import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Camera, Droplets, Sprout, MapPin, Wallet, Stethoscope, TrendingUp, FlaskConical,
  ShieldCheck, Landmark, Wheat, User, Banknote, MessageSquare, Store, GraduationCap,
  FolderArchive, ShieldPlus, Package, ListTodo, Bug, Gauge, UserCheck, Trophy, BellRing,
  Contact, Bell, FileSpreadsheet, PawPrint, Search, X, ChevronRight, SearchX,
  CloudSun, Tractor, ScanSearch, Database, BarChart3, ChevronDown,
} from 'lucide-react';
import axios from 'axios';
import WeatherWidget from '../components/WeatherWidget';

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

/* Designed tonal tiles: soft tinted background + matching deep icon colour */
const TONES = {
  green: 'bg-leaf-100 text-leaf-700',
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  violet: 'bg-violet-100 text-violet-700',
  rose: 'bg-rose-100 text-rose-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  teal: 'bg-teal-100 text-teal-700',
  red: 'bg-red-100 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
  lime: 'bg-lime-100 text-lime-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

const TOOLS = [
  { to: '/diagnose', icon: Camera, label: 'Diagnosis', cat: 'protect', tone: 'amber' },
  { to: '/treatments', icon: ScanSearch, label: 'Treatments', cat: 'protect', tone: 'red' },
  { to: '/pest-library', icon: Bug, label: 'Pest Library', cat: 'protect', tone: 'red' },
  { to: '/weather', icon: CloudSun, label: 'Weather', cat: 'protect', tone: 'blue' },
  { to: '/alerts-center', icon: Bell, label: 'Alerts', cat: 'protect', tone: 'amber' },
  { to: '/fertilizer', icon: Droplets, label: 'Fertilizer', cat: 'grow', tone: 'cyan' },
  { to: '/soil-passport', icon: Sprout, label: 'Soil Passport', cat: 'grow', tone: 'green' },
  { to: '/crop-planner', icon: TrendingUp, label: 'Crop Planner', cat: 'grow', tone: 'violet' },
  { to: '/crops', icon: Tractor, label: 'Crop Guides', cat: 'grow', tone: 'lime' },
  { to: '/irrigation-planner', icon: Droplets, label: 'Irrigation', cat: 'grow', tone: 'cyan' },
  { to: '/sensor-lab', icon: FlaskConical, label: 'Sensor Lab', cat: 'grow', tone: 'teal' },
  { to: '/sustainability-score', icon: Gauge, label: 'Sustainability', cat: 'grow', tone: 'green' },
  { to: '/livestock-care', icon: Stethoscope, label: 'Livestock', cat: 'animals', tone: 'rose' },
  { to: '/animal-encyclopedia', icon: PawPrint, label: 'Animal Guides', cat: 'animals', tone: 'rose' },
  { to: '/market-prices', icon: Wallet, label: 'Mandi Prices', cat: 'market', tone: 'amber' },
  { to: '/farm-ledger', icon: FileSpreadsheet, label: 'Farm Ledger', cat: 'market', tone: 'lime' },
  { to: '/loan-eligibility', icon: Banknote, label: 'Loan Help', cat: 'market', tone: 'indigo' },
  { to: '/insurance-hub', icon: ShieldPlus, label: 'Insurance', cat: 'market', tone: 'violet' },
  { to: '/input-marketplace', icon: Store, label: 'Marketplace', cat: 'market', tone: 'amber' },
  { to: '/vendor-contacts', icon: Contact, label: 'Vendors', cat: 'market', tone: 'teal' },
  { to: '/schemes', icon: Landmark, label: 'Gov Schemes', cat: 'learn', tone: 'blue' },
  { to: '/near-me', icon: MapPin, label: 'Near Me', cat: 'learn', tone: 'indigo' },
  { to: '/community', icon: MessageSquare, label: 'Community', cat: 'learn', tone: 'violet' },
  { to: '/expert-directory', icon: UserCheck, label: 'Experts', cat: 'learn', tone: 'blue' },
  { to: '/training-center', icon: GraduationCap, label: 'Training', cat: 'learn', tone: 'teal' },
  { to: '/success-stories', icon: Trophy, label: 'Success Stories', cat: 'learn', tone: 'amber' },
  { to: '/data-gov', icon: Database, label: 'Gov Data', cat: 'learn', tone: 'slate' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard', cat: 'manage', tone: 'emerald' },
  { to: '/crop-passport', icon: ShieldCheck, label: 'Crop Passport', cat: 'manage', tone: 'emerald' },
  { to: '/harvest-records', icon: Wheat, label: 'Harvest', cat: 'manage', tone: 'amber' },
  { to: '/task-manager', icon: ListTodo, label: 'Tasks', cat: 'manage', tone: 'green' },
  { to: '/inventory-tracker', icon: Package, label: 'Inventory', cat: 'manage', tone: 'blue' },
  { to: '/document-wallet', icon: FolderArchive, label: 'Documents', cat: 'manage', tone: 'slate' },
  { to: '/voice-notes', icon: Mic, label: 'Voice Notes', cat: 'manage', tone: 'rose' },
  { to: '/farm-notifications', icon: BellRing, label: 'Notifications', cat: 'manage', tone: 'cyan' },
  { to: '/profile-settings', icon: User, label: 'Profile', cat: 'manage', tone: 'slate' },
];

/* Sections in a logical farmer's journey: grow, protect, livestock, money, learn, manage */
const SECTIONS = [
  {
    id: 'grow', title: 'Grow & Plan', subtitle: 'Sowing, soil, water and nutrients', icon: Sprout, tone: 'green', openByDefault: true,
  },
  {
    id: 'protect', title: 'Protect & Cure', subtitle: 'Diagnose problems and act early', icon: ShieldCheck, tone: 'amber', openByDefault: false,
  },
  {
    id: 'animals', title: 'Livestock', subtitle: 'Care for cows, goats, poultry and fish', icon: PawPrint, tone: 'rose', openByDefault: false,
  },
  {
    id: 'market', title: 'Market & Money', subtitle: 'Prices, selling, loans and insurance', icon: Wallet, tone: 'indigo', openByDefault: true,
  },
  {
    id: 'learn', title: 'Learn & Community', subtitle: 'Schemes, experts and fellow farmers', icon: GraduationCap, tone: 'blue', openByDefault: false,
  },
  {
    id: 'manage', title: 'Manage My Farm', subtitle: 'Records, tasks and reminders', icon: ListTodo, tone: 'cyan', openByDefault: false,
  },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [listening, setListening] = useState(false);
  const [prices, setPrices] = useState(null);
  const [openSections, setOpenSections] = useState(
    () => new Set(SECTIONS.filter((s) => s.openByDefault).map((s) => s.id))
  );

  useEffect(() => {
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

  /* Searching auto-expands every section that has matches */
  const isSearching = query.trim().length > 0 && query.trim().split(/\s+/).length <= 4;
  const q = query.trim().toLowerCase();

  const matchesFor = useMemo(() => {
    const map = {};
    for (const s of SECTIONS) {
      map[s.id] = TOOLS.filter(
        (t) => t.cat === s.id && (!isSearching || t.label.toLowerCase().includes(q))
      );
    }
    return map;
  }, [isSearching, q]);

  const totalMatches = Object.values(matchesFor).reduce((n, arr) => n + arr.length, 0);

  const toggleSection = (id) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-5">
      {/* Weather forecast */}
      <WeatherWidget />

      {/* Search + voice */}
      <div className="mt-5 flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-300 bg-white py-2.5 pl-4 pr-2.5 shadow-sm transition-all focus-within:border-leaf-500 focus-within:ring-4 focus-within:ring-leaf-100">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all tools…"
          className="min-w-0 flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Clear"
          >
            <X size={15} />
          </button>
        )}
        <button
          onClick={startVoice}
          aria-label="Speak"
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-all active:scale-90 ${
            listening ? 'bg-red-500' : 'bg-leaf-600 hover:bg-leaf-700'
          }`}
        >
          {listening && (
            <>
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-400" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-300" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          <Mic size={16} className={`relative ${listening ? 'animate-bounce-soft' : ''}`} />
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
          <ChevronRight size={16} />
        </Link>
      )}

      {/* Mandi prices */}
      <div className="mt-6 animate-fade-up overflow-hidden rounded-2xl border border-gray-200" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <TrendingUp size={15} className="text-leaf-600" />
            Today's mandi prices
          </h2>
          <Link to="/market-prices" className="flex items-center gap-0.5 text-xs font-medium text-leaf-700 hover:text-leaf-800">
            See all <ChevronRight size={13} />
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

      {/* Tools — categorised sections, opened one at a time */}
      <h2 className="mt-8 animate-fade-up text-base font-semibold text-gray-900" style={{ animationDelay: '260ms' }}>
        Explore tools
      </h2>

      {isSearching && totalMatches === 0 && (
        <div className="mt-3 animate-pop rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <SearchX size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-700">No tools match “{query}”</p>
          <button onClick={() => setQuery('')} className="mt-1 text-xs font-medium text-leaf-700">
            Clear search
          </button>
        </div>
      )}

      <div className="mt-3 space-y-3">
        {SECTIONS.map((section) => {
          const matches = matchesFor[section.id];
          if (isSearching && matches.length === 0) return null;

          const open = isSearching || openSections.has(section.id);
          const SectionIcon = section.icon;

          return (
            <div
              key={section.id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200"
            >
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 active:bg-gray-100"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONES[section.tone]}`}>
                  <SectionIcon size={18} strokeWidth={2} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-gray-900">{section.title}</span>
                  <span className="block truncate text-xs text-gray-400">{section.subtitle}</span>
                </span>
                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                  {matches.length}
                </span>
                <ChevronDown
                  size={17}
                  className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section body (smooth expand/collapse) */}
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid grid-cols-4 gap-x-2 gap-y-5 border-t border-gray-100 px-4 py-4 sm:grid-cols-5">
                    {matches.map(({ to, icon: Icon, label, tone }) => (
                      <Link
                        key={to}
                        to={to}
                        className="group flex flex-col items-center gap-2 rounded-xl py-1 transition-all active:scale-90"
                      >
                        <span
                          className={`flex h-[52px] w-[52px] items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${TONES[tone]}`}
                        >
                          <Icon size={23} strokeWidth={1.9} />
                        </span>
                        <span className="max-w-[72px] truncate text-center text-xs text-gray-600 transition-colors group-hover:text-gray-900">
                          {label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
