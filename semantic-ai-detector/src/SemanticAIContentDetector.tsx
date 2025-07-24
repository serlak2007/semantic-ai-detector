import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SemanticAIContentDetector() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    // Placeholder for future API call
    setTimeout(() => {
      setResult({
        aiProbability: 82,
        semanticRisk: 68,
        intentCoverage: 45,
        entityDepth: 3,
        recommendations: [
          'Add more named entities like product names or expert references.',
          'Include a comparison or transactional section.',
          'Reduce generic transitional phrases.'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">Semantic AI Content Detector</h1>
      <p className="text-center text-gray-600">Paste your content below to analyze its semantic quality and AI-likeness.</p>

      <Textarea
        className="min-h-[200px]"
        placeholder="Paste your content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div className="flex justify-center">
        <Button onClick={handleAnalyze} disabled={loading || !content}>
          {loading ? 'Analyzing...' : 'Analyze Content'}
        </Button>
      </div>

      {result && (
        <Card>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}