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
   Detect signs of:
   - Repetition in sentence templates or phrasing  
   - Low verb/action diversity  
   - Declarative, generic tone over speculative or experiential voice  
   - Lack of subjective or emotional expression  
   - Absence of rare or branded named entities

2. **Semantic Depth Score (0–100)**  
   Based on presence of:
   - Named and linked entities  
   - Outcome-mechanism relationships  
   - Intent frames (comparison, risk, benefit, contradiction)  
   - Topical variance and semantic richness

3. **Verdict**  
   Choose one: "Human", "AI-Like", or "Hybrid"

4. **Improvement Suggestions**  
   Recommend how to improve:  
   - Add specific entities  
   - Rewrite sections to match user intent  
   - Restructure content to reduce AI signals  
   - Increase diversity in syntax and vocabulary

---

Additionally, extract and return the following AI-detection signal metrics:

- **subjectivity_ratio**: A score from 0 to 100 — how subjective, emotional, or experiential the content feels  
- **verb_diversity_score**: A score from 0 to 10 — how varied the verb and action language is  
- **rare_named_entities**: A list of specific or uncommon named entities used (e.g., brand names, proprietary concepts)  
- **tone_type**: One of "Speculative", "Declarative", or "Mixed"

---

Always return valid JSON in this exact format:

{
  "ai_likeness_score": 0-100,
  "semantic_depth_score": 0-100,
  "verdict": "Human" | "AI-Like" | "Hybrid",
  "improvement_suggestions": "string",
  "subjectivity_ratio": 0-100,
  "verb_diversity_score": 0-10,
  "rare_named_entities": [ "..." ],
  "tone_type": "Speculative" | "Declarative" | "Mixed"
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
    const output = data?.choices?.[0]?.message?.content;

    // ✅ Strip code block if present
    const cleanedOutput = output?.replace(/```json|```/g, '').trim();

    // 🧠 Log raw output for debugging
    console.log('🧠 GPT Raw Response:', cleanedOutput);

    try {
      const parsed = JSON.parse(cleanedOutput || '{}');
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({ raw: cleanedOutput, error: 'Response not in valid JSON format.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong', details: error });
  }
}
