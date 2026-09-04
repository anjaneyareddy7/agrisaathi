import { useState, useEffect } from 'react';
import { Stethoscope, Plus, Check, Calendar, Wheat, HeartPulse, Syringe, X } from 'lucide-react';
import appClient from '../api/appClient';
import axios from 'axios';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { SectionCard, FormField } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const CARE_TYPES = ['feed', 'health', 'milestone', 'vaccination'];

const CARE_META = {
  feed: { label: 'Feed', icon: Wheat, tone: 'bg-blue-100 text-blue-700' },
  health: { label: 'Health', icon: HeartPulse, tone: 'bg-rose-100 text-rose-700' },
  milestone: { label: 'Milestone', icon: Calendar, tone: 'bg-violet-100 text-violet-700' },
  vaccination: { label: 'Vaccination', icon: Syringe, tone: 'bg-teal-100 text-teal-700' },
};

export default function LivestockCare() {
  const [types, setTypes] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ animal_type: '', care_type: 'feed', title: '', scheduled_date: '', notes: '' });

  const load = async () => {
    const [tpRes, lg] = await Promise.all([
      axios.get(`${API_URL}/api/livestock-types`).catch(() => ({ data: [] })),
      appClient.entities.LivestockCareLog.list('-scheduled_date').catch(() => []),
    ]);
    setTypes(tpRes.data);
    setLogs(lg);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.animal_type || !form.title) { alert('Animal and title are required'); return; }
    const tp = types.find((x) => x.name_en === form.animal_type);
    await appClient.entities.LivestockCareLog.create({
      animal_type: form.animal_type, category: tp?.category || '', care_type: form.care_type,
      title: form.title, scheduled_date: form.scheduled_date || undefined,
      status: 'pending', notes: form.notes || undefined,
    });
    axios.post(`${API_URL}/api/ledger/log`, {
      entity_type: 'livestock_care', entity_id: form.animal_type,
      event_type: 'care_logged', payload: { care_type: form.care_type, title: form.title },
    }).catch(() => {});
    setForm({ animal_type: '', care_type: 'feed', title: '', scheduled_date: '', notes: '' });
    setShowAdd(false);
    load();
  };

  const markDone = async (log) => {
    await appClient.entities.LivestockCareLog.update(log.id, { status: 'done', completed_date: new Date().toISOString().slice(0, 10) });
    axios.post(`${API_URL}/api/ledger/log`, {
      entity_type: 'livestock_care', entity_id: log.animal_type,
      event_type: 'care_completed', payload: { title: log.title },
    }).catch(() => {});
    load();
  };

  const pending = logs.filter((l) => l.status === 'pending');
  const done = logs.filter((l) => l.status === 'done');
  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Livestock Care" icon={Stethoscope} subtitle="Feeds, health checks and vaccinations" />

      {/* Stat tiles */}
      <div className="grid animate-fade-up grid-cols-3 gap-2.5">
        {['feed', 'health', 'vaccination'].map((c, i) => {
          const meta = CARE_META[c];
          const count = logs.filter((l) => l.care_type === c).length;
          return (
            <div key={c} className="rounded-2xl border border-gray-200 bg-white p-3.5 text-center shadow-sm" style={{ animationDelay: `${i * 60}ms` }}>
              <span className={`mx-auto flex h-9 w-9 items-center justify-center rounded-xl ${meta.tone}`}>
                <meta.icon size={16} />
              </span>
              <p className="mt-2 text-xl font-bold text-gray-900">{count}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{meta.label}</p>
            </div>
          );
        })}
      </div>

      {/* Add button / form */}
      {showAdd ? (
        <div className="mt-4 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Log care entry</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            <FormField label="Animal">
              <Select value={form.animal_type} onValueChange={(v) => setForm({ ...form, animal_type: v })}>
                <SelectTrigger><SelectValue placeholder="Choose animal" /></SelectTrigger>
                <SelectContent className="max-h-72">{types.map((a) => <SelectItem key={a.id} value={a.name_en}>{a.name_en} · {a.category}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Care type">
                <Select value={form.care_type} onValueChange={(v) => setForm({ ...form, care_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CARE_TYPES.map((c) => <SelectItem key={c} value={c}>{CARE_META[c].label}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Date">
                <input type="date" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className={inputCls} />
              </FormField>
            </div>
            <FormField label="Title">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Morning feed, FMD vaccine" className={inputCls} />
            </FormField>
            <FormField label="Notes">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional notes…" className={`${inputCls} resize-none`} />
            </FormField>
            <div className="flex gap-2">
              <Button onClick={add} className="flex-1">Save entry</Button>
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-all hover:bg-leaf-50 active:scale-[0.98]"
        >
          <Plus size={15} /> Add care entry
        </button>
      )}

      {/* Pending */}
      <div className="mt-6">
        <h2 className="mb-2.5 flex items-baseline gap-2 text-sm font-semibold text-gray-900">
          Pending <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">{pending.length}</span>
        </h2>
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
            All caught up — no pending care items.
          </div>
        ) : (
          <div className="space-y-2.5">
            {pending.map((l, i) => {
              const meta = CARE_META[l.care_type] || CARE_META.feed;
              return (
                <div key={l.id} className="flex animate-fade-up items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}>
                    <meta.icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.tone}`}>{meta.label}</span>
                      <span className="text-xs text-gray-400">{l.animal_type}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">{l.title}</p>
                    {l.scheduled_date && <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-gray-400"><Calendar size={11} /> {l.scheduled_date}</p>}
                    {l.notes && <p className="mt-0.5 text-xs text-gray-500">{l.notes}</p>}
                  </div>
                  <button
                    onClick={() => markDone(l)} aria-label="Mark done"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-white shadow-sm transition-all hover:bg-leaf-700 active:scale-90"
                  >
                    <Check size={15} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Done */}
      {done.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2.5 text-sm font-semibold text-gray-500">Completed</h2>
          <SectionCard>
            <ul className="divide-y divide-gray-100">
              {done.map((l) => {
                const meta = CARE_META[l.care_type] || CARE_META.feed;
                return (
                  <li key={l.id} className="flex items-center gap-3 px-4 py-2.5 opacity-60">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                      <meta.icon size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-gray-500 line-through">{l.title}</span>
                      <span className="block text-[11px] text-gray-400">{l.animal_type}{l.completed_date ? ` · done ${l.completed_date}` : ''}</span>
                    </span>
                    <Check size={14} className="shrink-0 text-leaf-500" />
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
