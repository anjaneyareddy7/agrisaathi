import React, { useState, useEffect } from 'react';
import { CloudRain, ThermometerSun, X } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function WeatherAlerts() {
  const { t } = useLang();
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => checkAlerts(pos.coords.latitude, pos.coords.longitude),
      () => {}
    );
  }, []);

  const checkAlerts = async (lat, lng) => {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,precipitation_sum,weather_code,precipitation_probability_max&timezone=auto&forecast_days=5`;
      const data = await (await fetch(url)).json();
      const d = data.daily;
      if (!d) return;
      const found = [];
      for (let i = 0; i < d.time.length; i++) {
        const tmax = d.temperature_2m_max[i];
        const rain = d.precipitation_sum[i];
        const code = d.weather_code[i];
        const prob = d.precipitation_probability_max?.[i] ?? 0;
        if (tmax >= 40) {
          found.push({ type: 'heat', date: d.time[i], msg: `${tmax}°C — ${d.time[i]}` });
        }
        if (rain >= 35 || [65, 82, 95, 96, 99].includes(code) || (prob >= 80 && rain >= 10)) {
          found.push({ type: 'rain', date: d.time[i], msg: `${rain}mm rain — ${d.time[i]}` });
        }
      }
      setAlerts(found);
    } catch { /* noop */ }
  };

  if (dismissed || alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.slice(0, 3).map((a, i) => {
        const isHeat = a.type === 'heat';
        const Icon = isHeat ? ThermometerSun : CloudRain;
        return (
          <div key={i} className={`flex items-start gap-2 rounded-lg p-2.5 border ${isHeat ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
            <Icon className={`h-5 w-5 shrink-0 ${isHeat ? 'text-orange-600' : 'text-blue-600'}`} />
            <div className="flex-1">
              <p className={`text-xs font-semibold ${isHeat ? 'text-orange-700' : 'text-blue-700'}`}>{isHeat ? t('heatwaveAlert') : t('heavyRainAlert')}</p>
              <p className={`text-xs ${isHeat ? 'text-orange-600' : 'text-blue-600'}`}>{a.msg}</p>
            </div>
            <button onClick={() => setDismissed(true)} className="text-gray-400"><X className="h-4 w-4" /></button>
          </div>
        );
      })}
    </div>
  );
}
