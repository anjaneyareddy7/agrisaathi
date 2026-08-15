import React from 'react';
import { Store } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function InputMarketplace() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="inputMarketplace" icon={Store} />
      <div className="text-center py-8 text-gray-400">Coming soon: Find farm input suppliers</div>
    </div>
  );
}
