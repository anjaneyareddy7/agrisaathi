import { useState, useEffect } from 'react';
import { TrendingUp, FlaskConical, Droplets, CalendarDays, MapPin, Loader2, Sparkles, Wheat } from 'lucide-react';
import { base44 } from '../api/base44Client';
import axios from 'axios';
import { districtsOf } from '../lib/indianLocations';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';
import YieldEstimator from '../components/YieldEstimator';

const API_URL = import.meta.env.VITE_API_URL || '';

const waterScore = (need, avail) => {
  if (!need) return 1;
  const n = need.toLowerCase();
  if (n.includes('very low')) return avail === 'low' ? 3 : avail === 'medium' ? 2 : 1;
  if (n.includes('low')) return avail === 'low' ? 3 : avail === 'medium' ? 2.5 : 1.5;
  if (n.includes('high')) return avail === 'high' ? 3 : avail === 'medium' ? 2 : 1;
  return avail === 'medium' ? 2.5 : 2;
};

const WATER_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'medium', label: 'Medium' },
  { id: 'high', label: 'High' },
];
const SEASON_OPTIONS = ['', 'kharif', 'rabi', 'zaid', 'perennial'];
const SEASON_LABELS = { '': 'Any', kharif: 'Kharif', rabi: 'Rabi', zaid: 'Zaid', perennial: 'Perennial' };

export default function CropPlanner() {
  const [crops, setCrops] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [water, setWater] = useState('medium');
  const [season, setSeason] = useState('');
  const [ranked, setRanked] = useState([]);
  const [estimates, setEstimates] = useState({});
  const [loading, setLoading] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [soilCtx, setSoilCtx] = useState(null);
  const [waterCtx, setWaterCtx] = useState(null);

  useEffect(() => {
    base44.entities.Crop.list('name_en', 300).then(setCrops).catch(() => []);
    base44.entities.StateSoilProfile.list().then(setProfiles).catch(() => []);
  }, []);

  const plan = async () => {
    const profile = profiles.find((p) => p.state_ut === state);
    let soil = null, wq = null;
    try {
      const soilRecs = await base44.entities.SoilRecord.list('-test_date', 50);
      soil = soilRecs.find((r) => (!state || r.state === state) && (!district || r.district === district)) || soilRecs.find((r) => !state || r.state === state) || soilRecs[0];
    } catch (err) { console.warn('CropPlanner data fetch failed:', err); }
    try {
      const wqRecs = await base44.entities.SensorTest.filter({ test_type: 'water' }, '-test_date', 20).catch(() => []);
      wq = wqRecs[0];
    } catch (err) { console.warn('CropPlanner data fetch failed:', err); }
    setSoilCtx(soil); setWaterCtx(wq);
    const soilInfo = soil ? `Soil pH ${soil.ph ?? '?'}, N ${soil.nitrogen ?? '?'}, P ${soil.phosphorus ?? '?'}, K ${soil.potassium ?? '?'}, OC ${soil.organic_carbon ?? '?'}%, type ${soil.soil_type || '?'}` : 'unknown';
    const waterInfo = wq ? `Water pH ${wq.water_ph ?? '?'}, EC ${wq.water_ec ?? '?'}, TDS ${wq.water_tds ?? '?'}` : 'no water test data';
    const scored = crops.map((c) => {
      let score = 0;
      if (state && c.typical_states?.toLowerCase().includes(state.toLowerCase().split(' ')[0])) score += 3;
      score += waterScore(c.water_requirement, water);
      if (season && c.season?.toLowerCase().includes(season.toLowerCase())) score += 2;
      if (profile && c.typical_states?.toLowerCase().includes(state.toLowerCase().split(' ')[0])) score += 0.5;
      return { ...c, _score: score };
    }).sort((a, b) => b._score - a._score).slice(0, 8);
    setRanked(scored);
    setPlanned(true);
    setLoading(true);
    setEstimates({});
    try {
      const res = await axios.post(`${API_URL}/api/crop-planner/estimate`, {
        state, district, water, season,
        soil_context: soilInfo,
        water_context: waterInfo,
        crop_names: scored.map((c) => c.name_en),
      });
      const map = {};
      (res.data.crops || []).forEach((c) => { map[c.name] = c; });
      setEstimates(map);
      axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'crop_plan',
        entity_id: `${state || 'india'}_${Date.now()}`,
        event_type: 'plan_generated',
        payload: { state, district, water, season, top_crops: scored.slice(0, 3).map((c) => c.name_en) },
      }).catch(() => {});
    } catch {
      setEstimates({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Crop Planner"
        subtitle="Rank crops by fit for your soil, water and season"
        icon={TrendingUp}
      />

      <div className="mb-4">
        <YieldEstimator />
      </div>

      {/* Plan inputs */}
      <SectionCard className="mb-4 animate-fade-up" icon={MapPin} title="Your plot">
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="State">
              <Select value={state} onValueChange={(v) => { setState(v); setDistrict(''); }}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent className="max-h-72">{profiles.map((p) => <SelectItem key={p.id} value={p.state_ut}>{p.state_ut}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <FormField label="District">
              <Select value={district} onValueChange={setDistrict} disabled={!state}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200" disabled={!state}><SelectValue placeholder={state ? 'Select district' : 'Select state first'} /></SelectTrigger>
                <SelectContent className="max-h-72">{districtsOf(state).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
          </div>

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"><Droplets size={12} /> Water availability</span>
            <div className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5">
              {WATER_OPTIONS.map((o) => (
                <button key={o.id} onClick={() => setWater(o.id)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${water === o.id ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500'}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"><CalendarDays size={12} /> Season</span>
            <div className="flex items-center gap-1.5 overflow-x-auto rounded-2xl border border-gray-200 bg-gray-50 p-1.5 no-scrollbar">
              {SEASON_OPTIONS.map((s) => (
                <button key={s} onClick={() => setSeason(s)}
                  className={`flex-1 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-all ${season === s ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500'}`}>
                  {SEASON_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <button onClick={plan} disabled={!crops.length}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
            <Sparkles size={16} /> Rank crops by fit
          </button>
          <p className="text-center text-[11px] text-gray-400">Estimates are indicative — verify with your local agriculture officer.</p>
        </div>
      </SectionCard>

      {/* Soil & water context */}
      {(soilCtx || waterCtx) && (
        <div className="mb-4 rounded-2xl border border-leaf-200 bg-leaf-50/60 p-4 animate-fade-up">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-leaf-800"><FlaskConical size={13} /> Soil &amp; water context used</p>
          {soilCtx && <p className="mt-1.5 text-xs text-gray-600">pH {soilCtx.ph ?? '—'} · N {soilCtx.nitrogen ?? '—'} · P {soilCtx.phosphorus ?? '—'} · K {soilCtx.potassium ?? '—'} · {soilCtx.soil_type || '—'}</p>}
          {waterCtx && <p className="mt-0.5 text-xs text-gray-600">Water pH {waterCtx.water_ph ?? '—'} · EC {waterCtx.water_ec ?? '—'} · TDS {waterCtx.water_tds ?? '—'}</p>}
        </div>
      )}

      {/* Ranked results */}
      {loading && (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[92px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      )}

      {!loading && planned && ranked.length === 0 && (
        <EmptyState icon={Wheat} title="No crops matched" subtitle="Try a different state, season or water level." />
      )}

      {!loading && ranked.length > 0 && (
        <div className="space-y-2">
          {ranked.map((c, i) => {
            const est = estimates[c.name_en];
            return (
              <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-leaf-300 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${i === 0 ? 'bg-harvest-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{i + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">{c.name_en}</p>
                      <p className="text-xs text-gray-400">{c.category} · {c.season} · {c.duration_days || '—'} days</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700">{c.water_requirement || '—'}</span>
                </div>
                {est && (
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-red-50 px-2 py-2"><p className="text-[10px] uppercase tracking-wide text-red-400">Cost</p><p className="mt-0.5 font-bold text-red-700">{est.cost}</p></div>
                    <div className="rounded-xl bg-leaf-50 px-2 py-2"><p className="text-[10px] uppercase tracking-wide text-leaf-500">Revenue</p><p className="mt-0.5 font-bold text-leaf-700">{est.revenue}</p></div>
                    <div className="rounded-xl bg-harvest-50 px-2 py-2"><p className="text-[10px] uppercase tracking-wide text-harvest-500">Margin</p><p className="mt-0.5 font-bold text-harvest-700">{est.margin}</p></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
