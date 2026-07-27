import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { entries } from '../api/client';
import type { Entry } from '../api/types';
import { Star } from 'lucide-react';

export default function FavoritesPage() {
  const [favEntries, setFavEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entries.list({ favorited: true }).then((res) => setFavEntries(res.data.results)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Favorites</h1>

      <div className="space-y-3">
        {favEntries.map((entry) => (
          <Link
            key={entry.id}
            to={`/entries/${entry.id}`}
            className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-200 hover:border-amber-300 hover:shadow-sm transition-all group"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                  {entry.display_title}
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                {entry.topic_text} · {new Date(entry.date_added).toLocaleDateString()} · {entry.word_count} chars
              </p>
            </div>
          </Link>
        ))}
        {favEntries.length === 0 && (
          <div className="text-center py-16">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No favorited entries yet.</p>
            <p className="text-sm text-gray-400 mt-1">Click the star on any entry to add it to favorites.</p>
          </div>
        )}
      </div>
    </div>
  );
}
