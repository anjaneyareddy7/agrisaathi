import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const INTENTS = [
  { keys: ['disease', 'pest', 'yellow', 'leaf', 'rot', 'wilt', 'spot'], to: '/diagnose', label: 'Diagnose crop issue' },
  { keys: ['fertiliz', 'dose', 'npk'], to: '/fertilizer', label: 'Fertilizer dosage' },
  { keys: ['soil', 'ph', 'card'], to: '/soil-passport', label: 'Soil passport' },
  { keys: ['grow', 'crop', 'plant'], to: '/crop-planner', label: 'Plan a crop' },
  { keys: ['cow', 'goat', 'poultry', 'fish', 'bee', 'animal'], to: '/livestock-care', label: 'Livestock help' },
  { keys: ['market', 'price', 'mandi', 'bhav'], to: '/market-prices', label: 'Market prices' },
  { keys: ['weather', 'rain'], to: '/weather', label: 'Weather forecast' },
  { keys: ['scheme', 'subsidy', 'kisan'], to: '/schemes', label: 'Government schemes' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'grow', label: 'Grow & Plan' },
  { id: 'protect', label: 'Protect' },
  { id: 'animals', label: 'Livestock' },
  { id: 'market', label: 'Market & Money' },
  { id: 'learn', label: 'Learn' },
  { id: 'manage', label: 'Management' },
];

const TOOLS = [
  { to: '/diagnose', emoji: '📷', label: 'Diagnosis', cat: 'protect' },
  { to: '/treatments', emoji: '💊', label: 'Treatments', cat: 'protect' },
  { to: '/pest-library', emoji: '🐛', label: 'Pest Library', cat: 'protect' },
  { to: '/weather', emoji: '⛅', label: 'Weather', cat: 'protect' },
  { to: '/alerts-center', emoji: '🔔', label: 'Alerts', cat: 'protect' },
  { to: '/fertilizer', emoji: '💧', label: 'Fertilizer', cat: 'grow' },
  { to: '/soil-passport', emoji: '🌱', label: 'Soil Passport', cat: 'grow' },
  { to: '/crop-planner', emoji: '📅', label: 'Crop Planner', cat: 'grow' },
  { to: '/crops', emoji: '🌾', label: 'Crop Guides', cat: 'grow' },
  { to: '/irrigation-planner', emoji: '🚿', label: 'Irrigation', cat: 'grow' },
  { to: '/sensor-lab', emoji: '🔬', label: 'Sensor Lab', cat: 'grow' },
  { to: '/sustainability-score', emoji: '♻️', label: 'Sustainability', cat: 'grow' },
  { to: '/livestock-care', emoji: '🐄', label: 'Livestock', cat: 'animals' },
  { to: '/animal-encyclopedia', emoji: '🐾', label: 'Animal Guides', cat: 'animals' },
  { to: '/market-prices', emoji: '💰', label: 'Mandi Prices', cat: 'market' },
  { to: '/farm-ledger', emoji: '🧾', label: 'Farm Ledger', cat: 'market' },
  { to: '/loan-eligibility', emoji: '🏦', label: 'Loan Help', cat: 'market' },
  { to: '/insurance-hub', emoji: '🛡️', label: 'Insurance', cat: 'market' },
  { to: '/input-marketplace', emoji: '🛒', label: 'Marketplace', cat: 'market' },
  { to: '/vendor-contacts', emoji: '🤝', label: 'Vendors', cat: 'market' },
  { to: '/schemes', emoji: '🏛️', label: 'Gov Schemes', cat: 'learn' },
  { to: '/near-me', emoji: '📍', label: 'Near Me', cat: 'learn' },
  { to: '/community', emoji: '💬', label: 'Community', cat: 'learn' },
  { to: '/expert-directory', emoji: '👨‍🌾', label: 'Experts', cat: 'learn' },
  { to: '/training-center', emoji: '🎓', label: 'Training', cat: 'learn' },
  { to: '/success-stories', emoji: '🏆', label: 'Success Stories', cat: 'learn' },
  { to: '/data-gov', emoji: '🗄️', label: 'Gov Data', cat: 'learn' },
  { to: '/dashboard', emoji: '📊', label: 'Dashboard', cat: 'manage' },
  { to: '/crop-passport', emoji: '📜', label: 'Crop Passport', cat: 'manage' },
  { to: '/harvest-records', emoji: '🧺', label: 'Harvest', cat: 'manage' },
  { to: '/task-manager', emoji: '✅', label: 'Tasks', cat: 'manage' },
  { to: '/inventory-tracker', emoji: '📦', label: 'Inventory', cat: 'manage' },
  { to: '/document-wallet', emoji: '🗂️', label: 'Documents', cat: 'manage' },
  { to: '/voice-notes', emoji: '🎙️', label: 'Voice Notes', cat: 'manage' },
  { to: '/farm-notifications', emoji: '📣', label: 'Notifications', cat: 'manage' },
  { to: '/profile-settings', emoji: '⚙️', label: 'Profile', cat: 'manage' },
];

const QUICK_ACTIONS = [
  { to: '/diagnose', emoji: '📷', label: 'Diagnose', tint: 'bg-leaf-50' },
  { to: '/market-prices', emoji: '💰', label: 'Prices', tint: 'bg-amber-50' },
  { to: '/schemes', emoji: '🏛️', label: 'Schemes', tint: 'bg-blue-50' },
  { to: '/crop-planner', emoji: '📅', label: 'Planner', tint: 'bg-violet-50' },
];

function weatherEmoji(description) {
  const d = (description || '').toLowerCase();
  if (d.includes('thunder')) return '⛈️';
  if (d.includes('rain')) return '🌧️';
  if (d.includes('drizzle')) return '🌦️';
  if (d.includes('mist') || d.includes('haze') || d.includes('fog')) return '🌫️';
  if (d.includes('clear')) return '☀️';
  return '⛅';
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [listening, setListening] = useState(false);
  const [weather, setWeather] = useState(null);
  const [prices, setPrices] = useState(null);

  useEffect(() => {
    axios.get('/api/weather/current?lat=17.3850&lon=78.4867')
      .then((res) => setWeather(res.data))
      .catch(() => setWeather(false));

    Promise.all(
      ['onion', 'tomato', 'potato'].map((c) =>
        axios.get('/api/mandi-prices', { params: { commodity: c } })
          .then((res) => (res.data.records || [])[0])
          .catch(() => null)
      )
    ).then((rows) => setPrices(rows.filter(Boolean)));
  }, []);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setQuery('voice not supported in this browser');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => setQuery(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const intent = INTENTS.find((i) => i.keys.some((k) => query.toLowerCase().includes(k)));

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    // Long (spoken) sentences shouldn't filter the grid — the intent
    // link shown under the search bar is the answer.
    const isSearch = q.length > 0 && q.split(/\s+/).length <= 4;
    return TOOLS.filter((t) => {
      const inCat = category === 'all' || t.cat === category;
      const inQuery = !isSearch || t.label.toLowerCase().includes(q) || t.cat.includes(q);
      return inCat && inQuery;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-5">
      {/* Search + voice */}
      <div className="flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-300 bg-white py-2.5 pl-4 pr-2.5 shadow-sm transition-all focus-within:border-leaf-500 focus-within:ring-4 focus-within:ring-leaf-100">
        <span className="shrink-0 text-base">🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools or ask anything…"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="rounded-full px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
        <button
          onClick={startVoice}
          aria-label="Speak"
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm text-white transition-all active:scale-90 ${
            listening ? 'bg-red-500' : 'bg-leaf-600 hover:bg-leaf-700'
          }`}
        >
          {listening && (
            <>
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-400" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-300" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          <span className={`relative ${listening ? 'animate-bounce-soft' : ''}`}>🎙️</span>
        </button>
      </div>

      {listening && (
        <p className="mt-2 animate-fade-in text-center text-xs text-gray-400">Listening… speak now</p>
      )}

      {intent && (
        <Link
          to={intent.to}
          className="mt-3 flex animate-fade-up items-center justify-between rounded-xl bg-leaf-50 px-4 py-3 text-sm font-medium text-leaf-800 transition-all hover:bg-leaf-100 active:scale-[0.98]"
        >
          <span>
            <span className="text-gray-500">You asked:</span> “{query}” — open {intent.label}
          </span>
          <span>→</span>
        </Link>
      )}

      {/* Weather */}
      <Link
        to="/weather"
        className="mt-5 flex animate-fade-up items-center justify-between rounded-2xl border border-gray-200 p-4 transition-all hover:border-leaf-300 hover:shadow-sm active:scale-[0.99]"
        style={{ animationDelay: '80ms' }}
      >
        {weather && weather.temperature != null ? (
          <>
            <div className="flex items-center gap-3">
              <span className="animate-bounce-soft text-4xl">{weatherEmoji(weather.description)}</span>
              <div>
                <p className="text-lg font-semibold leading-tight text-gray-900">
                  {Math.round(weather.temperature)}°C{' '}
                  <span className="text-sm font-normal capitalize text-gray-500">
                    {weather.description || '—'}
                  </span>
                </p>
                <p className="text-xs text-gray-400">
                  Humidity {weather.humidity ?? '—'}% · Wind {weather.wind_speed ?? '—'} m/s
                </p>
              </div>
            </div>
            <span className="text-lg text-gray-300">›</span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="animate-bounce-soft text-3xl">⛅</span>
              <p className="text-sm text-gray-600">Check the 7-day forecast for your farm</p>
            </div>
            <span className="text-lg text-gray-300">›</span>
          </>
        )}
      </Link>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ to, emoji, label, tint }, i) => (
          <Link
            key={to}
            to={to}
            className="group flex animate-pop flex-col items-center gap-2 rounded-2xl py-3 transition-colors hover:bg-gray-50 active:scale-95"
            style={{ animationDelay: `${120 + i * 70}ms` }}
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform group-hover:scale-110 ${tint}`}>
              <span className="transition-transform group-hover:animate-wiggle">{emoji}</span>
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Mandi prices */}
      <div className="mt-6 animate-fade-up overflow-hidden rounded-2xl border border-gray-200" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">
            Today's mandi prices <span className="ml-1">📈</span>
          </h2>
          <Link to="/market-prices" className="text-xs font-medium text-leaf-700 hover:text-leaf-800">
            See all
          </Link>
        </div>

        {prices === null ? (
          <div className="space-y-3 px-4 py-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-shimmer h-9 rounded-lg bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />
            ))}
          </div>
        ) : prices.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {prices.map((r, i) => (
              <li key={r.commodity}>
                <Link
                  to="/market-prices"
                  className="flex animate-slide-in items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.commodity}</p>
                    <p className="text-xs text-gray-400">{r.market}, {r.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{Number(r.modal_price || 0).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-gray-400">/quintal</span>
                    </p>
                    <p className="text-xs text-gray-400">₹{r.min_price} – ₹{r.max_price}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            Prices unavailable right now
          </div>
        )}
      </div>

      {/* All tools */}
      <div className="mt-8 flex animate-fade-up items-baseline justify-between" style={{ animationDelay: '260ms' }}>
        <h2 className="text-base font-semibold text-gray-900">All tools</h2>
        <span className="text-xs text-gray-400">{filteredTools.length} tools</span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              category === id
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-5">
        {filteredTools.map(({ to, emoji, label }, i) => (
          <Link
            key={`${category}-${to}`}
            to={to}
            className="group flex animate-pop flex-col items-center gap-2 rounded-xl py-1 transition-all active:scale-90"
            style={{ animationDelay: `${(i % 10) * 30}ms` }}
          >
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-gray-50 text-[24px] transition-all group-hover:scale-110 group-hover:bg-leaf-50">
              {emoji}
            </span>
            <span className="max-w-[72px] truncate text-center text-xs text-gray-600 transition-colors group-hover:text-gray-900">
              {label}
            </span>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="mt-6 animate-pop rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <p className="text-2xl">🔎</p>
          <p className="mt-2 text-sm font-medium text-gray-700">No tools match your search</p>
          <button
            onClick={() => {
              setQuery('');
              setCategory('all');
            }}
            className="mt-1 text-xs font-medium text-leaf-700"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
