import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topics, entries } from '../api/client';
import type { Topic, Entry } from '../api/types';
import { Layers, FileText, Star, Plus, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [recentEntries, setRecentEntries] = useState<Entry[]>([]);
  const [stats, setStats] = useState({ topics: 0, entries: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      topics.list(),
      entries.list(),
      entries.list({ favorited: true }),
    ]).then(([topicsRes, entriesRes, favsRes]) => {
      setRecentTopics(topicsRes.data.results.slice(0, 5));
      setRecentEntries(entriesRes.data.results.slice(0, 5));
      setStats({
        topics: topicsRes.data.count,
        entries: entriesRes.data.count,
        favorites: favsRes.data.count,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/topics/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Topic
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Layers className="w-5 h-5" />} label="Topics" value={stats.topics} color="indigo" />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Entries" value={stats.entries} color="blue" />
        <StatCard icon={<Star className="w-5 h-5" />} label="Favorites" value={stats.favorites} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Topics</h2>
            <Link to="/topics" className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/topics/${topic.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {topic.text}
                </span>
                <span className="text-sm text-gray-500 shrink-0 ml-3">
                  {topic.entry_count} entries
                </span>
              </Link>
            ))}
            {recentTopics.length === 0 && (
              <p className="text-gray-500 text-center py-8">No topics yet. Create your first one!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Entries</h2>
            <Link to="/favorites" className="text-sm text-primary-600 hover:text-primary-500 flex items-center gap-1">
              Favorites <Star className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentEntries.map((entry) => (
              <Link
                key={entry.id}
                to={`/entries/${entry.id}`}
                className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                    {entry.display_title}
                  </span>
                  {entry.favorited && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {entry.topic_text} · {new Date(entry.date_added).toLocaleDateString()}
                </p>
              </Link>
            ))}
            {recentEntries.length === 0 && (
              <p className="text-gray-500 text-center py-8">No entries yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
