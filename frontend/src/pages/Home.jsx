import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Camera, Droplets, Sprout, MapPin, Wallet, Stethoscope, TrendingUp, FlaskConical,
  ShieldCheck, Landmark, Wheat, User, Banknote, MessageSquare, Store, GraduationCap,
  FolderArchive, ShieldPlus, Package, ListTodo, Bug, Gauge, UserCheck, Trophy, BellRing,
  Contact, Bell, FileSpreadsheet, PawPrint, Search, X, ChevronRight, SearchX,
  CloudSun, Tractor, ScanSearch, Database, BarChart3, ChevronDown, Sparkles,
} from 'lucide-react';
import axios from 'axios';
import { useLang } from '../lib/i18n';
import WeatherWidget from '../components/WeatherWidget';
import LanguageBar from '../components/LanguageBar';

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
  { to: '/diagnose', icon: Camera, label: 'Diagnosis', key: 'tool_diagnosis', cat: 'protect', tone: 'amber' },
  { to: '/treatments', icon: ScanSearch, label: 'Treatments', key: 'tool_treatments', cat: 'protect', tone: 'red' },
  { to: '/pest-library', icon: Bug, label: 'Pest Library', key: 'tool_pest_library', cat: 'protect', tone: 'red' },
  { to: '/weather', icon: CloudSun, label: 'Weather', key: 'tool_weather', cat: 'protect', tone: 'blue' },
  { to: '/alerts-center', icon: Bell, label: 'Alerts', key: 'tool_alerts', cat: 'protect', tone: 'amber' },
  { to: '/fertilizer', icon: Droplets, label: 'Fertilizer', key: 'tool_fertilizer', cat: 'grow', tone: 'cyan' },
  { to: '/soil-passport', icon: Sprout, label: 'Soil Passport', key: 'tool_soil_passport', cat: 'grow', tone: 'green' },
  { to: '/crop-planner', icon: TrendingUp, label: 'Crop Planner', key: 'tool_crop_planner', cat: 'grow', tone: 'violet' },
  { to: '/crops', icon: Tractor, label: 'Crop Guides', key: 'tool_crop_guides', cat: 'grow', tone: 'lime' },
  { to: '/irrigation-planner', icon: Droplets, label: 'Irrigation', key: 'tool_irrigation', cat: 'grow', tone: 'cyan' },
  { to: '/sensor-lab', icon: FlaskConical, label: 'Sensor Lab', key: 'tool_sensor_lab', cat: 'grow', tone: 'teal' },
  { to: '/sustainability-score', icon: Gauge, label: 'Sustainability', key: 'tool_sustainability', cat: 'grow', tone: 'green' },
  { to: '/livestock-care', icon: Stethoscope, label: 'Livestock', key: 'tool_livestock', cat: 'animals', tone: 'rose' },
  { to: '/animal-encyclopedia', icon: PawPrint, label: 'Animal Guides', key: 'tool_animal_guides', cat: 'animals', tone: 'rose' },
  { to: '/market-prices', icon: Wallet, label: 'Mandi Prices', key: 'tool_mandi_prices', cat: 'market', tone: 'amber' },
  { to: '/farm-ledger', icon: FileSpreadsheet, label: 'Farm Ledger', key: 'tool_farm_ledger', cat: 'market', tone: 'lime' },
  { to: '/loan-eligibility', icon: Banknote, label: 'Loan Help', key: 'tool_loan_help', cat: 'market', tone: 'indigo' },
  { to: '/insurance-hub', icon: ShieldPlus, label: 'Insurance', key: 'tool_insurance', cat: 'market', tone: 'violet' },
  { to: '/input-marketplace', icon: Store, label: 'Marketplace', key: 'tool_marketplace', cat: 'market', tone: 'amber' },
  { to: '/vendor-contacts', icon: Contact, label: 'Vendors', key: 'tool_vendors', cat: 'market', tone: 'teal' },
  { to: '/schemes', icon: Landmark, label: 'Gov Schemes', key: 'tool_gov_schemes', cat: 'learn', tone: 'blue' },
  { to: '/near-me', icon: MapPin, label: 'Near Me', key: 'tool_near_me', cat: 'learn', tone: 'indigo' },
  { to: '/community', icon: MessageSquare, label: 'Community', key: 'tool_community', cat: 'learn', tone: 'violet' },
  { to: '/expert-directory', icon: UserCheck, label: 'Experts', key: 'tool_experts', cat: 'learn', tone: 'blue' },
  { to: '/training-center', icon: GraduationCap, label: 'Training', key: 'tool_training', cat: 'learn', tone: 'teal' },
  { to: '/success-stories', icon: Trophy, label: 'Success Stories', key: 'tool_success_stories', cat: 'learn', tone: 'amber' },
  { to: '/data-gov', icon: Database, label: 'Gov Data', key: 'tool_gov_data', cat: 'learn', tone: 'slate' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard', key: 'tool_dashboard', cat: 'manage', tone: 'emerald' },
  { to: '/crop-passport', icon: ShieldCheck, label: 'Crop Passport', key: 'tool_crop_passport', cat: 'manage', tone: 'emerald' },
  { to: '/harvest-records', icon: Wheat, label: 'Harvest', key: 'tool_harvest', cat: 'manage', tone: 'amber' },
  { to: '/task-manager', icon: ListTodo, label: 'Tasks', key: 'tool_tasks', cat: 'manage', tone: 'green' },
  { to: '/inventory-tracker', icon: Package, label: 'Inventory', key: 'tool_inventory', cat: 'manage', tone: 'blue' },
  { to: '/document-wallet', icon: FolderArchive, label: 'Documents', key: 'tool_documents', cat: 'manage', tone: 'slate' },
  { to: '/voice-notes', icon: Mic, label: 'Voice Notes', key: 'tool_voice_notes', cat: 'manage', tone: 'rose' },
  { to: '/farm-notifications', icon: BellRing, label: 'Notifications', key: 'tool_notifications', cat: 'manage', tone: 'cyan' },
  { to: '/profile-settings', icon: User, label: 'Profile', key: 'tool_profile', cat: 'manage', tone: 'slate' },
];

/* Sections in a logical farmer's journey: grow, protect, livestock, money, learn, manage */
const SECTIONS = [
  { id: 'grow', titleKey: 'sec_grow', subKey: 'sec_grow_sub', icon: Sprout, tone: 'green', openByDefault: true },
  { id: 'protect', titleKey: 'sec_protect', subKey: 'sec_protect_sub', icon: ShieldCheck, tone: 'amber', openByDefault: false },
  { id: 'animals', titleKey: 'sec_animals', subKey: 'sec_animals_sub', icon: PawPrint, tone: 'rose', openByDefault: false },
  { id: 'market', titleKey: 'sec_market', subKey: 'sec_market_sub', icon: Wallet, tone: 'indigo', openByDefault: true },
  { id: 'learn', titleKey: 'sec_learn', subKey: 'sec_learn_sub', icon: GraduationCap, tone: 'blue', openByDefault: false },
  { id: 'manage', titleKey: 'sec_manage', subKey: 'sec_manage_sub', icon: ListTodo, tone: 'cyan', openByDefault: false },
];

/* Tinted initial avatars for mandi commodities (graphical, no emojis) */
const PRICE_AVATAR_TONES = [
  'bg-harvest-100 text-harvest-800',
  'bg-rose-100 text-rose-700',
  'bg-leaf-100 text-leaf-700',
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
];

export default function Home() {
  const { t } = useLang();
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
    <div className="mx-auto max-w-2xl px-4 pb-8 pt-4">
      {/* ── Language switcher ─────────────────────────── */}
      <LanguageBar />

      {/* ── Weather forecast ──────────────────────────── */}
      <div className="mt-4">
        <WeatherWidget />
      </div>

      {/* ── Search + voice ────────────────────────────── */}
      <div className="mt-5 flex animate-fade-up items-center gap-2.5 rounded-full border border-gray-300 bg-white py-2.5 pl-4 pr-2.5 shadow-sm transition-all focus-within:border-leaf-500 focus-within:ring-4 focus-within:ring-leaf-100">
        <Search size={18} className="shrink-0 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_placeholder')}
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
        <p className="mt-2 animate-fade-in text-center text-xs text-gray-400">{t('listening')}</p>
      )}

      {/* ── Smart suggestion ──────────────────────────── */}
      {intent && (
        <Link
          to={intent.to}
          className="mt-3 flex animate-fade-up items-center gap-3 rounded-2xl border border-leaf-200 bg-leaf-50/70 px-4 py-3 transition-all hover:bg-leaf-50 active:scale-[0.98]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
            <Sparkles size={16} />
          </span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block truncate text-gray-500">“{query}”</span>
            <span className="block font-semibold text-leaf-800">{t('open_action')} {intent.label}</span>
          </span>
          <ChevronRight size={16} className="shrink-0 text-leaf-600" />
        </Link>
      )}

      {/* ── Mandi prices ──────────────────────────────── */}
      <div className="mt-6 animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
          <h2 className="flex items-center gap-2.5 text-sm font-semibold text-gray-900">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700">
              <TrendingUp size={15} strokeWidth={2.2} />
            </span>
            {t('mandi_title')}
          </h2>
          <Link to="/market-prices" className="flex items-center gap-0.5 rounded-lg px-1.5 py-1 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50">
            {t('see_all')} <ChevronRight size={13} />
          </Link>
        </div>

        {prices === null ? (
          <div className="space-y-3 px-4 py-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-shimmer h-11 rounded-xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />
            ))}
          </div>
        ) : prices.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {prices.map((r, i) => (
              <li key={r.commodity}>
                <Link
                  to="/market-prices"
                  className="flex animate-slide-in items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${PRICE_AVATAR_TONES[i % PRICE_AVATAR_TONES.length]}`}>
                    {(r.commodity || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold capitalize text-gray-900">{r.commodity}</p>
                    <p className="truncate text-xs text-gray-400">{r.market}, {r.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{Number(r.modal_price || 0).toLocaleString('en-IN')}
                      <span className="text-[11px] font-normal text-gray-400">/q</span>
                    </p>
                    <p className="text-[11px] text-gray-400">₹{r.min_price} – ₹{r.max_price}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            {t('prices_unavailable')}
          </div>
        )}
      </div>

      {/* ── Tools ─────────────────────────────────────── */}
      <div className="mt-7 mb-3 flex animate-fade-up items-end justify-between" style={{ animationDelay: '260ms' }}>
        <div>
          <h2 className="text-base font-bold tracking-tight text-gray-900">{t('explore_tools', 'Explore tools')}</h2>
          <p className="mt-0.5 text-xs text-gray-400">{t('explore_tools_sub', 'Everything for your farm, in one place')}</p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-500">
          {TOOLS.length}
        </span>
      </div>

      {isSearching && totalMatches === 0 && (
        <div className="mt-3 animate-pop rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <SearchX size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-700">{t('no_matches')}</p>
          <button onClick={() => setQuery('')} className="mt-1 text-xs font-medium text-leaf-700">
            Clear search
          </button>
        </div>
      )}

      <div className="space-y-3">
        {SECTIONS.map((section) => {
          const matches = matchesFor[section.id];
          if (isSearching && matches.length === 0) return null;

          const open = isSearching || openSections.has(section.id);
          const SectionIcon = section.icon;

          return (
            <div
              key={section.id}
              className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
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
                  <span className="block text-sm font-semibold text-gray-900">{t(section.titleKey, section.title)}</span>
                  <span className="block truncate text-xs text-gray-400">{t(section.subKey, section.subtitle)}</span>
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
                    {matches.map(({ to, icon: Icon, label, key, tone }) => (
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
                          {t(key, label)}
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
