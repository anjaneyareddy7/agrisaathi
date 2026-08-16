import React from 'react';
import { ListTodo } from 'lucide-react';
import { useLang } from '../lib/i18n';
import PageHeader from '../components/PageHeader';

export default function TaskManager() {
  const { t } = useLang();
  return (
    <div>
      <PageHeader titleKey="taskManager" icon={ListTodo} />
      <div className="text-center py-8 text-gray-400">Coming soon: Task management for your farm</div>
    </div>
  );
}
