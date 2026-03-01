
import fs from 'fs';

// Manually parse .env since this basic script might not have dotenv installed/loaded
const envFile = fs.readFileSync('.env', 'utf-8');
const apiKeyMatch = envFile.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : 'MISSING';

console.log('Testing with API Key ending in: ...' + apiKey.slice(-5));

fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: 'Answer in one word: what color is the sky?' }] }] })
})
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error('API Error:', data.error);
        } else {
            console.log('Success! API responded with:');
            console.log(JSON.stringify(data.candidates[0].content.parts[0].text.trim(), null, 2));
        }
    })
    .catch(err => console.error('Network Error:', err));
