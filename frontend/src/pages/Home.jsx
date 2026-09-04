import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Camera, Droplets, Sprout, MapPin, Wallet, Stethoscope, TrendingUp, FlaskConical,
  ShieldCheck, Landmark, Wheat, User, Banknote, MessageSquare, CloudSun, Store,
  GraduationCap, FolderArchive, ShieldPlus, Package, ListTodo, Bug, Gauge, UserCheck,
  Trophy, BellRing, Contact, Bell, FileSpreadsheet, PawPrint, Search, ArrowRight,
  ChevronRight, CloudRain, Sun, Tractor, ScanSearch, Database, BarChart3,
} from 'lucide-react';
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
  { to: '/diagnose', icon: Camera, label: 'Diagnosis', cat: 'protect' },
  { to: '/treatments', icon: ScanSearch, label: 'Treatments', cat: 'protect' },
  { to: '/pest-library', icon: Bug, label: 'Pest Library', cat: 'protect' },
  { to: '/weather', icon: CloudSun, label: 'Weather', cat: 'protect' },
  { to: '/alerts-center', icon: Bell, label: 'Alerts', cat: 'protect' },
  { to: '/fertilizer', icon: Droplets, label: 'Fertilizer', cat: 'grow' },
  { to: '/soil-passport', icon: Sprout, label: 'Soil Passport', cat: 'grow' },
  { to: '/crop-planner', icon: TrendingUp, label: 'Crop Planner', cat: 'grow' },
  { to: '/crops', icon: Tractor, label: 'Crop Guides', cat: 'grow' },
  { to: '/irrigation-planner', icon: Droplets, label: 'Irrigation', cat: 'grow' },
  { to: '/sensor-lab', icon: FlaskConical, label: 'Sensor Lab', cat: 'grow' },
  { to: '/sustainability-score', icon: Gauge, label: 'Sustainability', cat: 'grow' },
  { to: '/livestock-care', icon: Stethoscope, label: 'Livestock Care', cat: 'animals' },
  { to: '/animal-encyclopedia', icon: PawPrint, label: 'Animal Guides', cat: 'animals' },
  { to: '/market-prices', icon: Wallet, label: 'Mandi Prices', cat: 'market' },
  { to: '/farm-ledger', icon: FileSpreadsheet, label: 'Farm Ledger', cat: 'market' },
  { to: '/loan-eligibility', icon: Banknote, label: 'Loan Help', cat: 'market' },
  { to: '/insurance-hub', icon: ShieldPlus, label: 'Insurance', cat: 'market' },
  { to: '/input-marketplace', icon: Store, label: 'Marketplace', cat: 'market' },
  { to: '/vendor-contacts', icon: Contact, label: 'Vendors', cat: 'market' },
  { to: '/schemes', icon: Landmark, label: 'Gov Schemes', cat: 'learn' },
  { to: '/near-me', icon: MapPin, label: 'Near Me', cat: 'learn' },
  { to: '/community', icon: MessageSquare, label: 'Community', cat: 'learn' },
  { to: '/expert-directory', icon: UserCheck, label: 'Experts', cat: 'learn' },
  { to: '/training-center', icon: GraduationCap, label: 'Training', cat: 'learn' },
  { to: '/success-stories', icon: Trophy, label: 'Success Stories', cat: 'learn' },
  { to: '/data-gov', icon: Database, label: 'Gov Data', cat: 'learn' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard', cat: 'manage' },
  { to: '/crop-passport', icon: ShieldCheck, label: 'Crop Passport', cat: 'manage' },
  { to: '/harvest-records', icon: Wheat, label: 'Harvest', cat: 'manage' },
  { to: '/task-manager', icon: ListTodo, label: 'Tasks', cat: 'manage' },
  { to: '/inventory-tracker', icon: Package, label: 'Inventory', cat: 'manage' },
  { to: '/document-wallet', icon: FolderArchive, label: 'Documents', cat: 'manage' },
  { to: '/voice-notes', icon: Mic, label: 'Voice Notes', cat: 'manage' },
  { to: '/farm-notifications', icon: BellRing, label: 'Notifications', cat: 'manage' },
  { to: '/profile-settings', icon: User, label: 'Profile', cat: 'manage' },
];

const QUICK_ACTIONS = [
  { to: '/diagnose', icon: Camera, label: 'Diagnose', tint: 'bg-leaf-50 text-leaf-700' },
  { to: '/market-prices', icon: Wallet, label: 'Prices', tint: 'bg-amber-50 text-amber-700' },
  { to: '/schemes', icon: Landmark, label: 'Schemes', tint: 'bg-blue-50 text-blue-700' },
  { to: '/crop-planner', icon: TrendingUp, label: 'Planner', tint: 'bg-violet-50 text-violet-700' },
];

function WeatherIcon({ description, className = 'h-8 w-8' }) {
  const d = (description || '').toLowerCase();
  if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className={className} />;
  if (d.includes('clear')) return <Sun className={className} />;
  return <CloudSun className={className} />;
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [listening, setListening] = useState(false);
  const [weather, setWeather] = useState(null);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    axios.get('/api/weather/current?lat=17.3850&lon=78.4867')
      .then((res) => setWeather(res.data))
      .catch(() => {});

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
      <div className="flex items-center gap-2.5 rounded-full border border-gray-300 bg-white py-2.5 pl-4 pr-2.5 shadow-sm">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools or ask anything…"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
        <button
          onClick={startVoice}
          aria-label="Speak"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors ${
            listening ? 'bg-red-500' : 'bg-leaf-600 hover:bg-leaf-700'
          }`}
        >
          <Mic size={16} />
        </button>
      </div>

      {listening && (
        <p className="mt-2 text-center text-xs text-gray-400">Listening… speak now</p>
      )}

      {intent && (
        <Link
          to={intent.to}
          className="mt-3 flex items-center justify-between rounded-xl bg-leaf-50 px-4 py-3 text-sm font-medium text-leaf-800 transition-colors hover:bg-leaf-100"
        >
          <span>
            <span className="text-gray-500">You asked:</span> “{query}” — open {intent.label}
          </span>
          <ArrowRight size={16} />
        </Link>
      )}

      {/* Weather */}
      <Link
        to="/weather"
        className="mt-5 flex items-center justify-between rounded-2xl border border-gray-200 p-4 transition-colors hover:border-gray-300"
      >
        {weather && weather.temperature != null ? (
          <>
            <div className="flex items-center gap-3">
              <WeatherIcon description={weather.description} className="h-9 w-9 text-gray-700" />
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
            <ChevronRight size={18} className="text-gray-300" />
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <CloudSun className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">Check the 7-day forecast for your farm</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </>
        )}
      </Link>

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-4 gap-2">
        {QUICK_ACTIONS.map(({ to, icon: Icon, label, tint }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-2xl py-3 transition-colors hover:bg-gray-50"
          >
            <span className={`flex h-12 w-12 items-center justify-center rounded-full ${tint}`}>
              <Icon size={21} />
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Mandi prices */}
      {prices.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Today's mandi prices</h2>
            <Link to="/market-prices" className="text-xs font-medium text-leaf-700 hover:text-leaf-800">
              See all
            </Link>
          </div>
          <ul className="divide-y divide-gray-100">
            {prices.map((r) => (
              <li key={r.commodity}>
                <Link to="/market-prices" className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50">
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
        </div>
      )}

      {/* All tools */}
      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-gray-900">All tools</h2>
        <span className="text-xs text-gray-400">{TOOLS.length} tools</span>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
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
        {filteredTools.map(({ to, icon: Icon, label }) => (
          <Link key={to + label} to={to} className="group flex flex-col items-center gap-2">
            <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-leaf-50 text-leaf-700 transition-colors group-hover:bg-leaf-100">
              <Icon size={22} strokeWidth={1.8} />
            </span>
            <span className="max-w-[72px] truncate text-center text-xs text-gray-600">{label}</span>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <p className="text-sm font-medium text-gray-700">No tools match your search</p>
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
