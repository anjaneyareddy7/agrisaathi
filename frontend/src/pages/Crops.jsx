import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sprout, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import { EmptyState } from '@/components/kit';
import cropData from '@/data/cropEncyclopedia.json';

const CATEGORY_TONES = {
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-leaf-100 text-leaf-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  pink: 'bg-pink-100 text-pink-700',
  violet: 'bg-violet-100 text-violet-700',
};

export default function Crops() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = cropData.categories;

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .filter((c) => activeCategory === 'all' || c.id === activeCategory)
      .map((c) => ({
        ...c,
        types: c.types.filter((tItem) =>
          !q ||
          tItem.name.toLowerCase().includes(q) ||
          tItem.category_use.toLowerCase().includes(q) ||
          tItem.varieties.some((v) => v.name.toLowerCase().includes(q))
        ),
      }))
      .filter((c) => c.types.length > 0);
  }, [categories, query, activeCategory]);

  const totalTypes = filteredCategories.reduce((s, c) => s + c.types.length, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Crop Encyclopedia" subtitle="Browse crops by category — tap for sowing, irrigation and harvest guidance" icon={Sprout} />

      {/* Search */}
      <div className="relative mb-3 animate-fade-up">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search crop, use or variety…"
          className="h-11 rounded-xl border-gray-200 bg-white pl-10 text-sm focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
        />
      </div>

      {/* Category chips */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar animate-fade-up">
        <button onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${activeCategory === 'all' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
          All
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActiveCategory(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${activeCategory === c.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 ? (
        <EmptyState icon={Sprout} title="No crop types found" subtitle="Try a different search or category." />
      ) : (
        <>
          <p className="mb-3 text-[11px] font-medium text-gray-400">{totalTypes} crop types</p>
          {filteredCategories.map((c) => (
            <div key={c.id} className="mb-5">
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <span className={`h-2 w-2 rounded-full ${CATEGORY_TONES[c.color]?.replace('text-', 'bg-') || 'bg-gray-300'}`} />
                {c.name}
              </h3>
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <ul className="divide-y divide-gray-100">
                  {c.types.map((tItem, i) => (
                    <li key={tItem.id}>
                      <button onClick={() => navigate(`/crop-encyclopedia/${c.id}/${tItem.id}`)}
                        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 animate-slide-in"
                        style={{ animationDelay: `${Math.min(i, 8) * 25}ms` }}>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${CATEGORY_TONES[c.color] || 'bg-gray-100 text-gray-600'}`}>
                          <Sprout size={17} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900">{tItem.name}</p>
                          <p className="truncate text-xs text-gray-500">{tItem.category_use}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {tItem.varieties.slice(0, 2).map((v) => (
                              <Badge key={v.name} className="bg-gray-100 text-gray-600 hover:bg-gray-100 text-[10px]">{v.name}</Badge>
                            ))}
                            {tItem.varieties.length > 2 && (
                              <Badge className="bg-gray-50 text-gray-400 hover:bg-gray-50 text-[10px]">+{tItem.varieties.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight size={16} className="shrink-0 text-gray-300" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
