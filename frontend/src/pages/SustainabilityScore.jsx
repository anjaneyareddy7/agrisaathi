import { useState, useEffect, useCallback } from 'react';
import { Leaf, CheckCircle2, Loader2, Sprout, Recycle, Droplets, FlaskConical, Bug, Flame, CloudRain, Wheat } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';

const PRACTICES = [
  { key: 'organic_fertilizer', label: 'Organic / farmyard manure alongside or instead of chemical fertilizer', icon: Recycle },
  { key: 'crop_rotation', label: 'Rotate crops across seasons rather than repeat the same crop', icon: Sprout },
  { key: 'drip_irrigation', label: 'Drip or sprinkler irrigation rather than flood irrigation', icon: Droplets },
  { key: 'soil_testing', label: 'Test soil before deciding fertilizer dosage', icon: FlaskConical },
  { key: 'pest_ipm', label: 'Integrated pest management (traps, biological control) before chemicals', icon: Bug },
  { key: 'residue_reuse', label: 'Reuse or compost crop residue rather than burning it', icon: Flame },
  { key: 'water_harvesting', label: 'Harvest or conserve rainwater on the farm', icon: CloudRain },
  { key: 'native_seeds', label: 'Native or locally-adapted seed varieties where possible', icon: Wheat },
];

export default function SustainabilityScore() {
  const deviceId = getDeviceId();
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/sustainability/${deviceId}`);
      const blocks = res.data.blocks || [];
      if (blocks.length > 0) {
        setChecked(blocks[blocks.length - 1].payload?.practices || {});
        setSaved(true);
      }
    } catch {
      setChecked({});
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const toggle = (key) => {
    setChecked((c) => ({ ...c, [key]: !c[key] }));
    setSaved(false);
  };

  const submit = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'sustainability',
        entity_id: deviceId,
        event_type: 'checklist_updated',
        payload: { practices: checked },
        actor: deviceId,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const count = Object.values(checked).filter(Boolean).length;
  const score = Math.round((count / PRACTICES.length) * 100);
  const band = score >= 75 ? { label: 'Excellent', cls: 'from-leaf-600 to-leaf-800' }
    : score >= 50 ? { label: 'Good', cls: 'from-leaf-500 to-leaf-700' }
    : score >= 25 ? { label: 'Getting there', cls: 'from-harvest-500 to-harvest-700' }
    : { label: 'Room to grow', cls: 'from-harvest-600 to-harvest-800' };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <div className="mb-4 h-[150px] rounded-3xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
        <div className="h-64 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Sustainability Score" subtitle="A self-assessment based on practices you actually follow" icon={Leaf} />

      {/* Score hero */}
      <div className={`mb-4 overflow-hidden rounded-3xl bg-gradient-to-br ${band.cls} p-5 text-white shadow-md animate-fade-up`}>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Your score</p>
            <p className="mt-1 text-5xl font-bold tracking-tight">{score}<span className="text-lg font-semibold text-white/70">/100</span></p>
            <p className="mt-1 text-sm font-semibold text-white/90">{band.label}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Leaf size={24} /></span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${score}%` }} />
        </div>
        <p className="mt-2 text-xs text-white/75">{count} of {PRACTICES.length} practices followed</p>
      </div>

      <SectionCard className="mb-4 animate-fade-up" icon={CheckCircle2} title="Your practices" tone="bg-leaf-100 text-leaf-700">
        <ul className="divide-y divide-gray-100">
          {PRACTICES.map((p) => (
            <li key={p.key}>
              <button onClick={() => toggle(p.key)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${checked[p.key] ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-400'}`}>
                  <p.icon size={17} />
                </span>
                <p className={`flex-1 text-sm leading-snug ${checked[p.key] ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{p.label}</p>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${checked[p.key] ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-gray-300'}`}>
                  {checked[p.key] && <CheckCircle2 size={14} />}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      {count === 0 && (
        <EmptyState icon={Leaf} title="Start ticking what you already do" subtitle="Even three or four practices make a real difference." />
      )}

      <button onClick={submit} disabled={saving}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${saved ? 'bg-leaf-800' : 'bg-leaf-700 hover:bg-leaf-800'} animate-fade-up`}>
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle2 size={15} /> : <Leaf size={15} />}
        {saving ? 'Saving…' : saved ? 'Saved on your device chain' : 'Save my checklist'}
      </button>
    </div>
  );
}
