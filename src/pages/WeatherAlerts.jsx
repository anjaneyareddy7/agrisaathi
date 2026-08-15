import React from 'react';
import { CloudRain } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function WeatherAlerts() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="weatherAlerts" icon={CloudRain} />
      <div className="text-center py-8 text-gray-400">Coming soon: Weather alerts and forecasts</div>
    </div>
  );
}
