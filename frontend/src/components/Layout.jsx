import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { Home, Camera, MapPin, Wheat, PawPrint, Bell, UserCircle } from 'lucide-react';
import Logo from './Logo.jsx';

const NAV_LINKS = [
  { path: '/', labelKey: 'nav_home' },
  { path: '/diagnose', labelKey: 'nav_diagnose' },
  { path: '/market-prices', labelKey: 'nav_prices' },
  { path: '/weather', labelKey: 'nav_weather' },
  { path: '/schemes', labelKey: 'nav_schemes' },
  { path: '/near-me', labelKey: 'nav_nearMe' },
];

const MOBILE_NAV = [
  { path: '/', icon: Home, labelKey: 'nav_home' },
  { path: '/diagnose', icon: Camera, labelKey: 'nav_diagnose' },
  { path: '/near-me', icon: MapPin, labelKey: 'nav_nearMe' },
  { path: '/crops', icon: Wheat, labelKey: 'nav_crops' },
  { path: '/animal-encyclopedia', icon: PawPrint, labelKey: 'nav_animals' },
];

export default function Layout({ children }) {
  const location = useLocation();
  const { t } = useLang();

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
            {NAV_LINKS.map(({ path, labelKey }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium transition-colors ${
                  isActive(path) ? 'text-leaf-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(labelKey)}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link
              to="/alerts-center"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Alerts"
            >
              <Bell size={19} />
            </Link>
            <Link
              to="/profile-settings"
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Profile"
            >
              <UserCircle size={19} />
            </Link>
            <Link
              to="/dashboard"
              className="ml-1 rounded-lg bg-leaf-600 px-3.5 py-1.5 text-sm font-medium text-white transition-all hover:bg-leaf-700 active:scale-95"
            >
              {t('my_farm')}
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
          <Link to="/alerts-center" className="rounded-full p-2 text-gray-500 transition-colors active:bg-gray-100" aria-label="Alerts">
            <Bell size={20} />
          </Link>
          <Link to="/profile-settings" className="rounded-full p-2 text-gray-500 transition-colors active:bg-gray-100" aria-label="Profile">
            <UserCircle size={20} />
          </Link>
        </div>
      </div>

      {/* ── Page content ───────────────────────────────── */}
      <main className="mx-auto w-full max-w-6xl">
        <div className="lg:pt-6">{children}</div>
      </main>

      {/* ── Minimal footer ─────────────────────────────── */}
      <footer className="px-4 py-10 text-center text-xs text-gray-400">
        AgriSaathi · Free for every farmer · 22 languages
      </footer>

      {/* Spacer so content clears the mobile bottom nav */}
      <div className="h-16 lg:hidden" />

      {/* ── Mobile bottom nav ──────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {MOBILE_NAV.map(({ path, icon: Icon, labelKey }) => {
            const active =
              isActive(path)
              || (path === '/animal-encyclopedia' && location.pathname.startsWith('/animal-encyclopedia'));
            return (
              <Link
                key={path}
                to={path}
                aria-label={t(labelKey)}
                className={`flex w-16 flex-col items-center gap-1 rounded-xl py-1.5 transition-colors ${
                  active ? 'text-leaf-700' : 'text-gray-400'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.3 : 1.7}
                  className={`transition-transform ${active ? 'animate-pop' : ''}`}
                />
                <span className={`text-[10px] ${active ? 'font-semibold' : ''}`}>{t(labelKey)}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
