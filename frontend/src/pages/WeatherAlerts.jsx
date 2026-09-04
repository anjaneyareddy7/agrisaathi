import { useCallback, useState } from 'react';
import { CloudRain, AlertTriangle, Sun, Cloud, Droplets, Wind, Navigation, Loader2, ShieldCheck, Umbrella, Thermometer, Wind as WindIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const WMO = {
  0: { label: 'Clear', icon: Sun, color: 'text-amber-500' },
  1: { label: 'Mainly clear', icon: Sun, color: 'text-amber-500' },
  2: { label: 'Partly cloudy', icon: Cloud, color: 'text-gray-400' },
  3: { label: 'Overcast', icon: Cloud, color: 'text-gray-400' },
  45: { label: 'Fog', icon: Cloud, color: 'text-gray-400' },
  48: { label: 'Rime fog', icon: Cloud, color: 'text-gray-400' },
  51: { label: 'Light drizzle', icon: CloudRain, color: 'text-blue-400' },
  53: { label: 'Drizzle', icon: CloudRain, color: 'text-blue-400' },
  55: { label: 'Heavy drizzle', icon: CloudRain, color: 'text-blue-500' },
  61: { label: 'Light rain', icon: CloudRain, color: 'text-blue-400' },
  63: { label: 'Rain', icon: CloudRain, color: 'text-blue-500' },
  65: { label: 'Heavy rain', icon: CloudRain, color: 'text-blue-600' },
  71: { label: 'Light snow', icon: Cloud, color: 'text-cyan-400' },
  73: { label: 'Snow', icon: Cloud, color: 'text-cyan-500' },
  75: { label: 'Heavy snow', icon: Cloud, color: 'text-cyan-600' },
  80: { label: 'Rain showers', icon: CloudRain, color: 'text-blue-500' },
  81: { label: 'Heavy showers', icon: CloudRain, color: 'text-blue-600' },
  82: { label: 'Violent showers', icon: CloudRain, color: 'text-blue-700' },
  95: { label: 'Thunderstorm', icon: AlertTriangle, color: 'text-red-500' },
  96: { label: 'Thunderstorm + hail', icon: AlertTriangle, color: 'text-red-600' },
  99: { label: 'Severe thunderstorm', icon: AlertTriangle, color: 'text-red-600' },
};

export default function WeatherAlerts() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(() => {
    if (!navigator.geolocation) { setError('Location is not supported on this device.'); setLoading(false); return; }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=5`;
        const res = await fetch(url);
        const data = await res.json();
        setForecast(data.daily);
      } catch { setError('Could not load weather — try again.'); } finally { setLoading(false); }
    }, () => { setError('Location permission denied — allow location to see alerts.'); setLoading(false); });
  }, []);

  const days = forecast?.time || [];
  const extremes = days.map((d, i) => {
    const code = forecast.weather_code[i];
    const rain = forecast.precipitation_sum?.[i] || 0;
    const wind = forecast.wind_speed_10m_max?.[i] || 0;
    const tempMax = forecast.temperature_2m_max?.[i] || 0;
    const alerts = [];
    if (code >= 95) alerts.push('Thunderstorm expected');
    if (rain >= 30) alerts.push(`Heavy rain — ${rain.toFixed(0)}mm`);
    if (wind >= 40) alerts.push(`High winds — ${wind.toFixed(0)}km/h`);
    if (tempMax >= 40) alerts.push(`Heatwave — ${tempMax.toFixed(0)}°C`);
    return { date: d, code, rain, wind, tempMax, tempMin: forecast.temperature_2m_min?.[i], alerts };
  }).filter((d) => d.alerts.length > 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Weather Alerts" subtitle="5-day extreme weather watch for your location" icon={CloudRain} />

      <button onClick={fetchWeather}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 animate-fade-up">
        {loading ? <Loader2 size={15} className="animate-spin text-leaf-600" /> : <Navigation size={15} className="text-leaf-600" />} Refresh forecast
      </button>

      {loading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      )}

      {!loading && error && (
        <EmptyState icon={CloudRain} title="Couldn't check the weather" subtitle={error} />
      )}

      {!loading && !error && extremes.length > 0 && (
        <div className="mb-4 animate-fade-up">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-red-700 p-5 text-white shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">Extreme weather ahead</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{extremes.length} day{extremes.length > 1 ? 's' : ''}</p>
            <p className="mt-2 text-xs leading-relaxed text-white/85">
              Protect your crops — delay spraying before heavy rain, stake young plants before high winds, and irrigate early during heatwaves.
            </p>
          </div>
          <div className="mt-3 space-y-2">
            {extremes.map((d, i) => (
              <div key={i} className="rounded-2xl border border-red-100 bg-red-50/70 p-4 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <p className="text-sm font-bold text-red-700">
                  {new Date(d.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {d.alerts.map((a, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs font-semibold text-red-600">
                      <AlertTriangle size={12} /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !error && extremes.length === 0 && forecast && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl border border-leaf-200 bg-leaf-50/70 p-4 animate-fade-up">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700"><ShieldCheck size={22} /></span>
          <div>
            <p className="text-sm font-semibold text-leaf-800">All clear for 5 days</p>
            <p className="text-xs text-leaf-700/80">No extreme rain, wind or heat expected for your location.</p>
          </div>
        </div>
      )}

      {forecast && !loading && !error && (
        <SectionCard title="5-day outlook" icon={Umbrella}>
          <ul className="divide-y divide-gray-100">
            {days.map((d, i) => {
              const w = WMO[forecast.weather_code[i]] || { label: '—', icon: Cloud, color: 'text-gray-400' };
              const Icon = w.icon;
              return (
                <li key={d} className="flex items-center justify-between gap-2 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <div className="flex items-center gap-3">
                    <Icon className={`h-7 w-7 ${w.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{i === 0 ? 'Today' : new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}</p>
                      <p className="text-xs text-gray-500">{w.label}</p>
                    </div>
                  </div>
                  <div className="space-y-0.5 text-right text-xs text-gray-500">
                    <p className="text-sm font-bold text-gray-800">{Math.round(forecast.temperature_2m_max?.[i])}° <span className="font-medium text-gray-400">/ {Math.round(forecast.temperature_2m_min?.[i])}°</span></p>
                    <p className="flex items-center justify-end gap-1"><Droplets size={11} className="text-blue-400" />{(forecast.precipitation_sum?.[i] || 0).toFixed(1)}mm</p>
                    <p className="flex items-center justify-end gap-1"><WindIcon size={11} />{Math.round(forecast.wind_speed_10m_max?.[i] || 0)}km/h</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
