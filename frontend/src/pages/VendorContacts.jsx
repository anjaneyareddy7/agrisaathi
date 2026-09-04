import { useState, useEffect, useCallback } from 'react';
import { Phone, Plus, X, Store, Trash2, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const VENDOR_TYPES = ['Seed dealer', 'Fertilizer dealer', 'Pesticide dealer', 'Equipment rental', 'Buyer/Trader', 'Transport', 'Other'];
const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { name: '', type: 'Seed dealer', phone: '', location: '', notes: '' };

export default function VendorContacts() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/vendor_contact/${deviceId}`);
      setBlocks(res.data.blocks || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.name || !form.phone) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'vendor_contact',
        entity_id: deviceId,
        event_type: 'vendor_added',
        payload: { ...form, active: true },
        actor: deviceId,
      });
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const removeVendor = async (name) => {
    await axios.post(`${API_URL}/api/ledger/log`, {
      entity_type: 'vendor_contact',
      entity_id: deviceId,
      event_type: 'vendor_removed',
      payload: { name, active: false },
      actor: deviceId,
    });
    await load();
  };

  const latestByName = {};
  [...blocks].reverse().forEach((b) => {
    const name = b.payload?.name;
    if (name && !latestByName[name]) latestByName[name] = b;
  });
  const vendors = Object.values(latestByName).filter((b) => b.payload?.active);
  const shown = filter === 'All' ? vendors : vendors.filter((v) => v.payload.type === filter);
  const usedTypes = [...new Set(vendors.map((v) => v.payload.type))];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Vendor Contacts" subtitle="Shops and buyers you deal with — one tap to call" icon={Store} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Saved vendors</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{vendors.length}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Store size={24} /></span>
        </div>
        <p className="mt-3 text-xs text-white/70">Contacts are stored on your device's ledger — private and verifiable.</p>
      </div>

      {/* Add vendor */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Add vendor
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New vendor</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Name"><Input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sharma Seeds" /></FormField>
              <FormField label="Phone"><Input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="98xxx xxxxx" inputMode="tel" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>{VENDOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Location"><Input className={inputCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Mandi town" /></FormField>
            </div>
            <FormField label="Notes">
              <Textarea className="min-h-[60px] rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional — e.g. best prices in season" rows={2} />
            </FormField>
            <button onClick={submit} disabled={saving || !form.name || !form.phone}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {saving && <Loader2 size={15} className="animate-spin" />} Save vendor
            </button>
          </div>
        </div>
      )}

      {/* Filter chips */}
      {vendors.length > 0 && (
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['All', ...usedTypes].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filter === t ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[92px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <EmptyState icon={Store} title={vendors.length === 0 ? 'No vendors saved yet' : 'Nothing in this category'} subtitle="Add the shops and buyers you deal with regularly." />
      ) : (
        <SectionCard title="Your contacts" icon={Phone}>
          <ul className="divide-y divide-gray-100">
            {shown.map((b, i) => (
              <li key={b.payload.name} className="px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><Store size={16} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{b.payload.name}</p>
                    <p className="truncate text-xs text-gray-500">
                      {b.payload.type}{b.payload.location ? ` · ${b.payload.location}` : ''}
                    </p>
                  </div>
                  <button onClick={() => removeVendor(b.payload.name)}
                    className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
                </div>
                <a href={`tel:${b.payload.phone}`}
                  className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-leaf-700 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-leaf-800">
                  <Phone size={12} /> {b.payload.phone}
                </a>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
