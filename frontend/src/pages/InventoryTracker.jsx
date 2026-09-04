import { useState, useEffect, useCallback } from 'react';
import { Package, Plus, X, ShieldCheck, ShieldAlert, AlertTriangle, Sprout, FlaskConical, Bug, Wrench, Fuel, Boxes, Loader2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Input } from '../components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const CATEGORIES = ['Seed', 'Fertilizer', 'Pesticide', 'Equipment', 'Fuel', 'Other'];
const UNITS = ['kg', 'litre', 'bag', 'unit', 'packet'];

const CAT_META = {
  Seed: { icon: Sprout, tone: 'bg-leaf-100 text-leaf-700' },
  Fertilizer: { icon: FlaskConical, tone: 'bg-cyan-100 text-cyan-700' },
  Pesticide: { icon: Bug, tone: 'bg-rose-100 text-rose-700' },
  Equipment: { icon: Wrench, tone: 'bg-violet-100 text-violet-700' },
  Fuel: { icon: Fuel, tone: 'bg-amber-100 text-amber-700' },
  Other: { icon: Boxes, tone: 'bg-gray-100 text-gray-600' },
};

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function InventoryTracker() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ item: '', category: 'Seed', quantity: '', unit: 'kg', low_stock_at: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/inventory-tracker/${deviceId}`);
      setBlocks(res.data.blocks || []);
      setValid(res.data.valid);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.item || !form.quantity) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'inventory',
        entity_id: deviceId,
        event_type: 'stock_update',
        payload: {
          item: form.item,
          category: form.category,
          quantity: Number(form.quantity),
          unit: form.unit,
          low_stock_at: form.low_stock_at ? Number(form.low_stock_at) : null,
        },
        actor: deviceId,
      });
      setForm({ item: '', category: 'Seed', quantity: '', unit: 'kg', low_stock_at: '' });
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const latestByItem = {};
  [...blocks].reverse().forEach((b) => {
    const item = b.payload?.item;
    if (item && !latestByItem[item]) latestByItem[item] = b;
  });
  const currentStock = Object.values(latestByItem);
  const lowStockItems = currentStock.filter(
    (b) => b.payload?.low_stock_at != null && b.payload.quantity <= b.payload.low_stock_at
  );

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Inventory Tracker"
        subtitle="Track seed, fertilizer, pesticide and equipment stock"
        icon={Package}
      />

      {/* Summary hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Items in stock</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{currentStock.length}</p>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${valid ? 'bg-white/15 text-white' : 'bg-red-500/90 text-white'}`}>
            {valid ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
            {valid ? `Chain verified · ${blocks.length} entries` : 'Chain check failed'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Categories</p>
            <p className="mt-0.5 text-sm font-bold">{new Set(currentStock.map((b) => b.payload.category)).size}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2.5 ${lowStockItems.length ? 'bg-red-400/25' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Running low</p>
            <p className="mt-0.5 text-sm font-bold">{lowStockItems.length}</p>
          </div>
        </div>
      </div>

      {/* Low stock warning */}
      {lowStockItems.length > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-up">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200/70 text-amber-800"><AlertTriangle size={14} /></span>
            {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low
          </p>
          <ul className="mt-2 space-y-1 pl-1 text-xs text-amber-800/90">
            {lowStockItems.map((b) => (
              <li key={b.payload.item} className="flex items-center justify-between">
                <span>{b.payload.item}</span>
                <span className="font-semibold">{b.payload.quantity} {b.payload.unit} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add stock */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up"
        >
          <Plus size={16} /> Log stock
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Stock update</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Item name">
              <Input className={inputCls} value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} placeholder="e.g. Urea 46%" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Unit">
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>{UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Current quantity"><Input className={inputCls} type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 12" /></FormField>
              <FormField label="Low-stock alert at" hint="Optional"><Input className={inputCls} type="number" value={form.low_stock_at} onChange={(e) => setForm({ ...form, low_stock_at: e.target.value })} placeholder="e.g. 5" /></FormField>
            </div>
            <button onClick={submit} disabled={saving || !form.item || !form.quantity} className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              {saving && <Loader2 size={15} className="animate-spin" />} Save to inventory
            </button>
          </div>
        </div>
      )}

      {/* Stock list */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[68px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : currentStock.length === 0 ? (
        <EmptyState icon={Package} title="No inventory logged yet" subtitle="Add your first item to start tracking stock levels." />
      ) : (
        <SectionCard title="Current stock" icon={Boxes}>
          <ul className="divide-y divide-gray-100">
            {currentStock.map((b, i) => {
              const meta = CAT_META[b.payload.category] || CAT_META.Other;
              const low = b.payload.low_stock_at != null && b.payload.quantity <= b.payload.low_stock_at;
              return (
                <li key={b.payload.item} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.tone}`}><meta.icon size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{b.payload.item}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {b.payload.category} · updated {new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-bold ${low ? 'text-red-600' : 'text-gray-900'}`}>{b.payload.quantity} <span className="text-xs font-medium text-gray-400">{b.payload.unit}</span></p>
                    {low && <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-semibold text-red-500"><AlertTriangle size={10} /> low</p>}
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
