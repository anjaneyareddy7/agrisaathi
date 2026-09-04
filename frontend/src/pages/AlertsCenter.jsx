import { useState, useEffect, useCallback } from 'react';
import { Bell, AlertTriangle, CloudRain, TrendingUp, TrendingDown, Package, ShieldCheck, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import PageHeader from '../components/PageHeader';
import { SectionCard } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';

function AlertGroup({ icon: Icon, title, tone, loading, emptyText, children }) {
  return (
    <SectionCard className="mb-4 animate-fade-up" icon={Icon} title={title} tone={tone}>
      {loading ? (
        <div className="flex items-center gap-2 px-4 py-5 text-xs text-gray-400">
          <Loader2 size={13} className="animate-spin" /> Checking…
        </div>
      ) : children}
    </SectionCard>
  );
}

export default function AlertsCenter() {
  const deviceId = getDeviceId();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [forecastDays, setForecastDays] = useState([]);
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/inventory/${deviceId}`);
      const blocks = res.data.blocks || [];
      const latestByItem = {};
      [...blocks].reverse().forEach((b) => {
        const item = b.payload?.item;
        if (item && !latestByItem[item]) latestByItem[item] = b;
      });
      const low = Object.values(latestByItem).filter(
        (b) => b.payload?.low_stock_at != null && b.payload.quantity <= b.payload.low_stock_at
      );
      setLowStockItems(low);
    } catch { setLowStockItems([]); }

    try {
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation
          ? navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          : reject(new Error('no geolocation'))
      );
      const { latitude, longitude } = pos.coords;
      const fRes = await axios.get(`${API_URL}/api/weather/forecast`, { params: { lat: latitude, lon: longitude } });
      const risky = (fRes.data.days || []).filter((d) => d.rain_probability >= 60);
      setForecastDays(risky);
    } catch { setForecastDays([]); }

    try {
      const pRes = await axios.get(`${API_URL}/api/price-alerts`);
      setPriceAlerts(pRes.data.alerts || []);
    } catch { setPriceAlerts([]); }

    setLoading(false);
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const totalAlerts = lowStockItems.length + forecastDays.length + priceAlerts.length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Alerts Center" subtitle="Everything that needs your attention, in one place" icon={Bell} />

      {/* Hero */}
      <div className={`mb-4 overflow-hidden rounded-3xl p-5 text-white shadow-md animate-fade-up ${totalAlerts > 0 ? 'bg-gradient-to-br from-harvest-500 to-harvest-700' : 'bg-gradient-to-br from-leaf-800 to-leaf-950'}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{totalAlerts > 0 ? 'Active alerts' : 'Status'}</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{totalAlerts > 0 ? totalAlerts : 'All clear'}</p>
            <p className="mt-2 max-w-[260px] text-xs leading-relaxed text-white/80">
              {totalAlerts > 0
                ? 'Tap through to each section below to see details and act.'
                : 'Stock levels, weather and prices all look normal right now.'}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            {totalAlerts > 0 ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
          </span>
        </div>
      </div>

      {/* Low stock */}
      <AlertGroup icon={Package} title="Low stock" tone="bg-amber-100 text-amber-700" loading={loading} emptyText="">
        {lowStockItems.length === 0 ? (
          <p className="px-4 py-5 text-xs text-gray-400">Nothing running low.</p>
        ) : (
          <ul className="divide-y divide-amber-100">
            {lowStockItems.map((b) => (
              <li key={b.payload.item} className="flex items-center gap-3 bg-amber-50/60 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><AlertTriangle size={15} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">{b.payload.item}</p>
                  <p className="text-xs text-amber-700">{b.payload.quantity} {b.payload.unit} left · threshold {b.payload.low_stock_at}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AlertGroup>

      {/* Weather risk */}
      <AlertGroup icon={CloudRain} title="Weather risk" tone="bg-blue-100 text-blue-700" loading={loading}>
        {forecastDays.length === 0 ? (
          <p className="px-4 py-5 text-xs text-gray-400">No high rain risk in the next 5 days.</p>
        ) : (
          <ul className="divide-y divide-blue-100">
            {forecastDays.map((d) => (
              <li key={d.date} className="flex items-center gap-3 bg-blue-50/60 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><CloudRain size={15} /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900">{d.date} · {Math.round(d.rain_probability)}% rain chance</p>
                  <p className="text-xs text-blue-700">{d.description} · {Math.round(d.temp_min)}–{Math.round(d.temp_max)}°C</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AlertGroup>

      {/* Price changes */}
      <AlertGroup icon={TrendingUp} title="Price changes" tone="bg-leaf-100 text-leaf-700" loading={loading}>
        {priceAlerts.length === 0 ? (
          <p className="px-4 py-5 text-xs leading-relaxed text-gray-400">
            No price swings of 5% or more recorded yet. Alerts build up as prices are checked over time — visit Market Prices a few times to start tracking changes.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {priceAlerts.map((p) => (
              <li key={`${p.market}-${p.commodity}`} className="flex items-center gap-3 px-4 py-3 animate-slide-in">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${p.direction === 'up' ? 'bg-leaf-100 text-leaf-700' : 'bg-red-100 text-red-600'}`}>
                  {p.direction === 'up' ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{p.commodity} — {p.market}</p>
                  <p className={`text-xs font-medium ${p.direction === 'up' ? 'text-leaf-700' : 'text-red-600'}`}>
                    ₹{p.previous_price} → ₹{p.current_price} ({p.direction === 'up' ? '+' : ''}{p.pct_change}%)
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AlertGroup>
    </div>
  );
}
