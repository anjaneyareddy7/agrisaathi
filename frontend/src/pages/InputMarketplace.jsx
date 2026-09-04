import { useState, useEffect } from 'react';
import { Store, Navigation, Phone, BadgeCheck, Star, Sprout, FlaskConical, Tractor, Bug, Boxes, MapPin, Loader2 } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const CATEGORIES = [
  { value: '', label: 'All', icon: Boxes },
  { value: 'fertilizer', label: 'Fertilizer', icon: FlaskConical },
  { value: 'seeds', label: 'Seeds', icon: Sprout },
  { value: 'equipment', label: 'Equipment', icon: Tractor },
  { value: 'pesticide', label: 'Pesticide', icon: Bug },
  { value: 'general', label: 'General', icon: Store },
];

export default function InputMarketplace() {
  const [shops, setShops] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [locating, setLocating] = useState(false);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { appClient.entities.InputShop.list('name', 200).then(setShops).catch(() => {}).finally(() => setLoading(false)); }, []);

  const useLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false)
    );
  };

  let list = shops
    .filter((s) => !filter || s.category === filter)
    .map((s) => ({ ...s, _dist: origin && s.lat != null ? haversine(origin.lat, origin.lng, s.lat, s.lng) : null }));
  list.sort((a, b) => (a._dist == null) - (b._dist == null) || a._dist - b._dist);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Input Marketplace" subtitle="Find seed, fertilizer and equipment shops near you" icon={Store} />

      {/* Locate bar */}
      <button onClick={useLocation}
        className={`mb-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white shadow-sm transition-colors ${origin ? 'bg-leaf-800 hover:bg-leaf-900' : 'bg-leaf-700 hover:bg-leaf-800'} animate-fade-up`}>
        {locating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
        {origin ? 'Location active — sorted by distance' : 'Use my location'}
      </button>

      {/* Category chips */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setFilter(c.value)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filter === c.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
            <c.icon size={12} /> {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[104px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState icon={Store} title="No shops found" subtitle={filter ? 'Try another category.' : 'Shops will appear here once added.'} />
      ) : (
        <SectionCard title={origin ? 'Nearest first' : 'All shops'} icon={MapPin}>
          <ul className="divide-y divide-gray-100">
            {list.map((s, i) => (
              <li key={s.id} className="px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><Store size={17} /></span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                        <span className="truncate">{s.name}</span>
                        {s.verified && <BadgeCheck size={14} className="shrink-0 text-leaf-600" />}
                      </p>
                      <p className="mt-0.5 text-xs capitalize text-gray-500">{[s.category, s.district, s.state].filter(Boolean).join(' · ')}</p>
                      {s.address && <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{s.address}</p>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {s._dist != null && (
                      <span className="rounded-full bg-leaf-50 px-2 py-0.5 text-[11px] font-bold text-leaf-700">
                        {s._dist < 1 ? `${Math.round(s._dist * 1000)}m` : `${s._dist.toFixed(1)}km`}
                      </span>
                    )}
                    {s.rating != null && (
                      <p className="mt-1 flex items-center justify-end gap-0.5 text-xs font-semibold text-amber-500"><Star size={11} className="fill-amber-400" />{s.rating}</p>
                    )}
                  </div>
                </div>
                {s.phone && (
                  <a href={`tel:${s.phone}`}
                    className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-leaf-200 bg-leaf-50/50 py-2 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50">
                    <Phone size={12} /> {s.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
