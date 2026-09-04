export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#359d56" />
          <stop offset="1" stopColor="#174328" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#logo-g)" />
      <path d="M32 50c0-12 0-18 0-24" stroke="#eaf6ec" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 30c-1.5-8-7-13-16-14 1 10 6.5 15 16 14Z" fill="#eaf6ec" />
      <path d="M32 34c1.5-8 7-13 16-14-1 10-6.5 15-16 14Z" fill="#efc95b" />
      <circle cx="32" cy="15" r="3" fill="#efc95b" />
    </svg>
  );
}

export default function Logo({ dark = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark className="h-9 w-9" />
      {!compact && (
        <span className="leading-none">
          <span
            className={`block font-display text-xl font-semibold tracking-tight ${
              dark ? 'text-white' : 'text-leaf-950'
            }`}
          >
            Agri<span className={dark ? 'text-harvest-300' : 'text-harvest-600'}>Saathi</span>
          </span>
          <span
            className={`block text-[10px] font-medium uppercase tracking-[0.18em] ${
              dark ? 'text-leaf-200/70' : 'text-leaf-700/70'
            }`}
          >
            Every farmer's companion
          </span>
        </span>
      )}
    </span>
  );
}
