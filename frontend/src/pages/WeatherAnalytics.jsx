import { useEffect, useState } from 'react';
import { CloudRain, Thermometer, Wind, Droplets, MapPin, RefreshCw, CalendarDays, Loader2 } from 'lucide-react';
import axios from 'axios';
import { weatherIconEl } from '../components/icons/WeatherIcons';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState, StatTile } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const DEFAULT_LOCATION = { lat: 17.385, lon: 78.4867 };

export default function WeatherAnalytics() {
  const [current, setCurrent] = useState(null);
  const [days, setDays] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadWeather = () => {
    setLoading(true);
    setError(null);

    const fetchForLocation = (lat, lon) =>
      Promise.all([
        axios.get(`${API_URL}/api/weather/current`, { params: { lat, lon } }),
        axios.get(`${API_URL}/api/weather/forecast`, { params: { lat, lon } }),
      ])
        .then(([currentResponse, forecastResponse]) => {
          setCurrent(currentResponse.data);
          setDays(forecastResponse.data?.days || []);
        })
        .catch((err) => {
          setError(err?.response?.data?.detail || 'Weather analytics unavailable. Check the backend weather provider.');
        })
        .finally(() => setLoading(false));

    if (!navigator.geolocation) {
      return fetchForLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => fetchForLocation(position.coords.latitude, position.coords.longitude),
      () => fetchForLocation(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
      { timeout: 5000 }
    );
  };

  useEffect(() => { loadWeather(); }, []);

  const highRainDays = days.filter((day) => Number(day.rain_probability) >= 60).length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Weather Analytics" subtitle="Current conditions and the 5-day farm outlook" icon={CloudRain} />

      <button onClick={loadWeather}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 animate-fade-up">
        {loading ? <Loader2 size={15} className="animate-spin text-leaf-600" /> : <RefreshCw size={15} className="text-leaf-600" />} Refresh
      </button>

      {loading && (
        <div className="space-y-2">
          <div className="h-[168px] rounded-3xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[72px] rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      )}

      {!loading && error && (
        <EmptyState icon={CloudRain} title="Couldn't load analytics" subtitle={error} />
      )}

      {!loading && current && (
        <>
          {/* Current hero */}
          <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
            <p className="flex items-center gap-1.5 text-xs font-medium text-white/70">
              <MapPin size={12} /> {current.location || 'Your location'}
            </p>
            <div className="mt-2 flex items-center gap-4">
              <span className="text-white/90">{weatherIconEl(current.description, 56)}</span>
              <div>
                <p className="text-5xl font-bold tracking-tight">{Math.round(current.temperature)}°</p>
                <p className="mt-0.5 text-sm capitalize text-white/80">{current.description || '—'}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/15 px-3 py-2.5">
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Thermometer size={10} /> Feels like</p>
                <p className="mt-0.5 text-sm font-bold">{current.feels_like != null ? `${Math.round(current.feels_like)}°` : '—'}</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-3 py-2.5">
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Droplets size={10} /> Humidity</p>
                <p className="mt-0.5 text-sm font-bold">{current.humidity ?? '—'}%</p>
              </div>
              <div className="rounded-2xl bg-white/15 px-3 py-2.5">
                <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Wind size={10} /> Wind</p>
                <p className="mt-0.5 text-sm font-bold">{current.wind_speed ?? '—'} m/s</p>
              </div>
            </div>
          </div>

          {/* 5-day outlook */}
          <SectionCard icon={CalendarDays} title="5-day forecast" action={
            highRainDays > 0 ? (
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                {highRainDays} high-rain day{highRainDays === 1 ? '' : 's'}
              </span>
            ) : null
          }>
            {days.length === 0 ? (
              <div className="p-4"><EmptyState icon={CloudRain} title="No forecast data" subtitle="Try refreshing." /></div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {days.map((day, i) => {
                  const rain = Math.round(Number(day.rain_probability) || 0);
                  return (
                    <li key={day.date} className="flex items-center gap-3 px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center text-gray-500">{weatherIconEl(day.description, 30)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })}
                        </p>
                        <p className="truncate text-xs capitalize text-gray-500">{day.description}</p>
                        <div className="mt-1.5 h-1.5 w-full max-w-[140px] overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full transition-all duration-700 ${rain >= 60 ? 'bg-blue-500' : 'bg-blue-300'}`} style={{ width: `${rain}%` }} />
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-gray-900">{Math.round(day.temp_max)}° <span className="font-medium text-gray-400">{Math.round(day.temp_min)}°</span></p>
                        <p className={`text-[11px] font-semibold ${rain >= 60 ? 'text-blue-600' : 'text-gray-400'}`}>{rain}% rain</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          {/* Farm tip */}
          {highRainDays > 0 && (
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 animate-fade-up">
              <p className="text-xs leading-relaxed text-blue-800/90">
                <span className="font-bold">Spray smart:</span> {highRainDays} day{highRainDays === 1 ? '' : 's'} with 60%+ rain chance — avoid spraying or applying fertilizer just before them.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
