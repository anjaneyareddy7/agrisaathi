import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bug, Syringe, ChevronDown } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';

const TYPE_STYLES = {
  pest: 'bg-red-100 text-red-600',
  disease: 'bg-amber-100 text-amber-700',
  weed: 'bg-lime-100 text-lime-700',
};

export default function PestLibrary() {
  const [items, setItems] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [tab, setTab] = useState('crop');
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const [disclaimer, setDisclaimer] = useState('');

  useEffect(() => {
    axios.get('/api/pest-library')
      .then((res) => { setItems(res.data.items || []); setDisclaimer(res.data.disclaimer || ''); })
      .catch(() => setItems([]));
    axios.get('/api/pest-library/livestock-vaccines')
      .then((res) => setVaccines(res.data.items || []))
      .catch(() => setVaccines([]));
  }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.type === filter);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Pest Library" icon={Bug} subtitle="Know the enemy — identify and manage" />

      {/* Tabs */}
      <div className="flex animate-fade-up gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5">
        {[
          { id: 'crop', label: 'Crop pests & diseases', icon: Bug },
          { id: 'livestock', label: 'Livestock vaccines', icon: Syringe },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all active:scale-95 ${
              tab === id ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {tab === 'crop' ? (
        <>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {['all', 'pest', 'disease', 'weed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium capitalize transition-all active:scale-95 ${
                  filter === f ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
              <EmptyState icon={Bug} title="No entries found" subtitle="Library data is unavailable right now." />
            </div>
          ) : (
            <div className="mt-3 space-y-2.5">
              {filtered.map((p, i) => {
                const isOpen = open === i;
                return (
                  <div key={i} className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                    <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TYPE_STYLES[p.type] || 'bg-gray-100 text-gray-600'}`}>
                        <Bug size={17} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-gray-900">{p.name}</span>
                        <span className="block truncate text-xs text-gray-400">Affects: {p.affects}</span>
                      </span>
                      <ChevronDown size={16} className={`shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="space-y-2.5 border-t border-gray-100 px-4 py-3.5">
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Symptoms</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{p.symptoms}</p>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Management</p>
                            <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{p.management}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="mt-4 space-y-2.5">
          {vaccines.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <EmptyState icon={Syringe} title="No vaccine data" subtitle="Livestock vaccine schedules are unavailable right now." />
            </div>
          ) : vaccines.map((v, i) => (
            <div key={i} className="flex animate-fade-up items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <Syringe size={17} />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{v.disease}</p>
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600">{v.species}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500"><span className="font-semibold text-gray-700">Vaccine:</span> {v.vaccine}</p>
                <p className="mt-0.5 text-xs text-gray-500"><span className="font-semibold text-gray-700">Schedule:</span> {v.schedule}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {disclaimer && <p className="mt-4 text-[10px] leading-relaxed text-gray-300">{disclaimer}</p>}
    </div>
  );
}
