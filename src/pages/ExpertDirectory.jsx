import React from 'react';
import { UserCheck } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ExpertDirectory() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="expertDirectory" icon={UserCheck} />
      <div className="text-center py-8 text-gray-400">Coming soon: Connect with agricultural experts</div>
    </div>
  );
}
