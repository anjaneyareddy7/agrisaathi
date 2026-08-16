import React from 'react';
import { LifeBuoy } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SupportTickets() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="supportTickets" icon={LifeBuoy} />
      <div className="text-center py-8 text-gray-400">Coming soon: Support ticket system</div>
    </div>
  );
}
