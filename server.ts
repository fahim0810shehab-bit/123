import express from 'express';
import 'dotenv/config';
import { OAuth2Client } from 'google-auth-library';
import { addHistory, getHistory, deleteHistory, addLoginHistory } from './src/db.ts';
import multer from 'multer';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = (pdfParseModule as any).default || pdfParseModule;
import Tesseract from 'tesseract.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

const upload = multer({ storage: multer.memoryStorage() });

import { performLevel1Audit, performLevel2Audit, performLevel3Audit } from './src/services/nsuAudit.ts';

// Helper to parse unstructured text into CSV
function parseTextToCSV(text: string): string {
  const lines = text.split('\n');
  let csv = "Course Code, Course Title, Credits, Grade, Semester, Year\n";
  let currentSemester = "Unknown";
  let currentYear = "Unknown";

  // Match semester headers like "Spring 2023", "Fall-2022", "Autumn 2021"
  const semesterRegex = /(Spring|Summer|Fall|Autumn)\s*[-_]?\s*(\d{4})/i;
  
  // Valid grades at NSU
  const validGrades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F', 'W', 'I', 'AU'];

  for (let i = 0; i < lines.length; i++) {
    // Clean up extra spaces and normalize
    let line = lines[i].trim().replace(/\s+/g, ' ');
    if (!line) continue;

    // 1. Check for Semester Header
    const semMatch = line.match(semesterRegex);
    if (semMatch) {
      currentSemester = semMatch[1];
      currentYear = semMatch[2];
      continue;
    }

    // 2. Look for Course Code (e.g., CSE 115, MAT120, C5E 225)
    // 3 letters/numbers + optional space + 3 digits + optional letter
    const potentialCodeMatch = line.match(/\b([A-Z0-9]{3})\s*(\d{3}[A-Z]?)\b/i);
    
    if (potentialCodeMatch) {
      let prefix = potentialCodeMatch[1].toUpperCase();
      const suffix = potentialCodeMatch[2].toUpperCase();
      
      // Fix common OCR typos in the prefix (e.g., C5E -> CSE)
      prefix = prefix.replace(/5/g, 'S').replace(/4/g, 'A').replace(/0/g, 'O').replace(/1/g, 'I');
      const code = `${prefix}${suffix}`;
      
      // Extract the rest of the line after the course code
      const afterCode = line.substring(line.indexOf(potentialCodeMatch[0]) + potentialCodeMatch[0].length).trim();
      
      // 3. Find Credits (usually 0.0 to 4.0, or 0 to 4)
      const creditsMatch = afterCode.match(/\b([0-4](?:\.\d)?)\b/);
      
      // 4. Find Grade (search from the end of the line to avoid matching title words like "A")
      const tokens = afterCode.split(' ');
      let grade = '';
      let gradeToken = '';
      
      for (let j = tokens.length - 1; j >= 0; j--) {
        const token = tokens[j].toUpperCase();
        const cleanToken = token.replace(/[^A-Z\+\-]/g, ''); // Strip punctuation
        if (validGrades.includes(cleanToken)) {
          grade = cleanToken;
          gradeToken = tokens[j];
          break;
        }
      }

      // If we found both credits and a grade, it's a valid course line
      if (creditsMatch && grade) {
        const credits = creditsMatch[1];
        const creditsToken = creditsMatch[0];
        
        // 5. Extract Title (everything else)
        // Remove the grade and credit tokens, then clean up punctuation
        let titleTokens = tokens.filter(t => t !== gradeToken && t !== creditsToken);
        let title = titleTokens.join(' ')
          .replace(/[^a-zA-Z\s&\-]/g, '') // Keep only letters, spaces, &, -
          .replace(/\s+/g, ' ')
          .trim();
          
        if (!title) title = "Unknown Title";

        csv += `${code},${title},${credits},${grade},${currentSemester},${currentYear}\n`;
      }
    }
  }
  return csv;
}

// API Routes
app.post('/api/analyze', upload.single('file'), async (req, res) => {
  try {
    const level = parseInt(req.body.level, 10);
    const program = req.body.program;
    
    let csvContent = req.body.csvContent;

    if (req.file) {
      const file = req.file;
      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(file.buffer);
        csvContent = parseTextToCSV(pdfData.text);
      } else if (file.mimetype.startsWith('image/')) {
        const worker = await Tesseract.createWorker('eng');
        const ret = await worker.recognize(file.buffer);
        await worker.terminate();
        csvContent = parseTextToCSV(ret.data.text);
      } else if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')) {
        csvContent = file.buffer.toString('utf-8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type.' });
      }
    }
    
    if (!csvContent || typeof csvContent !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid content. Please upload a valid transcript.' });
    }

    let report = "";
    let data = null;
    switch (level) {
      case 1:
        {
          const res = performLevel1Audit(csvContent);
          report = res.report;
          data = res.data;
        }
        break;
      case 2:
        {
          const res = performLevel2Audit(csvContent, program);
          report = res.report;
          data = res.data;
        }
        break;
      case 3:
        {
          const res = performLevel3Audit(csvContent, program);
          report = res.report;
          data = res.data;
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid analysis level. Choose 1, 2, or 3.' });
    }

    res.json({ text: report, data });
  } catch (error: unknown) {
    console.error("Local Analysis Error:", error);
    let errorMessage = "Failed to analyze transcripts";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(500).json({ error: errorMessage });
  }
});

// OAuth Configuration
const getOAuthClient = () => {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // We'll override this in generateAuthUrl
  );
};

// API Routes
app.get('/api/auth/google/url', (req, res) => {
  try {
    const redirectUri = req.query.redirect_uri as string;
    if (!redirectUri) {
      return res.status(400).json({ error: 'Missing redirect_uri' });
    }

    const client = getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      redirect_uri: redirectUri,
      prompt: 'select_account',
      state: redirectUri
    });

    res.json({ url });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

app.get('/auth/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) {
      return res.status(400).send('Missing code');
    }

    // Construct the redirect URI based on the request to match what was sent
    // We assume the client sent the correct one, but we need to match it here for verification
    // The client should have used window.location.origin + '/auth/callback'
    let redirectUri = state as string;
    if (!redirectUri) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers['x-forwarded-host'] || req.headers.host;
      redirectUri = `${protocol}://${host}/auth/callback`;
    }

    const client = getOAuthClient();
    const { tokens } = await client.getToken({
      code: code as string,
      redirect_uri: redirectUri
    });

    client.setCredentials(tokens);

    // Verify the ID token and get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new Error('No email found in token');
    }

    // Success
    const user = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      hd: payload.hd
    };

    // Log the login
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    await addLoginHistory(payload.email, new Date().toISOString(), ip as string);

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_SUCCESS', user: ${JSON.stringify(user)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p style="text-align: center; margin-top: 20px;">Authentication successful. Closing...</p>
        </body>
      </html>
    `);

  } catch (error: unknown) {
    console.error('OAuth callback error:', error);
    res.status(500).send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_ERROR', error: 'Authentication failed: ' + ${JSON.stringify(error instanceof Error ? error.message : 'Unknown error')} }, '*');
              window.close();
            }
          </script>
          <p style="color: red; text-align: center;">Authentication failed. Please try again.</p>
        </body>
      </html>
    `);
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Missing email parameter' });
    }
    const history = await getHistory(email);
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.post('/api/history', async (req, res) => {
  try {
    const { email, timestamp, program, level, fileName, result } = req.body;
    if (!email || !timestamp || !program || !level || !fileName || !result) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await addHistory({ email, timestamp, program, level, fileName, result });
    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ error: 'Failed to add history' });
  }
});

app.delete('/api/history/:id', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Missing email parameter' });
    }
    const id = req.params.id;
    await deleteHistory(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting history:', error);
    res.status(500).json({ error: 'Failed to delete history' });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
