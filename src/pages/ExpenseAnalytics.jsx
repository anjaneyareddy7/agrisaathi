import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ExpenseAnalytics() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="expenseAnalytics" icon={BarChart3} />
      <div className="text-center py-8 text-gray-400">Coming soon: Expense analytics and insights</div>
    </div>
  );
}
