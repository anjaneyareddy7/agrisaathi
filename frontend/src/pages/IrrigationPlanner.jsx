import { useState, useEffect } from 'react';
import { Droplets, Plus, X, Check, Trash2, CalendarClock, History, Waves, Timer } from 'lucide-react';
import appClient from '../api/appClient';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const METHODS = ['drip', 'sprinkler', 'flood', 'furrow', 'rainfed'];
const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { plot_name: '', crop_name: '', session_date: '', duration_minutes: '', water_litres: '', method: 'drip', water_source: '', notes: '' };

export default function IrrigationPlanner() {
  const [farms, setFarms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    const [f, s] = await Promise.all([
      appClient.entities.Farm.list().catch(() => []),
      appClient.entities.IrrigationSession.list('-session_date', 100).catch(() => []),
    ]);
    setFarms(f); setSessions(s);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.plot_name || !form.session_date) return;
    await appClient.entities.IrrigationSession.create({
      ...form,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : undefined,
      water_litres: form.water_litres ? Number(form.water_litres) : undefined,
      status: 'scheduled',
    });
    setForm(EMPTY);
    setShowForm(false);
    load();
  };

  const markDone = async (id) => { await appClient.entities.IrrigationSession.update(id, { status: 'done' }); load(); };
  const remove = async (id) => { await appClient.entities.IrrigationSession.delete(id); load(); };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = sessions.filter((s) => s.status === 'scheduled' && s.session_date >= today);
  const past = sessions.filter((s) => s.status !== 'scheduled' || s.session_date < today);
  const totalWater = sessions.reduce((sum, s) => sum + (s.water_litres || 0), 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Irrigation Planner" subtitle="Schedule and log watering for every plot" icon={Droplets} />

      {/* Water hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-leaf-800 p-5 text-white shadow-md animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Upcoming sessions</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">{upcoming.length}</span>
          <span className="text-sm font-medium text-white/80">{upcoming.length === 1 ? 'session' : 'sessions'} scheduled</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Waves size={10} /> Water logged</p>
            <p className="mt-0.5 text-sm font-bold">{totalWater >= 1000 ? `${(totalWater / 1000).toFixed(1)}k L` : `${totalWater} L`}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Timer size={10} /> Total sessions</p>
            <p className="mt-0.5 text-sm font-bold">{sessions.length}</p>
          </div>
        </div>
      </div>

      {/* Add session */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Schedule irrigation
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New session</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Plot">
              <Select value={form.plot_name} onValueChange={(v) => {
                const f = farms.find((x) => x.plot_name === v);
                setForm({ ...form, plot_name: v, crop_name: f?.current_crop || '' });
              }}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue placeholder="Choose plot" /></SelectTrigger>
                <SelectContent>{farms.map((f) => <SelectItem key={f.id} value={f.plot_name}>{f.plot_name}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Crop"><Input className={inputCls} value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} placeholder="e.g. Cotton" /></FormField>
              <FormField label="Date"><Input className={inputCls} type="date" value={form.session_date} onChange={(e) => setForm({ ...form, session_date: e.target.value })} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Duration (min)"><Input className={inputCls} type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} placeholder="45" /></FormField>
              <FormField label="Water (litres)"><Input className={inputCls} type="number" value={form.water_litres} onChange={(e) => setForm({ ...form, water_litres: e.target.value })} placeholder="500" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Method">
                <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200 capitalize"><SelectValue /></SelectTrigger>
                  <SelectContent>{METHODS.map((m) => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Water source"><Input className={inputCls} value={form.water_source} onChange={(e) => setForm({ ...form, water_source: e.target.value })} placeholder="borewell / canal" /></FormField>
            </div>
            <button onClick={submit} className="mt-1 w-full rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800">
              Save session
            </button>
          </div>
        </div>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <SectionCard className="mb-4 animate-fade-up" icon={CalendarClock} title="Upcoming" tone="bg-cyan-100 text-cyan-700">
          <ul className="divide-y divide-gray-100">
            {upcoming.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><Droplets size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{s.plot_name} <span className="font-normal text-gray-400">· {s.crop_name || '—'}</span></p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · <span className="capitalize">{s.method}</span>
                    {s.water_litres ? ` · ${s.water_litres}L` : ''}{s.duration_minutes ? ` · ${s.duration_minutes}min` : ''}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => markDone(s.id)} title="Mark done"
                    className="rounded-lg p-2 text-leaf-600 transition-colors hover:bg-leaf-50"><Check size={16} /></button>
                  <button onClick={() => remove(s.id)} title="Delete"
                    className="rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* History */}
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"><History size={13} /> History</h3>
      {past.length === 0 ? (
        <EmptyState icon={Droplets} title="No past sessions" subtitle="Completed and past-dated sessions appear here." />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {past.map((s, i) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500"><Droplets size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{s.plot_name} <span className="font-normal text-gray-400">· {s.crop_name || '—'}</span></p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(s.session_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · <span className="capitalize">{s.method}</span>
                    {s.water_litres ? ` · ${s.water_litres}L` : ''}
                  </p>
                </div>
                <Badge className={s.status === 'done' ? 'bg-leaf-100 text-leaf-800 hover:bg-leaf-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                  {s.status === 'done' ? 'Done' : 'Missed'}
                </Badge>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
