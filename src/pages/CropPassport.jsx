import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function CropPassport() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="cropPassport" icon={ShieldCheck} />
      <div className="text-center py-8 text-gray-400">
        <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Blockchain-based crop tracking from seed to sale</p>
        <p className="text-sm mt-2">Coming soon with blockchain integration</p>
      </div>
    </div>
  );
}
