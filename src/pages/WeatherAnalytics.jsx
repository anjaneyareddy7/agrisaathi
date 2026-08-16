import React from 'react';
import { CloudRain } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function WeatherAnalytics() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="weatherAnalytics" icon={CloudRain} />
      <div className="text-center py-8 text-gray-400">Coming soon: Historical weather data analytics</div>
    </div>
  );
}
