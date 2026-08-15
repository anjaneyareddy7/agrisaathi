import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function TrainingCenter() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="trainingCenter" icon={GraduationCap} />
      <div className="text-center py-8 text-gray-400">Coming soon: Training videos and guides</div>
    </div>
  );
}
