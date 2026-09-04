import { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, ShieldCheck, ShieldAlert, ArrowUpCircle, ArrowDownCircle, X, IndianRupee, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField } from '../components/kit';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

const CATEGORIES = {
  income: ['Crop Sale', 'Livestock Sale', 'Government Subsidy', 'Other Income'],
  expense: ['Seeds', 'Fertilizer', 'Pesticide', 'Labour', 'Irrigation', 'Equipment', 'Transport', 'Other Expense'],
};
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

export default function FarmLedger() {
  const [userId, setUserId] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: 'Seeds', amount: '', note: '' });

  const load = async (uid) => {
    setLoading(true);
    try {
      const res = await appClient.call(`/api/ledger/chain/farm_ledger/${uid}`);
      setBlocks(res.blocks || []);
      setValid(res.valid);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    appClient.auth.me().then((user) => { setUserId(user.id); load(user.id); });
  }, []);

  const submit = async () => {
    if (!userId || !form.amount || Number(form.amount) <= 0) return;
    setSaving(true);
    try {
      await appClient.call('/api/ledger/log', {
        method: 'POST',
        data: {
          entity_type: 'farm_ledger', entity_id: userId, event_type: form.type,
          payload: { category: form.category, amount: Number(form.amount), note: form.note }, actor: userId,
        },
      });
      setForm({ type: 'expense', category: 'Seeds', amount: '', note: '' });
      setShowForm(false);
      await load(userId);
    } finally {
      setSaving(false);
    }
  };

  const totalIncome = blocks.filter((b) => b.event_type === 'income').reduce((s, b) => s + (b.payload?.amount || 0), 0);
  const totalExpense = blocks.filter((b) => b.event_type === 'expense').reduce((s, b) => s + (b.payload?.amount || 0), 0);
  const net = totalIncome - totalExpense;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Farm Ledger" icon={FileSpreadsheet} subtitle="Every rupee in and out — tamper-proof" />

      {/* Balance hero */}
      <div className="animate-fade-up rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-leaf-200/80">Net balance</p>
            <p className="mt-1 text-3xl font-bold leading-none">₹{net.toLocaleString('en-IN')}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <Wallet size={22} />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <TrendingUp size={16} className="shrink-0 text-emerald-300" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-leaf-200/70">Income</p>
              <p className="text-sm font-bold">₹{totalIncome.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <TrendingDown size={16} className="shrink-0 text-red-300" />
            <div>
              <p className="text-[10px] uppercase tracking-wide text-leaf-200/70">Expense</p>
              <p className="text-sm font-bold">₹{totalExpense.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chain status + add */}
      <div className="mt-4 flex animate-fade-up items-center justify-between gap-2" style={{ animationDelay: '60ms' }}>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${valid ? 'bg-leaf-50 text-leaf-700' : 'bg-red-50 text-red-600'}`}>
          {valid ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
          {valid ? `Chain verified · ${blocks.length} entries` : 'Chain check failed'}
        </span>
        <Button size="sm" onClick={() => setShowForm((s) => !s)}><Plus size={14} /> Add entry</Button>
      </div>

      {showForm && (
        <div className="mt-3 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New entry</h3>
            <button onClick={() => setShowForm(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Type">
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v, category: CATEGORIES[v][0] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="income">Income</SelectItem><SelectItem value="expense">Expense</SelectItem></SelectContent>
                </Select>
              </FormField>
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES[form.type].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
            </div>
            <FormField label="Amount (₹)">
              <div className="relative">
                <IndianRupee size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" className={`${inputCls} pl-9`} />
              </div>
            </FormField>
            <FormField label="Note (optional)">
              <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="e.g. Urea for plot 2" className={inputCls} />
            </FormField>
            <Button className="w-full" onClick={submit} disabled={saving || !form.amount}>
              {saving ? 'Saving to ledger…' : 'Save entry'}
            </Button>
          </div>
        </div>
      )}

      {/* Entries */}
      {loading ? (
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2, 3].map((i) => <div key={i} className="animate-shimmer h-16 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
        </div>
      ) : blocks.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <FileSpreadsheet size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-600">No entries yet</p>
          <p className="text-xs text-gray-400">Add your first income or expense above.</p>
        </div>
      ) : (
        <div className="mt-4">
          <SectionCard>
            <ul className="divide-y divide-gray-100">
              {[...blocks].reverse().map((b, i) => (
                <li key={b.index} className="flex animate-slide-in items-center gap-3 px-4 py-3" style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${b.event_type === 'income' ? 'bg-leaf-100 text-leaf-700' : 'bg-red-100 text-red-600'}`}>
                    {b.event_type === 'income' ? <ArrowUpCircle size={16} /> : <ArrowDownCircle size={16} />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{b.payload?.category}</p>
                    <p className="truncate text-[11px] text-gray-400">
                      {new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {b.payload?.note ? ` · ${b.payload.note}` : ''}
                    </p>
                  </div>
                  <p className={`shrink-0 text-sm font-bold ${b.event_type === 'income' ? 'text-leaf-700' : 'text-red-600'}`}>
                    {b.event_type === 'income' ? '+' : '−'}₹{(b.payload?.amount || 0).toLocaleString('en-IN')}
                  </p>
                </li>
              ))}
            </ul>
          </SectionCard>
          <p className="mt-3 text-center text-[10px] text-gray-300">
            Entries are hash-chained — nothing can be silently edited or deleted.
          </p>
        </div>
      )}
    </div>
  );
}
