import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Droplets, Wind, CloudRain } from 'lucide-react';
import axios from 'axios';
import { weatherIconEl, WCloudFog, DecoCloud, DecoStar } from './icons/WeatherIcons';

/* Nearest-city lookup (offline, no geocoding API needed) */
const CITIES = [
  ['Hyderabad', 17.385, 78.4867], ['Warangal', 17.9689, 79.5941], ['Karimnagar', 18.4386, 79.1288],
  ['Nizamabad', 18.6725, 78.0941], ['Khammam', 17.2473, 80.1514], ['Vijayawada', 16.5062, 80.648],
  ['Visakhapatnam', 17.6868, 83.2185], ['Tirupati', 13.6288, 79.4192], ['Bengaluru', 12.9716, 77.5946],
  ['Mysuru', 12.2958, 76.6394], ['Chennai', 13.0827, 80.2707], ['Coimbatore', 11.0168, 76.9558],
  ['Madurai', 9.9252, 78.1198], ['Kochi', 9.9312, 76.2673], ['Thiruvananthapuram', 8.5241, 76.9366],
  ['Mumbai', 19.076, 72.8777], ['Pune', 18.5204, 73.8567], ['Nashik', 19.9975, 73.7898],
  ['Nagpur', 21.1458, 79.0882], ['Aurangabad', 19.8762, 75.3433], ['Ahmedabad', 23.0225, 72.5714],
  ['Surat', 21.1702, 72.8311], ['Vadodara', 22.3072, 73.1812], ['Jaipur', 26.9124, 75.7873],
  ['Jodhpur', 26.2389, 73.0243], ['Udaipur', 24.5854, 73.7125], ['Delhi', 28.7041, 77.1025],
  ['Lucknow', 26.8467, 80.9462], ['Kanpur', 26.4499, 80.3319], ['Varanasi', 25.3176, 82.9739],
  ['Prayagraj', 25.4358, 81.8463], ['Agra', 27.1767, 78.0081], ['Patna', 25.5941, 85.1376],
  ['Bhubaneswar', 20.2961, 85.8245], ['Kolkata', 22.5726, 88.3639], ['Ranchi', 23.3441, 85.3096],
  ['Bhopal', 23.2599, 77.4126], ['Indore', 22.7196, 75.8577], ['Raipur', 21.2514, 81.6296],
  ['Chandigarh', 30.7333, 76.7794], ['Ludhiana', 30.901, 75.8573], ['Amritsar', 31.634, 74.8723],
  ['Dehradun', 30.3165, 78.0322], ['Srinagar', 34.0837, 74.7973], ['Guwahati', 26.1445, 91.7362],
].map(([n, lat, lon]) => ({ n, lat, lon }));

function nearestCity(lat, lon) {
  let best = CITIES[0];
  let bestD = Infinity;
  for (const c of CITIES) {
    const d = Math.hypot((c.lat - lat) * 111, (c.lon - lon) * 102);
    if (d < bestD) { bestD = d; best = c; }
  }
  return { name: best.n, near: bestD > 55 };
}

function isRainy(description) {
  const d = (description || '').toLowerCase();
  return d.includes('rain') || d.includes('drizzle') || d.includes('thunder');
}

function skyClasses(description, day) {
  const d = (description || '').toLowerCase();
  if (d.includes('thunder')) return 'from-slate-700 via-slate-600 to-slate-800';
  if (isRainy(d)) return day ? 'from-slate-500 via-sky-600 to-blue-700' : 'from-slate-800 via-slate-700 to-indigo-950';
  if (d.includes('mist') || d.includes('haze') || d.includes('fog')) return 'from-slate-400 via-slate-500 to-slate-600';
  if (d.includes('overcast')) return day ? 'from-slate-400 via-slate-500 to-slate-600' : 'from-slate-800 to-slate-900';
  if (d.includes('cloud')) return day ? 'from-sky-400 via-sky-500 to-blue-600' : 'from-indigo-950 via-slate-900 to-black';
  if (d.includes('clear')) return day ? 'from-sky-400 via-cyan-500 to-blue-600' : 'from-indigo-950 via-slate-900 to-black';
  return day ? 'from-sky-500 to-blue-600' : 'from-slate-800 to-indigo-950';
}

function hourLabel(ts) {
  return new Date(ts * 1000).toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });
}

export default function WeatherWidget() {
  const [now, setNow] = useState(new Date());
  const [place, setPlace] = useState('Locating…');
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [displayTemp, setDisplayTemp] = useState(0);
  const stripRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = () => {
    const el = stripRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 6);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
  };

  useEffect(() => {
    updateArrows();
  }, [forecast]);

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Locate (geolocation, fallback Hyderabad) then fetch */
  useEffect(() => {
    let settled = false;

    const load = (lat, lon, geo) => {
      const city = nearestCity(lat, lon);
      setPlace(geo && city.near ? `Near ${city.name}` : city.name);
      axios.get('/api/weather/current', { params: { lat, lon } })
        .then((r) => setCurrent(r.data))
        .catch(() => setCurrent(false));
      axios.get('/api/weather/forecast', { params: { lat, lon } })
        .then((r) => setForecast(r.data))
        .catch(() => setForecast(false));
    };

    const fallback = () => { if (!settled) { settled = true; load(17.385, 78.4867, false); } };
    const timer = setTimeout(fallback, 4000);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!settled) { settled = true; clearTimeout(timer); load(pos.coords.latitude, pos.coords.longitude, true); }
        },
        () => { clearTimeout(timer); fallback(); },
        { timeout: 3500, maximumAge: 600000 }
      );
    } else {
      clearTimeout(timer);
      fallback();
    }
  }, []);

  /* Count-up temperature */
  useEffect(() => {
    if (!current || current.temperature == null) return;
    const target = Math.round(current.temperature);
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / 800);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayTemp(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [current]);

  if (current === null || forecast === null) {
    /* Loading skeleton */
    return (
      <div className="animate-shimmer h-[350px] rounded-3xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />
    );
  }

  if (current === false || current.temperature == null) {
    return (
      <div className="rounded-3xl border border-gray-200 p-6 text-center text-sm text-gray-500">
        <WCloudFog className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-2">Weather unavailable right now — please retry.</p>
      </div>
    );
  }

  const hour = now.getHours();
  const day = hour >= 6 && hour < 18;
  const rainy = isRainy(current.description);
  const cloudy = (current.description || '').toLowerCase().includes('cloud') || rainy;
  const clearSky = (current.description || '').toLowerCase().includes('clear');
  const hourly = forecast && forecast.hourly ? forecast.hourly : [];
  const sample = current.source === 'sample' || (forecast && forecast.source === 'sample');

  return (
    <section
      className={`relative animate-fade-up overflow-hidden rounded-3xl bg-gradient-to-br text-white shadow-sm ${skyClasses(current.description, day)}`}
    >
      {/* ── Animated sky decorations (pure graphics) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {clearSky && day && (
          <div className="absolute -right-8 -top-10 h-36 w-36 animate-sun-pulse rounded-full bg-yellow-300/60 blur-2xl" />
        )}
        {!day && (
          <>
            <DecoStar className="absolute right-10 top-6 h-4 w-4 text-white/70" />
            <DecoStar className="absolute right-24 top-12 h-2.5 w-2.5 text-white/50" />
            <DecoStar className="absolute right-16 top-20 h-2 w-2 text-white/40" />
          </>
        )}
        {cloudy && (
          <>
            <DecoCloud className="absolute -left-4 top-8 h-10 w-20 animate-drift text-white/25" />
            <DecoCloud className="absolute right-12 top-16 h-12 w-24 animate-drift text-white/20" style={{ animationDelay: '-4s', animationDuration: '14s' }} />
            <DecoCloud className="absolute left-1/3 top-2 h-8 w-16 animate-drift text-white/15" style={{ animationDelay: '-8s', animationDuration: '17s' }} />
          </>
        )}
        {rainy && (
          <>
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="absolute top-0 h-3.5 w-[3px] animate-rain-fall rounded-full bg-white/45 opacity-0"
                style={{ left: `${(i * 7.3) % 100}%`, animationDelay: `${(i % 7) * 0.16}s` }}
              />
            ))}
          </>
        )}
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <div className="relative p-5">
        {/* Location + live clock */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <MapPin size={15} strokeWidth={2.4} /> {place}
            </p>
            <p className="mt-0.5 text-xs text-white/70">
              {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-semibold tabular-nums leading-none">
              {now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </p>
            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">
              <span className={`h-1.5 w-1.5 rounded-full ${sample ? 'bg-amber-300' : 'animate-ping bg-emerald-300'}`} />
              {sample ? 'Sample · offline' : 'Live'}
            </span>
          </div>
        </div>

        {/* Current temperature */}
        <div className="mt-4 flex items-center gap-4">
          <span className="animate-bounce-soft drop-shadow-lg">
            {weatherIconEl(current.description, 'h-16 w-16')}
          </span>
          <div>
            <p className="text-5xl font-bold leading-none tracking-tight">
              {displayTemp}<span className="align-top text-2xl font-medium">°C</span>
            </p>
            <p className="mt-1.5 text-sm capitalize text-white/90">{current.description || '—'}</p>
            {current.feels_like != null && (
              <p className="text-xs text-white/70">Feels like {Math.round(current.feels_like)}°</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <Droplets size={17} className="shrink-0 text-sky-100" />
            <div>
              <p className="text-sm font-semibold leading-none">{current.humidity ?? '—'}%</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/65">Humidity</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <Wind size={17} className="shrink-0 text-teal-50" />
            <div>
              <p className="text-sm font-semibold leading-none">{current.wind_speed ?? '—'} m/s</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/65">Wind</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <CloudRain size={17} className="shrink-0 text-indigo-50" />
            <div>
              <p className="text-sm font-semibold leading-none">{forecast?.days?.[0] ? Math.round(forecast.days[0].rain_probability) : '—'}%</p>
              <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/65">Rain chance</p>
            </div>
          </div>
        </div>

        {/* Hourly strip — swipe to travel through the day */}
        {hourly.length > 0 && (
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
              Hourly · swipe to check later hours
            </p>
            <div className="relative mt-2">
              <div
                ref={stripRef}
                onScroll={updateArrows}
                className="flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                <div className="w-[62px] shrink-0 snap-start animate-pop rounded-2xl border border-white/40 bg-white/20 py-2.5 text-center backdrop-blur-sm">
                  <p className="text-[10px] font-medium text-white/75">Now</p>
                  <span className="mt-1 block h-6 w-6">{weatherIconEl(current.description, 'h-6 w-6')}</span>
                  <p className="mt-1 text-sm font-semibold">{Math.round(current.temperature)}°</p>
                </div>
                {hourly.map((h, i) => (
                  <div
                    key={h.ts}
                    className="w-[62px] shrink-0 snap-start animate-slide-in rounded-2xl bg-white/12 py-2.5 text-center backdrop-blur-sm transition-transform hover:scale-105"
                    style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                  >
                    <p className="text-[10px] font-medium text-white/75">{hourLabel(h.ts)}</p>
                    <span className="mt-1 block h-6 w-6">{weatherIconEl(h.description, 'h-6 w-6')}</span>
                    <p className="mt-1 text-sm font-semibold">{Math.round(h.temp)}°</p>
                  </div>
                ))}
              </div>

              {/* Slide arrows */}
              {canLeft && (
                <button
                  onClick={() => stripRef.current.scrollBy({ left: -220, behavior: 'smooth' })}
                  aria-label="Earlier hours"
                  className="absolute -left-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              )}
              {canRight && (
                <button
                  onClick={() => stripRef.current.scrollBy({ left: 220, behavior: 'smooth' })}
                  aria-label="Later hours"
                  className="absolute -right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 animate-bounce-soft items-center justify-center rounded-full bg-white/25 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
            </div>
          </div>
        )}

        <Link
          to="/weather"
          className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-white/75 transition-colors hover:text-white"
        >
          Full forecast & advisories
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </div>
    </section>
  );
}
