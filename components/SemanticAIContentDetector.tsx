import React, { useState } from 'react';

type AnalysisResult = {
  aiProbability: number;
  semanticRisk: number;
  intentCoverage: number;
  entityDepth: number;
  recommendations: string[];
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

    setResult({
      aiProbability: 0,
      semanticRisk: 0,
      intentCoverage: 0,
      entityDepth: 0,
      recommendations: [data.result], // this is GPT response text
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
        </div>
      )}
    </div>
  );
}
