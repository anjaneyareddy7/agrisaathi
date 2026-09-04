import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, XCircle, Info, FileBadge } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function CropPassport() {
  const [requirements, setRequirements] = useState([]);
  const [source, setSource] = useState('reference_data');
  const [selected, setSelected] = useState(null);
  const [chain, setChain] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/api/crop-passport/requirements`)
      .then((res) => {
        setRequirements(res.data.requirements);
        setSource(res.data.source);
      })
      .catch(() => setRequirements([]));
  }, []);

  const current = requirements.find((r) => r.crop === selected);

  const generatePassport = async () => {
    if (!current) return;
    setGenerating(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'crop_passport',
        entity_id: current.crop,
        event_type: 'passport_generated',
        payload: current,
      });
      const chainRes = await axios.get(
        `${API_URL}/api/ledger/chain/crop_passport/${encodeURIComponent(current.crop)}`
      );
      setChain(chainRes.data);
    } catch {
      setChain(null);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Crop Passport" subtitle="Verified soil & water requirements per crop, on a tamper-evident ledger" icon={ShieldCheck} />

      {source === 'reference_data' && (
        <div className="mb-4 flex items-start gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 animate-fade-up">
          <Info size={14} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-amber-800/90">
            Showing reference data — live data.gov.in crop requirement data will replace this once the API key is active.
          </p>
        </div>
      )}

      {/* Crop picker */}
      <div className="mb-4 animate-fade-up">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Select crop</label>
        <div className="relative">
          <select
            value={selected || ''}
            onChange={(e) => { setSelected(e.target.value); setChain(null); }}
            className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-900 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100"
          >
            <option value="">Choose a crop…</option>
            {requirements.map((r) => (
              <option key={r.crop} value={r.crop}>{r.crop}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
        </div>
      </div>

      {!current ? (
        <EmptyState icon={ShieldCheck} title="Pick a crop" subtitle="Its soil, water and nutrient passport will appear here." />
      ) : (
        <>
          {/* Requirement passport */}
          <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Requirement passport</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{current.crop}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {[
                { k: 'Soil pH', v: current.soil_ph },
                { k: 'Nitrogen', v: current.nitrogen_kg_ha },
                { k: 'Phosphorus', v: current.phosphorus_kg_ha },
                { k: 'Potassium', v: current.potassium_kg_ha },
                { k: 'Temperature', v: current.temperature_c },
                { k: 'Water need', v: current.water_requirement },
              ].map((m) => (
                <div key={m.k} className="rounded-2xl bg-white/15 px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{m.k}</p>
                  <p className="mt-0.5 text-sm font-bold">{m.v ?? '—'}</p>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-2xl bg-white/15 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Moisture</p>
              <p className="mt-0.5 text-sm font-bold">{current.moisture ?? '—'}</p>
            </div>
          </div>

          <button onClick={generatePassport} disabled={generating}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-60 animate-fade-up">
            {generating ? <Loader2 size={15} className="animate-spin" /> : <FileBadge size={15} />}
            {generating ? 'Recording…' : 'Generate verified passport'}
          </button>

          {/* Chain */}
          {chain && (
            <SectionCard className="animate-fade-up" icon={chain.valid ? CheckCircle2 : XCircle} title={chain.valid ? 'Ledger verified' : 'Chain check failed'} tone={chain.valid ? 'bg-leaf-100 text-leaf-700' : 'bg-red-100 text-red-600'}>
              <ul className="divide-y divide-gray-100">
                {chain.blocks.map((b, i) => (
                  <li key={b.index} className="px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                    <p className="text-xs font-semibold text-gray-800">
                      #{b.index} <span className="capitalize text-gray-600">{b.event_type.replace(/_/g, ' ')}</span>
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-400">{new Date(b.timestamp).toLocaleString('en-IN')}</p>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-gray-300">{b.hash}</p>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
