import SemanticAIContentDetector from '@/components/SemanticAIContentDetector';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
        Semantic AI Content Detector (Live Test)
      </h1>
      <SemanticAIContentDetector />
    </main>
  );
}
