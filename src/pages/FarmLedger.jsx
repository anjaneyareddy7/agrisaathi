import React from 'react';
import { Wallet } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function FarmLedger() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="farmLedger" icon={Wallet} />
      <div className="text-center py-8 text-gray-400">
        <Wallet className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Track your farm expenses and revenue</p>
        <p className="text-sm mt-2">Coming soon with full accounting features</p>
      </div>
    </div>
  );
}
