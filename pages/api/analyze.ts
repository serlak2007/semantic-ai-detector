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
You are SemanticIQ 1.0, an advanced semantic content evaluator trained using the Semantic SEO framework of Koray Tuğberk Gübür, Bill Slawski’s entity indexing principles, and Google’s document retrieval patents.

Your goal is to analyze the content below for deep semantic structure, AI-likeness, and optimization signals related to Google’s retrieval cost model.

---

Your evaluation must consider:

1. **AI-Likeness Score (0–100)**  
   Detect signs of language prediction, repetition, low information gain, and uniform sentence structure.  
   - High = repetitive, templated, shallow, generic  
   - Low = unpredictable, entity-rich, outcome-anchored writing

2. **Semantic Depth Score (0–100)**  
   Based on how well the content reflects:  
   - Named and linked entities  
   - Outcome-mechanism relationships  
   - Intent frames (comparison, risk, benefit, etc.)  
   - Topical layer richness (e.g. internal concept variance)

3. **Verdict**  
   Return one: "Human", "AI-Like", or "Hybrid"

4. **Improvement Suggestions**  
   Recommend actions such as adding entities, restructuring for buyer intent, improving topical coverage, or removing fluff.

---

Always return valid JSON in this exact format:

{
  "ai_likeness_score": 0-100,
  "semantic_depth_score": 0-100,
  "verdict": "Human" | "AI-Like" | "Hybrid",
  "improvement_suggestions": "string"
}

---

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
          { role: 'system', content: 'You are SemanticIQ 1.0, a semantic content scoring AI.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
      }),
    });

    const data = await response.json();
    
    // ✅ Add this log to inspect the raw GPT output
    console.log('🧠 GPT Raw Response:', JSON.stringify(data, null, 2));
    
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
