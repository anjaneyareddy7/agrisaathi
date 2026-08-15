import React from 'react';
import { Calculator } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function LoanCalculator() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="loanCalculator" icon={Calculator} />
      <div className="text-center py-8 text-gray-400">Coming soon: Loan EMI calculator</div>
    </div>
  );
}
