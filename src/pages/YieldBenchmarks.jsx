import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function YieldBenchmarks() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="yieldBenchmarks" icon={BarChart3} />
      <div className="text-center py-8 text-gray-400">Coming soon: Compare your yields with benchmarks</div>
    </div>
  );
}
