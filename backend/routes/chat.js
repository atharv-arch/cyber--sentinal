import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are CyberSentinel AI, an expert threat intelligence analyst. You receive raw data from multiple threat intelligence sources and produce structured, actionable security reports.

Your output must be valid JSON with this exact schema:
{
  "riskScore": number (0-100),
  "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "CLEAN",
  "verdict": string (one sentence summary),
  "scoreBreakdown": {
    "reputation": number,
    "infrastructure": number,
    "geolocation": number,
    "certificates": number,
    "networkExposure": number
  },
  "threatCategories": string[],
  "mitreAttack": [
    { "tactic": string, "technique": string, "techniqueId": string }
  ],
  "timeline": [
    { "date": string, "event": string, "severity": "high" | "medium" | "low" }
  ],
  "iocRelationships": string[],
  "recommendations": [
    { "priority": "immediate" | "short-term" | "long-term", "action": string }
  ],
  "analystNotes": string (2-3 paragraph deep analysis),
  "confidence": "high" | "medium" | "low"
}

Output ONLY the JSON object, no markdown, no explanation.`;

// POST /api/analyze-ai — stream Claude synthesis
router.post('/analyze', async (req, res) => {
  try {
    const { intelBundle } = req.body;
    if (!intelBundle) return res.status(400).json({ error: 'intelBundle required' });

    const userMessage = `Analyze this threat intelligence data and produce a security report:\n\n${JSON.stringify(intelBundle, null, 2)}`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }]
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Claude analyze error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// POST /api/chat — stream chat with context
router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: 'messages array required' });

    const systemWithContext = `You are CyberSentinel AI, an expert threat intelligence analyst helping a security analyst investigate a threat.

Current investigation context:
${context ? JSON.stringify(context, null, 2) : 'No context provided'}

Answer questions about this threat concisely and precisely. Include specific technical details when available. For firewall rules, provide exact syntax.`;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 2048,
      system: systemWithContext,
      messages: messages.map(m => ({ role: m.role, content: m.content }))
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta?.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('Chat error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

export default router;
