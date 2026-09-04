import { useEffect, useMemo, useState } from 'react';
import { Wallet, Building2, Navigation, AlertCircle, TrendingUp, Search, IndianRupee, Store } from 'lucide-react';
import { getDataGovResourceRecords } from '../lib/dataGov';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard } from '../components/kit';

const normaliseRecord = (record) => ({
  state: record?.state ?? record?.State ?? '',
  district: record?.district ?? record?.District ?? '',
  market: record?.market ?? record?.Market ?? '',
  commodity: record?.commodity ?? record?.Commodity ?? '',
  variety: record?.variety ?? record?.Variety ?? '',
  grade: record?.grade ?? record?.Grade ?? '',
  arrival_date: record?.arrival_date ?? record?.Arrival_Date ?? '',
  min_price: Number(record?.min_price ?? record?.Min_Price ?? 0),
  max_price: Number(record?.max_price ?? record?.Max_Price ?? 0),
  modal_price: Number(record?.modal_price ?? record?.Modal_Price ?? 0),
});

export default function MarketPrices() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const loadPrices = async () => {
      setLoading(true); setError('');
      try {
        const data = await getDataGovResourceRecords('mandi_prices', { limit: 100 });
        if (!cancelled) setRecords(data.map(normaliseRecord));
      } catch (err) {
        if (!cancelled) { setRecords([]); setError(err?.message || 'Could not load market prices.'); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadPrices();
    return () => { cancelled = true; };
  }, []);

  const states = useMemo(() => [...new Set(records.map((r) => r.state).filter(Boolean))].sort(), [records]);
  const commodities = useMemo(() => [...new Set(records.map((r) => r.commodity).filter(Boolean))].sort(), [records]);

  const filteredRecords = useMemo(() => {
    const q = search.trim().toLowerCase();
    return records.filter((r) => {
      const stateOK = !stateFilter || r.state === stateFilter;
      const commodityOK = !commodityFilter || r.commodity === commodityFilter;
      const searchOK = !q || `${r.commodity} ${r.market} ${r.district}`.toLowerCase().includes(q);
      return stateOK && commodityOK && searchOK;
    });
  }, [records, stateFilter, commodityFilter, search]);

  const mandis = useMemo(() => {
    const map = new Map();
    filteredRecords.forEach((r) => {
      const key = `${r.state}|${r.district}|${r.market}`;
      if (!map.has(key)) {
        map.set(key, { id: key, market_name: r.market, district: r.district, state: r.state, commodities: new Set() });
      }
      if (r.commodity) map.get(key).commodities.add(r.commodity);
    });
    return [...map.values()]
      .map((m) => ({ ...m, commodities: [...m.commodities].slice(0, 8).join(', '), count: m.commodities.size }))
      .slice(0, 15);
  }, [filteredRecords]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      () => alert('Location detected. Mandi records do not include coordinates yet, so use the state filter instead.'),
      () => alert('Could not get your location.')
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Mandi Prices" icon={Wallet} subtitle="Daily bhav from mandis across India" />

      {/* Hero strip */}
      <div className="flex animate-fade-up items-center justify-between rounded-2xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-4 text-white shadow-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-harvest-100">Live from Data.gov.in</p>
          <p className="mt-1 text-2xl font-bold leading-none">
            {loading ? '—' : filteredRecords.length} <span className="text-sm font-medium">prices</span>
          </p>
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <TrendingUp size={22} />
        </span>
      </div>

      {/* Filters */}
      <div className="mt-4 flex animate-fade-up gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 shadow-sm transition-all focus-within:border-leaf-500 focus-within:ring-4 focus-within:ring-leaf-100">
          <Search size={15} className="shrink-0 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commodity or mandi…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={useMyLocation}
          aria-label="Use my location"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all hover:border-leaf-400 hover:text-leaf-700 active:scale-90"
        >
          <Navigation size={16} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Select value={stateFilter || '__all__'} onValueChange={(v) => setStateFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder="All states" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="__all__">All states</SelectItem>
            {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={commodityFilter || '__all__'} onValueChange={(v) => setCommodityFilter(v === '__all__' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder="All commodities" /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="__all__">All commodities</SelectItem>
            {commodities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Error */}
      {!loading && error && (
        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle size={17} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-xs leading-relaxed text-red-600">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-shimmer h-[86px] rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />
          ))}
        </div>
      )}

      {/* Price list */}
      {!loading && !error && filteredRecords.length > 0 && (
        <div className="mt-4 space-y-2.5">
          {filteredRecords.slice(0, 30).map((r, i) => {
            const span = Math.max(1, r.max_price - r.min_price);
            const pos = Math.min(100, Math.max(0, ((r.modal_price - r.min_price) / span) * 100));
            return (
              <div key={`${r.state}-${r.market}-${r.commodity}-${i}`}
                className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-leaf-300 hover:shadow-md"
                style={{ animationDelay: `${Math.min(i, 10) * 35}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {r.commodity}
                      {r.variety && <span className="font-normal text-gray-400"> · {r.variety}</span>}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">
                      {r.market}{r.district && ` · ${r.district}`}{r.state && ` · ${r.state}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="flex items-center justify-end text-base font-bold text-leaf-700">
                      <IndianRupee size={13} strokeWidth={3} />{r.modal_price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">per quintal</p>
                  </div>
                </div>

                {/* Min-modal-max range */}
                {r.min_price > 0 && r.max_price > 0 && (
                  <div className="mt-3">
                    <div className="relative h-1.5 rounded-full bg-gray-100">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-leaf-200 to-harvest-300" style={{ width: `${Math.max(pos, 8)}%` }} />
                      <span
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-leaf-700 shadow"
                        style={{ left: `calc(${pos}% - 6px)` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[10px] font-medium text-gray-400">
                      <span>₹{r.min_price.toLocaleString('en-IN')}</span>
                      {r.arrival_date && <span>{r.arrival_date}</span>}
                      <span>₹{r.max_price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && filteredRecords.length === 0 && (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <Search size={24} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-600">No prices match your filters</p>
        </div>
      )}

      {/* Mandis */}
      {mandis.length > 0 && (
        <div className="mt-6">
          <SectionCard icon={Store} title="Markets / Mandis" tone="bg-harvest-100 text-harvest-700">
            <ul className="divide-y divide-gray-100">
              {mandis.map((m) => (
                <li key={m.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-harvest-100 text-harvest-700">
                    <Building2 size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{m.market_name || 'Unknown market'}</p>
                    <p className="truncate text-xs text-gray-400">{m.district && `${m.district} · `}{m.state}</p>
                    {m.commodities && <p className="mt-0.5 truncate text-[11px] text-gray-400">{m.commodities}</p>}
                  </div>
                  <span className="shrink-0 rounded-full bg-leaf-50 px-2 py-1 text-[10px] font-bold text-leaf-700">{m.count}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      )}

      <p className="mt-5 text-center text-[10px] text-gray-300">Source: Data.gov.in · AGMARKNET daily mandi arrivals</p>
    </div>
  );
}
