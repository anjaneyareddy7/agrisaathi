import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, Umbrella, FlaskConical, Droplets, ThermometerSun, Wind, CalendarDays, Info } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import WeatherWidget from '../components/WeatherWidget';
import { SectionCard } from '../components/kit';

function advisoriesFor(current, today) {
  const tips = [];
  const rain = today ? today.rain_probability : 0;
  const wind = current?.wind_speed ?? 0;
  const temp = current?.temperature ?? today?.temp_max ?? 0;
  const humidity = current?.humidity ?? 0;

  if (rain >= 60) {
    tips.push({ icon: Umbrella, tone: 'bg-blue-100 text-blue-700', title: 'Delay pesticide spraying', body: `Rain chance is ${Math.round(rain)}% today — sprays will wash off. Plan for a dry window.` });
  } else if (wind > 5) {
    tips.push({ icon: Wind, tone: 'bg-amber-100 text-amber-700', title: 'Windy for spraying', body: `Wind at ${wind} m/s can drift spray. Prefer early morning calm hours.` });
  } else {
    tips.push({ icon: FlaskConical, tone: 'bg-leaf-100 text-leaf-700', title: 'Good spraying window', body: 'Low rain chance and calm winds — a fine day for crop protection sprays.' });
  }

  if (rain < 30 && temp >= 30) {
    tips.push({ icon: Droplets, tone: 'bg-cyan-100 text-cyan-700', title: 'Irrigate your fields', body: `Warm (${Math.round(temp)}°C) with little rain expected — check soil moisture and irrigate.` });
  }
  if (temp >= 37) {
    tips.push({ icon: ThermometerSun, tone: 'bg-red-100 text-red-600', title: 'Heat stress alert', body: 'Shade livestock and poultry, water them twice, and avoid field work at noon.' });
  }
  if (humidity >= 80 && rain >= 40) {
    tips.push({ icon: Info, tone: 'bg-violet-100 text-violet-700', title: 'Fungal disease risk', body: 'Humid and wet conditions favour blight and rust — inspect leaves and stay alert.' });
  }
  return tips;
}

export default function Weather() {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    const lat = 17.385, lon = 78.4867;
    let done = false;
    const load = (la, lo) => {
      if (done) return;
      done = true;
      axios.get('/api/weather/current', { params: { lat: la, lon: lo } })
        .then((r) => setCurrent(r.data)).catch(() => {});
      axios.get('/api/weather/forecast', { params: { lat: la, lon: lo } })
        .then((r) => setForecast(r.data)).catch(() => setForecast(false));
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => load(p.coords.latitude, p.coords.longitude),
        () => load(lat, lon),
        { timeout: 3500 }
      );
      const timer = setTimeout(() => load(lat, lon), 4000);
      return () => clearTimeout(timer);
    }
    load(lat, lon);
  }, []);

  const days = forecast?.days || [];
  const weekMin = days.length ? Math.min(...days.map((d) => d.temp_min)) : 0;
  const weekMax = days.length ? Math.max(...days.map((d) => d.temp_max)) : 1;
  const range = Math.max(1, weekMax - weekMin);
  const tips = advisoriesFor(current, days[0]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader titleKey="weather" icon={CloudSun} subtitle="Forecast and advisories for your farm" />

      <WeatherWidget />

      {/* Farming advisories */}
      <h2 className="mb-3 mt-6 text-base font-semibold text-gray-900">Farm advisories</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {tips.map((a, i) => (
          <div
            key={a.title}
            className="flex animate-fade-up gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.tone}`}>
              <a.icon size={18} strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{a.title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{a.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 5-day outlook */}
      <div className="mt-6">
        {days.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-400">
            Forecast data unavailable right now
          </div>
        ) : (
          <SectionCard icon={CalendarDays} title="5-day outlook">
            <ul className="divide-y divide-gray-100">
              {days.map((d, i) => {
                const label = i === 0
                  ? 'Today'
                  : new Date(d.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
                const left = ((d.temp_min - weekMin) / range) * 100;
                const width = Math.max(8, ((d.temp_max - d.temp_min) / range) * 100);
                return (
                  <li key={d.date} className="flex animate-slide-in items-center gap-3 px-4 py-3" style={{ animationDelay: `${i * 70}ms` }}>
                    <span className="w-24 shrink-0 text-sm font-medium text-gray-800">{label}</span>
                    <span className="w-20 shrink-0 truncate text-xs capitalize text-gray-400">{d.description}</span>
                    <span className="w-9 shrink-0 text-right text-xs text-gray-500">{Math.round(d.temp_min)}°</span>
                    <span className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <span
                        className="absolute inset-y-0 animate-grow-x origin-left rounded-full bg-gradient-to-r from-sky-400 to-amber-400"
                        style={{ left: `${left}%`, width: `${width}%`, animationDelay: `${150 + i * 100}ms` }}
                      />
                    </span>
                    <span className="w-9 shrink-0 text-xs font-semibold text-gray-900">{Math.round(d.temp_max)}°</span>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
