import { useState, useEffect } from 'react';
import { MapPin, Phone, Building2, Sprout, Navigation, ExternalLink, Store, Leaf, FlaskConical, X } from 'lucide-react';
import axios from 'axios';
import { CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import PageHeader from '../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || '';

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const SHOP_TYPES = {
  agrarian: { label: 'Agro shop (pesticides/fertilizers)', icon: FlaskConical, color: 'bg-violet-100 text-violet-700' },
  garden_centre: { label: 'Nursery / seeds', icon: Sprout, color: 'bg-leaf-100 text-leaf-700' },
  health_food: { label: 'Organic products', icon: Leaf, color: 'bg-emerald-100 text-emerald-700' },
  florist: { label: 'Florist / seeds', icon: Leaf, color: 'bg-teal-100 text-teal-700' },
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'kvk', label: 'KVKs' },
  { id: 'market', label: 'Markets' },
  { id: 'shop', label: 'Shops' },
];

export default function NearMe() {
  const [kvks, setKvks] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [shops, setShops] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [filter, setFilter] = useState('all');
  const [radius, setRadius] = useState(50);
  const [selected, setSelected] = useState(null);
  const [shopsLoading, setShopsLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/kvk`)
      .then((res) => setKvks((res.data || []).map((k, idx) => ({
        id: `kvk_${k.state}_${k.serial_no ?? idx}`,
        address: k.address, state_ut: k.state, host_institution_approx: k.host_institution,
        year_of_sanction: k.year_of_sanction, kvk_type: k.type,
        lat_approx: null, lng_approx: null, VERIFY_AT: k.verify_at,
      }))))
      .catch(() => setKvks([]));
    axios.get(`${API_URL}/api/gov-markets`)
      .then((res) => setMarkets((res.data || []).map((m) => ({
        id: `market_${m.market_name}_${m.state}`,
        market_name: m.market_name, state: m.state, district_region: m.district_region,
        lat_approx: m.lat, lng_approx: m.lng, commodities_traded: m.commodities_traded,
      }))))
      .catch(() => setMarkets([]));
  }, []);

  const useLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const o = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(o);
        fetchShops(o);
      },
      () => alert('Could not get location. You can still browse saved centres.')
    );
  };

  const fetchShops = async (o) => {
    setShopsLoading(true);
    try {
      const query = `[out:json][timeout:25];(node["shop"="agrarian"](around:30000,${o.lat},${o.lng});node["shop"="garden_centre"](around:30000,${o.lat},${o.lng});node["shop"="health_food"](around:30000,${o.lat},${o.lng});node["shop"="florist"](around:30000,${o.lat},${o.lng}););out body;`;
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      });
      const data = await res.json();
      setShops((data.elements || []).map((e) => ({
        id: 'shop_' + e.id,
        name: e.tags?.name || SHOP_TYPES[e.tags?.shop]?.label || 'Shop',
        shop_type: e.tags?.shop, lat_approx: e.lat, lng_approx: e.lon, _type: 'shop',
      })));
    } catch { setShops([]); }
    finally { setShopsLoading(false); }
  };

  const withDist = (items) =>
    items.map((i) => ({ ...i, _dist: origin && i.lat_approx != null ? haversine(origin.lat, origin.lng, i.lat_approx, i.lng_approx) : null }));

  let all = [
    ...withDist(kvks.map((k) => ({ ...k, _type: 'kvk' }))),
    ...withDist(markets.map((m) => ({ ...m, _type: 'market' }))),
    ...withDist(shops),
  ];
  if (filter !== 'all') all = all.filter((i) => i._type === filter);
  if (origin) all = all.filter((i) => i._dist == null || i._dist <= radius);
  all.sort((a, b) => (a._dist == null) - (b._dist == null) || a._dist - b._dist);

  const mapCenter = selected?.lat_approx != null ? { lat: selected.lat_approx, lng: selected.lng_approx } : origin || { lat: 20.5937, lng: 78.9629 };
  const delta = 0.05;
  const bbox = `${mapCenter.lng - delta},${mapCenter.lat - delta},${mapCenter.lng + delta},${mapCenter.lat + delta}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`;

  const iconFor = (i) => {
    if (i._type === 'shop') return SHOP_TYPES[i.shop_type]?.icon || Store;
    return i._type === 'kvk' ? Sprout : Building2;
  };
  const colorFor = (i) => {
    if (i._type === 'shop') return SHOP_TYPES[i.shop_type]?.color || 'bg-gray-100 text-gray-600';
    return i._type === 'kvk' ? 'bg-leaf-100 text-leaf-700' : 'bg-amber-100 text-amber-700';
  };
  const nameFor = (i) => i.name || i.market_name || i.address || 'KVK';
  const subFor = (i) => {
    if (i._type === 'shop') return SHOP_TYPES[i.shop_type]?.label;
    if (i._type === 'kvk') return (i.host_institution_approx || '').slice(0, 70) + (i.state_ut ? ` · ${i.state_ut}` : '');
    return (i.district_region || '') + (i.state ? ` · ${i.state}` : '');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Near Me" icon={MapPin} subtitle="KVKs, markets and agro shops around you" />

      {/* Map card */}
      <div className="animate-fade-up overflow-hidden rounded-3xl border border-gray-200 shadow-sm">
        <div className="h-44">
          <iframe src={mapSrc} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="map" />
        </div>
        <button
          onClick={useLocation}
          className="flex w-full items-center justify-center gap-1.5 bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 active:bg-leaf-900"
        >
          <Navigation size={15} /> {origin ? 'Refresh my location' : 'Use my location'}
        </button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex animate-fade-up items-center gap-2" style={{ animationDelay: '60ms' }}>
        <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                filter === f.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {origin && (
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 outline-none"
          >
            {[5, 10, 25, 50, 100].map((r) => <option key={r} value={r}>{r} km</option>)}
          </select>
        )}
      </div>

      {!origin && (
        <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
          Showing saved centres from the ICAR KVK directory and government market list. Tap "Use my location" to find shops nearby and sort by distance.
        </p>
      )}
      {shopsLoading && (
        <div className="mt-3 space-y-2.5">
          {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-16 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
        </div>
      )}

      {/* Results */}
      <div className="mt-3 space-y-2.5">
        {all.slice(0, 40).map((i, idx) => {
          const Icon = iconFor(i);
          return (
            <ResultCard key={i.id} onClick={() => setSelected(i)} delay={Math.min(idx, 8) * 35}>
              <CardContent className="flex items-start gap-3 pt-3.5 pb-3.5">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colorFor(i)}`}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{nameFor(i)}</p>
                  <p className="truncate text-xs text-gray-400">{subFor(i)}</p>
                </div>
                {i._dist != null && (
                  <span className="shrink-0 rounded-full bg-leaf-50 px-2 py-1 text-[10px] font-bold text-leaf-700">
                    {i._dist.toFixed(1)} km
                  </span>
                )}
              </CardContent>
            </ResultCard>
          );
        })}
        {all.length === 0 && !shopsLoading && (
          <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center">
            <MapPin size={26} className="mx-auto text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-600">Nothing found nearby</p>
            <p className="text-xs text-gray-400">Try a larger radius or a different filter.</p>
          </div>
        )}
      </div>

      {/* Detail bottom sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-[2px]" onClick={() => setSelected(null)}>
          <div
            className="mx-auto w-full max-w-md animate-fade-up rounded-t-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-gray-200" />
            </div>
            <CardContent className="space-y-3 pb-7 pt-4">
              <div className="flex items-start gap-3">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${colorFor(selected)}`}>
                  {(() => { const Icon = iconFor(selected); return <Icon size={19} />; })()}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold leading-snug text-gray-900">{nameFor(selected)}</h3>
                  <p className="text-xs text-gray-500">{subFor(selected)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close">
                  <X size={16} />
                </button>
              </div>

              {selected._dist != null && (
                <span className="inline-flex items-center gap-1 rounded-full bg-leaf-50 px-2.5 py-1 text-[11px] font-bold text-leaf-700">
                  <Navigation size={11} /> {selected._dist.toFixed(1)} km away
                </span>
              )}
              {selected.host_institution_approx && <InfoRow label="Host" value={selected.host_institution_approx} />}
              {selected.address && <InfoRow label="Address" value={selected.address} />}
              {selected.commodities_traded && <InfoRow label="Commodities" value={selected.commodities_traded} />}
              {selected.shop_type && <InfoRow label="Type" value={SHOP_TYPES[selected.shop_type]?.label} />}
              <p className="text-[10px] text-gray-300">{selected.VERIFY_AT ? `Verify at: ${selected.VERIFY_AT}` : 'Verify details on the official portal'}</p>

              <div className="space-y-2 pt-1">
                {selected.lat_approx != null && (
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat_approx},${selected.lng_approx}`} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full"><Navigation size={15} /> Get directions</Button>
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`}><Button className="w-full"><Phone size={15} /> Call now</Button></a>
                )}
                {selected._type === 'kvk' && (
                  <a href="https://kvk.icar.gov.in/" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full"><ExternalLink size={15} /> KVK portal</Button>
                  </a>
                )}
                {selected._type === 'market' && (
                  <>
                    <a href="https://agmarknet.gov.in/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full"><ExternalLink size={15} /> AGMARKNET prices</Button>
                    </a>
                    <a href="https://enam.gov.in/" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full"><ExternalLink size={15} /> eNAM portal</Button>
                    </a>
                  </>
                )}
              </div>
            </CardContent>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultCard({ children, onClick, delay = 0 }) {
  return (
    <div
      onClick={onClick}
      className="animate-fade-up cursor-pointer rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-leaf-300 hover:shadow-md active:scale-[0.99]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3.5 py-2.5">
      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm leading-relaxed text-gray-700">{value}</p>
    </div>
  );
}
