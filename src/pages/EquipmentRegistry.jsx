import React from 'react';
import { Tractor } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function EquipmentRegistry() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="equipmentRegistry" icon={Tractor} />
      <div className="text-center py-8 text-gray-400">Coming soon: Equipment registry and maintenance</div>
    </div>
  );
}
