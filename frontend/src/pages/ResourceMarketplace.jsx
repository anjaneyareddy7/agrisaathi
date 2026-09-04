import { useEffect, useMemo, useState } from 'react';
import { Store, Database, Clock3, Search, Sprout, FlaskConical, Bug, Tractor, Info } from 'lucide-react';
import { getDataGovResources } from '../lib/dataGov';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const LOCAL_RESOURCES = [
  { name: 'Seeds', note: 'Use verified local suppliers and confirm current price and stock before purchase.', icon: Sprout, tone: 'bg-leaf-100 text-leaf-700' },
  { name: 'Fertilizer', note: 'Confirm current availability, product registration and price with the seller.', icon: FlaskConical, tone: 'bg-cyan-100 text-cyan-700' },
  { name: 'Pesticide', note: 'Use only registered products and follow the product label.', icon: Bug, tone: 'bg-rose-100 text-rose-700' },
  { name: 'Farm Equipment', note: 'Contact local vendors for current rental or sale availability.', icon: Tractor, tone: 'bg-violet-100 text-violet-700' },
];

export default function ResourceMarketplace() {
  const [resources, setResources] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getDataGovResources()
      .then((result) => {
        const list = Array.isArray(result?.resources) ? result.resources : Array.isArray(result) ? result : [];
        setResources(list);
      })
      .catch(() => setResources([]));
  }, []);

  const marketplaceResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          resource.primary_feature === 'Marketplace' ||
          (resource.secondary_features || []).includes('Marketplace')
      ),
    [resources]
  );

  const filtered = LOCAL_RESOURCES.filter((item) =>
    `${item.name} ${item.note}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Resource Marketplace" subtitle="Farmer resource directory — inputs, equipment and official data sources" icon={Store} />

      {/* Search */}
      <div className="relative mb-4 animate-fade-up">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources…"
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100"
        />
      </div>

      {/* Local resource cards */}
      {filtered.length === 0 ? (
        <EmptyState icon={Store} title="No resources match" subtitle="Try a different search." />
      ) : (
        <div className="mb-4 space-y-2">
          {filtered.map((item, i) => (
            <div key={item.name}
              className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-leaf-300 animate-slide-in"
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><item.icon size={17} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Honest scope note */}
      <div className="mb-4 flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 animate-fade-up">
        <Info size={14} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-xs leading-relaxed text-blue-800/90">
          A directory, not a shop — this page does not claim live seller prices or stock. Use it to know what to ask your supplier.
        </p>
      </div>

      {/* Data.gov sources */}
      <SectionCard icon={Database} title="Data.gov marketplace sources" tone="bg-blue-100 text-blue-700">
        <div className="p-4">
          <p className="text-xs text-gray-500">
            {marketplaceResources.length} registered source{marketplaceResources.length === 1 ? '' : 's'} mapped to Marketplace.
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {marketplaceResources.map((resource) => (
              <li key={resource.resource_key} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2">
                <span className="truncate text-xs font-semibold text-gray-700">{resource.resource_key}</span>
                {resource.temporal_status === 'HISTORICAL' ? (
                  <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold text-amber-700"><Clock3 size={10} /> historical</span>
                ) : (
                  <span className="shrink-0 text-[10px] font-bold capitalize text-leaf-700">{resource.temporal_status?.toLowerCase() || '—'}</span>
                )}
              </li>
            ))}
            {marketplaceResources.length === 0 && (
              <li className="py-2 text-center text-xs text-gray-400">No marketplace sources loaded.</li>
            )}
          </ul>
        </div>
      </SectionCard>
    </div>
  );
}
