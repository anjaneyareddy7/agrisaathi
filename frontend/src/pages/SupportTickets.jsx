import { useState, useEffect, useCallback } from 'react';
import { LifeBuoy, Plus, X, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const CATEGORIES = ['Technical issue', 'Account', 'Feature request', 'Bug report', 'Other'];
const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function SupportTickets() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subject: '', category: 'Technical issue', description: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/support_ticket/${deviceId}`);
      setBlocks(res.data.blocks || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.subject || !form.description) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'support_ticket',
        entity_id: deviceId,
        event_type: 'ticket_created',
        payload: { subject: form.subject, category: form.category, description: form.description, status: 'open' },
        actor: deviceId,
      });
      setForm({ subject: '', category: 'Technical issue', description: '' });
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const tickets = [...blocks].reverse();
  const open = tickets.filter((t) => (t.payload?.status || 'open') !== 'resolved');

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Support Tickets" subtitle="Report an issue or ask for help — every ticket is tracked" icon={LifeBuoy} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Open tickets</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{open.length}</p>
            <p className="mt-2 text-xs text-white/70">{tickets.length - open.length} resolved</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><LifeBuoy size={24} /></span>
        </div>
      </div>

      {/* New ticket */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> New ticket
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New ticket</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Subject">
              <Input className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Short summary of the issue" />
            </FormField>
            <FormField label="Category">
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField label="Description">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What went wrong, and what did you expect?" rows={4}
                className="rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
            </FormField>
            <button onClick={submit} disabled={saving || !form.subject || !form.description}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {saving && <Loader2 size={15} className="animate-spin" />} Submit ticket
            </button>
          </div>
        </div>
      )}

      {/* Tickets */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[96px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState icon={LifeBuoy} title="No tickets yet" subtitle="Raise one above if you run into a problem." />
      ) : (
        <SectionCard title="Your tickets" icon={LifeBuoy}>
          <ul className="divide-y divide-gray-100">
            {tickets.map((b, i) => {
              const resolved = b.payload?.status === 'resolved';
              return (
                <li key={b.index} className="px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900">{b.payload?.subject}</p>
                    <span className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${resolved ? 'bg-leaf-100 text-leaf-800' : 'bg-amber-100 text-amber-800'}`}>
                      {resolved ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                      {b.payload?.status || 'open'}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {b.payload?.category} · {new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{b.payload?.description}</p>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
