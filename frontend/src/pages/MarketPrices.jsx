import React, { useState, useEffect } from 'react';
import { Wallet, Building2, Navigation, AlertCircle, TrendingUp } from 'lucide-react';
import { useLang } from '../lib/i18n';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function MarketPrices() {
  const { t } = useLang();
  const [markets, setMarkets] = useState([]);
  const [liveRecords, setLiveRecords] = useState([]);
  const [liveSource, setLiveSource] = useState(null);
  const [liveNote, setLiveNote] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/gov-markets`)
      .then((res) => setMarkets((res.data || []).map((m, idx) => ({
        id: `market_${m.state}_${idx}`,
        market_name: m.market_name,
        state: m.state,
        district_region: m.district_region,
        lat_approx: m.lat,
        lng_approx: m.lng,
        commodities_traded: m.commodities_traded,
      }))))
      .catch(() => setMarkets([]));
  }, []);

  useEffect(() => {
    if (!stateFilter) { setLiveRecords([]); setLiveSource(null); setLiveNote(null); return; }
    setLiveLoading(true);
    axios.get(`${API_URL}/api/mandi-prices`, { params: { state: stateFilter, limit: 30 } })
      .then((res) => {
        setLiveRecords(res.data?.records || []);
        setLiveSource(res.data?.source || null);
        setLiveNote(res.data?.note || null);
      })
      .catch(() => { setLiveRecords([]); setLiveSource(null); setLiveNote('Could not reach the price service.'); })
      .finally(() => setLiveLoading(false));
  }, [stateFilter]);

  const useLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Could not get location.')
    );
  };

  let list = markets.map((m) => ({ ...m, _dist: origin && m.lat_approx != null ? haversine(origin.lat, origin.lng, m.lat_approx, m.lng_approx) : null }));
  if (stateFilter) list = list.filter((m) => m.state === stateFilter);
  list.sort((a, b) => (a._dist == null) - (b._dist == null) || a._dist - b._dist);
  list = list.slice(0, 15);

  const states = [...new Set(markets.map((m) => m.state))].sort();

  return (
    <div>
      <PageHeader titleKey="marketPrices" icon={Wallet} />

      <div className="flex gap-2 mb-3">
        <Button onClick={useLocation} className="flex-1 bg-green-600 hover:bg-green-700"><Navigation className="h-4 w-4 mr-1" />{t('useMyLocation')}</Button>
        <Select value={stateFilter} onValueChange={setStateFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder={t('pickLocation')} /></SelectTrigger>
          <SelectContent className="max-h-72">{states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><TrendingUp className="h-4 w-4" />{t('livePrices') || 'Live Prices'}</h3>

      {!stateFilter && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">Pick a state above to see today's live commodity prices.</p>
        </div>
      )}

      {stateFilter && liveLoading && <p className="text-xs text-gray-400 mb-3">{t('loading')}</p>}

      {stateFilter && !liveLoading && liveSource === 'sample_fallback' && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">{liveNote || 'Live prices unavailable right now, showing sample data.'}</p>
        </div>
      )}

      {stateFilter && !liveLoading && liveRecords.length > 0 && (
        <div className="space-y-2 mb-4">
          {liveRecords.map((r, idx) => (
            <Card key={`price_${idx}`}><CardContent className="pt-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{r.commodity} <span className="text-gray-400 font-normal">· {r.variety}</span></p>
                  <p className="text-xs text-gray-400 truncate">{r.market} · {r.district}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-green-700">₹{r.modal_price}</p>
                  <p className="text-[10px] text-gray-400">{r.arrival_date}</p>
                </div>
              </div>
            </CardContent></Card>
          ))}
        </div>
      )}

      {stateFilter && !liveLoading && liveRecords.length === 0 && (
        <p className="text-xs text-gray-400 mb-4">No live price records for {stateFilter} right now.</p>
      )}

      <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('nearestMandis')}</h3>
      <div className="space-y-2">
        {list.map((m) => (
          <Card key={m.id}><CardContent className="pt-3">
            <div className="flex items-start gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 shrink-0"><Building2 className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{m.market_name}</p>
                <p className="text-xs text-gray-400">{m.district_region} · {m.state}</p>
                <p className="text-xs text-gray-500 mt-0.5"><span className="text-gray-400">{t('commodities')}:</span> {m.commodities_traded}</p>
                {m._dist != null && <Badge className="mt-1 bg-gray-100 text-gray-600">{m._dist.toFixed(1)} {t('distance')}</Badge>}
              </div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
