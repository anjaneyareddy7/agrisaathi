import React, { useState, useEffect, useCallback } from 'react';
import { Cloud, CloudRain, Sun, CloudDrizzle, Wind, Droplets, MapPin, RefreshCw } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const WMO = {
  0: { label: 'Clear sky', icon: Sun, color: 'text-amber-500' },
  1: { label: 'Mainly clear', icon: Sun, color: 'text-amber-400' },
  2: { label: 'Partly cloudy', icon: Cloud, color: 'text-gray-400' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-gray-400' },
  45: { label: 'Fog', icon: Cloud, color: 'text-gray-300' },
  48: { label: 'Fog', icon: Cloud, color: 'text-gray-300' },
  51: { label: 'Light drizzle', icon: CloudDrizzle, color: 'text-blue-400' },
  53: { label: 'Drizzle', icon: CloudDrizzle, color: 'text-blue-400' },
  55: { label: 'Heavy drizzle', icon: CloudDrizzle, color: 'text-blue-500' },
  61: { label: 'Light rain', icon: CloudRain, color: 'text-blue-400' },
  63: { label: 'Rain', icon: CloudRain, color: 'text-blue-500' },
  65: { label: 'Heavy rain', icon: CloudRain, color: 'text-blue-600' },
};

export default function WeatherCard() {
  const { t } = useLang();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadWeather = useCallback(() => {
    if (!navigator.geolocation) { setError(t('dataUnavailable')); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
        fetch(url)
          .then((r) => r.json())
          .then((data) => { setWeather(data); setLoading(false); })
          .catch(() => { setError(t('dataUnavailable')); setLoading(false); });
      },
      () => { setError(t('dataUnavailable')); setLoading(false); }
    );
  }, [t]);

  useEffect(() => { loadWeather(); }, [loadWeather]);

  const cur = weather?.current;
  const daily = weather?.daily;
  const wmo = cur ? WMO[cur.weather_code] || WMO[2] : null;
  const WIcon = wmo?.icon || Cloud;

  return (
    <Card className="bg-gradient-to-br from-sky-50 to-blue-50 border-sky-100">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-sky-800 flex items-center gap-1.5"><Cloud className="h-4 w-4" />{t('liveWeather')}</h3>
          <button onClick={loadWeather} className="text-sky-600 p-1"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400">{t('loading')}</p>
        ) : error ? (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-400">{error}</p>
            <Button onClick={loadWeather} variant="outline" size="sm" className="text-sky-600"><MapPin className="h-3 w-3 mr-1" />{t('useMyLocation')}</Button>
          </div>
        ) : cur ? (
          <>
            <div className="flex items-center gap-3">
              <WIcon className={`h-10 w-10 ${wmo.color}`} />
              <div>
                <p className="text-2xl font-bold text-gray-800">{Math.round(cur.temperature_2m)}°C</p>
                <p className="text-xs text-gray-500">{wmo.label}</p>
              </div>
              <div className="ml-auto text-right space-y-0.5">
                <p className="text-xs text-gray-500 flex items-center gap-1 justify-end"><Droplets className="h-3 w-3" />{cur.relative_humidity_2m}%</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 justify-end"><Wind className="h-3 w-3" />{Math.round(cur.wind_speed_10m)} km/h</p>
              </div>
            </div>
            {daily && (
              <div className="flex gap-2 mt-3">
                {daily.time.slice(0, 4).map((d, i) => {
                  const dw = WMO[daily.weather_code[i]] || WMO[2];
                  const DIcon = dw.icon;
                  return (
                    <div key={d} className="flex-1 text-center bg-white/60 rounded-lg py-1.5">
                      <p className="text-[10px] text-gray-400">{new Date(d).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                      <DIcon className={`h-5 w-5 mx-auto ${dw.color}`} />
                      <p className="text-[11px] font-medium text-gray-700">{Math.round(daily.temperature_2m_max[i])}°</p>
                      <p className="text-[10px] text-gray-400">{Math.round(daily.temperature_2m_min[i])}°</p>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
