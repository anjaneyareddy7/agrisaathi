import React, { useState, useEffect } from 'react';
import { Wallet, Building2, Navigation, AlertCircle } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';

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
  const [prices, setPrices] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    base44.entities.GovMarket.list().then(setMarkets).catch(() => {});
    base44.entities.MarketPrice.list('-price_date').then(setPrices).catch(() => {});
  }, []);

  const useLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => alert('Could not get location.')
    );
  };

  let list = markets.map((m) => ({ ...m, _dist: origin ? haversine(origin.lat, origin.lng, m.lat_approx, m.lng_approx) : null }));
  if (stateFilter) list = list.filter((m) => m.state === stateFilter);
  list.sort((a, b) => (a._dist == null) - (b._dist == null) || a._dist - b._dist);
  list = list.slice(0, 15);

  const states = [...new Set(markets.map((m) => m.state))].sort();
  const hasLivePrices = prices.length > 0;

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

      {!hasLivePrices && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
          <p className="text-xs text-amber-700">{t('livePricesNotConfigured')}</p>
        </div>
      )}

      <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('nearestMandis')}</h3>
      <div className="space-y-2">
        {list.map((m) => {
          const mktPrices = prices.filter((p) => p.market_name === m.market_name);
          return (
            <Card key={m.id}><CardContent className="pt-3">
              <div className="flex items-start gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 shrink-0"><Building2 className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{m.market_name}</p>
                  <p className="text-xs text-gray-400">{m.district_region} · {m.state}</p>
                  <p className="text-xs text-gray-500 mt-0.5"><span className="text-gray-400">{t('commodities')}:</span> {m.commodities_traded}</p>
                  {m._dist != null && <Badge className="mt-1 bg-gray-100 text-gray-600">{m._dist.toFixed(1)} {t('distance')}</Badge>}
                  {mktPrices.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      {mktPrices.map((p) => (
                        <div key={p.id} className="flex justify-between text-xs bg-green-50 rounded px-2 py-1">
                          <span className="font-medium">{p.commodity}</span>
                          <span>₹{p.modal_price}/{p.unit || 'qtl'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 mt-1">{t('dataUnavailable')}</p>
                  )}
                </div>
              </div>
            </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
