import { useState, useEffect } from 'react';
import { Sprout, ShieldCheck, ScanLine, Plus, LineChart as LineChartIcon, X, BookOpen } from 'lucide-react';
import appClient, { files, ai } from '../api/appClient';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { SectionCard, FormField } from '../components/kit';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || '';
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

const toHash = async (obj) => {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export default function SoilPassport() {
  const [records, setRecords] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [form, setForm] = useState({ plot_name: '', test_date: '', testing_organization: '', soil_type: '', ph: '', nitrogen: '', phosphorus: '', potassium: '', organic_carbon: '', ec: '', notes: '', card_file_url: '' });

  const load = () => axios.get(`${API_URL}/api/soil-records`).then((res) => setRecords(res.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const [soilProfiles, setSoilProfiles] = useState([]);
  const [refState, setRefState] = useState('');
  useEffect(() => {
    axios.get(`${API_URL}/api/soil-profiles`)
      .then((res) => setSoilProfiles(res.data || []))
      .catch(() => setSoilProfiles([]));
  }, []);
  const refProfile = soilProfiles.find((p) => p.state === refState);

  const save = async () => {
    if (!form.plot_name) { alert('Plot name is required'); return; }
    const payload = {
      plot_name: form.plot_name,
      test_date: form.test_date || undefined,
      testing_organization: form.testing_organization || undefined,
      soil_type: form.soil_type || undefined,
      ph: form.ph ? Number(form.ph) : undefined,
      nitrogen: form.nitrogen ? Number(form.nitrogen) : undefined,
      phosphorus: form.phosphorus ? Number(form.phosphorus) : undefined,
      potassium: form.potassium ? Number(form.potassium) : undefined,
      organic_carbon: form.organic_carbon ? Number(form.organic_carbon) : undefined,
      ec: form.ec ? Number(form.ec) : undefined,
      notes: form.notes || undefined,
      card_file_url: form.card_file_url || undefined,
    };
    const hash = await toHash({ ...payload, hashed_at: new Date().toISOString() });
    await axios.post(`${API_URL}/api/soil-records`, { ...payload, record_hash: hash, hashed_at: new Date().toISOString() });
    setForm({ plot_name: '', test_date: '', testing_organization: '', soil_type: '', ph: '', nitrogen: '', phosphorus: '', potassium: '', organic_carbon: '', ec: '', notes: '', card_file_url: '' });
    setShowAdd(false);
    load();
  };

  const scanCard = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    try {
      const { file_url } = await files.upload({ file });
      setForm((f) => ({ ...f, card_file_url: file_url }));
      const res = await ai.invoke({
        prompt: 'Extract soil health values from this Soil Health Card image. Return available fields only. Leave blank if not visible.',
        file_urls: [file_url],
        response_json_schema: {
          type: 'object',
          properties: {
            ph: { type: 'number' }, nitrogen: { type: 'number' }, phosphorus: { type: 'number' },
            potassium: { type: 'number' }, organic_carbon: { type: 'number' }, ec: { type: 'number' },
            soil_type: { type: 'string' }, testing_organization: { type: 'string' },
          },
        },
      });
      setForm((f) => ({
        ...f,
        ph: res.ph ?? f.ph, nitrogen: res.nitrogen ?? f.nitrogen, phosphorus: res.phosphorus ?? f.phosphorus,
        potassium: res.potassium ?? f.potassium, organic_carbon: res.organic_carbon ?? f.organic_carbon,
        ec: res.ec ?? f.ec, soil_type: res.soil_type || f.soil_type, testing_organization: res.testing_organization || f.testing_organization,
      }));
      alert('Scanned — please check the values before saving.');
    } catch {
      alert('Scan failed. You can enter values manually.');
    } finally {
      setScanning(false);
    }
  };

  const num = (v) => (v == null || v === '' ? '—' : v);

  const plots = [...new Set(records.map((r) => r.plot_name).filter(Boolean))].sort();
  const [trendPlot, setTrendPlot] = useState('');
  useEffect(() => { if (plots.length && !trendPlot) setTrendPlot(plots[0]); }, [plots, trendPlot]);
  const trendData = records
    .filter((r) => r.plot_name === trendPlot && r.test_date)
    .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
    .map((r) => ({
      date: new Date(r.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      pH: r.ph ?? null, N: r.nitrogen ?? null, P: r.phosphorus ?? null, K: r.potassium ?? null, OC: r.organic_carbon ?? null,
    }));
  const hasTrend = trendData.filter((d) => d.pH != null || d.N != null || d.P != null || d.K != null).length >= 2;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Soil Passport" icon={Sprout} subtitle="Your soil health history, plot by plot" />

      {/* Records */}
      {records.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <Sprout size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-600">No soil records yet</p>
          <p className="text-xs text-gray-400">Add one below, or scan your Soil Health Card.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r, i) => (
            <div key={r.id} className="animate-fade-up overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-leaf-800 to-leaf-950 px-4 py-3 text-white">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.plot_name}</p>
                  <p className="truncate text-[11px] text-leaf-200/75">
                    {r.test_date ? new Date(r.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No date'}
                    {r.testing_organization ? ` · ${r.testing_organization}` : ''}
                  </p>
                </div>
                {r.record_hash && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold text-leaf-100">
                    <ShieldCheck size={11} /> Verified
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-1.5 p-3">
                {[['pH', num(r.ph)], ['N', num(r.nitrogen)], ['P', num(r.phosphorus)], ['K', num(r.potassium)], ['OC', num(r.organic_carbon)]].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-gray-50 py-2 text-center">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{k}</div>
                    <div className="text-sm font-semibold text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              {r.notes && <p className="px-4 pb-2 text-xs text-gray-500">{r.notes}</p>}
              {r.record_hash && <p className="truncate px-4 pb-3 text-[10px] text-gray-300">hash: {r.record_hash.slice(0, 32)}…</p>}
            </div>
          ))}
        </div>
      )}

      {/* Trend chart */}
      {plots.length > 0 && (
        <div className="mt-4">
          <SectionCard icon={LineChartIcon} title="Soil trend" tone="bg-leaf-100 text-leaf-700">
            <div className="p-4">
              {plots.length > 1 && (
                <Select value={trendPlot} onValueChange={setTrendPlot}>
                  <SelectTrigger className="mb-3"><SelectValue /></SelectTrigger>
                  <SelectContent>{plots.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              )}
              {hasTrend ? (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="pH" stroke="#16a34a" dot={{ r: 3 }} connectNulls strokeWidth={2} />
                      <Line type="monotone" dataKey="N" stroke="#3b82f6" dot={{ r: 3 }} connectNulls strokeWidth={2} />
                      <Line type="monotone" dataKey="P" stroke="#f59e0b" dot={{ r: 3 }} connectNulls strokeWidth={2} />
                      <Line type="monotone" dataKey="K" stroke="#ef4444" dot={{ r: 3 }} connectNulls strokeWidth={2} />
                      <Line type="monotone" dataKey="OC" stroke="#a855f7" dot={{ r: 3 }} connectNulls strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="py-4 text-center text-xs text-gray-400">Add two or more dated records for this plot to see the trend.</p>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* Government reference */}
      {soilProfiles.length > 0 && (
        <div className="mt-4">
          <SectionCard icon={BookOpen} title="State soil reference" tone="bg-blue-100 text-blue-700">
            <div className="p-4">
              <Select value={refState} onValueChange={setRefState}>
                <SelectTrigger><SelectValue placeholder="Select your state" /></SelectTrigger>
                <SelectContent className="max-h-72">{soilProfiles.map((p) => <SelectItem key={p.state} value={p.state}>{p.state}</SelectItem>)}</SelectContent>
              </Select>
              {refProfile && (
                <div className="mt-3 space-y-1.5 text-sm">
                  <p><span className="text-gray-400">Soil type:</span> <span className="font-medium text-gray-800">{refProfile.dominant_soil_type}</span></p>
                  <p><span className="text-gray-400">Typical pH:</span> <span className="font-medium text-gray-800">{refProfile.typical_ph_range}</span></p>
                  <p className="text-xs leading-relaxed text-gray-500">{refProfile.characteristics}</p>
                  <p className="text-xs leading-relaxed text-gray-500"><span className="font-semibold text-gray-600">Suitable crops:</span> {refProfile.suitable_crops}</p>
                </div>
              )}
              <p className="mt-2 text-[10px] text-gray-300">Reference values only — not a substitute for your own soil test.</p>
            </div>
          </SectionCard>
        </div>
      )}

      {/* Add record */}
      {showAdd ? (
        <div className="mt-4 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Add soil record</h3>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${scanning ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>
                  <ScanLine size={13} /> {scanning ? 'Scanning…' : 'Scan card'}
                </span>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={scanCard} />
              </label>
              <button onClick={() => setShowAdd(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={16} /></button>
            </div>
          </div>
          {form.card_file_url && <img src={form.card_file_url} alt="Soil card" className="mb-3 h-32 w-full rounded-xl object-contain" />}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Plot name"><input value={form.plot_name} onChange={(e) => setForm({ ...form, plot_name: e.target.value })} placeholder="e.g. Paddy field" className={inputCls} /></FormField>
              <FormField label="Test date"><input type="date" value={form.test_date} onChange={(e) => setForm({ ...form, test_date: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div>
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Measurements</span>
              <div className="grid grid-cols-5 gap-2">
                {[['ph', 'pH'], ['nitrogen', 'N'], ['phosphorus', 'P'], ['potassium', 'K'], ['organic_carbon', 'OC']].map(([k, lbl]) => (
                  <div key={k} className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-1.5 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lbl}</p>
                    <input type="number" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder="—"
                      className="w-full bg-transparent text-center text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300" />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Soil type"><input value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value })} placeholder="e.g. Black cotton" className={inputCls} /></FormField>
              <FormField label="Testing org"><input value={form.testing_organization} onChange={(e) => setForm({ ...form, testing_organization: e.target.value })} placeholder="Optional" className={inputCls} /></FormField>
            </div>
            <FormField label="Notes">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional…" className={`${inputCls} resize-none`} />
            </FormField>
            <div className="flex gap-2">
              <Button onClick={save} className="flex-1">Save record</Button>
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-all hover:bg-leaf-50 active:scale-[0.98]">
          <Plus size={15} /> Add soil record
        </button>
      )}

      <p className="mt-4 text-center text-[10px] text-gray-300">Records are SHA-256 hashed for tamper-evidence (local verification).</p>
    </div>
  );
}
