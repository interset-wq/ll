import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { entries } from '../api/client';
import type { Entry } from '../api/types';
import { ArrowLeft } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    entries.get(Number(id)).then((res) => {
      setEntry(res.data);
      setTitle(res.data.title);
      setText(res.data.text);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');
    try {
      await entries.update(Number(id), { title, text });
      navigate(`/entries/${id}`);
    } catch {
      setError('Failed to save entry');
      setSaving(false);
    }
  };

  if (loading) return <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />;
  if (!entry) return <div className="text-center py-16 text-gray-500">Entry not found</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to={`/entries/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to entry
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">Edit Entry</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
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
          <button type="submit" disabled={saving || !text.trim()} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link to={`/entries/${id}`} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
