export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#16a34a" />
      <path d="M32 50c0-12 0-18 0-24" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M32 30c-1.5-8-7-13-16-14 1 10 6.5 15 16 14Z" fill="#ffffff" />
      <path d="M32 34c1.5-8 7-13 16-14-1 10-6.5 15-16 14Z" fill="#bbf7d0" />
    </svg>
  );
}

export default function Logo({ dark = false, compact = false }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={compact ? 'h-7 w-7' : 'h-8 w-8'} />
      <span
        className={`text-[17px] font-semibold tracking-tight ${
          dark ? 'text-white' : 'text-gray-900'
        }`}
      >
        Agri<span className="text-leaf-600">Saathi</span>
      </span>
    </span>
  );
}
