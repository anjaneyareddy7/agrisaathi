import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function AgriHelper() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="helper" icon={MessageCircle} />
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">⚠️ {t('aiAssisted')}</p>
      <div className="text-center py-8 text-gray-400">Coming soon: AI-powered agricultural assistant</div>
    </div>
  );
}
