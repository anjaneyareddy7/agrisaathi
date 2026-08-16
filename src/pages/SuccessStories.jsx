import React from 'react';
import { Trophy } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SuccessStories() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="successStories" icon={Trophy} />
      <div className="text-center py-8 text-gray-400">Coming soon: Success stories from fellow farmers</div>
    </div>
  );
}
