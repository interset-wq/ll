import { Layers, Code, Database, Palette, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
          <Layers className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">About Learning Log</h1>
        <p className="text-gray-500 mt-2">A personal journal for tracking your learning journey</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
        <Feature icon={<BookOpen className="w-5 h-5" />} title="Write & Organize" desc="Create topics and write entries with full Markdown support." />
        <Feature icon={<Layers className="w-5 h-5" />} title="Track Progress" desc="View statistics, favorites, and your learning history." />
        <Feature icon={<Palette className="w-5 h-5" />} title="Beautiful UI" desc="Modern, responsive design built with React and Tailwind CSS." />
        <Feature icon={<Code className="w-5 h-5" />} title="REST API" desc="Full RESTful API powered by Django REST Framework." />
        <Feature icon={<Database className="w-5 h-5" />} title="Fast & Reliable" desc="SQLite backend with token-based authentication." />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Tech Stack</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="px-3 py-2 bg-gray-50 rounded-lg"><strong>Frontend:</strong> React 19 + TypeScript</div>
          <div className="px-3 py-2 bg-gray-50 rounded-lg"><strong>Styling:</strong> Tailwind CSS 4</div>
          <div className="px-3 py-2 bg-gray-50 rounded-lg"><strong>Backend:</strong> Django 6.0 + DRF</div>
          <div className="px-3 py-2 bg-gray-50 rounded-lg"><strong>Database:</strong> SQLite</div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-xl bg-primary-50 text-primary-600 shrink-0 mt-0.5">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
