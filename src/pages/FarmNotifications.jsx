import React from 'react';
import { BellRing } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function FarmNotifications() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="farmNotifications" icon={BellRing} />
      <div className="text-center py-8 text-gray-400">Coming soon: Custom farm notifications and reminders</div>
    </div>
  );
}
