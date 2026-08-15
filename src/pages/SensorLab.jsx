import React from 'react';
import { FlaskConical } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function SensorLab() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="sensorLab" icon={FlaskConical} />
      <div className="text-center py-8 text-gray-400">
        <FlaskConical className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Connect soil and water sensors for real-time monitoring</p>
        <p className="text-sm mt-2">Coming soon with IoT integration</p>
      </div>
    </div>
  );
}
