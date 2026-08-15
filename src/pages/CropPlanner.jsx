import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function CropPlanner() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="cropPlanner" icon={TrendingUp} />
      <div className="text-center py-8 text-gray-400">
        <TrendingUp className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Plan your crops based on soil, weather, and market data</p>
        <p className="text-sm mt-2">Coming soon with AI recommendations</p>
      </div>
    </div>
  );
}
