import React from 'react';
import { Bell } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function AlertsCenter() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="alertsCenter" icon={Bell} />
      <div className="text-center py-8 text-gray-400">Coming soon: All your farm alerts in one place</div>
    </div>
  );
}
