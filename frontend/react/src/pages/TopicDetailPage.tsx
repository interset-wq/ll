import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { topics, entries } from '../api/client';
import type { Topic, Entry } from '../api/types';
import { Plus, Pencil, Trash2, ArrowLeft, FileText } from 'lucide-react';

export default function TopicDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [entryList, setEntryList] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const topicId = Number(id);
    Promise.all([
      topics.get(topicId),
      entries.list({ topic: topicId }),
    ]).then(([topicRes, entriesRes]) => {
      setTopic(topicRes.data);
      setEntryList(entriesRes.data.results);
    }).finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    await topics.delete(Number(id));
    navigate('/topics');
  };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}</div>;
  if (!topic) return <div className="text-center py-16 text-gray-500">Topic not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/topics" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="w-4 h-4" /> Back to topics
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{topic.text}</h1>
          <p className="text-gray-500 mt-1">{topic.entry_count} entries · Created {new Date(topic.date_added).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/topics/${id}/edit`}
            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setShowDelete(true)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <Link
            to={`/topics/${id}/entries/new`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Entry
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {entryList.map((entry) => (
          <Link
            key={entry.id}
            to={`/entries/${entry.id}`}
            className="block p-5 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {entry.display_title}
              </span>
              {entry.favorited && <span className="text-amber-400">★</span>}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(entry.date_added).toLocaleDateString()} · {entry.word_count} chars
            </p>
          </Link>
        ))}
        {entryList.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No entries yet.</p>
            <Link
              to={`/topics/${id}/entries/new`}
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" /> Write your first entry
            </Link>
          </div>
        )}
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete topic?</h3>
            <p className="text-gray-500 mt-2">This will permanently delete "{topic.text}" and all its entries.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDelete(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
