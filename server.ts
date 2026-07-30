import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with named parameters
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// List of slugs for sitemap generation
const TOOL_SLUGS = [
  'pinterest-downloader',
  'instagram-downloader',
  'facebook-downloader',
  'x-twitter-downloader',
  'reddit-downloader',
  'vimeo-downloader',
  'dailymotion-downloader',
  'image-downloader',
  'thumbnail-downloader',
  'background-remover',
  'image-upscaler',
  'image-compressor',
  'image-converter',
  'qr-generator',
  'text-to-qr',
  'pdf-converter',
  'word-counter',
  'password-generator',
  'color-palette-generator',
  'json-formatter',
  'seo-console'
];

// 1. Technical SEO: XML Sitemap Endpoint
app.get('/sitemap.xml', (req, res) => {
  const host = process.env.APP_URL || 'https://downloadhub-ai.com';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  // Homepage
  xml += `  <url>\n    <loc>${host}/</loc>\n    <priority>1.0</priority>\n    <changefreq>daily</changefreq>\n  </url>\n`;
  
  // Tools pages
  TOOL_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${host}/tools/${slug}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
  });

  // Blogs
  xml += `  <url>\n    <loc>${host}/blog/media-rights-downloader-safety</loc>\n    <priority>0.6</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
  xml += `  <url>\n    <loc>${host}/blog/ai-revolution-everyday-web-tools</loc>\n    <priority>0.6</priority>\n    <changefreq>monthly</changefreq>\n  </url>\n`;

  // Legal pages
  ['about', 'contact', 'privacy', 'terms', 'dmca'].forEach(page => {
    xml += `  <url>\n    <loc>${host}/${page}</loc>\n    <priority>0.4</priority>\n    <changefreq>yearly</changefreq>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// 2. Technical SEO: Robots.txt Endpoint
app.get('/robots.txt', (req, res) => {
  const host = process.env.APP_URL || 'https://downloadhub-ai.com';
  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${host}/sitemap.xml
Disallow: /api/`);
});

// 3. Technical SEO: RSS Feed XML Endpoint
app.get('/rss.xml', (req, res) => {
  const host = process.env.APP_URL || 'https://downloadhub-ai.com';
  res.header('Content-Type', 'application/rss+xml');
  res.send(`<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>DownloadHub AI Blogs & Guides</title>
  <link>${host}</link>
  <description>The ultimate resource for digital creator rights, web performance utilities, and AI-enabled tools.</description>
  <lastBuildDate>Tue, 28 Jul 2026 00:00:00 GMT</lastBuildDate>
  <item>
    <title>A Guide to Digital Media Rights and Online Downloader Safety (2026)</title>
    <link>${host}/blog/media-rights-downloader-safety</link>
    <description>Understanding licensing, copyright compliance, and secure local file backups when utilizing free online download tools.</description>
    <pubDate>Fri, 24 Jul 2026 00:00:00 GMT</pubDate>
  </item>
  <item>
    <title>The AI Revolution in Everyday Web Tools</title>
    <link>${host}/blog/ai-revolution-everyday-web-tools</link>
    <description>How client-side computation and LLMs are transforming simple utilities like converters and validators into smart tools.</description>
    <pubDate>Thu, 18 Jun 2026 00:00:00 GMT</pubDate>
  </item>
</channel>
</rss>`);
});

// 4. API Endpoint: AI Color Palette Generator (utilizes gemini-3.6-flash with Structured Output)
app.post('/api/ai/palette', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Call Gemini with Structured JSON Schema
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Create a professional, highly cohesive 5-color palette inspired by the mood/concept: "${prompt}". Provide 5 contrasting hex-codes with creative names and suggest if text written on them should be "white" or "black" for WCAG AA readability. Also give a 1-sentence design advice/tip.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colors: {
              type: Type.ARRAY,
              description: 'An array of exactly 5 color definitions.',
              items: {
                type: Type.OBJECT,
                properties: {
                  hex: { type: Type.STRING, description: 'Hex code including hash, e.g. #1E3A8A' },
                  name: { type: Type.STRING, description: 'Creative name of the color' },
                  textContrast: { type: Type.STRING, description: 'Strictly either "white" or "black" for optimal WCAG contrast' },
                },
                required: ['hex', 'name', 'textContrast'],
              },
            },
            tips: { type: Type.STRING, description: 'One clear design layout tip on how to pair these colors' },
          },
          required: ['colors', 'tips'],
        },
      },
    });

    const cleanResult = response.text ? response.text.trim() : '';
    res.json(JSON.parse(cleanResult));
  } catch (err: any) {
    console.error('Gemini Palette failure:', err);
    res.status(500).json({
      error: 'Failed to generate palette',
      details: err.message
    });
  }
});

// 5. API Endpoint: JSON Repair Validator
app.post('/api/ai/json-repair', async (req, res) => {
  try {
    const { jsonText } = req.body;
    if (!jsonText) {
      return res.status(400).json({ error: 'jsonText is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are an expert developer JSON debugger. Inspect the following malformed, messy, or corrupted JSON text. Automatically correct any missing double quotes, mismatched brackets, unescaped strings, trailing commas, or trailing comments. Output ONLY the repaired JSON. Do NOT include markdown blocks like \`\`\`json. Repair this: ${jsonText}`,
      config: {
        temperature: 0.1,
      },
    });

    const cleanResult = response.text ? response.text.trim() : '';
    // Double check it parses successfully
    try {
      JSON.parse(cleanResult);
      res.json({ repairedText: cleanResult });
    } catch {
      // If output contained backticks, strip them
      const stripped = cleanResult.replace(/^```json\s*|```$/g, '').trim();
      res.json({ repairedText: stripped });
    }
  } catch (err: any) {
    console.error('Gemini Repair failure:', err);
    res.status(500).json({ error: 'AI Repair failed', details: err.message });
  }
});

// Initialize Express server and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DownloadHub AI] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
