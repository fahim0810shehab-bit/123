import express from 'express';

const app = express();
app.get('/test-env', (req, res) => {
  res.json({ key: process.env.GEMINI_API_KEY ? "EXISTS" : "MISSING" });
});
app.listen(3002, () => console.log('Test server running'));
