import React from 'react';
import { Activity } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SensorHub() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="sensorHub" icon={Activity} />
      <div className="text-center py-8 text-gray-400">Coming soon: Soil sensor data hub</div>
    </div>
  );
}
