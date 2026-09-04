import { Users, Sprout, Stethoscope, GraduationCap, Landmark, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const EXPERT_TYPES = [
  { icon: Sprout, tone: 'bg-leaf-100 text-leaf-700', title: 'Agronomist', description: 'Crop disease, fertilizer & soil advice', helpline: '1800-180-1551', hours: 'Mon–Sat, 6am–10pm' },
  { icon: Stethoscope, tone: 'bg-rose-100 text-rose-700', title: 'Veterinarian', description: 'Livestock, poultry & fish health', helpline: '1962', hours: 'Emergency, 24×7' },
  { icon: GraduationCap, tone: 'bg-violet-100 text-violet-700', title: 'KVK Expert', description: 'Krishi Vigyan Kendra farm scientist near you', helpline: null, hours: null, to: '/near-me' },
  { icon: Landmark, tone: 'bg-blue-100 text-blue-700', title: 'Agriculture Officer', description: 'Schemes, insurance & subsidies', helpline: '1800-180-1551', hours: 'Mon–Sat, 9am–6pm' },
];

export default function ExpertDirectory() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Expert Directory" icon={Users} subtitle="Reach the right expert for your problem" />

      {/* Hero strip */}
      <div className="animate-fade-up rounded-2xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-5 text-white shadow-sm">
        <p className="text-lg font-semibold leading-snug">Free expert help, one call away</p>
        <p className="mt-1 text-sm leading-relaxed text-leaf-100/85">
          Government helplines connect you to real agronomists and vets — at no cost.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {EXPERT_TYPES.map((e, i) => {
          const Card = e.to ? Link : 'div';
          return (
            <Card
              key={e.title}
              {...(e.to ? { to: e.to } : {})}
              className="flex animate-fade-up items-center gap-3.5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-leaf-300 hover:shadow-md active:scale-[0.99]"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${e.tone}`}>
                <e.icon size={20} strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900">{e.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-gray-500">{e.description}</p>
                {e.hours && (
                  <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={11} /> {e.hours}
                  </p>
                )}
              </div>
              {e.helpline ? (
                <a
                  href={`tel:${e.helpline}`}
                  aria-label={`Call ${e.title}`}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white shadow-sm transition-all hover:bg-leaf-700 active:scale-90"
                >
                  <Phone size={17} />
                </a>
              ) : (
                e.to && (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <MapPin size={17} />
                  </span>
                )
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-gray-400">
        Kisan Call Center: 1800-180-1551 · Veterinary emergency: 1962
      </p>
    </div>
  );
}
