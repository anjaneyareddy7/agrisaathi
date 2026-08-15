import React from 'react';
import { Banknote } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function LoanEligibility() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="loanEligibility" icon={Banknote} />
      <div className="text-center py-8 text-gray-400">
        <Banknote className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Check your eligibility for farm loans</p>
        <p className="text-sm mt-2">Coming soon with AI eligibility checker</p>
      </div>
    </div>
  );
}
