import { useState, useEffect } from 'react';
import { Activity, Plus, X, Trash2, Radio, FlaskConical, Droplets, ThermometerSun, Zap } from 'lucide-react';
import appClient from '../api/appClient';
import { Input } from '../components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { soil_ph: '', soil_moisture: '', soil_ec: '', soil_nitrogen: '', test_date: '' };

export default function SensorHub() {
  const [readings, setReadings] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const load = () => appClient.entities.SensorTest.list('-test_date', 30).then(setReadings).catch(() => []);
  useEffect(() => { load(); }, []);

  const save = async () => {
    await appClient.entities.SensorTest.create({
      test_type: 'soil',
      soil_ph: form.soil_ph ? Number(form.soil_ph) : undefined,
      soil_moisture: form.soil_moisture ? Number(form.soil_moisture) : undefined,
      soil_ec: form.soil_ec ? Number(form.soil_ec) : undefined,
      soil_nitrogen: form.soil_nitrogen ? Number(form.soil_nitrogen) : undefined,
      test_date: form.test_date || new Date().toISOString().slice(0, 10),
    });
    setForm(EMPTY);
    setShowAdd(false);
    load();
  };

  const remove = async (id) => { await appClient.entities.SensorTest.delete(id); load(); };

  const latest = readings[0];
  const trendData = readings
    .filter((r) => r.test_date)
    .sort((a, b) => new Date(a.test_date) - new Date(b.test_date))
    .map((r) => ({
      date: new Date(r.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      pH: r.soil_ph ?? null,
      Moisture: r.soil_moisture ?? null,
      EC: r.soil_ec ?? null,
      N: r.soil_nitrogen ?? null,
    }));

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Sensor Hub" subtitle="Log soil sensor readings and watch the trends" icon={Activity} />

      {/* Latest reading hero */}
      {latest ? (
        <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-leaf-800 p-5 text-white shadow-md animate-fade-up">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            <Radio size={12} className="animate-pulse" /> Latest reading
          </p>
          <p className="mt-1 text-sm font-medium text-white/85">
            {new Date(latest.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { k: 'pH', v: latest.soil_ph },
              { k: 'Moisture', v: latest.soil_moisture != null ? `${latest.soil_moisture}%` : null },
              { k: 'EC', v: latest.soil_ec },
              { k: 'N', v: latest.soil_nitrogen },
            ].map((m) => (
              <div key={m.k} className="rounded-2xl bg-white/15 px-2 py-2.5 text-center">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">{m.k}</p>
                <p className="mt-0.5 text-sm font-bold">{m.v ?? '—'}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 to-leaf-800 p-5 text-white shadow-md animate-fade-up">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Sensor Hub</p>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-white/85">
            Record pH, moisture, EC and nitrogen readings from your soil sensors — the trend chart builds as you log.
          </p>
        </div>
      )}

      {/* Trend */}
      {trendData.length >= 2 && (
        <SectionCard className="mb-4 animate-fade-up" icon={Activity} title="Sensor trend" tone="bg-cyan-100 text-cyan-700">
          <div className="h-56 px-2 pb-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="pH" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="Moisture" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="EC" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="N" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {/* Add reading */}
      {!showAdd ? (
        <button onClick={() => setShowAdd(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-cyan-400 bg-cyan-50/50 py-3 text-sm font-semibold text-cyan-700 transition-colors hover:bg-cyan-50 animate-fade-up">
          <Plus size={16} /> Add reading
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New reading</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Date">
              <Input className={inputCls} type="date" value={form.test_date} onChange={(e) => setForm({ ...form, test_date: e.target.value })} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="pH"><Input className={inputCls} type="number" step="0.1" value={form.soil_ph} onChange={(e) => setForm({ ...form, soil_ph: e.target.value })} placeholder="6.5" /></FormField>
              <FormField label="Moisture (%)"><Input className={inputCls} type="number" value={form.soil_moisture} onChange={(e) => setForm({ ...form, soil_moisture: e.target.value })} placeholder="30" /></FormField>
              <FormField label="EC (dS/m)"><Input className={inputCls} type="number" value={form.soil_ec} onChange={(e) => setForm({ ...form, soil_ec: e.target.value })} placeholder="0.8" /></FormField>
              <FormField label="Nitrogen"><Input className={inputCls} type="number" value={form.soil_nitrogen} onChange={(e) => setForm({ ...form, soil_nitrogen: e.target.value })} placeholder="280" /></FormField>
            </div>
            <button onClick={save} className="mt-1 w-full rounded-xl bg-cyan-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan-800">
              Save reading
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {readings.length === 0 ? (
        <EmptyState icon={Activity} title="No readings yet" subtitle="Log your first sensor reading above." />
      ) : (
        <SectionCard title="Recent readings" icon={FlaskConical}>
          <ul className="divide-y divide-gray-100">
            {readings.map((r, i) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><Droplets size={15} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(r.test_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    pH {r.soil_ph ?? '—'} · Moisture {r.soil_moisture ?? '—'} · EC {r.soil_ec ?? '—'} · N {r.soil_nitrogen ?? '—'}
                  </p>
                </div>
                <button onClick={() => remove(r.id)} className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
