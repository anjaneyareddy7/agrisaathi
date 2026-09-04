import { useLang } from '../lib/i18n';

export default function PageHeader({ titleKey, title, icon: Icon, subtitle }) {
  const { t } = useLang();
  const displayTitle = title || (t ? t(titleKey) : titleKey);

  return (
    <div className="mb-5 flex items-center gap-3 pt-6">
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-gray-900">{displayTitle}</h1>
        {subtitle && <p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
