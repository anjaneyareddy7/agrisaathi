import { useState, useEffect } from 'react';
import { BookOpen, Syringe, Wheat, Thermometer, TrendingUp, AlertTriangle, ChevronDown, Info } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';

const CATEGORY_LABELS = {
  poultry: 'Poultry',
  dairy: 'Dairy Cattle / Buffalo',
  fisheries: 'Freshwater Fisheries',
  apiculture: 'Beekeeping',
  aquaculture_prawns: 'Prawn / Shrimp',
  small_ruminants: 'Goat / Sheep',
};

function DetailRow({ icon: Icon, tone, label, children }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone}`}><Icon size={13} /></span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <div className="mt-0.5 text-xs leading-relaxed text-gray-700">{children}</div>
      </div>
    </div>
  );
}

export default function AnimalEncyclopedia() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [entries, setEntries] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    appClient
      .call('/api/livestock/encyclopedia/categories')
      .then((res) => {
        setCategories(res.categories || []);
        if (res.categories?.length) setActiveCategory(res.categories[0]);
        setError(null);
      })
      .catch(() => setError('Could not load the encyclopedia. Service may be unavailable.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoadingEntries(true);
    appClient
      .call(`/api/livestock/encyclopedia/${activeCategory}`)
      .then((res) => setEntries(Array.isArray(res) ? res : []))
      .catch(() => setEntries([]))
      .finally(() => setLoadingEntries(false));
  }, [activeCategory]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <div className="mb-4 h-[104px] rounded-3xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
        <div className="mb-4 h-8 w-2/3 rounded-full bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <PageHeader title="Animal Encyclopedia" subtitle="Husbandry reference for livestock keepers" icon={BookOpen} />
        <EmptyState icon={BookOpen} title="Couldn't load" subtitle={error} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Animal Encyclopedia" subtitle="Vaccination schedules, feed and environment needs" icon={BookOpen} />

      {/* Category chips */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-fade-up">
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${activeCategory === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
            {CATEGORY_LABELS[c] || c}
          </button>
        ))}
      </div>

      {loadingEntries ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState icon={BookOpen} title="No entries yet" subtitle="This category hasn't been filled in yet." />
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors animate-slide-in ${expanded ? 'border-leaf-300' : 'border-gray-200 hover:border-leaf-200'}`}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left" onClick={() => setExpandedId(expanded ? null : entry.id)}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-harvest-100 text-harvest-700"><BookOpen size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{entry.name_en}</p>
                    <p className="truncate text-xs text-gray-500">{entry.purpose}</p>
                  </div>
                  <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </button>

                {expanded && (
                  <div className="space-y-3.5 border-t border-gray-100 px-4 py-4 animate-fade-up">
                    <DetailRow icon={TrendingUp} tone="bg-leaf-100 text-leaf-700" label="Maturity & yield">{entry.maturity_yield}</DetailRow>
                    <DetailRow icon={Wheat} tone="bg-harvest-100 text-harvest-700" label="Feed">{entry.feed}</DetailRow>
                    <DetailRow icon={Thermometer} tone="bg-blue-100 text-blue-700" label="Environment">{entry.environment}</DetailRow>

                    {entry.vaccination_schedule?.length > 0 && (
                      <DetailRow icon={Syringe} tone="bg-red-100 text-red-600" label="Vaccination schedule">
                        <ul className="space-y-1">
                          {entry.vaccination_schedule.map((v, j) => (
                            <li key={j} className="flex gap-2">
                              <span className="shrink-0 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-600">{v.age}</span>
                              <span className="text-gray-700">{v.vaccine}</span>
                            </li>
                          ))}
                        </ul>
                      </DetailRow>
                    )}

                    {entry.care_notes && (
                      <div className="flex items-start gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-800">
                        <Info size={13} className="mt-0.5 shrink-0" /> {entry.care_notes}
                      </div>
                    )}

                    {entry.common_risks?.length > 0 && (
                      <DetailRow icon={AlertTriangle} tone="bg-amber-100 text-amber-700" label="Common risks">
                        <div className="flex flex-wrap gap-1.5">
                          {entry.common_risks.map((r) => (
                            <span key={r} className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">{r}</span>
                          ))}
                        </div>
                      </DetailRow>
                    )}

                    <p className="border-t border-gray-100 pt-2 text-[10px] text-gray-400">{entry.source}</p>
                    <p className="text-[10px] leading-relaxed text-gray-400">Always confirm specifics with your local veterinarian or KVK.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
