import React from 'react';
import { Landmark } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function GovernmentSchemes() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="govSchemes" icon={Landmark} />
      <div className="text-center py-8 text-gray-400">
        <Landmark className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Find government schemes and check eligibility</p>
        <p className="text-sm mt-2">Coming soon with AI eligibility checker</p>
      </div>
    </div>
  );
}
