
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a semantic AI content detector. Analyze the given text and provide an assessment of how likely it is AI-generated, the semantic depth, structure, repetition, coherence, and any patterns typical of LLM-generated content.',
          },
          {
            role: 'user',
            content: content,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    const result = data.choices?.[0]?.message?.content ?? 'No analysis result.';
    res.status(200).json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Something went wrong.' });
  }
}
