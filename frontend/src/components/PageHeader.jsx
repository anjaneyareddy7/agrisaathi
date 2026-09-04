import { useLang } from '../lib/i18n';

export default function PageHeader({ titleKey, title, icon: Icon, subtitle }) {
  const { t } = useLang();
  const displayTitle = title || (t ? t(titleKey) : titleKey);

  return (
    <div className="mb-5 flex items-center gap-4 pt-6">
      {Icon && (
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-500 to-leaf-800 text-white shadow-soft">
          <Icon className="h-[22px] w-[22px]" strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-semibold tracking-tight text-leaf-950">
          {displayTitle}
        </h1>
        {subtitle && <p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
