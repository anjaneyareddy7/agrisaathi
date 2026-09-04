import { Link } from 'react-router-dom';
import { Scale, BarChart3 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';
import { Button } from '../components/ui/button';

export default function YieldBenchmarks() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Yield Benchmarks" icon={BarChart3} subtitle="Compare your harvest with district averages" />
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={Scale}
          title="Yield benchmarks are on the way"
          subtitle="See how your harvest compares with other farmers in your district — arriving soon."
          action={<Link to="/"><Button variant="outline">Back to home</Button></Link>}
        />
      </div>
    </div>
  );
}
