import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLang } from '../lib/i18n';

export default function PageHeader({ titleKey, title, icon: Icon }) {
  const navigate = useNavigate();
  const { t } = useLang();
  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => navigate(-1)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        aria-label={t('back')}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 text-green-700" />}
        {title || t(titleKey)}
      </h1>
    </div>
  );
}
