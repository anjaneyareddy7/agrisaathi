import { useState, useEffect } from 'react';
import { FolderArchive, Plus, X, Trash2, FileText, Loader2, Camera, Landmark, Sprout, IdCard, ShieldCheck, Banknote, Box } from 'lucide-react';
import appClient, { files } from '../api/appClient';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Image } from '../components/ui/image';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const DOC_TYPES = [
  { value: 'land_deed', label: 'Land Deed', icon: Landmark, tone: 'bg-amber-100 text-amber-700' },
  { value: 'soil_card', label: 'Soil Health Card', icon: Sprout, tone: 'bg-leaf-100 text-leaf-700' },
  { value: 'identity', label: 'Identity (Aadhaar/PAN)', icon: IdCard, tone: 'bg-blue-100 text-blue-700' },
  { value: 'insurance', label: 'Insurance', icon: ShieldCheck, tone: 'bg-violet-100 text-violet-700' },
  { value: 'loan', label: 'Loan Document', icon: Banknote, tone: 'bg-indigo-100 text-indigo-700' },
  { value: 'other', label: 'Other', icon: Box, tone: 'bg-gray-100 text-gray-600' },
];
const meta = (v) => DOC_TYPES.find((d) => d.value === v) || DOC_TYPES[5];

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function DocumentWallet() {
  const [docs, setDocs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', doc_type: 'land_deed', file_url: '', issued_date: '', expiry_date: '', notes: '' });

  const load = () => appClient.entities.DocumentWallet.list('-created_date').then(setDocs).catch(() => []);
  useEffect(() => { load(); }, []);

  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await files.upload({ file });
      setForm((f) => ({ ...f, file_url }));
    } catch { /* keep empty */ }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.title) return;
    await appClient.entities.DocumentWallet.create({
      title: form.title, doc_type: form.doc_type, file_url: form.file_url || undefined,
      issued_date: form.issued_date || undefined, expiry_date: form.expiry_date || undefined, notes: form.notes || undefined,
    });
    setForm({ title: '', doc_type: 'land_deed', file_url: '', issued_date: '', expiry_date: '', notes: '' });
    setShowAdd(false);
    load();
  };

  const remove = async (id) => { await appClient.entities.DocumentWallet.delete(id); load(); };

  const shown = filter === 'all' ? docs : docs.filter((d) => d.doc_type === filter);
  const fmtDate = (s) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Document Wallet" subtitle="Land records, IDs and certificates — always at hand" icon={FolderArchive} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Documents stored</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{docs.length}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><FolderArchive size={24} /></span>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[...new Set(docs.map((d) => d.doc_type))].slice(0, 4).map((v) => (
            <span key={v} className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold">{meta(v).label}</span>
          ))}
          {docs.length > 0 && <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white/80">{docs.length} total</span>}
        </div>
      </div>

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
              <Input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Land deed — North plot" />
            </FormField>
            <FormField label="Document type">
              <Select value={form.doc_type} onValueChange={(v) => setForm({ ...form, doc_type: v })}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField label="Scan or photo">
              <label className={`flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 text-sm font-medium ${form.file_url ? 'border-leaf-400 bg-leaf-50/50 text-leaf-700' : 'border-gray-300 bg-gray-50 text-gray-500'}`}>
                {uploading ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
                {form.file_url ? 'Photo attached' : uploading ? 'Uploading…' : 'Take photo / choose file'}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={upload} />
              </label>
            </FormField>
            {form.file_url && <Image src={form.file_url} className="h-32 w-full rounded-xl" fittingType="fit" />}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Issued date"><Input className={inputCls} type="date" value={form.issued_date} onChange={(e) => setForm({ ...form, issued_date: e.target.value })} /></FormField>
              <FormField label="Expiry date"><Input className={inputCls} type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} /></FormField>
            </div>
            <FormField label="Notes">
              <Textarea className="min-h-[64px] rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" placeholder="Optional" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
            </FormField>
            <div className="flex gap-2">
              <button onClick={save} className="flex-1 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800">Save</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Type filter chips */}
      {docs.length > 0 && (
        <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[{ value: 'all', label: 'All' }, ...DOC_TYPES.filter((d) => docs.some((x) => x.doc_type === d.value))].map((c) => (
            <button key={c.value} onClick={() => setFilter(c.value)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filter === c.value ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
              {c.label}
            </button>
          ))}
        </div>
      )}

      {/* Document list */}
      {shown.length === 0 ? (
        <EmptyState icon={FolderArchive} title={docs.length === 0 ? 'No documents yet' : 'Nothing in this category'} subtitle="Tap “Add document” to scan and store your first record." />
      ) : (
        <SectionCard title="Your documents" icon={FileText}>
          <ul className="divide-y divide-gray-100">
            {shown.map((d, i) => {
              const m = meta(d.doc_type);
              return (
                <li key={d.id} className="flex items-start gap-3 px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  {d.file_url
                    ? <Image src={d.file_url} className="h-14 w-14 shrink-0 rounded-xl border border-gray-100" fittingType="fill" />
                    : <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${m.tone}`}><m.icon size={20} /></span>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{d.title}</p>
                    <Badge className={`${m.tone} mb-1 mt-1 hover:bg-inherit}`}>{m.label}</Badge>
                    <p className="text-xs text-gray-500">
                      {fmtDate(d.issued_date) ? `Issued ${fmtDate(d.issued_date)}` : ''}
                      {fmtDate(d.issued_date) && fmtDate(d.expiry_date) ? ' · ' : ''}
                      {fmtDate(d.expiry_date) ? `Expires ${fmtDate(d.expiry_date)}` : ''}
                    </p>
                    {d.notes && <p className="mt-1 line-clamp-2 text-xs text-gray-400">{d.notes}</p>}
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer" className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-leaf-50 hover:text-leaf-700"><FileText size={15} /></a>}
                    <button onClick={() => remove(d.id)} className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
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
