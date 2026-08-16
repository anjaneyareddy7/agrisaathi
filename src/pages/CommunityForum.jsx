import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function CommunityForum() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="communityForum" icon={MessageSquare} />
      <div className="text-center py-8 text-gray-400">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p>Connect with fellow farmers and share knowledge</p>
        <p className="text-sm mt-2">Coming soon with community features</p>
      </div>
    </div>
  );
}
