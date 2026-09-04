import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, MapPin, Sprout, PawPrint, LayoutDashboard, Mic, X, Bell, User, ArrowRight } from 'lucide-react';
import Logo, { LogoMark } from './Logo.jsx';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/diagnose', label: 'Diagnose' },
  { path: '/market-prices', label: 'Mandi Prices' },
  { path: '/weather', label: 'Weather' },
  { path: '/schemes', label: 'Schemes' },
  { path: '/near-me', label: 'Near Me' },
];

const MOBILE_NAV = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/diagnose', icon: Camera, label: 'Diagnose' },
  { path: '/near-me', icon: MapPin, label: 'Near Me' },
  { path: '/crops', icon: Sprout, label: 'Crops' },
  { path: '/animal-encyclopedia', icon: PawPrint, label: 'Animals' },
];

const FOOTER_COLS = [
  {
    title: 'Grow & Protect',
    links: [
      { to: '/diagnose', label: 'Crop Diagnosis' },
      { to: '/crop-planner', label: 'Crop Planner' },
      { to: '/fertilizer', label: 'Fertilizer Dose' },
      { to: '/pest-library', label: 'Pest Library' },
      { to: '/soil-passport', label: 'Soil Passport' },
    ],
  },
  {
    title: 'Earn & Save',
    links: [
      { to: '/market-prices', label: 'Mandi Prices' },
      { to: '/farm-ledger', label: 'Farm Ledger' },
      { to: '/loan-eligibility', label: 'Loan Eligibility' },
      { to: '/insurance-hub', label: 'Insurance' },
      { to: '/schemes', label: 'Gov Schemes' },
    ],
  },
  {
    title: 'Learn & Connect',
    links: [
      { to: '/training-academy', label: 'Training Academy' },
      { to: '/community', label: 'Community' },
      { to: '/expert-directory', label: 'Ask an Expert' },
      { to: '/success-stories', label: 'Success Stories' },
      { to: '/livestock-care', label: 'Livestock Care' },
    ],
  },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [showMic, setShowMic] = useState(false);

  const isActive = (path) =>
    location.pathname === path
    || (path !== '/' && location.pathname.startsWith(path))
    || (path === '/crops' && location.pathname.startsWith('/crop-encyclopedia'));

  return (
    <div className="min-h-screen bg-cream">
      {/* ── Desktop header ─────────────────────────────── */}
      <header className="fixed top-0 inset-x-0 z-40 hidden lg:block">
        <div className="glass border-b border-leaf-100/80 shadow-soft">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link to="/" aria-label="AgriSaathi home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-leaf-100 text-leaf-800'
                      : 'text-gray-600 hover:bg-leaf-50 hover:text-leaf-800'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <Link
                to="/alerts-center"
                className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-leaf-50 hover:text-leaf-700"
                aria-label="Alerts"
              >
                <Bell size={19} />
              </Link>
              <Link
                to="/profile-settings"
                className="rounded-full p-2.5 text-gray-500 transition-colors hover:bg-leaf-50 hover:text-leaf-700"
                aria-label="Profile"
              >
                <User size={19} />
              </Link>
              <Link
                to="/dashboard"
                className="group inline-flex items-center gap-1.5 rounded-full bg-leaf-800 px-4 py-2 text-sm font-semibold text-white shadow-soft transition-all hover:bg-leaf-700 hover:shadow-lift"
              >
                <LayoutDashboard size={16} />
                My Farm
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile top bar ─────────────────────────────── */}
      <div className="sticky top-0 z-40 lg:hidden">
        <div className="glass flex h-14 items-center justify-between border-b border-leaf-100/80 px-4">
          <Link to="/" aria-label="AgriSaathi home">
            <span className="inline-flex items-center gap-2">
              <LogoMark className="h-8 w-8" />
              <span className="font-display text-lg font-semibold tracking-tight text-leaf-950">
                Agri<span className="text-harvest-600">Saathi</span>
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/alerts-center" className="rounded-full p-2 text-gray-500" aria-label="Alerts">
              <Bell size={19} />
            </Link>
            <Link to="/profile-settings" className="rounded-full p-2 text-gray-500" aria-label="Profile">
              <User size={19} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Voice FAB ──────────────────────────────────── */}
      <button
        onClick={() => setShowMic(!showMic)}
        aria-label="Voice assistant"
        className="fixed bottom-24 right-4 z-50 rounded-full bg-gradient-to-br from-leaf-600 to-leaf-800 p-4 text-white shadow-glow transition-transform hover:scale-105 active:scale-95 lg:bottom-8"
      >
        <Mic size={22} />
      </button>

      {showMic && (
        <div className="fixed bottom-40 right-4 z-50 w-72 rounded-2xl border border-leaf-100 bg-white p-4 shadow-lift lg:bottom-24">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-semibold text-gray-800">Listening…</span>
            <button onClick={() => setShowMic(false)} className="ml-auto rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="mt-2 rounded-xl bg-leaf-50 p-3 text-sm italic text-leaf-800">
            "Identify this plant disease…"
          </div>
          <div className="mt-2 flex gap-2">
            {['Crop', 'Livestock', 'Weather'].map((chip) => (
              <span key={chip} className="rounded-full bg-leaf-100 px-3 py-1 text-xs font-medium text-leaf-800">
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Page content ───────────────────────────────── */}
      <main>
        <div className="mx-auto w-full max-w-6xl lg:pt-16">{children}</div>
      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="mt-16 bg-leaf-950 text-leaf-100">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <Logo dark />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-leaf-200/80">
                One voice for every acre. Diagnose, plan, trade and grow — with a
                companion that speaks your language.
              </p>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-leaf-800 bg-leaf-900/60 px-3 py-1.5 text-xs font-medium text-leaf-200">
                <span className="h-1.5 w-1.5 rounded-full bg-harvest-300" />
                Free for every farmer · 22 languages
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-harvest-300">{col.title}</h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link to={l.to} className="text-sm text-leaf-200/80 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-leaf-900 pt-6 text-xs text-leaf-300/70 sm:flex-row">
            <span>© {new Date().getFullYear()} AgriSaathi · Made with care for Bharat's farmers</span>
            <span>🌾 One Voice, Every Acre, Every Plot</span>
          </div>
        </div>
      </footer>

      {/* Spacer so content clears the mobile bottom nav */}
      <div className="h-20 lg:hidden" />

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="glass border-t border-leaf-100/80">
          <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
            {MOBILE_NAV.map(({ path, icon: Icon, label }) => {
              const active = isActive(path)
                || (path === '/animal-encyclopedia' && location.pathname.startsWith('/animal-encyclopedia'));
              return (
                <Link
                  key={path}
                  to={path}
                  aria-label={label}
                  className={`flex w-16 flex-col items-center gap-1 rounded-2xl py-1.5 transition-all ${
                    active ? 'text-leaf-800' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`flex h-8 w-14 items-center justify-center rounded-full transition-all ${
                      active ? 'bg-leaf-200/70' : ''
                    }`}
                  >
                    <Icon size={21} strokeWidth={active ? 2.2 : 1.7} />
                  </span>
                  <span className={`text-[10px] ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
