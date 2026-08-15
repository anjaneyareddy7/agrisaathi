import React from 'react';
import { User } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function ProfileSettings() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="profileSettings" icon={User} />
      <div className="text-center py-8 text-gray-400">
        <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Manage your profile and farm settings</p>
        <p className="text-sm mt-2">Coming soon with full profile management</p>
      </div>
    </div>
  );
}
