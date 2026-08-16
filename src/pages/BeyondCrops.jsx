import React from 'react';
import { Stethoscope } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function BeyondCrops() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="beyondCrops" icon={Stethoscope} />
      <div className="text-center py-8 text-gray-400">
        <Stethoscope className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Livestock, poultry, and fisheries management</p>
        <p className="text-sm mt-2">Coming soon with AI health monitoring</p>
      </div>
    </div>
  );
}
