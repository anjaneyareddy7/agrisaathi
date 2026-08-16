import React from 'react';
import { FolderArchive } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function DocumentWallet() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="documentWallet" icon={FolderArchive} />
      <div className="text-center py-8 text-gray-400">Coming soon: Store your farm documents</div>
    </div>
  );
}
