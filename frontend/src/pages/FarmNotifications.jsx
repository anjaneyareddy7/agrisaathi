import { useState, useEffect, useCallback } from 'react';
import { BellRing, Plus, X, CheckCircle2, Circle, CalendarClock, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Input } from '../components/ui/input';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function FarmNotifications() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', due_date: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/farm_notification/${deviceId}`);
      setBlocks(res.data.blocks || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.title || !form.due_date) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'farm_notification',
        entity_id: deviceId,
        event_type: 'reminder_created',
        payload: { ...form, done: false },
        actor: deviceId,
      });
      setForm({ title: '', due_date: '' });
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const markDone = async (title, due_date) => {
    await axios.post(`${API_URL}/api/ledger/log`, {
      entity_type: 'farm_notification',
      entity_id: deviceId,
      event_type: 'reminder_completed',
      payload: { title, due_date, done: true },
      actor: deviceId,
    });
    await load();
  };

  const latestByReminder = {};
  [...blocks].reverse().forEach((b) => {
    const key = `${b.payload?.title}__${b.payload?.due_date}`;
    if (key && !latestByReminder[key]) latestByReminder[key] = b;
  });
  const reminders = Object.values(latestByReminder).sort((a, b) => (a.payload.due_date || '').localeCompare(b.payload.due_date || ''));
  const pending = reminders.filter((r) => !r.payload.done);
  const done = reminders.filter((r) => r.payload.done);
  const nextDue = pending[0];
  const overdue = (d) => d && new Date(d) < new Date(new Date().toDateString());

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Farm Reminders" subtitle="Spraying, harvest, vaccination — never miss a date" icon={BellRing} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Pending reminders</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{pending.length}</p>
            {nextDue && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-white/80">
                <CalendarClock size={12} />
                Next: {nextDue.payload.title} · {new Date(nextDue.payload.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            )}
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><BellRing size={24} /></span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`rounded-2xl px-3 py-2.5 ${pending.some((r) => overdue(r.payload.due_date)) ? 'bg-red-400/25' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Overdue</p>
            <p className="mt-0.5 text-sm font-bold">{pending.filter((r) => overdue(r.payload.due_date)).length}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Completed</p>
            <p className="mt-0.5 text-sm font-bold">{done.length}</p>
          </div>
        </div>
      </div>

      {/* Add reminder */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> New reminder
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New reminder</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Reminder">
              <Input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Spray fungicide on plot 2" />
            </FormField>
            <FormField label="Due date">
              <Input className={inputCls} type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </FormField>
            <button onClick={submit} disabled={saving || !form.title || !form.due_date}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {saving && <Loader2 size={15} className="animate-spin" />} Save reminder
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[60px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : reminders.length === 0 ? (
        <EmptyState icon={BellRing} title="No reminders set" subtitle="Add one above — it stays logged and verifiable on your device." />
      ) : (
        <SectionCard title={pending.length > 0 ? 'To do' : 'All done'} icon={BellRing}>
          <ul className="divide-y divide-gray-100">
            {reminders.map((b, i) => (
              <li key={`${b.payload.title}-${b.payload.due_date}`} className={`animate-slide-in ${b.payload.done ? 'opacity-50' : ''}`} style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <button onClick={() => !b.payload.done && markDone(b.payload.title, b.payload.due_date)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50">
                  {b.payload.done
                    ? <CheckCircle2 size={20} className="shrink-0 text-leaf-600" />
                    : <Circle size={20} className="shrink-0 text-gray-300" />}
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-semibold ${b.payload.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{b.payload.title}</p>
                    <p className={`mt-0.5 text-[11px] font-medium ${!b.payload.done && overdue(b.payload.due_date) ? 'text-red-500' : 'text-gray-400'}`}>
                      {new Date(b.payload.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {!b.payload.done && overdue(b.payload.due_date) && ' · overdue'}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
