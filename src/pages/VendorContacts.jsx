import React from 'react';
import { Contact } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function VendorContacts() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="vendorContacts" icon={Contact} />
      <div className="text-center py-8 text-gray-400">Coming soon: Manage your vendor contacts</div>
    </div>
  );
}
