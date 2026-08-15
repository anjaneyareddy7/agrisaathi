import React from 'react';
import { Tractor } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ResourceMarketplace() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="resourceMarketplace" icon={Tractor} />
      <div className="text-center py-8 text-gray-400">Coming soon: Find farm equipment and resources</div>
    </div>
  );
}
