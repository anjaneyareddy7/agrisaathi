import React from 'react';
import { FileDown } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ExportReports() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="exportReports" icon={FileDown} />
      <div className="text-center py-8 text-gray-400">Coming soon: Export farm reports</div>
    </div>
  );
}
