import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, Camera, Droplets, Sprout, MapPin, Wallet, Stethoscope, TrendingUp, FlaskConical,
  ShieldCheck, Landmark, Wheat, User, Banknote, MessageSquare, CloudSun, Store,
  GraduationCap, FolderArchive, ShieldPlus, Package, ListTodo, Bug, Gauge, UserCheck,
  Trophy, BellRing, Contact, Bell, FileSpreadsheet, PawPrint, Search, ArrowRight,
  ArrowUpRight, Sun, Sparkles, CheckCircle2, Quote, Languages, BarChart3,
  Tractor, ScanSearch, Database, CloudRain,
} from 'lucide-react';
import axios from 'axios';
import useReveal from '../lib/useReveal';
import heroFarmer from '../assets/hero-farmer.jpg';
import fieldsAerial from '../assets/fields-aerial.jpg';

const INTENTS = [
  { keys: ['disease', 'pest', 'yellow', 'leaf', 'rot', 'wilt', 'spot'], to: '/diagnose', label: 'Diagnose crop issue' },
  { keys: ['fertiliz', 'dose', 'npk'], to: '/fertilizer', label: 'Fertilizer dosage' },
  { keys: ['soil', 'ph', 'card'], to: '/soil-passport', label: 'Soil passport' },
  { keys: ['grow', 'crop', 'plant'], to: '/crop-planner', label: 'Plan a crop' },
  { keys: ['cow', 'goat', 'poultry', 'fish', 'bee', 'animal'], to: '/livestock-care', label: 'Livestock help' },
  { keys: ['market', 'price', 'mandi'], to: '/market-prices', label: 'Market prices' },
];

const CATEGORIES = [
  { id: 'all', label: 'All tools', icon: Sparkles },
  { id: 'grow', label: 'Grow & Plan', icon: Sprout },
  { id: 'protect', label: 'Protect & Heal', icon: ShieldCheck },
  { id: 'animals', label: 'Livestock', icon: PawPrint },
  { id: 'market', label: 'Market & Money', icon: Wallet },
  { id: 'learn', label: 'Learn & Community', icon: GraduationCap },
  { id: 'manage', label: 'Farm Management', icon: ListTodo },
];

const TOOLS = [
  { to: '/diagnose', icon: Camera, label: 'Crop Diagnosis', desc: 'Snap a photo, identify disease instantly', cat: 'protect', tone: 'amber' },
  { to: '/fertilizer', icon: Droplets, label: 'Fertilizer Dose', desc: 'Exact NPK by crop and soil', cat: 'grow', tone: 'blue' },
  { to: '/soil-passport', icon: Sprout, label: 'Soil Passport', desc: 'Your soil health, card by card', cat: 'grow', tone: 'green' },
  { to: '/crop-planner', icon: TrendingUp, label: 'Crop Planner', desc: 'What to sow, when and where', cat: 'grow', tone: 'purple' },
  { to: '/livestock-care', icon: Stethoscope, label: 'Livestock Care', desc: 'Health advice for every animal', cat: 'animals', tone: 'rose' },
  { to: '/animal-encyclopedia', icon: PawPrint, label: 'Animal Encyclopedia', desc: 'Breeds, feed and care guides', cat: 'animals', tone: 'fuchsia' },
  { to: '/market-prices', icon: Wallet, label: 'Mandi Prices', desc: 'Live prices across mandis', cat: 'market', tone: 'orange' },
  { to: '/near-me', icon: MapPin, label: 'Near Me', desc: 'KVKs, vet centres and markets', cat: 'learn', tone: 'indigo' },
  { to: '/farm-ledger', icon: FileSpreadsheet, label: 'Farm Ledger', desc: 'Every rupee in and out', cat: 'market', tone: 'lime' },
  { to: '/crop-passport', icon: ShieldCheck, label: 'Crop Passport', desc: 'Journey from seed to sale', cat: 'manage', tone: 'emerald' },
  { to: '/schemes', icon: Landmark, label: 'Gov Schemes', desc: 'Subsidies you can claim', cat: 'learn', tone: 'blue' },
  { to: '/community', icon: MessageSquare, label: 'Community', desc: 'Ask fellow farmers anything', cat: 'learn', tone: 'purple' },
  { to: '/weather', icon: CloudSun, label: 'Weather', desc: '7-day forecast for your farm', cat: 'protect', tone: 'sky' },
  { to: '/sensor-lab', icon: FlaskConical, label: 'Sensor Lab', desc: 'Soil moisture & sensor insights', cat: 'grow', tone: 'cyan' },
  { to: '/irrigation-planner', icon: Droplets, label: 'Irrigation Planner', desc: 'Water smart, save more', cat: 'grow', tone: 'cyan' },
  { to: '/harvest-records', icon: Wheat, label: 'Harvest Records', desc: 'Track yield season by season', cat: 'manage', tone: 'amber' },
  { to: '/profile-settings', icon: User, label: 'Profile', desc: 'Your farm, your preferences', cat: 'manage', tone: 'slate' },
  { to: '/voice-notes', icon: Mic, label: 'Voice Notes', desc: 'Spoken notes, saved forever', cat: 'manage', tone: 'rose' },
  { to: '/loan-eligibility', icon: Banknote, label: 'Loan Eligibility', desc: 'Kisan Credit Card readiness', cat: 'market', tone: 'indigo' },
  { to: '/input-marketplace', icon: Store, label: 'Input Marketplace', desc: 'Seeds & agri inputs, fair prices', cat: 'market', tone: 'orange' },
  { to: '/training-center', icon: GraduationCap, label: 'Training Center', desc: 'Learn new farming practices', cat: 'learn', tone: 'teal' },
  { to: '/document-wallet', icon: FolderArchive, label: 'Documents', desc: 'Land papers, always with you', cat: 'manage', tone: 'amber' },
  { to: '/insurance-hub', icon: ShieldPlus, label: 'Insurance', desc: 'Protect crops and cattle', cat: 'market', tone: 'purple' },
  { to: '/inventory-tracker', icon: Package, label: 'Inventory', desc: 'Stock of inputs and produce', cat: 'manage', tone: 'blue' },
  { to: '/task-manager', icon: ListTodo, label: 'Tasks', desc: 'Field work, never forgotten', cat: 'manage', tone: 'green' },
  { to: '/alerts-center', icon: Bell, label: 'Alerts', desc: 'Price & weather, as they break', cat: 'protect', tone: 'amber' },
  { to: '/pest-library', icon: Bug, label: 'Pest Library', desc: 'Know the enemy, beat it', cat: 'protect', tone: 'red' },
  { to: '/sustainability-score', icon: Gauge, label: 'Sustainability', desc: 'Score your farm eco-friendliness', cat: 'grow', tone: 'green' },
  { to: '/expert-directory', icon: UserCheck, label: 'Experts', desc: 'Talk to agri scientists', cat: 'learn', tone: 'blue' },
  { to: '/success-stories', icon: Trophy, label: 'Success Stories', desc: 'Farmers who made it big', cat: 'learn', tone: 'amber' },
  { to: '/farm-notifications', icon: BellRing, label: 'Notifications', desc: 'Your farm bulletin board', cat: 'manage', tone: 'cyan' },
  { to: '/vendor-contacts', icon: Contact, label: 'Vendors', desc: 'Trusted local suppliers', cat: 'market', tone: 'teal' },
  { to: '/crops', icon: Tractor, label: 'Crop Encyclopedia', desc: 'Deep guides for 100+ crops', cat: 'grow', tone: 'lime' },
  { to: '/dashboard', icon: BarChart3, label: 'My Farm Dashboard', desc: 'Your whole farm at a glance', cat: 'manage', tone: 'emerald' },
  { to: '/treatments', icon: ScanSearch, label: 'Treatments', desc: 'Cures for diagnosed problems', cat: 'protect', tone: 'red' },
  { to: '/data-gov', icon: Database, label: 'Gov Live Data', desc: 'Open data feeds for farms', cat: 'learn', tone: 'blue' },
];

const TONES = {
  amber: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-leaf-200 text-leaf-800',
  purple: 'bg-purple-100 text-purple-700',
  rose: 'bg-rose-100 text-rose-700',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-700',
  orange: 'bg-orange-100 text-orange-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  lime: 'bg-lime-100 text-lime-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
  cyan: 'bg-cyan-100 text-cyan-700',
  slate: 'bg-slate-200 text-slate-700',
  teal: 'bg-teal-100 text-teal-700',
  red: 'bg-red-100 text-red-700',
};

const TICKER_ITEMS = [
  '🌾 Paddy', '🍅 Tomato', '🧅 Onion', '🌱 Cotton', '🫘 Gram', '🥔 Potato', '☀️ Sowing window',
  '💧 Irrigation alerts', '🐄 Cattle care', '📈 Mandi bhav', '🛡️ PM-Kisan', '🐛 Pest watch', '🥜 Groundnut', '🌽 Maize',
];

const TESTIMONIALS = [
  {
    quote: 'I photographed my paddy leaves and knew it was blight in seconds. Saved half my crop this season.',
    name: 'Lakshmi Reddy',
    place: 'Nalgonda, Telangana',
  },
  {
    quote: 'The mandi price alerts tell me exactly when to sell. My onion profit went up ₹40,000 last year.',
    name: 'Ramesh Yadav',
    place: 'Kanpur, Uttar Pradesh',
  },
  {
    quote: 'Everything speaks my language — even the fertilizer dose. My saathi indeed.',
    name: 'Gurpreet Singh',
    place: 'Ludhiana, Punjab',
  },
];

function WeatherIcon({ description, className = 'h-6 w-6' }) {
  const d = (description || '').toLowerCase();
  if (d.includes('rain') || d.includes('drizzle')) return <CloudRain className={className} />;
  if (d.includes('clear')) return <Sun className={className} />;
  return <CloudSun className={className} />;
}

export default function Home() {
  useReveal();
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [health, setHealth] = useState(null);
  const [weather, setWeather] = useState(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const toolsRef = useRef(null);

  useEffect(() => {
    axios.get('/health').then((res) => setHealth(res.data)).catch(() => {});
    axios.get('/api/weather/current?lat=17.3850&lon=78.4867')
      .then((res) => setWeather(res.data))
      .catch(() => {});
  }, []);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setTranscript('Voice input is not supported in this browser — try typing your question below.');
      return;
    }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => setTranscript(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.start();
    setListening(true);
  };

  const intent = INTENTS.find((i) => i.keys.some((k) => transcript.toLowerCase().includes(k)));

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((t) => {
      const inCat = category === 'all' || t.cat === category;
      const inQuery = !q || t.label.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [query, category]);

  const scrollToTools = () => toolsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="overflow-hidden">
      {/* ════════════════════════ HERO ════════════════════════ */}
      <section className="relative bg-hero-grad">
        <div className="dot-field absolute inset-0 opacity-60" />
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-leaf-300/25 blur-3xl" />
        <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-harvest-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-20">
          {/* Copy */}
          <div>
            <div className="reveal inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-leaf-800 shadow-soft">
              <Sparkles size={14} className="text-harvest-600" />
              Your farm's companion — in 22 Indian languages
            </div>

            <h1
              className="reveal mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-leaf-950 sm:text-6xl lg:text-[4.2rem]"
              style={{ '--reveal-delay': '80ms' }}
            >
              Farming answers,
              <br />
              <span className="text-gradient">one voice away.</span>
            </h1>

            <p
              className="reveal mt-5 max-w-lg text-base leading-relaxed text-gray-600 sm:text-lg"
              style={{ '--reveal-delay': '160ms' }}
            >
              Speak to AgriSaathi in your language — diagnose a sick crop, get the right
              fertilizer dose, catch the best mandi price and claim every scheme you
              deserve. <span className="font-semibold text-leaf-800">Free, forever.</span>
            </p>

            {/* Voice bar */}
            <div className="reveal mt-8" style={{ '--reveal-delay': '240ms' }}>
              <div className="flex flex-col items-stretch gap-3 rounded-3xl border border-leaf-200/80 bg-white/80 p-3 shadow-soft backdrop-blur sm:flex-row sm:items-center">
                <button
                  onClick={startVoice}
                  aria-label="Speak to AgriSaathi"
                  className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white transition-all ${
                    listening
                      ? 'scale-105 bg-gradient-to-br from-red-400 to-red-600'
                      : 'bg-gradient-to-br from-leaf-500 to-leaf-800 hover:shadow-glow'
                  }`}
                >
                  {listening && (
                    <>
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-400/60" />
                      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-400/40" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  <Mic className="relative h-6 w-6" />
                </button>
                <div className="min-w-0 flex-1">
                  {transcript ? (
                    <div>
                      <p className="truncate text-sm font-medium text-gray-800">"{transcript}"</p>
                      {intent ? (
                        <Link
                          to={intent.to}
                          className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700 hover:text-leaf-800"
                        >
                          {intent.label} <ArrowRight size={15} />
                        </Link>
                      ) : (
                        <p className="mt-1 text-xs text-gray-400">Try: "my tomato leaves have yellow spots"</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {listening ? 'Listening… speak now' : 'Tap and speak your problem'}
                      </p>
                      <p className="text-xs text-gray-400">"What is today's mandi bhav for onion?"</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={scrollToTools}
                  className="hidden items-center gap-2 rounded-2xl bg-leaf-800 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-leaf-700 sm:inline-flex"
                >
                  Explore tools <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-leaf-600" /> 35+ farm tools
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Languages size={14} className="text-leaf-600" /> Voice-first, low literacy friendly
                </span>
                {health && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-leaf-500" />
                    Live data connected
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="reveal relative" style={{ '--reveal-delay': '200ms' }}>
            <div className="absolute -inset-6 -z-0 animate-spin-slow rounded-[3rem] bg-[conic-gradient(from_0deg,rgba(53,157,86,0.12),transparent_25%,rgba(234,179,46,0.15)_50%,transparent_75%,rgba(53,157,86,0.12))] blur-sm" />
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-lift">
              <img
                src={heroFarmer}
                alt="Indian farmer using AgriSaathi in a green paddy field at golden hour"
                className="h-[340px] w-full object-cover sm:h-[420px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-leaf-950/45 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl glass px-4 py-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-800">Today's Saathi score</p>
                  <p className="text-sm text-gray-600">Great day for irrigation & sowing</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-harvest-400/90 text-sm font-bold text-leaf-950">92</span>
              </div>
            </div>

            {/* Floating weather chip */}
            <div className="absolute -left-3 top-6 animate-floaty rounded-2xl border border-white/60 glass px-4 py-3 shadow-lift sm:-left-8">
              {weather && weather.temperature != null ? (
                <div className="flex items-center gap-3">
                  <WeatherIcon description={weather.description} className="h-8 w-8 text-leaf-700" />
                  <div>
                    <p className="text-lg font-bold leading-none text-leaf-950">{Math.round(weather.temperature)}°C</p>
                    <p className="text-[11px] capitalize text-gray-500">{weather.description || 'Live weather'}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                  <CloudSun className="h-6 w-6 text-leaf-600" /> Weather for your pincode
                </div>
              )}
            </div>

            {/* Floating price chip */}
            <div className="absolute -right-2 bottom-24 animate-floaty-slow rounded-2xl border border-white/60 glass px-4 py-3 shadow-lift sm:-right-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-harvest-100 text-harvest-700">
                  <TrendingUp size={18} />
                </span>
                <div>
                  <p className="text-[11px] font-medium text-gray-500">Onion · Lasalgaon</p>
                  <p className="text-sm font-bold text-leaf-950">
                    ₹1,845 <span className="text-xs font-semibold text-leaf-600">▲ 3.2%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ticker */}
        <div className="relative border-y border-leaf-200/70 bg-white/60 py-3 backdrop-blur">
          <div className="flex w-max animate-ticker whitespace-nowrap">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="px-4 text-sm font-medium text-leaf-900/70">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ HIGHLIGHTS ════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="reveal max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-harvest-600">Why farmers love it</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">
            A whole agriculture department,
            <span className="text-gradient"> in your pocket</span>
          </h2>
          <p className="mt-3 text-gray-600">
            From sowing to selling, every decision has a saathi — backed by live government
            data and agronomy science.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Big card — Diagnose */}
          <Link
            to="/diagnose"
            className="reveal group relative overflow-hidden rounded-3xl bg-leaf-800 p-7 text-white shadow-lift transition-transform hover:-translate-y-1 sm:col-span-2"
          >
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-leaf-600/50 blur-2xl transition-transform group-hover:scale-125" />
            <div className="absolute bottom-4 right-5 opacity-20 transition-all group-hover:scale-110 group-hover:opacity-30">
              <Camera size={110} strokeWidth={1} />
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-harvest-400/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-harvest-300">
              <ScanSearch size={13} /> AI powered
            </span>
            <h3 className="mt-16 font-display text-2xl font-semibold sm:text-[1.7rem]">Spot a sick plant? Snap it.</h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-leaf-100/85">
              Point your camera at any leaf. AgriSaathi identifies 30+ diseases and pests
              and prescribes the exact treatment — in your language.
            </p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-harvest-300">
              Diagnose now <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>

          {/* Mandi prices */}
          <Link
            to="/market-prices"
            className="reveal group rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft card-lift"
            style={{ '--reveal-delay': '80ms' }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-harvest-100 text-harvest-700">
              <Wallet size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-leaf-950">Live mandi prices</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Daily bhav from 3,600+ mandis. Set an alert, sell at the peak.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf-700">
              Check bhav <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Weather */}
          <Link
            to="/weather"
            className="reveal group rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft card-lift"
            style={{ '--reveal-delay': '160ms' }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <CloudSun size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-leaf-950">Farm-accurate weather</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              7-day forecast with sowing and irrigation advisories.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf-700">
              See forecast <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Schemes */}
          <Link
            to="/schemes"
            className="reveal group rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft card-lift"
            style={{ '--reveal-delay': '80ms' }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Landmark size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-leaf-950">Schemes, simplified</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              PM-Kisan, insurance and subsidies — matched to you, explained simply.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf-700">
              Find my schemes <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Livestock */}
          <Link
            to="/livestock-care"
            className="reveal group rounded-3xl border border-leaf-100 bg-white p-6 shadow-soft card-lift"
            style={{ '--reveal-delay': '160ms' }}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <Stethoscope size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-leaf-950">Livestock doctor</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
              Cattle, goat, poultry and fish — symptoms to care plans.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf-700">
              Care for animals <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          {/* Ledger */}
          <Link
            to="/farm-ledger"
            className="reveal group relative overflow-hidden rounded-3xl bg-gradient-to-br from-harvest-300 to-harvest-500 p-6 shadow-lift transition-transform hover:-translate-y-1"
            style={{ '--reveal-delay': '240ms' }}
          >
            <FileSpreadsheet className="absolute -right-4 -top-4 h-28 w-28 text-white/25" strokeWidth={1} />
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/30 text-leaf-950">
              <BarChart3 size={22} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-leaf-950">Know your profit</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-leaf-950/75">
              Track expenses, yields and income — see what every acre truly earns.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-leaf-950">
              Open ledger <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ════════════════════════ TOOL EXPLORER ════════════════════════ */}
      <section ref={toolsRef} id="tools" className="scroll-mt-20 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-harvest-600">Everything in one place</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">
                35+ tools for every season
              </h2>
              <p className="mt-3 text-gray-600">Search or browse — each tool works on voice and text, online or offline.</p>
            </div>
            <div className="relative w-full max-w-sm">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools — try 'price' or 'soil'"
                className="w-full rounded-2xl border border-leaf-200 bg-leaf-50/50 py-3 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-leaf-500 focus:bg-white focus:ring-4 focus:ring-leaf-200/60"
              />
            </div>
          </div>

          <div className="reveal mt-8 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setCategory(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                  category === id
                    ? 'border-leaf-800 bg-leaf-800 text-white shadow-soft'
                    : 'border-leaf-200 bg-white text-gray-600 hover:border-leaf-400 hover:text-leaf-800'
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredTools.map(({ to, icon: Icon, label, desc, tone }, i) => (
              <Link
                key={to + label}
                to={to}
                className="group rounded-2xl border border-gray-100 bg-cream/60 p-4 transition-all hover:-translate-y-1 hover:border-leaf-300 hover:bg-white hover:shadow-lift"
                style={{ '--reveal-delay': `${(i % 8) * 40}ms` }}
              >
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${TONES[tone]}`}>
                  <Icon size={19} />
                </span>
                <p className="mt-3 text-sm font-bold text-gray-800 group-hover:text-leaf-900">{label}</p>
                <p className="mt-1 text-xs leading-snug text-gray-500">{desc}</p>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="mt-10 rounded-3xl border-2 border-dashed border-leaf-200 bg-leaf-50/50 py-14 text-center">
              <Search size={28} className="mx-auto text-leaf-400" />
              <p className="mt-3 font-semibold text-gray-700">No tools match "{query}"</p>
              <p className="text-sm text-gray-400">Try "weather", "loan" or "pest"</p>
            </div>
          )}
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS ════════════════════════ */}
      <section className="relative overflow-hidden py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="reveal mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-harvest-600">Simple by design</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-leaf-950 sm:text-4xl">
              Working in three easy steps
            </h2>
          </div>

          <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            <div className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-leaf-200 md:block" />
            {[
              {
                n: '01',
                icon: Mic,
                title: 'Just speak or snap',
                desc: 'Ask a question in your mother tongue or photograph the problem. No forms, no jargon.',
              },
              {
                n: '02',
                icon: Sparkles,
                title: 'Get clear guidance',
                desc: 'AgriSaathi translates science into simple steps — doses, dates and prices included.',
              },
              {
                n: '03',
                icon: TrendingUp,
                title: 'Act, track, prosper',
                desc: 'Set alerts, record harvests and watch your farm — and income — grow season after season.',
              },
            ].map(({ n, icon: Icon, title, desc }, i) => (
              <div key={n} className="reveal relative text-center md:text-left" style={{ '--reveal-delay': `${i * 120}ms` }}>
                <div className="relative z-10 mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-3xl border border-leaf-200 bg-white text-leaf-700 shadow-soft md:mx-0">
                  <Icon size={26} />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-harvest-400 text-xs font-extrabold text-leaf-950">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-leaf-950">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
      <section className="relative overflow-hidden">
        <img src={fieldsAerial} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-leaf-950/85" />
        <div className="grain relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-24">
          <div className="reveal mx-auto max-w-2xl text-center">
            <Quote size={36} className="mx-auto text-harvest-300/70" />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Loved across <span className="text-gradient-gold">Bharat's fields</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <figure
                key={t.name}
                className="reveal glass-dark rounded-3xl border border-white/10 p-7 shadow-lift"
                style={{ '--reveal-delay': `${i * 120}ms` }}
              >
                <blockquote className="text-[15px] leading-relaxed text-leaf-50/90">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-harvest-400 font-display text-base font-bold text-leaf-950">
                    {t.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-leaf-200/70">{t.place}</p>
                  </div>
                  <span className="ml-auto text-harvest-300">★★★★★</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="reveal mt-14 grid grid-cols-2 gap-6 border-t border-white/10 pt-10 text-center sm:grid-cols-4">
            {[
              { v: '35+', l: 'Farm tools' },
              { v: '22', l: 'Languages' },
              { v: '3,600+', l: 'Mandis tracked' },
              { v: '100%', l: 'Free for farmers' },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-3xl font-semibold text-harvest-300 sm:text-4xl">{s.v}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-leaf-200/70">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ FINAL CTA ════════════════════════ */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:py-24">
        <div className="reveal">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-harvest-600">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-leaf-950 sm:text-5xl">
            Your fields are waiting.
            <span className="text-gradient"> Say hello.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            No sign-up needed. Tap the mic and ask your first question — your saathi is listening.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={startVoice}
              className="group inline-flex items-center gap-2.5 rounded-full bg-leaf-800 px-8 py-4 text-base font-bold text-white shadow-lift transition-all hover:bg-leaf-700 hover:shadow-glow"
            >
              <Mic size={19} className="transition-transform group-hover:scale-110" />
              {listening ? 'Listening…' : 'Speak to AgriSaathi'}
            </button>
            <button
              onClick={scrollToTools}
              className="inline-flex items-center gap-2 rounded-full border-2 border-leaf-200 bg-white px-8 py-[0.9rem] text-base font-bold text-leaf-800 transition-all hover:border-leaf-500 hover:bg-leaf-50"
            >
              Browse all tools <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
