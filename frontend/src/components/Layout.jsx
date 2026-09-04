import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/diagnose', label: 'Diagnose' },
  { path: '/market-prices', label: 'Prices' },
  { path: '/weather', label: 'Weather' },
  { path: '/schemes', label: 'Schemes' },
  { path: '/near-me', label: 'Near Me' },
];

const MOBILE_NAV = [
  { path: '/', emoji: '🏠', label: 'Home' },
  { path: '/diagnose', emoji: '📷', label: 'Diagnose' },
  { path: '/near-me', emoji: '📍', label: 'Near Me' },
  { path: '/crops', emoji: '🌾', label: 'Crops' },
  { path: '/animal-encyclopedia', emoji: '🐾', label: 'Animals' },
];

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
    || (path !== '/' && location.pathname.startsWith(path))
    || (path === '/crops' && location.pathname.startsWith('/crop-encyclopedia'));

  return (
    <div className="min-h-screen bg-white">
      {/* ── Desktop header ─────────────────────────────── */}
      <header className="sticky top-0 z-40 hidden border-b border-gray-200 bg-white lg:block">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link to="/" aria-label="AgriSaathi home" className="transition-opacity hover:opacity-80">
            <Logo />
          </Link>
          <nav className="flex items-center gap-6">
            {NAV_LINKS.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  isActive(path) ? 'text-leaf-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link
              to="/alerts-center"
              className="rounded-full p-2 text-base transition-transform hover:scale-110"
              aria-label="Alerts"
            >
              🔔
            </Link>
            <Link
              to="/profile-settings"
              className="rounded-full p-2 text-base transition-transform hover:scale-110"
              aria-label="Profile"
            >
              👤
            </Link>
            <Link
              to="/dashboard"
              className="ml-1 rounded-lg bg-leaf-600 px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-leaf-700 active:scale-95"
            >
              My Farm
            </Link>
          </div>
        </div>
      </header>

      {/* ── Mobile top bar ─────────────────────────────── */}
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
        <Link to="/" aria-label="AgriSaathi home">
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/alerts-center" className="rounded-full p-2 text-lg transition-transform active:scale-90" aria-label="Alerts">
            🔔
          </Link>
          <Link to="/profile-settings" className="rounded-full p-2 text-lg transition-transform active:scale-90" aria-label="Profile">
            👤
          </Link>
        </div>
      </div>

      {/* ── Page content ───────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl">
        <div className="lg:pt-6">{children}</div>
      </main>

      {/* ── Minimal footer ─────────────────────────────── */}
      <footer className="px-4 py-10 text-center text-xs text-gray-400">
        🌾 AgriSaathi · Free for every farmer · 22 languages
      </footer>

      {/* Spacer so content clears the mobile bottom nav */}
      <div className="h-16 lg:hidden" />

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {MOBILE_NAV.map(({ path, emoji, label }) => {
            const active =
              isActive(path)
              || (path === '/animal-encyclopedia' && location.pathname.startsWith('/animal-encyclopedia'));
            return (
              <Link
                key={path}
                to={path}
                aria-label={label}
                className={`flex w-16 flex-col items-center gap-0.5 rounded-xl py-1.5 transition-colors ${
                  active ? 'text-leaf-700' : 'text-gray-400'
                }`}
              >
                <span
                  key={`${path}-${active}`}
                  className={`text-xl leading-none transition-transform ${active ? 'animate-pop' : ''}`}
                >
                  {emoji}
                </span>
                <span className={`text-[10px] ${active ? 'font-semibold' : ''}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
