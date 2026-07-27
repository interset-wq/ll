import { useState, useEffect } from 'react';
import { topics, entries } from '../api/client';
import type { Topic, Entry } from '../api/types';
import { BarChart3, Layers, FileText, Star } from 'lucide-react';

export default function StatsPage() {
  const [topicList, setTopicList] = useState<Topic[]>([]);
  const [entryList, setEntryList] = useState<Entry[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      topics.list(),
      entries.list(),
      entries.list({ favorited: true }),
    ]).then(([topicsRes, entriesRes, favsRes]) => {
      setTopicList(topicsRes.data.results);
      setEntryList(entriesRes.data.results);
      setFavCount(favsRes.data.count);
    }).finally(() => setLoading(false));
  }, []);

  const totalChars = entryList.reduce((sum, e) => sum + e.word_count, 0);
  const avgChars = entryList.length ? Math.round(totalChars / entryList.length) : 0;

  const topicStats = topicList
    .map((t) => ({ ...t }))
    .sort((a, b) => b.entry_count - a.entry_count)
    .slice(0, 10);

  if (loading) return <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Layers className="w-5 h-5" />} label="Topics" value={topicList.length} />
        <StatCard icon={<FileText className="w-5 h-5" />} label="Entries" value={entryList.length} />
        <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Total Chars" value={totalChars.toLocaleString()} />
        <StatCard icon={<Star className="w-5 h-5" />} label="Favorites" value={favCount} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Avg Chars per Entry: {avgChars}</h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Topics</h2>
        <div className="space-y-3">
          {topicStats.map((topic, i) => (
            <div key={topic.id} className="flex items-center gap-3">
              <span className="text-sm font-mono text-gray-400 w-6">{i + 1}.</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{topic.text}</div>
              </div>
              <div className="text-sm text-gray-500">{topic.entry_count} entries</div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(topic.entry_count / (topicStats[0]?.entry_count || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {topicStats.length === 0 && <p className="text-gray-500 text-center py-4">No data yet.</p>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl bg-primary-50 text-primary-600">{icon}</div>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
