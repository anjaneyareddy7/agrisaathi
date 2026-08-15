import React from 'react';
import { Package } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function InventoryTracker() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="inventoryTracker" icon={Package} />
      <div className="text-center py-8 text-gray-400">Coming soon: Track your farm inventory</div>
    </div>
  );
}
