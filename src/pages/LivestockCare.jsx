import React from 'react';
import { Leaf } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function LivestockCare() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="livestockCare" icon={Leaf} />
      <div className="text-center py-8 text-gray-400">
        <Leaf className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Track animal health, vaccination, and feeding schedules</p>
        <p className="text-sm mt-2">Coming soon with AI health monitoring</p>
      </div>
    </div>
  );
}
