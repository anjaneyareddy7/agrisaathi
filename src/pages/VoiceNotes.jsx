import React from 'react';
import { Mic } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function VoiceNotes() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="voiceNotes" icon={Mic} />
      <div className="text-center py-8 text-gray-400">
        <Mic className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Record voice notes for quick farm updates</p>
        <p className="text-sm mt-2">Coming soon with voice-to-text</p>
      </div>
    </div>
  );
}
