/**
 * AgriSaathi page kit — shared building blocks that give every feature
 * page a consistent, designed interface.
 */
import { Link } from 'react-router-dom';
import { ChevronRight, Inbox } from 'lucide-react';

/** Titled section wrapper used across detail pages. */
export function SectionCard({ icon: Icon, title, action, children, className = '', tone = 'bg-gray-100 text-gray-600' }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3">
          {Icon && (
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone}`}>
              <Icon size={14} strokeWidth={2} />
            </span>
          )}
          <h2 className="flex-1 text-sm font-semibold text-gray-900">{title}</h2>
          {action}
        </div>
      )}
      <div>{children}</div>
    </section>
  );
}

/** Small metric tile. */
export function StatTile({ icon: Icon, label, value, hint, tone = 'bg-leaf-100 text-leaf-700' }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
        {Icon && <Icon size={17} strokeWidth={2} />}
      </span>
      <p className="mt-2.5 text-xl font-bold leading-tight text-gray-900">{value}</p>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

/** Consistent list row with icon, two lines and an optional trailing slot. */
export function ListRow({ icon: Icon, title, subtitle, trailing, to, onClick, tone = 'bg-gray-100 text-gray-600' }) {
  const inner = (
    <>
      {Icon && (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={17} strokeWidth={2} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-gray-900">{title}</span>
        {subtitle && <span className="block truncate text-xs text-gray-400">{subtitle}</span>}
      </span>
      {trailing ?? <ChevronRight size={16} className="shrink-0 text-gray-300" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 active:bg-gray-100">
        {inner}
      </Link>
    );
  }
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 ${onClick ? 'cursor-pointer transition-colors hover:bg-gray-50' : ''}`}>
      {inner}
    </div>
  );
}

/** Friendly empty state. */
export function EmptyState({ icon, title, subtitle, action }) {
  const Icon = icon || Inbox;
  return (
    <div className="px-6 py-12 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <p className="mt-3 text-sm font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="mx-auto mt-1 max-w-xs text-xs text-gray-400">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Standard form field wrapper. */
export function FormField({ label, hint, children }) {
  return (
    <label className="block">
      {label && <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>}
      {children}
      {hint && <span className="mt-1 block text-[11px] text-gray-400">{hint}</span>}
    </label>
  );
}
