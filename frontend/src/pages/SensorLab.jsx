import { useState } from 'react';
import axios from 'axios';
import { Gauge, Bluetooth, FlaskConical, Droplets, CheckCircle2, AlertTriangle, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';
import { SectionCard } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const inputCls = 'h-10 w-full rounded-xl border border-gray-200 bg-white px-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

export default function SensorLab() {
  const [tab, setTab] = useState('soil');
  const [bleStatus, setBleStatus] = useState('Not connected');
  const [busy, setBusy] = useState(false);

  const [soilSamples, setSoilSamples] = useState(Array(15).fill(''));
  const [n, setN] = useState(''); const [p, setP] = useState(''); const [k, setK] = useState('');
  const [oc, setOc] = useState(''); const [soilEc, setSoilEc] = useState('');
  const [soilResult, setSoilResult] = useState(null);
  const [soilError, setSoilError] = useState(null);

  const [waterSamples, setWaterSamples] = useState(Array(5).fill().map(() => ({ ph: '', ec: '' })));
  const [tds, setTds] = useState(''); const [turbidity, setTurbidity] = useState(''); const [hardness, setHardness] = useState('');
  const [waterResult, setWaterResult] = useState(null);
  const [waterError, setWaterError] = useState(null);

  const connectSensor = async () => {
    if (!navigator.bluetooth) {
      setBleStatus('Bluetooth not supported in this browser — enter readings manually below.');
      return;
    }
    try {
      const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
      setBleStatus(`Connected: ${device.name || 'Unknown sensor'} — enter values manually for now`);
    } catch {
      setBleStatus('No device selected — enter readings manually below.');
    }
  };

  const analyzeSoil = async () => {
    setSoilError(null);
    const samples = soilSamples.filter((v) => v !== '').map(Number);
    if (samples.length === 0) { setSoilError('Enter at least one soil pH sample.'); return; }
    setBusy(true);
    try {
      const res = await axios.post(`${API_URL}/api/sensors/soil/analyze`, {
        ph_samples: samples,
        n: n ? Number(n) : null,
        p: p ? Number(p) : null,
        k: k ? Number(k) : null,
        organic_carbon: oc ? Number(oc) : null,
        ec: soilEc ? Number(soilEc) : null,
      });
      setSoilResult(res.data);
    } catch (err) {
      setSoilError(err?.response?.data?.detail?.[0]?.msg || 'Failed to analyze soil samples.');
    } finally {
      setBusy(false);
    }
  };

  const analyzeWater = async () => {
    setWaterError(null);
    const samples = waterSamples
      .filter((s) => s.ph !== '' || s.ec !== '')
      .map((s) => ({ ph: s.ph ? Number(s.ph) : null, ec: s.ec ? Number(s.ec) : null }));
    if (samples.length === 0) { setWaterError('Enter at least one water sample.'); return; }
    setBusy(true);
    try {
      const res = await axios.post(`${API_URL}/api/sensors/water/analyze`, {
        samples,
        tds: tds ? Number(tds) : null,
        turbidity: turbidity ? Number(turbidity) : null,
        hardness: hardness ? Number(hardness) : null,
      });
      setWaterResult(res.data);
    } catch (err) {
      setWaterError(err?.response?.data?.detail?.[0]?.msg || 'Failed to analyze water samples.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Sensor Lab" subtitle="Analyze soil and water samples from your own tests" icon={Gauge} />

      {/* Bluetooth connect */}
      <div className="mb-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 animate-fade-up">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Bluetooth size={18} /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-blue-900">Connect sensor</p>
              <p className="truncate text-xs text-blue-700/80">{bleStatus}</p>
            </div>
          </div>
          <button onClick={connectSensor} className="shrink-0 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100/60">
            Connect
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-blue-700/60">
          Pairs with compatible Bluetooth soil/water sensors (Web Bluetooth). USB sensors aren't readable in-browser — connect a BLE device or enter readings manually below.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5 animate-fade-up">
        {[
          { id: 'soil', label: 'Soil', icon: FlaskConical },
          { id: 'water', label: 'Water', icon: Droplets },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${tab === t.id ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500'}`}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'soil' ? (
        <>
          <SectionCard className="mb-4 animate-fade-up" icon={FlaskConical} title="Soil samples — pH" tone="bg-leaf-100 text-leaf-700">
            <div className="p-4">
              <p className="mb-2 text-[11px] text-gray-400">Up to 15 samples from the same field</p>
              <div className="grid grid-cols-5 gap-2">
                {soilSamples.map((v, i) => (
                  <Input key={i} placeholder={`S${i + 1}`} value={v} type="number" step="0.1" className={inputCls}
                    onChange={(e) => { const arr = [...soilSamples]; arr[i] = e.target.value; setSoilSamples(arr); }} />
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">N (kg/ha)</p><Input type="number" className={inputCls} value={n} onChange={(e) => setN(e.target.value)} /></div>
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">P (kg/ha)</p><Input type="number" className={inputCls} value={p} onChange={(e) => setP(e.target.value)} /></div>
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">K (kg/ha)</p><Input type="number" className={inputCls} value={k} onChange={(e) => setK(e.target.value)} /></div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Organic carbon (%)</p><Input type="number" className={inputCls} value={oc} onChange={(e) => setOc(e.target.value)} /></div>
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">EC (dS/m)</p><Input type="number" className={inputCls} value={soilEc} onChange={(e) => setSoilEc(e.target.value)} /></div>
              </div>
              <button onClick={analyzeSoil} disabled={busy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Analyze soil
              </button>
              {soilError && <p className="mt-2 text-center text-xs font-medium text-red-500">{soilError}</p>}
            </div>
          </SectionCard>

          {soilResult && (
            <SectionCard className="animate-fade-up" icon={CheckCircle2} title="Soil analysis" tone="bg-leaf-100 text-leaf-700">
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { k: 'Avg pH', v: soilResult.avg_ph },
                    { k: 'Range', v: `${soilResult.min_ph}–${soilResult.max_ph}` },
                    { k: 'Variation', v: soilResult.variation },
                  ].map((m) => (
                    <div key={m.k} className="rounded-xl bg-gray-50 px-2 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{m.k}</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">{m.v}</p>
                    </div>
                  ))}
                </div>
                <Badge className="mt-3 bg-blue-100 text-blue-800 hover:bg-blue-100">{soilResult.ph_classification}</Badge>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{soilResult.variation_note}</p>
                <p className="mt-3 text-xs font-semibold text-gray-700">Suitable crops at this pH:</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {soilResult.suitable_crops.map((c) => <Badge key={c} className="bg-leaf-50 text-leaf-700 hover:bg-leaf-50">{c}</Badge>)}
                </div>
              </div>
            </SectionCard>
          )}
        </>
      ) : (
        <>
          <SectionCard className="mb-4 animate-fade-up" icon={Droplets} title="Water samples — pH & EC" tone="bg-blue-100 text-blue-700">
            <div className="p-4">
              <p className="mb-2 text-[11px] text-gray-400">Up to 5 samples from the same source</p>
              {waterSamples.map((s, i) => (
                <div key={i} className="mb-2 grid grid-cols-2 gap-2">
                  <Input placeholder={`#${i + 1} pH`} type="number" step="0.1" className={inputCls} value={s.ph}
                    onChange={(e) => { const arr = [...waterSamples]; arr[i] = { ...arr[i], ph: e.target.value }; setWaterSamples(arr); }} />
                  <Input placeholder="EC" type="number" step="0.1" className={inputCls} value={s.ec}
                    onChange={(e) => { const arr = [...waterSamples]; arr[i] = { ...arr[i], ec: e.target.value }; setWaterSamples(arr); }} />
                </div>
              ))}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">TDS (mg/L)</p><Input type="number" className={inputCls} value={tds} onChange={(e) => setTds(e.target.value)} /></div>
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Turbidity (NTU)</p><Input type="number" className={inputCls} value={turbidity} onChange={(e) => setTurbidity(e.target.value)} /></div>
                <div><p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Hardness (mg/L)</p><Input type="number" className={inputCls} value={hardness} onChange={(e) => setHardness(e.target.value)} /></div>
              </div>
              <button onClick={analyzeWater} disabled={busy}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50">
                {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} Check water suitability
              </button>
              {waterError && <p className="mt-2 text-center text-xs font-medium text-red-500">{waterError}</p>}
            </div>
          </SectionCard>

          {waterResult && (
            <SectionCard className="animate-fade-up" icon={waterResult.issues?.length ? AlertTriangle : CheckCircle2} title="Water analysis" tone="bg-blue-100 text-blue-700">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2 text-center">
                  {[
                    { k: 'Avg pH', v: waterResult.avg_ph },
                    { k: 'Avg EC', v: waterResult.avg_ec },
                  ].map((m) => (
                    <div key={m.k} className="rounded-xl bg-gray-50 px-2 py-2.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{m.k}</p>
                      <p className="mt-0.5 text-sm font-bold text-gray-900">{m.v ?? '—'}</p>
                    </div>
                  ))}
                </div>
                {waterResult.issues?.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {waterResult.issues.map((issue, i) => (
                      <li key={i} className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {issue}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
