import React from 'react';
import { ShieldPlus } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function InsuranceHub() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="insuranceHub" icon={ShieldPlus} />
      <div className="text-center py-8 text-gray-400">Coming soon: Crop insurance management</div>
    </div>
  );
}
