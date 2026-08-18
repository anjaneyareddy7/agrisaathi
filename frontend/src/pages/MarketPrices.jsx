import { useEffect, useMemo, useState } from 'react'
import {
  Wallet,
  Building2,
  Navigation,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

import { useLang } from '../lib/i18n';
import { getDataGovResourceRecords } from '../lib/dataGov';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';

import PageHeader from '../components/PageHeader';

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
  const { t } = useLang();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [commodityFilter, setCommodityFilter] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadPrices = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await getDataGovResourceRecords(
          'mandi_prices',
          { limit: 100 }
        );

        if (!cancelled) {
          setRecords(data.map(normaliseRecord));
        }
      } catch (err) {
        console.error('Data.gov mandi prices error:', err);

        if (!cancelled) {
          setRecords([]);
          setError(
            err?.message || 'Could not load market prices.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadPrices();

    return () => {
      cancelled = true;
    };
  }, []);

  const useLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        alert(
          'Your location was detected. Current Data.gov mandi records do not include coordinates, so exact distance cannot be calculated.'
        );
      },
      () => {
        alert('Could not get your location.');
      }
    );
  };

  const states = useMemo(
    () =>
      [...new Set(
        records.map((r) => r.state).filter(Boolean)
      )].sort(),
    [records]
  );

  const commodities = useMemo(
    () =>
      [...new Set(
        records.map((r) => r.commodity).filter(Boolean)
      )].sort(),
    [records]
  );

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const stateOK =
        !stateFilter || r.state === stateFilter;

      const commodityOK =
        !commodityFilter ||
        r.commodity === commodityFilter;

      return stateOK && commodityOK;
    });
  }, [records, stateFilter, commodityFilter]);

  const mandis = useMemo(() => {
    const map = new Map();

    filteredRecords.forEach((r) => {
      const key = `${r.state}|${r.district}|${r.market}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          market_name: r.market,
          district: r.district,
          state: r.state,
          commodities: new Set(),
        });
      }

      if (r.commodity) {
        map.get(key).commodities.add(r.commodity);
      }
    });

    return [...map.values()]
      .map((m) => ({
        ...m,
        commodities: [...m.commodities]
          .slice(0, 8)
          .join(', '),
      }))
      .slice(0, 15);
  }, [filteredRecords]);

  return (
    <div>
      <PageHeader
        titleKey="marketPrices"
        icon={Wallet}
      />

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <Button
          onClick={useLocation}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          <Navigation className="h-4 w-4 mr-1" />
          {t('useMyLocation') || 'Use My Location'}
        </Button>

        <Select
          value={stateFilter}
          onValueChange={(value) =>
            setStateFilter(
              value === '__all__' ? '' : value
            )
          }
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue
              placeholder={
                t('pickLocation') || 'Select State'
              }
            />
          </SelectTrigger>

          <SelectContent className="max-h-72">
            <SelectItem value="__all__">
              All States
            </SelectItem>

            {states.map((state) => (
              <SelectItem
                key={state}
                value={state}
              >
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={commodityFilter}
          onValueChange={(value) =>
            setCommodityFilter(
              value === '__all__' ? '' : value
            )
          }
        >
          <SelectTrigger className="sm:w-52">
            <SelectValue placeholder="Commodity" />
          </SelectTrigger>

          <SelectContent className="max-h-72">
            <SelectItem value="__all__">
              All Commodities
            </SelectItem>

            {commodities.map((commodity) => (
              <SelectItem
                key={commodity}
                value={commodity}
              >
                {commodity}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
        <TrendingUp className="h-4 w-4" />
        {t('livePrices') || 'Live Market Prices'}
      </h3>

      {loading && (
        <p className="text-xs text-gray-400 mb-3">
          {t('loading') || 'Loading market prices...'}
        </p>
      )}

      {!loading && error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-xs text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && records.length > 0 && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-xs text-green-700">
            Current market prices loaded from
            Data.gov.in.
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        filteredRecords.length > 0 && (
          <div className="space-y-2 mb-5">
            {filteredRecords
              .slice(0, 30)
              .map((r, index) => (
                <Card
                  key={`${r.state}-${r.district}-${r.market}-${r.commodity}-${index}`}
                >
                  <CardContent className="pt-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {r.commodity}

                          {r.variety && (
                            <span className="text-gray-400 font-normal">
                              {' · '}
                              {r.variety}
                            </span>
                          )}
                        </p>

                        <p className="text-xs text-gray-400 truncate">
                          {r.market}
                          {r.district &&
                            ` · ${r.district}`}
                          {r.state &&
                            ` · ${r.state}`}
                        </p>

                        {r.grade && (
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Grade: {r.grade}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold text-green-700">
                          ₹
                          {r.modal_price.toLocaleString(
                            'en-IN'
                          )}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          Modal Price
                        </p>

                        {r.min_price > 0 &&
                          r.max_price > 0 && (
                            <p className="text-[10px] text-gray-400">
                              ₹
                              {r.min_price.toLocaleString(
                                'en-IN'
                              )}
                              {' – '}
                              ₹
                              {r.max_price.toLocaleString(
                                'en-IN'
                              )}
                            </p>
                          )}

                        {r.arrival_date && (
                          <p className="text-[10px] text-gray-400">
                            {r.arrival_date}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

      {!loading &&
        !error &&
        filteredRecords.length === 0 && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              No market price records found for
              the selected filters.
            </p>
          </div>
        )}

      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {t('nearestMandis') || 'Markets / Mandis'}
      </h3>

      <div className="space-y-2">
        {mandis.map((m) => (
          <Card key={m.id}>
            <CardContent className="pt-3">
              <div className="flex items-start gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-orange-700 shrink-0">
                  <Building2 className="h-5 w-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {m.market_name ||
                      'Unknown Market'}
                  </p>

                  <p className="text-xs text-gray-400">
                    {m.district &&
                      `${m.district} · `}
                    {m.state}
                  </p>

                  {m.commodities && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      <span className="text-gray-400">
                        {t('commodities') ||
                          'Commodities'}:
                      </span>{' '}
                      {m.commodities}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Badge className="mt-4 bg-green-100 text-green-700">
        Data.gov.in
      </Badge>
    </div>
  );
}
