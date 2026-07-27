import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { entries, topics } from '../api/client';
import type { Topic } from '../api/types';
import { ArrowLeft } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

export default function NewEntryPage() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) topics.get(Number(id)).then((res) => setTopic(res.data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await entries.create({ title, text, topic_id: Number(id) });
      navigate(`/entries/${res.data.id}`);
    } catch {
      setError('Failed to create entry');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={`/topics/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> {topic?.text || 'Back'}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-gray-400">(optional)</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Entry title"
          />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4" data-color-mode="light">
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <MDEditor
            value={text}
            onChange={(val) => setText(val || '')}
            height={400}
            preview="live"
            visibleDragbar
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading || !text.trim()} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {loading ? 'Saving...' : 'Save Entry'}
          </button>
          <Link to={`/topics/${id}`} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
