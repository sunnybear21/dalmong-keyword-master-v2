
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createPrompt, responseSchema, createPostPrompt, postResponseSchema } from './prompt.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}
const ai = new GoogleGenAI({ apiKey });

// Check for Naver API configuration
const isNaverApiConfigured = !!(process.env.NAVER_ACCESS_KEY && process.env.NAVER_SECRET_KEY && process.env.NAVER_CUSTOMER_ID);

// API route for checking backend status
app.get('/api/status', (req: Request, res: Response) => {
    res.json({ naverApiConfigured: isNaverApiConfigured });
});

// API route for SEO analysis
app.post('/api/analyze', async (req: Request, res: Response) => {
    const { input, mode } = req.body;

    if (!input || !mode) {
        return res.status(400).json({ error: 'Input and mode are required.' });
    }

    if (mode === 'api' && !isNaverApiConfigured) {
        return res.status(400).json({ error: 'Naver API is not configured on the server. Please set the required environment variables.' });
    }

    const prompt = createPrompt(input, mode);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text;
        if (!jsonText) {
            console.error("Gemini API returned an empty response text.");
            return res.status(500).json({ error: 'AI 모델로부터 비어있는 응답을 받았습니다.' });
        }
        
        const result = JSON.parse(jsonText.trim());
        res.json(result);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: 'Failed to get SEO analysis from Gemini API.' });
    }
});

// API route for Blog Post Generation
app.post('/api/generate-post', async (req: Request, res: Response) => {
    const { keyword, style, length } = req.body;

    if (!keyword || !style || !length) {
        return res.status(400).json({ error: 'Keyword, style, and length are required.' });
    }

    const prompt = createPostPrompt(keyword, style, length);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: postResponseSchema,
                temperature: 0.7, // A bit more creative for writing
            },
        });
        
        const jsonText = response.text;
        if (!jsonText) {
            console.error("Gemini API returned an empty response text for post generation.");
            return res.status(500).json({ error: 'AI 모델로부터 비어있는 응답을 받았습니다.' });
        }
        
        const result = JSON.parse(jsonText.trim());
        res.json(result);

    } catch (error) {
        console.error("Error calling Gemini API for post generation:", error);
        res.status(500).json({ error: 'Failed to generate blog post from Gemini API.' });
    }
});


// --- Production static file serving ---
if (process.env.NODE_ENV === 'production') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // The production build of the frontend will be in ../dist
    const buildPath = path.join(__dirname, '..', 'dist');
    
    app.use(express.static(buildPath));

    // For any request that doesn't match a static file, serve index.html
    app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}


app.listen(port, () => {
    console.log(`🚀 백엔드 서버 실행 중: http://localhost:${port}`);
});