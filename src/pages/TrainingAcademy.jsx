import React from 'react';
import { GraduationCap } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function TrainingAcademy() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="trainingAcademy" icon={GraduationCap} />
      <div className="text-center py-8 text-gray-400">Coming soon: Farming tutorials and courses</div>
    </div>
  );
}
