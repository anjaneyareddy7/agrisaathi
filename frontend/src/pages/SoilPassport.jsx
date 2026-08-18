import { files } from '../api/appClient';
import { ai } from '../api/appClient';
import { useState, useEffect } from 'react'
import { Sprout, ShieldCheck, ScanLine, Plus, LineChart as LineChartIcon } from 'lucide-react';
import { useLang } from '../lib/i18n';
import appClient from '../api/appClient';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Image } from '../components/ui/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../components/PageHeader';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const toHash = async (obj) => {
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export default function SoilPassport() {
  const { t } = useLang();
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
    if (!form.plot_name) { alert('Plot name required'); return; }
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
      alert(t('confirmValues'));
    } catch (_err) {
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
      pH: r.ph ?? null,
      N: r.nitrogen ?? null,
      P: r.phosphorus ?? null,
      K: r.potassium ?? null,
      OC: r.organic_carbon ?? null,
    }));
  const hasTrend = trendData.filter((d) => d.pH != null || d.N != null || d.P != null || d.K != null).length >= 2;

  return (
    <div>
      <PageHeader titleKey="soilPassport" icon={Sprout} />

      {soilProfiles.length > 0 && (
        <Card className="mb-4 border-blue-200"><CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Government soil reference (state-level)</h3>
          <Select value={refState} onValueChange={setRefState}>
            <SelectTrigger className="h-8 text-sm mb-2"><SelectValue placeholder="Select your state" /></SelectTrigger>
            <SelectContent>{soilProfiles.map((p) => <SelectItem key={p.state} value={p.state}>{p.state}</SelectItem>)}</SelectContent>
          </Select>
          {refProfile && (
            <div className="text-sm space-y-1">
              <p><span className="text-gray-400">Dominant soil type:</span> {refProfile.dominant_soil_type}</p>
              <p><span className="text-gray-400">Typical pH range:</span> {refProfile.typical_ph_range}</p>
              <p><span className="text-gray-400">Characteristics:</span> {refProfile.characteristics}</p>
              <p><span className="text-gray-400">Suitable crops:</span> {refProfile.suitable_crops}</p>
            </div>
          )}
          <p className="text-[10px] text-gray-300 mt-2">Reference values only — not a substitute for your own soil test.</p>
        </CardContent></Card>
      )}

      <div className="space-y-2 mb-4">
        {records.length === 0 ? (
          <p className="text-sm text-gray-400">No soil records yet. Add one or scan a Soil Health Card.</p>
        ) : records.map((r) => (
          <Card key={r.id}><CardContent className="pt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{r.plot_name}</p>
              {r.record_hash && <Badge className="bg-green-100 text-green-700 flex items-center gap-1"><ShieldCheck className="h-3 w-3" />{t('verifiedBadge')}</Badge>}
            </div>
            <p className="text-xs text-gray-400">{r.test_date || 'No date'} {r.testing_organization ? `· ${r.testing_organization}` : ''}</p>
            <div className="grid grid-cols-5 gap-1 mt-2 text-center">
              {[['pH', num(r.ph)], ['N', num(r.nitrogen)], ['P', num(r.phosphorus)], ['K', num(r.potassium)], ['OC', num(r.organic_carbon)]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded p-1"><div className="text-[10px] text-gray-400">{k}</div><div className="text-xs font-medium">{v}</div></div>
              ))}
            </div>
            {r.notes && <p className="text-xs text-gray-500 mt-2">{r.notes}</p>}
            <p className="text-[10px] text-gray-300 mt-1 truncate">hash: {r.record_hash?.slice(0, 24)}…</p>
          </CardContent></Card>
        ))}
      </div>

      {plots.length > 0 && (
        <Card className="mb-4"><CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <LineChartIcon className="h-4 w-4 text-green-600" /> {t('soilTrend')}
          </h3>
          {plots.length > 1 && (
            <Select value={trendPlot} onValueChange={setTrendPlot}>
              <SelectTrigger className="h-8 text-sm mb-2"><SelectValue /></SelectTrigger>
              <SelectContent>{plots.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          )}
          {hasTrend ? (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="pH" stroke="#16a34a" dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="N" stroke="#3b82f6" dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="P" stroke="#f59e0b" dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="K" stroke="#ef4444" dot={{ r: 3 }} connectNulls />
                  <Line type="monotone" dataKey="OC" stroke="#a855f7" dot={{ r: 3 }} connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-gray-400">{t('soilTrendEmpty')}</p>
          )}
        </CardContent></Card>
      )}

      <p className="text-xs text-gray-400 mb-3">⚠️ {t('blockchainUnavailable')}</p>

      {showAdd ? (
        <Card className="border-green-200"><CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label>{t('addSoilRecord')}</Label>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-lg"><ScanLine className="h-3.5 w-3.5" />{scanning ? t('loading') : t('scanCard')}</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={scanCard} />
            </label>
          </div>
          {form.card_file_url && <Image src={form.card_file_url} className="w-full h-32 rounded-lg" fittingType="fit" />}
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="mb-1 block text-xs">{t('plotName')}</Label><Input value={form.plot_name} onChange={(e) => setForm({ ...form, plot_name: e.target.value })} /></div>
            <div><Label className="mb-1 block text-xs">Test date</Label><Input type="date" value={form.test_date} onChange={(e) => setForm({ ...form, test_date: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[['ph', 'pH'], ['nitrogen', 'N'], ['phosphorus', 'P'], ['potassium', 'K'], ['organic_carbon', 'OC']].map(([k, lbl]) => (
              <div key={k}><Label className="mb-1 block text-xs">{lbl}</Label><Input type="number" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
            ))}
          </div>
          <Input placeholder={t('soilType')} value={form.soil_type} onChange={(e) => setForm({ ...form, soil_type: e.target.value })} />
          <Textarea placeholder={t('notes')} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
          <div className="flex gap-2">
            <Button onClick={save} className="flex-1 bg-green-600 hover:bg-green-700">{t('save')}</Button>
            <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">{t('cancel')}</Button>
          </div>
        </CardContent></Card>
      ) : (
        <Button onClick={() => setShowAdd(true)} variant="outline" className="w-full border-green-300 text-green-700"><Plus className="h-4 w-4 mr-1" />{t('addSoilRecord')}</Button>
      )}
    </div>
  );
}
