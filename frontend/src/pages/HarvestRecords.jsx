import { useState, useEffect } from 'react';
import { Wheat, Plus, X, Trash2, TrendingUp, BarChart3, CalendarDays, IndianRupee, Package } from 'lucide-react';
import appClient from '../api/appClient';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';
const EMPTY = { plot_name: '', crop_name: '', harvest_date: '', quantity: '', quantity_unit: 'quintal', area_harvested: '', quality_grade: '', sale_price_per_unit: '', season: '', notes: '' };

export default function HarvestRecords() {
  const [farms, setFarms] = useState([]);
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [chart, setChart] = useState('crop');

  const load = async () => {
    const [f, r] = await Promise.all([
      appClient.entities.Farm.list().catch(() => []),
      appClient.entities.HarvestRecord.list('-harvest_date', 200).catch(() => []),
    ]);
    setFarms(f); setRecords(r);
  };
  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.plot_name || !form.crop_name || !form.harvest_date) return;
    await appClient.entities.HarvestRecord.create({
      ...form,
      quantity: form.quantity ? Number(form.quantity) : undefined,
      area_harvested: form.area_harvested ? Number(form.area_harvested) : undefined,
      sale_price_per_unit: form.sale_price_per_unit ? Number(form.sale_price_per_unit) : undefined,
      quality_grade: form.quality_grade || undefined,
    });
    setForm(EMPTY);
    setShowForm(false);
    load();
  };
  const remove = async (id) => { await appClient.entities.HarvestRecord.delete(id); load(); };

  const plots = [...new Set(records.map((r) => r.plot_name).filter(Boolean))].sort();
  const [trendPlot, setTrendPlot] = useState('');
  useEffect(() => { if (plots.length && !trendPlot) setTrendPlot(plots[0]); }, [plots, trendPlot]);
  const trendData = records
    .filter((r) => r.plot_name === trendPlot && r.harvest_date && r.quantity != null)
    .sort((a, b) => new Date(a.harvest_date) - new Date(b.harvest_date))
    .map((r) => ({ date: new Date(r.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), yield: r.quantity }));

  const byCrop = (() => {
    const byKey = {};
    records.forEach((r) => {
      const key = r.crop_name || '—';
      byKey[key] = (byKey[key] || 0) + (r.quantity || 0);
    });
    return Object.entries(byKey)
      .map(([name, q]) => ({ name, yield: Math.round(q * 10) / 10 }))
      .sort((a, b) => b.yield - a.yield)
      .slice(0, 8);
  })();

  const totalQty = records.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalValue = records.reduce((sum, r) => sum + (r.quantity || 0) * (r.sale_price_per_unit || 0), 0);
  const avgPrice = totalQty > 0 ? totalValue / totalQty : 0;
  const unit = records[0]?.quantity_unit || 'quintal';

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Harvest Records"
        subtitle="Log every harvest — see yield by plot, crop and season"
        icon={Wheat}
      />

      {/* Season summary hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-5 text-white shadow-md animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">All-time harvest</p>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight">{totalQty.toFixed(1)}</span>
          <span className="text-sm font-medium text-white/80">{unit}s</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Est. value</p>
            <p className="mt-0.5 flex items-center text-sm font-bold"><IndianRupee size={13} className="mr-0.5" />{totalValue.toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Avg price</p>
            <p className="mt-0.5 text-sm font-bold">₹{Math.round(avgPrice).toLocaleString('en-IN')}<span className="font-medium text-white/70">/q</span></p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Records</p>
            <p className="mt-0.5 text-sm font-bold">{records.length}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      {records.length > 0 && (
        <SectionCard className="mb-4 animate-fade-up">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-1">
              {[{ id: 'crop', label: 'By crop', icon: BarChart3 }, { id: 'plot', label: 'By plot', icon: TrendingUp }].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setChart(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-semibold transition-all ${chart === tab.id ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500'}`}
                >
                  <tab.icon size={13} /> {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="px-2 pb-3 pt-4">
            {chart === 'crop' ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byCrop} margin={{ top: 5, right: 16, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} ${unit}`, 'Yield']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Bar dataKey="yield" fill="#d97706" radius={[6, 6, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : plots.length > 1 ? (
              <div className="mb-3 px-2">
                <Select value={trendPlot} onValueChange={setTrendPlot}>
                  <SelectTrigger className="h-9 rounded-xl border-gray-200 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>{plots.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            ) : null}
            {chart === 'plot' && (trendData.length >= 2 ? (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 16, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => [`${v} ${unit}`, 'Yield']} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Line type="monotone" dataKey="yield" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3, fill: '#16a34a' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-6 text-center text-xs text-gray-400">Log at least 2 harvests from this plot to see the trend.</p>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Add harvest */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up"
        >
          <Plus size={16} /> Log harvest
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New harvest entry</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Plot">
              <Select value={form.plot_name} onValueChange={(v) => {
                const f = farms.find((x) => x.plot_name === v);
                setForm({ ...form, plot_name: v, crop_name: f?.current_crop || '', area_harvested: f?.area_value || '' });
              }}>
                <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue placeholder="Choose plot" /></SelectTrigger>
                <SelectContent>{farms.map((f) => <SelectItem key={f.id} value={f.plot_name}>{f.plot_name}</SelectItem>)}</SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Crop"><Input className={inputCls} value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} placeholder="e.g. Paddy" /></FormField>
              <FormField label="Harvest date"><Input className={inputCls} type="date" value={form.harvest_date} onChange={(e) => setForm({ ...form, harvest_date: e.target.value })} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label={`Quantity (${unit})`}><Input className={inputCls} type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="0" /></FormField>
              <FormField label="Area (acres)"><Input className={inputCls} type="number" value={form.area_harvested} onChange={(e) => setForm({ ...form, area_harvested: e.target.value })} placeholder="0" /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Quality grade">
                <Select value={form.quality_grade || '__none__'} onValueChange={(v) => setForm({ ...form, quality_grade: v === '__none__' ? '' : v })}>
                  <SelectTrigger className="h-11 rounded-xl border-gray-200"><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">—</SelectItem>
                    <SelectItem value="A">A</SelectItem><SelectItem value="B">B</SelectItem><SelectItem value="C">C</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Price / unit (₹)"><Input className={inputCls} type="number" value={form.sale_price_per_unit} onChange={(e) => setForm({ ...form, sale_price_per_unit: e.target.value })} placeholder="0" /></FormField>
            </div>
            <button onClick={submit} className="mt-1 w-full rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800">
              Save harvest
            </button>
          </div>
        </div>
      )}

      {/* History */}
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500"><CalendarDays size={13} /> History</h3>
      {records.length === 0 ? (
        <EmptyState icon={Wheat} title="No harvests logged yet" subtitle="Tap “Log harvest” to record your first yield." />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {records.map((r, i) => (
              <li key={r.id} className="flex items-center gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-harvest-100 text-harvest-700"><Wheat size={17} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">{r.crop_name || 'Crop'} <span className="font-normal text-gray-400">· {r.plot_name}</span></p>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {r.harvest_date && new Date(r.harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}<span className="font-medium text-gray-700">{r.quantity || 0} {r.quantity_unit}</span>
                    {r.sale_price_per_unit ? ` · ₹${r.sale_price_per_unit}/unit` : ''}
                  </p>
                </div>
                {r.quality_grade && <Badge className="bg-harvest-100 text-harvest-800 hover:bg-harvest-100">{r.quality_grade}</Badge>}
                <button onClick={() => remove(r.id)} className="rounded-lg p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"><Trash2 size={15} /></button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
