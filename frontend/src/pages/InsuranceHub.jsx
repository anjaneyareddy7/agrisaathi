import { useState, useEffect } from 'react';
import { ShieldPlus, Plus, X, Trash2, ShieldCheck, IndianRupee } from 'lucide-react';
import appClient from '../api/appClient';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const CLAIM_STATUS = {
  none: { label: 'No claim', color: 'bg-gray-100 text-gray-600' },
  filed: { label: 'Filed', color: 'bg-amber-100 text-amber-800' },
  under_review: { label: 'Under review', color: 'bg-blue-100 text-blue-800' },
  approved: { label: 'Approved', color: 'bg-leaf-100 text-leaf-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
};

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { policy_name: '', provider: '', crop_name: '', plot_name: '', premium_amount: '', sum_insured: '', start_date: '', end_date: '' };

export default function InsuranceHub() {
  const [policies, setPolicies] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => appClient.entities.InsurancePolicy.list('-created_date').then(setPolicies).catch(() => []);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.policy_name) return;
    await appClient.entities.InsurancePolicy.create({
      policy_name: form.policy_name, provider: form.provider || undefined, crop_name: form.crop_name || undefined,
      plot_name: form.plot_name || undefined, premium_amount: form.premium_amount ? Number(form.premium_amount) : undefined,
      sum_insured: form.sum_insured ? Number(form.sum_insured) : undefined, start_date: form.start_date || undefined, end_date: form.end_date || undefined,
      status: 'active', claim_status: 'none',
    });
    setForm(EMPTY);
    setShowAdd(false);
    load();
  };

  const updateClaim = async (p, claim_status) => { await appClient.entities.InsurancePolicy.update(p.id, { claim_status }); load(); };
  const remove = async (id) => { await appClient.entities.InsurancePolicy.delete(id); load(); };

  const active = policies.filter((p) => p.status === 'active');
  const filedClaims = policies.filter((p) => p.claim_status !== 'none');
  const totalCover = policies.reduce((s, p) => s + (p.sum_insured || 0), 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Insurance Hub" subtitle="Track crop insurance policies and claims" icon={ShieldPlus} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Active policies</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{active.length}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck size={24} /></span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><IndianRupee size={10} /> Total cover</p>
            <p className="mt-0.5 text-sm font-bold">₹{totalCover.toLocaleString('en-IN')}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2.5 ${filedClaims.length ? 'bg-harvest-400/30' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Claims in progress</p>
            <p className="mt-0.5 text-sm font-bold">{filedClaims.length}</p>
          </div>
        </div>
      </div>

      {/* Add policy */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Add policy
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New policy</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Policy name"><Input className={inputCls} value={form.policy_name} onChange={(e) => setForm({ ...form, policy_name: e.target.value })} placeholder="PMFBY 2026" /></FormField>
              <FormField label="Provider"><Input className={inputCls} value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="Insurance company" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Crop"><Input className={inputCls} value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} placeholder="e.g. Paddy" /></FormField>
              <FormField label="Plot"><Input className={inputCls} value={form.plot_name} onChange={(e) => setForm({ ...form, plot_name: e.target.value })} placeholder="Plot name" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Premium (₹)"><Input className={inputCls} type="number" value={form.premium_amount} onChange={(e) => setForm({ ...form, premium_amount: e.target.value })} placeholder="0" /></FormField>
              <FormField label="Sum insured (₹)"><Input className={inputCls} type="number" value={form.sum_insured} onChange={(e) => setForm({ ...form, sum_insured: e.target.value })} placeholder="0" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Start date"><Input className={inputCls} type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></FormField>
              <FormField label="End date"><Input className={inputCls} type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></FormField>
            </div>
            <button onClick={save} disabled={!form.policy_name}
              className="w-full rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              Save policy
            </button>
          </div>
        </div>
      )}

      {/* Policies */}
      {policies.length === 0 ? (
        <EmptyState icon={ShieldPlus} title="No policies yet" subtitle="Add your crop insurance policy to track premiums and claims." />
      ) : (
        <SectionCard title="Your policies" icon={ShieldCheck}>
          <ul className="divide-y divide-gray-100">
            {policies.map((p, i) => {
              const cs = CLAIM_STATUS[p.claim_status] || CLAIM_STATUS.none;
              return (
                <li key={p.id} className="px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{p.policy_name}</p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {[p.provider, p.crop_name, p.plot_name].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <button onClick={() => remove(p.id)} className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {p.sum_insured && <Badge className="bg-leaf-50 text-leaf-700 hover:bg-leaf-50">₹{p.sum_insured.toLocaleString('en-IN')} covered</Badge>}
                    {p.premium_amount && <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">₹{p.premium_amount.toLocaleString('en-IN')} premium</Badge>}
                    {p.end_date && <Badge className="border border-gray-200 text-gray-500 hover:bg-transparent" variant="outline">until {new Date(p.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Badge>}
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Badge className={`${cs.color} hover:bg-inherit}`}>{cs.label}</Badge>
                    {p.claim_status !== 'approved' && p.claim_status !== 'rejected' && (
                      <Select value={p.claim_status} onValueChange={(v) => updateClaim(p, v)}>
                        <SelectTrigger className="h-8 w-40 rounded-xl border-gray-200 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(CLAIM_STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}
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
