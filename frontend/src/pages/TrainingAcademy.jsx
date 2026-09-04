import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';
import { Button } from '../components/ui/button';

export default function TrainingAcademy() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Training Academy" icon={GraduationCap} subtitle="Structured courses for modern farming" />
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={GraduationCap}
          title="Training Academy is coming soon"
          subtitle="Short courses on seeds, soil, pests and markets — taught in your language."
          action={<Link to="/training-center"><Button variant="outline">Visit training center</Button></Link>}
        />
      </div>
    </div>
  );
}
