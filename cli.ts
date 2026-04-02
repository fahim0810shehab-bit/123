#!/usr/bin/env -S npx tsx

import fs from 'fs';
import path from 'path';
import http from 'http';
import open from 'open';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3001/oauth2callback';
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\n=================================================');
    console.error('❌ ERROR: Missing Google OAuth Credentials!');
    console.error('=================================================');
    console.error('If you saw "[dotenv] injecting env (0)" above, it means your .env file is empty or missing.');
    console.error('\nTo fix this, create a file named EXACTLY ".env" in your project folder with:');
    console.error('GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
    console.error('GOOGLE_CLIENT_SECRET=your-client-secret');
    console.error('\nMake sure there are NO SPACES around the "=" sign.');
    console.error('=================================================\n');
    process.exit(1);
}

const authClient = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

async function authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
        const authorizeUrl = authClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
            redirect_uri: REDIRECT_URI,
        });

        const server = http.createServer(async (req, res) => {
            try {
                if (req.url && req.url.startsWith('/oauth2callback')) {
                    const qs = new URL(req.url, 'http://localhost:3001').searchParams;
                    const code = qs.get('code');
                    res.end('Authentication successful! Please return to the console.');
                    // Forcefully close all connections so the script doesn't hang
                    (server as import('http').Server & { destroy?: () => void }).destroy?.();
                    
                    if (code) {
                        const { tokens } = await authClient.getToken(code);
                        authClient.setCredentials(tokens);
                        const ticket = await authClient.verifyIdToken({
                            idToken: tokens.id_token!,
                            audience: CLIENT_ID,
                        });
                        const payload = ticket.getPayload();
                        if (payload && payload.email) {
                            resolve(payload.email);
                        } else {
                            reject(new Error('No email found in token'));
                        }
                    }
                }
            } catch (e) {
                reject(e);
            }
        }).listen(3001, () => {
            console.log('\n=================================================');
            console.log('🔒 Google Authentication Required');
            console.log('Please click the link below to log in:');
            console.log('\n' + authorizeUrl + '\n');
            console.log('Waiting for you to log in on your browser...');
            console.log('=================================================\n');
            
            // Try to auto-open, but gracefully handle if it fails (e.g., in headless terminals)
            open(authorizeUrl, { wait: false }).catch(() => {
                console.log('(Could not auto-open browser, please click the link above)');
            });
        });

        // Add destroy method to server
        const connections = new Set<import('net').Socket>();
        server.on('connection', (conn) => {
            connections.add(conn);
            conn.on('close', () => connections.delete(conn));
        });
        (server as import('http').Server & { destroy?: () => void }).destroy = () => {
            server.close();
            for (const conn of connections) {
                conn.destroy();
            }
        };
    });
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length > 0 && args[0] === 'history') {
        console.log("Authenticating...");
        const email = await authenticate();
        
        try {
            const response = await fetch(`${SERVER_URL}/api/history?email=${encodeURIComponent(email)}`);
            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            const history = await response.json();
            
            if (history.length === 0) {
                console.log("No history found.");
            } else {
                console.log(`\n=== Audit History for ${email} ===\n`);
                history.forEach((item: any, index: number) => {
                    console.log(`${index + 1}. [${new Date(item.timestamp).toLocaleString()}] ${item.fileName} (${item.program} L${item.level})`);
                });
                console.log("\n");
            }
        } catch (error) {
            console.error("Failed to fetch history from server:", error);
        }
        process.exit(0);
    }

    if (args.length < 1 || args[0] === '--help' || args[0] === '-h') {
        console.error("Usage:");
        console.error("  Run Audit: npm run cli <file_path> [level=1|2|3] [program=CSE|BBA|ECONOMICS] [output_file]");
        console.error("  View History: npm run cli history");
        process.exit(1);
    }

    const filePath = args[0];
    const level = parseInt(args[1] || '3', 10);
    const program = args[2] ? args[2].toUpperCase() : undefined;
    const outputFile = args[3];

    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found at ${filePath}`);
        process.exit(1);
    }

    console.log("Authenticating...");
    const email = await authenticate();

    console.log(`\nAnalyzing ${path.basename(filePath)} via ${SERVER_URL}...`);
    console.log(`Level: ${level}`);
    console.log(`Program: ${program || 'Auto-Detected'}\n`);

    try {
        const fileBuffer = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        let mimeType = 'application/octet-stream';
        if (ext === '.pdf') mimeType = 'application/pdf';
        else if (ext === '.csv') mimeType = 'text/csv';
        else if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';

        const blob = new Blob([fileBuffer], { type: mimeType });
        const formData = new FormData();
        formData.append('file', blob, path.basename(filePath));
        formData.append('level', level.toString());
        if (program) formData.append('program', program);

        const analyzeResponse = await fetch(`${SERVER_URL}/api/analyze`, {
            method: 'POST',
            body: formData
        });

        if (!analyzeResponse.ok) {
            const err = await analyzeResponse.text();
            throw new Error(`Analysis failed: ${err}`);
        }

        const resData = await analyzeResponse.json();
        const report = resData.text;
        const data = resData.data;

        // Log to history via server API
        const historyResponse = await fetch(`${SERVER_URL}/api/history`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                timestamp: Date.now(),
                fileName: path.basename(filePath),
                level,
                program: program || 'Auto-Detected',
                result: report
            })
        });

        if (!historyResponse.ok) {
            console.error("Warning: Failed to save history to server.");
        }

        if (outputFile) {
            fs.writeFileSync(outputFile, report);
            fs.writeFileSync(outputFile.replace(/\.[^/.]+$/, "") + ".json", JSON.stringify(data, null, 2));
            console.log(`Report saved to ${outputFile}`);
            console.log(`JSON Data saved to ${outputFile.replace(/\.[^/.]+$/, "") + ".json"}`);
        } else {
            console.log(report);
            console.log("\n--- JSON DATA ---\n");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("Error during analysis:", error);
        process.exit(1);
    }
}

main();
