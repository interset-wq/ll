import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { entries } from '../api/client';
import type { Entry } from '../api/types';
import { ArrowLeft, Pencil, Trash2, Copy, Star } from 'lucide-react';

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    entries.get(Number(id)).then((res) => setEntry(res.data)).finally(() => setLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!entry) return;
    const res = await entries.favorite(entry.id);
    setEntry({ ...entry, favorited: res.data.favorited });
  };

  const handleDuplicate = async () => {
    if (!entry) return;
    const res = await entries.duplicate(entry.id);
    navigate(`/entries/${res.data.id}`);
  };

  const handleDelete = async () => {
    if (!entry) return;
    await entries.delete(entry.id);
    navigate(`/topics/${entry.topic_pk}`);
  };

  if (loading) return <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />;
  if (!entry) return <div className="text-center py-16 text-gray-500">Entry not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to={`/topics/${entry.topic_pk}`}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" /> {entry.topic_text}
      </Link>

      <article className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{entry.display_title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
          <span>{new Date(entry.date_added).toLocaleString()}</span>
          {entry.updated_at !== entry.date_added && (
            <span>· updated {new Date(entry.updated_at).toLocaleString()}</span>
          )}
          <span>· {entry.word_count} chars</span>
        </div>

        <div className="prose prose-gray max-w-none">
          <MarkdownRenderer content={entry.text} />
        </div>

        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          <Link
            to={`/entries/${entry.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button
            onClick={handleDuplicate}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4" /> Duplicate
          </button>
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              entry.favorited
                ? 'bg-amber-400 text-white hover:bg-amber-500'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Star className={`w-4 h-4 ${entry.favorited ? 'fill-white' : ''}`} />
            {entry.favorited ? 'Favorited' : 'Favorite'}
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </article>

      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Delete entry?</h3>
            <p className="text-gray-500 mt-2">This action cannot be undone.</p>
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

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-xl font-semibold mt-5 mb-2">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>);
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1 my-3">
          {items.map((item, j) => <li key={j}>{item}</li>)}
        </ul>
      );
      continue;
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-gray-300 pl-4 text-gray-600 italic my-3">
          {line.slice(2)}
        </blockquote>
      );
    } else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-3">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-3" />);
    } else {
      elements.push(<p key={i} className="my-2 leading-relaxed">{line}</p>);
    }
    i++;
  }

  return <>{elements}</>;
}
