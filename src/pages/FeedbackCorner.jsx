import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function FeedbackCorner() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="feedbackCorner" icon={MessageSquare} />
      <div className="text-center py-8 text-gray-400">Coming soon: Submit your feedback</div>
    </div>
  );
}
