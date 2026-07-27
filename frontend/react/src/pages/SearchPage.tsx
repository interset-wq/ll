import { useState } from 'react';
import { Link } from 'react-router-dom';
import { topics, entries } from '../api/client';
import type { Topic, Entry } from '../api/types';
import { Search as SearchIcon, Layers, FileText } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [topicResults, setTopicResults] = useState<Topic[]>([]);
  const [entryResults, setEntryResults] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSearched(true);
    try {
      const [topicsRes, entriesRes] = await Promise.all([
        topics.list(),
        entries.list(),
      ]);
      const lower = q.toLowerCase();
      setTopicResults(topicsRes.data.results.filter((t) => t.text.toLowerCase().includes(lower)));
      setEntryResults(entriesRes.data.results.filter((e) => e.text.toLowerCase().includes(lower) || e.display_title.toLowerCase().includes(lower)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Search</h1>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Search topics and entries..."
            autoFocus
          />
        </div>
        <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
          Search
        </button>
      </form>

      {loading && <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-200 rounded-2xl animate-pulse" />)}</div>}

      {searched && !loading && (
        <div className="space-y-6">
          {topicResults.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-3">Topics ({topicResults.length})</h2>
              <div className="space-y-2">
                {topicResults.map((topic) => (
                  <Link key={topic.id} to={`/topics/${topic.id}`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 transition-all group">
                    <Layers className="w-5 h-5 text-primary-500 shrink-0" />
                    <span className="font-medium text-gray-900 group-hover:text-primary-600">{topic.text}</span>
                    <span className="text-sm text-gray-500 ml-auto">{topic.entry_count} entries</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {entryResults.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-3">Entries ({entryResults.length})</h2>
              <div className="space-y-2">
                {entryResults.map((entry) => (
                  <Link key={entry.id} to={`/entries/${entry.id}`} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 hover:border-primary-300 transition-all group">
                    <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <span className="font-medium text-gray-900 group-hover:text-primary-600 block truncate">{entry.display_title}</span>
                      <span className="text-sm text-gray-500">{entry.topic_text}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {topicResults.length === 0 && entryResults.length === 0 && (
            <div className="text-center py-16">
              <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found for "{query}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
