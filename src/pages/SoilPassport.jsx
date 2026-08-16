import React from 'react';
import { Sprout } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SoilPassport() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="soilPassport" icon={Sprout} />
      <div className="text-center py-8 text-gray-400">
        <Sprout className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Track your soil health records and test results</p>
        <p className="text-sm mt-2">Coming soon with blockchain verification</p>
      </div>
    </div>
  );
}
