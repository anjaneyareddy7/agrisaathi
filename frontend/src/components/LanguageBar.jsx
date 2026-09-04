import { useLang } from '../lib/i18n';
import { INDIAN_LANGUAGES } from '../lib/indianLanguages';
import { Languages } from 'lucide-react';

/**
 * Slim language switcher strip — sits at the top of the Home page.
 * Scrolls horizontally through all 22 official Indian languages,
 * shown in their native script. Selection applies instantly.
 */
export default function LanguageBar() {
  const { lang, setLang } = useLang();
  const current = INDIAN_LANGUAGES.find((l) => l.code === lang);

  return (
    <div className="animate-fade-up flex items-center gap-2.5">
      <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-gray-500">
        <Languages size={15} className="text-leaf-600" />
        <span className="hidden sm:inline">{current ? current.label : 'Language'}</span>
      </span>
      <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {INDIAN_LANGUAGES.map((l) => {
          const active = l.code === lang;
          return (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              aria-pressed={active}
              aria-label={l.label}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                active
                  ? 'animate-pop border-leaf-600 bg-leaf-600 text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-leaf-400 hover:text-leaf-700'
              }`}
            >
              {l.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
