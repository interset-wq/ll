import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { topics } from '../api/client';
import { ArrowLeft } from 'lucide-react';

export default function NewTopicPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await topics.create(text);
      navigate(`/topics/${res.data.id}`);
    } catch {
      setError('Failed to create topic');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/topics" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to topics
      </Link>

      <h1 className="text-2xl font-bold text-gray-900">New Topic</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic name</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="e.g. Python, Mathematics, Reading Notes..."
            autoFocus
          />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {loading ? 'Creating...' : 'Create Topic'}
          </button>
          <Link to="/topics" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
