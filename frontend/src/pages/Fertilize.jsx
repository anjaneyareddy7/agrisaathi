import { useState, useEffect } from 'react';
import axios from 'axios';
import { Droplets, Leaf, Calculator, Sparkles, AlertTriangle, FlaskConical, CalendarClock, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { FormField } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function Fertilize() {
  const [crops, setCrops] = useState([]);
  const [soilProfiles, setSoilProfiles] = useState([]);
  const [form, setForm] = useState({ crop: '', area: '', unit: 'acre', state: '', n: '', p: '', k: '', ph: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/crops`).then((res) => setCrops(res.data)).catch(() => setCrops([]));
    axios.get(`${API_URL}/api/soil-profiles`).then((res) => setSoilProfiles(res.data)).catch(() => setSoilProfiles([]));
  }, []);

  const stateDefault = soilProfiles.find((s) => s.state === form.state);
  const numInput = 'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

  const calc = async () => {
    if (!form.crop || !form.area) { alert('Select crop and enter land size'); return; }
    setLoading(true); setResult(null);
    try {
      const res = await axios.post(`${API_URL}/api/fertilizer/calculate`, {
        crop: form.crop, area: parseFloat(form.area), unit: form.unit,
        soil_n: form.n ? parseFloat(form.n) : null, soil_p: form.p ? parseFloat(form.p) : null,
        soil_k: form.k ? parseFloat(form.k) : null, soil_ph: form.ph ? parseFloat(form.ph) : null,
      });
      setResult(res.data);
      axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'fertilizer_recommendation',
        entity_id: `${form.crop}_${Date.now()}`,
        event_type: 'recommendation_generated',
        payload: { crop: form.crop, area: form.area, unit: form.unit },
      }).catch(() => {});
    } catch { alert('Calculation failed. Please try again.'); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Fertilizer Dose" icon={Droplets} subtitle="Exact NPK for your crop and soil" />

      {/* Form card */}
      <div className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <FormField label="Crop">
            <Select value={form.crop} onValueChange={(v) => setForm({ ...form, crop: v })}>
              <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
              <SelectContent className="max-h-72">{crops.map((c) => <SelectItem key={c.name_en} value={c.name_en}>{c.name_en}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Land size">
              <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. 2.5" className={numInput} />
            </FormField>
            <FormField label="Unit">
              <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="acre">Acre</SelectItem>
                  <SelectItem value="hectare">Hectare</SelectItem>
                  <SelectItem value="guntha">Guntha</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>

          <FormField label="State (for typical soil)" hint={stateDefault ? `Typical soil: ${stateDefault.dominant_soil_type} · pH ${stateDefault.typical_ph_range}` : undefined}>
            <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent className="max-h-72">{soilProfiles.map((s) => <SelectItem key={s.state} value={s.state}>{s.state}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>

          {/* Soil test values */}
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Soil test values <span className="normal-case text-gray-400 font-medium">(optional)</span></span>
            <div className="grid grid-cols-4 gap-2">
              {[['n', 'N'], ['p', 'P'], ['k', 'K'], ['ph', 'pH']].map(([k, lbl]) => (
                <div key={k} className="rounded-xl border border-gray-200 bg-gray-50/50 px-2 py-1.5 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">{lbl}</p>
                  <input
                    type="number" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder="—"
                    className="w-full bg-transparent text-center text-sm font-semibold text-gray-800 outline-none placeholder:text-gray-300"
                  />
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-[11px] text-gray-400">Leave blank to use the full recommended dosage.</p>
          </div>

          <Button onClick={calc} disabled={loading} size="lg" className="w-full">
            {loading ? (<><Sparkles size={16} className="animate-spin" /> Calculating…</>) : (<><Calculator size={16} /> Calculate dose</>)}
          </Button>
        </div>
      </div>

      {/* Estimate notice */}
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2.5">
        <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-[11px] leading-relaxed text-amber-700">Estimate based on general crop reference data — confirm with a soil test where possible.</p>
      </div>

      {/* Result */}
      {loading && (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-20 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
        </div>
      )}

      {result && !loading && (
        <div className="mt-4 animate-fade-up space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-leaf-800 p-5 text-white shadow-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-100">
              <Droplets size={12} /> Recommended dose
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-snug">{result.summary}</h2>
            {result.dosage && <p className="mt-2 rounded-xl bg-white/10 p-3 text-sm font-medium">{result.dosage}</p>}
          </div>

          {result.method && <ResultRow icon={FlaskConical} tone="bg-violet-100 text-violet-700" title="How to apply" body={result.method} />}
          {result.timing && <ResultRow icon={CalendarClock} tone="bg-cyan-100 text-cyan-700" title="When to apply" body={result.timing} />}
          {result.organic_option && <ResultRow icon={Leaf} tone="bg-leaf-100 text-leaf-700" title="Organic option" body={result.organic_option} />}
          {result.precautions && <ResultRow icon={ShieldAlert} tone="bg-amber-100 text-amber-700" title="Precautions" body={result.precautions} />}
          {result.assumptions && <p className="px-1 text-[11px] leading-relaxed text-gray-400">Assumptions: {result.assumptions}</p>}
        </div>
      )}
    </div>
  );
}

function ResultRow({ icon: Icon, tone, title, body }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{body}</p>
      </div>
    </div>
  );
}
