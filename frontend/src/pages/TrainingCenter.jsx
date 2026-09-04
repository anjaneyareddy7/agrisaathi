import { useState, useEffect } from 'react';
import { GraduationCap, Play, FileText, Clock, ExternalLink, Search, SearchX } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';

const CATEGORIES = [
  { value: '', label: 'All' }, { value: 'crop', label: 'Crops' }, { value: 'livestock', label: 'Livestock' },
  { value: 'soil', label: 'Soil' }, { value: 'irrigation', label: 'Irrigation' },
  { value: 'machinery', label: 'Machinery' }, { value: 'marketing', label: 'Marketing' },
];

const DIFF_STYLES = {
  beginner: 'bg-leaf-100 text-leaf-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-600',
};

export default function TrainingCenter() {
  const [resources, setResources] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { appClient.entities.TrainingResource.list('title', 200).then(setResources).catch(() => {}); }, []);

  const list = resources
    .filter((r) => !filter || r.category === filter)
    .filter((r) => !search || (r.title + ' ' + (r.summary || '')).toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Training Center" icon={GraduationCap} subtitle="Learn modern farming, one short lesson at a time" />

      {/* Search */}
      <div className="flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-300 bg-white py-2.5 pl-4 pr-2.5 shadow-sm transition-all focus-within:border-leaf-500 focus-within:ring-4 focus-within:ring-leaf-100">
        <Search size={17} className="shrink-0 text-gray-400" />
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search lessons…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Category chips */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setFilter(c.value)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              filter === c.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={SearchX}
            title={resources.length === 0 ? 'No lessons yet' : 'Nothing matches your search'}
            subtitle={resources.length === 0 ? 'Training resources will appear here once added.' : 'Try a different word or category.'}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {list.map((r, i) => {
            const isVideo = r.type === 'video';
            return (
              <a
                key={r.id}
                href={r.url || undefined}
                target={r.url ? '_blank' : undefined}
                rel="noreferrer"
                className="flex animate-fade-up items-start gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-leaf-300 hover:shadow-md active:scale-[0.99]"
                style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isVideo ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>
                  {isVideo ? <Play size={18} /> : <FileText size={18} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-snug text-gray-900">{r.title}</span>
                  {r.summary && <span className="mt-0.5 block line-clamp-2 text-xs leading-relaxed text-gray-500">{r.summary}</span>}
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    {r.category && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-gray-600">{r.category}</span>}
                    {r.difficulty && <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${DIFF_STYLES[r.difficulty] || ''}`}>{r.difficulty}</span>}
                    {r.duration_minutes != null && (
                      <span className="inline-flex items-center gap-0.5 text-[11px] text-gray-400"><Clock size={11} /> {r.duration_minutes}m</span>
                    )}
                    {r.language && r.language !== 'en' && <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{r.language}</span>}
                  </span>
                </span>
                {r.url && <ExternalLink size={15} className="mt-1 shrink-0 text-gray-300" />}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
