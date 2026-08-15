import React from 'react';
import { Droplets } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function Fertilize() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="fertilize" icon={Droplets} />
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
        <p className="text-sm text-amber-700">⚠️ AI-powered fertilizer recommendations coming soon</p>
      </div>
      <div className="text-center py-8 text-gray-400">
        <Droplets className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Get personalized fertilizer recommendations based on your soil and crop</p>
        <p className="text-sm mt-2">Coming soon with AI integration</p>
      </div>
    </div>
  );
}
