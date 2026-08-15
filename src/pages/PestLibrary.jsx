import React from 'react';
import { Bug } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function PestLibrary() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="pestLibrary" icon={Bug} />
      <div className="text-center py-8 text-gray-400">Coming soon: Pest identification and treatment library</div>
    </div>
  );
}
