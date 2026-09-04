import { useState, useEffect, useCallback } from 'react';
import { Wrench, Plus, X, AlertTriangle, Tractor, Loader2, Wrench as WrenchIcon } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Input } from '../components/ui/input';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { name: '', type: '', last_maintenance: '', next_maintenance: '' };

export default function EquipmentRegistry() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/equipment/${deviceId}`);
      setBlocks(res.data.blocks || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'equipment',
        entity_id: deviceId,
        event_type: 'equipment_registered',
        payload: form,
        actor: deviceId,
      });
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const latestByName = {};
  [...blocks].reverse().forEach((b) => {
    const name = b.payload?.name;
    if (name && !latestByName[name]) latestByName[name] = b;
  });
  const equipment = Object.values(latestByName);
  const today = new Date().toISOString().slice(0, 10);
  const due = equipment.filter((e) => e.payload.next_maintenance && e.payload.next_maintenance <= today);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Equipment Registry" subtitle="Track machinery and its maintenance schedule" icon={Wrench} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Machines registered</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{equipment.length}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Tractor size={24} /></span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`rounded-2xl px-3 py-2.5 ${due.length ? 'bg-red-400/25' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Service due</p>
            <p className="mt-0.5 text-sm font-bold">{due.length}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Up to date</p>
            <p className="mt-0.5 text-sm font-bold">{equipment.length - due.length}</p>
          </div>
        </div>
      </div>

      {due.length > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-up">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200/70 text-amber-800"><AlertTriangle size={14} /></span>
            Maintenance overdue
          </p>
          <ul className="mt-2 space-y-1 pl-1 text-xs text-amber-800/90">
            {due.map((e) => (
              <li key={e.payload.name} className="flex items-center justify-between">
                <span>{e.payload.name}</span>
                <span className="font-semibold">due {new Date(e.payload.next_maintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add equipment */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Add equipment
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New equipment</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Name"><Input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Mahindra 475 DI" /></FormField>
              <FormField label="Type"><Input className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="tractor / pump / sprayer" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Last service"><Input className={inputCls} type="date" value={form.last_maintenance} onChange={(e) => setForm({ ...form, last_maintenance: e.target.value })} /></FormField>
              <FormField label="Next service due"><Input className={inputCls} type="date" value={form.next_maintenance} onChange={(e) => setForm({ ...form, next_maintenance: e.target.value })} /></FormField>
            </div>
            <button onClick={submit} disabled={saving || !form.name}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {saving && <Loader2 size={15} className="animate-spin" />} Save equipment
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[76px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : equipment.length === 0 ? (
        <EmptyState icon={Wrench} title="No equipment registered" subtitle="Add your tractor, pump or sprayer to track servicing." />
      ) : (
        <SectionCard title="Your equipment" icon={WrenchIcon}>
          <ul className="divide-y divide-gray-100">
            {equipment.map((e, i) => {
              const overdue = e.payload.next_maintenance && e.payload.next_maintenance <= today;
              return (
                <li key={e.payload.name} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Wrench size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{e.payload.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {e.payload.type || 'Equipment'}
                      {e.payload.last_maintenance ? ` · served ${new Date(e.payload.last_maintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                    </p>
                  </div>
                  {e.payload.next_maintenance && (
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${overdue ? 'bg-red-100 text-red-600' : 'bg-leaf-50 text-leaf-700'}`}>
                      {overdue ? 'due' : 'next'} {new Date(e.payload.next_maintenance).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
