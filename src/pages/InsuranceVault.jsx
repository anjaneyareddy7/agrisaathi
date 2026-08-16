import React from 'react';
import { ShieldPlus } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function InsuranceVault() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="insuranceVault" icon={ShieldPlus} />
      <div className="text-center py-8 text-gray-400">Coming soon: Insurance policy vault</div>
    </div>
  );
}
