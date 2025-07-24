import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { userInput } = req.body;
  if (!userInput) {
    return res.status(400).json({ error: 'Missing input text.' });
  }

  const prompt = `
You are a semantic content quality evaluator trained to detect AI-generated patterns and shallow content structures.

Analyze the following content for the following dimensions:

1. AI-Likeness Score (0-100)
2. Semantic Depth Score (0-100)
3. Verdict (Human / AI-Like / Hybrid)
4. Suggestions for Improvement

Return a JSON like:
{
  "ai_likeness_score": 0-100,
  "semantic_depth_score": 0-100,
  "verdict": "Human" | "AI-Like" | "Hybrid",
  "improvement_suggestions": "..."
}

Content to analyze:
"""${userInput}"""
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content;

    try {
      const parsed = JSON.parse(output || '{}');
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({ raw: output, error: 'Response not in valid JSON format.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong', details: error });
  }
}
