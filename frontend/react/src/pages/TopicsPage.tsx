import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topics } from '../api/client';
import type { Topic } from '../api/types';
import { Plus, ArrowRight, Layers } from 'lucide-react';

export default function TopicsPage() {
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    topics.list().then((res) => setTopicList(res.data.results)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Topics</h1>
        <Link
          to="/topics/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Topic
        </Link>
      </div>

      <div className="space-y-3">
        {topicList.map((topic) => (
          <Link
            key={topic.id}
            to={`/topics/${topic.id}`}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-primary-50 text-primary-600 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {topic.text}
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {topic.entry_count} entries · {new Date(topic.date_added).toLocaleDateString()}
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-colors shrink-0 ml-3" />
          </Link>
        ))}
        {topicList.length === 0 && (
          <div className="text-center py-16">
            <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No topics yet.</p>
            <Link to="/topics/new" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Plus className="w-4 h-4" /> Create your first topic
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
