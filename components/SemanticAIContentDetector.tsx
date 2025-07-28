import React, { useState } from 'react';

type AnalysisResult = {
  aiProbability: number;
  semanticRisk: number;
  intentCoverage: number;
  entityDepth: number;
  recommendations: string[];
  subjectivityRatio?: number;
  verbDiversityScore?: number;
  rareNamedEntities?: string[];
  toneType?: string;
};


export default function SemanticAIContentDetector() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);


const handleAnalyze = async () => {
  setLoading(true);
  setResult(null);

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: content }),
    });

    const data = await response.json();

let parsed: any = null;
if (data?.ai_likeness_score !== undefined) {
  parsed = data;
} else if (data?.raw) {
  try {
    const cleaned = data.raw.replace(/```json|```/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error('❌ Failed to parse GPT JSON response:', e);
  }
}

    setResult({
      aiProbability: parsed?.ai_likeness_score ?? 0,
      semanticRisk: 100 - (parsed?.semantic_depth_score ?? 0),
      intentCoverage: Math.round((parsed?.semantic_depth_score ?? 0) * 0.8),
      entityDepth: Math.round((parsed?.semantic_depth_score ?? 0) / 25),
      recommendations: [
        `Verdict: ${parsed?.verdict ?? 'Unknown'}`,
        parsed?.improvement_suggestions ?? 'No suggestions provided.',
     ],
      subjectivityRatio: parsed?.subjectivity_ratio,
      verbDiversityScore: parsed?.verb_diversity_score,
      rareNamedEntities: parsed?.rare_named_entities,
      toneType: parsed?.tone_type,
});
    
  } catch (error) {
    console.error('API Error:', error);
    setResult({
      aiProbability: 0,
      semanticRisk: 0,
      intentCoverage: 0,
      entityDepth: 0,
      recommendations: ['Error analyzing content.'],
    });
  } finally {
    setLoading(false);
  }
};



  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Semantic AI Content Detector</h1>
      <p className="text-center text-gray-600">Paste your content below to analyze its semantic quality and AI-likeness.</p>

      <textarea
        className="w-full p-4 border rounded min-h-[200px]"
        placeholder="Paste your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={loading || !content}
          className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Content'}
        </button>
      </div>

      {result && (
        <div className="bg-white shadow rounded p-6 space-y-4">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>AI Probability:</strong> {result.aiProbability}%</li>
            <li><strong>Semantic Risk:</strong> {result.semanticRisk}%</li>
            <li><strong>Intent Coverage:</strong> {result.intentCoverage}%</li>
            <li><strong>Entity Depth:</strong> {result.entityDepth}</li>
          </ul>
          <div>
            <h3 className="font-semibold">Recommendations:</h3>
            <ul className="list-disc list-inside ml-4 text-gray-700">
              {result.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
          {result.subjectivityRatio !== undefined && (
  <div className="pt-4 border-t">
    <h3 className="font-semibold">AI Detection Signals:</h3>
    <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
      <li><strong>Subjectivity Ratio:</strong> {result.subjectivityRatio}%</li>
      <li><strong>Verb Diversity Score:</strong> {result.verbDiversityScore}/10</li>
      <li><strong>Tone Type:</strong> {result.toneType}</li>
      <li>
        <strong>Rare Named Entities:</strong>{' '}
        {result.rareNamedEntities && result.rareNamedEntities.length > 0
          ? result.rareNamedEntities.join(', ')
          : 'None'}
      </li>
    </ul>
  </div>
)}

        </div>
      )}
    </div>
  );
}
