import { useLang } from '../lib/i18n';

/** camelCase / keys → readable title, e.g. "soilPassport" → "Soil Passport" */
function prettifyKey(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

export default function PageHeader({ titleKey, title, icon: Icon, subtitle }) {
  const { t } = useLang();
  const translated = t ? t(titleKey, titleKey) : titleKey;
  // If the dictionary has no entry, t() hands back the key — prettify it.
  const displayTitle = title || (translated && translated !== titleKey ? translated : prettifyKey(titleKey || ''));

  return (
    <div className="mb-5 flex items-center gap-3 pt-2">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-700">
          <Icon className="h-[21px] w-[21px]" strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-gray-900">{displayTitle}</h1>
        {subtitle && <p className="mt-0.5 truncate text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}
