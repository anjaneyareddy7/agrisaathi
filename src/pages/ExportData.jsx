import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ExportData() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="exportData" icon={FileSpreadsheet} />
      <div className="text-center py-8 text-gray-400">Coming soon: Export your farm data</div>
    </div>
  );
}
