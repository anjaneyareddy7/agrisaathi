import React from 'react';
import { Leaf } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SustainabilityScore() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="sustainabilityScore" icon={Leaf} />
      <div className="text-center py-8 text-gray-400">Coming soon: Your farm's sustainability score</div>
    </div>
  );
}
