import { useState, useEffect } from 'react';
import { ShieldCheck, Plus, X, Trash2, FileText, Loader2, Upload, ShieldAlert, Link2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import appClient, { files } from '../api/appClient';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function InsuranceVault() {
  const [docs, setDocs] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', doc_type: 'insurance', file_url: '', issued_date: '', expiry_date: '', notes: '' });

  const load = () => {
    appClient.entities.DocumentWallet.list('-created_date').then((all) => {
      setDocs(all.filter((d) => d.doc_type === 'insurance' || /policy|insurance|claim/i.test(d.title || '')));
    }).catch(() => []);
    appClient.entities.InsurancePolicy.list('-created_date').then(setPolicies).catch(() => []);
  };
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await files.upload({ file });
      setForm((f) => ({ ...f, file_url }));
    } catch {
      setForm((f) => ({ ...f, file_url: '' }));
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!form.title) return;
    await appClient.entities.DocumentWallet.create({ ...form, title: form.title });
    setForm({ title: '', doc_type: 'insurance', file_url: '', issued_date: '', expiry_date: '', notes: '' });
    setShowAdd(false);
    load();
  };

  const remove = async (id) => { await appClient.entities.DocumentWallet.delete(id); load(); };

  const expiringSoon = (d) => {
    if (!d.expiry_date) return false;
    const days = (new Date(d.expiry_date) - new Date()) / 86400000;
    return days >= 0 && days <= 30;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Insurance Vault"
        subtitle="Policy documents and claim papers, in one safe place"
        icon={ShieldCheck}
      />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Documents stored</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{docs.length}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><ShieldCheck size={24} /></span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Linked policies</p>
            <p className="mt-0.5 text-sm font-bold">{policies.length}</p>
          </div>
          <div className={`rounded-2xl px-3 py-2.5 ${docs.some(expiringSoon) ? 'bg-red-400/25' : 'bg-white/15'}`}>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Expiring in 30 days</p>
            <p className="mt-0.5 text-sm font-bold">{docs.filter(expiringSoon).length}</p>
          </div>
        </div>
      </div>

      {docs.some(expiringSoon) && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 animate-fade-up">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200/70 text-amber-800"><ShieldAlert size={14} /></span>
            Renewal coming up
          </p>
          <ul className="mt-2 space-y-1 pl-1 text-xs text-amber-800/90">
            {docs.filter(expiringSoon).map((d) => (
              <li key={d.id} className="flex items-center justify-between">
                <span>{d.title}</span>
                <span className="font-semibold">expires {new Date(d.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add document */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Add document
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New document</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Title">
              <Input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. PMFBY Policy 2026" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Issued date"><Input className={inputCls} type="date" value={form.issued_date} onChange={(e) => setForm({ ...form, issued_date: e.target.value })} /></FormField>
              <FormField label="Expiry date"><Input className={inputCls} type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></FormField>
            </div>
            <FormField label="File">
              <label className={`flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed ${form.file_url ? 'border-leaf-400 bg-leaf-50/50 text-leaf-700' : 'border-gray-300 bg-gray-50 text-gray-500'} px-3 text-sm`}>
                {uploading ? <Loader2 size={15} className="animate-spin" /> : form.file_url ? <FileText size={15} /> : <Upload size={15} />}
                {form.file_url ? 'File attached' : uploading ? 'Uploading…' : 'Upload policy / claim file'}
                <input type="file" className="hidden" onChange={upload} />
              </label>
            </FormField>
            <button onClick={submit} disabled={!form.title}
              className="mt-1 w-full rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
              Save document
            </button>
          </div>
        </div>
      )}

      {/* Documents */}
      {docs.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No insurance documents yet" subtitle="Store policy PDFs and claim papers here so they're always at hand." />
      ) : (
        <SectionCard className="mb-4" title="Documents" icon={FileText}>
          <ul className="divide-y divide-gray-100">
            {docs.map((d, i) => (
              <li key={d.id} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><FileText size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{d.title}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {d.issued_date ? `issued ${new Date(d.issued_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'no issue date'}
                    {d.expiry_date ? ` · expires ${new Date(d.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` : ''}
                  </p>
                </div>
                {expiringSoon(d) && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">expiring</Badge>}
                {d.file_url && (
                  <a href={d.file_url} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-leaf-50 hover:text-leaf-700"><FileText size={15} /></a>
                )}
                <button onClick={() => remove(d.id)} className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      <Link to="/insurance-hub" className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-leaf-700">
        <Link2 size={13} /> Manage your policies in Insurance Hub
      </Link>
    </div>
  );
}
