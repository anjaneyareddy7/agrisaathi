import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, CalendarDays, AlertTriangle, Plus, Leaf, MapPin, TrendingUp, Sprout, Wheat, X } from 'lucide-react';
import DashboardCalendar from '../components/DashboardCalendar';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import ProfitCalculator from '../components/ProfitCalculator';
import { SectionCard, FormField, StatTile } from '../components/kit';
import { Button } from '../components/ui/button';

const today = new Date().toISOString().slice(0, 10);
const daysUntil = (d) => Math.ceil((new Date(d) - new Date(today)) / 86400000);
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

export default function Dashboard() {
  const [farms, setFarms] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [harvests, setHarvests] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ plot_name: '', state: '', crop_name: '', area_value: '', sowing_date: '', expected_harvest_date: '' });

  const load = async () => {
    const [f, c, dx, ls, lg, hv] = await Promise.all([
      appClient.entities.Farm.list().catch(() => []),
      appClient.entities.CropCycle.list().catch(() => []),
      appClient.entities.Diagnosis.filter({ escalate: true }, '-created_date', 10).catch(() => []),
      appClient.entities.LivestockCareLog.filter({ status: 'pending' }, 'scheduled_date', 100).catch(() => []),
      appClient.entities.FarmLedgerEntry.list('-entry_date', 100).catch(() => []),
      appClient.entities.HarvestRecord.list('-harvest_date', 50).catch(() => []),
    ]);
    setFarms(f); setCycles(c); setAlerts(dx); setLivestock(ls); setLedger(lg); setHarvests(hv);
  };
  useEffect(() => { load(); }, []);

  const upcoming = cycles
    .filter((c) => c.expected_harvest_date && c.status !== 'harvested')
    .sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
  const urgentCycles = cycles.filter((c) => c.alert_level === 'urgent');
  const urgentCount = alerts.length + urgentCycles.length;

  const harvestEvents = upcoming.map((c) => ({ date: c.expected_harvest_date, label: `${c.plot_name} · ${c.crop_name}`, kind: 'harvest' }));
  const milestoneEvents = livestock
    .filter((l) => l.scheduled_date)
    .map((l) => ({ date: l.scheduled_date, label: `${l.animal_type} · ${l.title}`, kind: 'maintenance' }));

  const addPlot = async () => {
    if (!form.plot_name || !form.crop_name) { alert('Plot name and crop are required'); return; }
    const farm = await appClient.entities.Farm.create({
      plot_name: form.plot_name, state: form.state,
      area_value: form.area_value ? Number(form.area_value) : undefined,
      current_crop: form.crop_name, farm_type: 'crop',
    });
    await appClient.entities.CropCycle.create({
      farm_id: farm.id, plot_name: form.plot_name, crop_name: form.crop_name,
      sowing_date: form.sowing_date || undefined, expected_harvest_date: form.expected_harvest_date || undefined,
      status: form.sowing_date ? 'sown' : 'planned',
    });
    setForm({ plot_name: '', state: '', crop_name: '', area_value: '', sowing_date: '', expected_harvest_date: '' });
    setShowAdd(false);
    load();
  };

  const totalCost = ledger.filter((e) => e.kind === 'expense').reduce((s, e) => s + (e.amount || 0), 0);
  const harvestValue = harvests.reduce((s, h) => s + ((h.quantity || 0) * (h.sale_price_per_unit || 0)), 0);
  const diff = harvestValue - totalCost;
  const maxVal = Math.max(totalCost, harvestValue, 1);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="My Farm" icon={LayoutGrid} subtitle="Everything about your farm, at a glance" />

      {/* Stats */}
      <div className="grid animate-fade-up grid-cols-3 gap-2.5">
        <StatTile icon={Sprout} label="Plots" value={farms.length} tone="bg-leaf-100 text-leaf-700" />
        <StatTile icon={Wheat} label="Harvests soon" value={upcoming.length} tone="bg-amber-100 text-amber-700" />
        <StatTile icon={AlertTriangle} label="Urgent" value={urgentCount} tone="bg-red-100 text-red-600" />
      </div>

      {/* Profit calculator */}
      <div className="mt-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
        <ProfitCalculator />
      </div>

      {/* Cost vs market value */}
      <div className="mt-4 animate-fade-up" style={{ animationDelay: '120ms' }}>
        <SectionCard icon={TrendingUp} title="Cost vs harvest value" tone="bg-leaf-100 text-leaf-700">
          <div className="space-y-3 p-4">
            <div>
              <div className="mb-1 flex justify-between text-xs"><span className="font-medium text-red-600">Production cost</span><span className="font-bold text-red-600">₹{totalCost.toLocaleString('en-IN')}</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full animate-grow-x origin-left rounded-full bg-gradient-to-r from-red-400 to-red-500" style={{ width: `${(totalCost / maxVal) * 100}%` }} /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs"><span className="font-medium text-leaf-700">Harvest value</span><span className="font-bold text-leaf-700">₹{harvestValue.toLocaleString('en-IN')}</span></div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full animate-grow-x origin-left rounded-full bg-gradient-to-r from-leaf-400 to-leaf-600" style={{ width: `${(harvestValue / maxVal) * 100}%`, animationDelay: '150ms' }} /></div>
            </div>
            <div className={`rounded-xl p-3 text-center ${diff >= 0 ? 'bg-leaf-50' : 'bg-amber-50'}`}>
              <div className={`text-base font-bold ${diff >= 0 ? 'text-leaf-700' : 'text-amber-700'}`}>
                {diff >= 0 ? 'Surplus' : 'Deficit'}: ₹{Math.abs(diff).toLocaleString('en-IN')}
              </div>
              <div className="text-[10px] text-gray-400">Based on your ledger and harvest records</div>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Calendar */}
      <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><CalendarDays size={15} className="text-leaf-600" /> Farm calendar</h3>
      <DashboardCalendar harvestEvents={harvestEvents} milestoneEvents={milestoneEvents} />

      {/* Urgent alerts */}
      <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><AlertTriangle size={15} className="text-red-500" /> Urgent attention</h3>
      {alerts.length === 0 && urgentCycles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-6 text-center text-sm text-gray-400">Nothing urgent — your farm is calm.</div>
      ) : (
        <div className="space-y-2">
          {urgentCycles.map((c) => (
            <div key={c.id} className="animate-fade-up rounded-2xl border border-red-200 bg-red-50/60 p-3.5">
              <p className="text-sm font-semibold text-red-700">{c.plot_name} · {c.crop_name}</p>
              <p className="text-xs text-red-600">{c.alert_note || 'Urgent attention needed'}</p>
            </div>
          ))}
          {alerts.map((a) => (
            <Link to="/diagnose" key={a.id} className="block animate-fade-up rounded-2xl border border-red-200 bg-red-50/60 p-3.5 transition-all hover:shadow-md active:scale-[0.99]">
              <p className="text-sm font-semibold text-red-700">{a.subject || 'Diagnosis'}</p>
              <p className="truncate text-xs text-red-600">{a.likely_issue} — {a.escalation_note || 'Expert review recommended'}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Upcoming harvests */}
      <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><Wheat size={15} className="text-amber-500" /> Upcoming harvests</h3>
      {upcoming.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-6 text-center text-sm text-gray-400">No scheduled harvests — add a plot to start.</div>
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {upcoming.map((c, i) => {
              const d = daysUntil(c.expected_harvest_date);
              return (
                <li key={c.id} className="flex animate-slide-in items-center justify-between px-4 py-3" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{c.plot_name} · {c.crop_name}</p>
                    <p className="text-xs text-gray-400">{new Date(c.expected_harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${d <= 7 ? 'bg-amber-100 text-amber-700' : 'bg-leaf-100 text-leaf-700'}`}>
                    {d > 0 ? `${d} days` : 'Ready'}
                  </span>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      )}

      {/* My plots */}
      <h3 className="mb-2 mt-5 flex items-center gap-1.5 text-sm font-semibold text-gray-900"><Leaf size={15} className="text-leaf-600" /> My plots</h3>
      {farms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-6 text-center text-sm text-gray-400">No plots yet — add your first one below.</div>
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {farms.map((f) => (
              <li key={f.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700"><Sprout size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{f.plot_name}</p>
                  <p className="truncate text-xs text-gray-400">{f.current_crop || '—'}{f.state ? ` · ${f.state}` : ''}{f.area_value ? ` · ${f.area_value} ${f.area_unit || 'acre'}` : ''}</p>
                </div>
                {f.state && <MapPin size={14} className="shrink-0 text-gray-300" />}
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Add plot */}
      {showAdd ? (
        <div className="mt-4 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Add a plot</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Plot name"><input value={form.plot_name} onChange={(e) => setForm({ ...form, plot_name: e.target.value })} placeholder="e.g. Kharif field" className={inputCls} /></FormField>
              <FormField label="Crop"><input value={form.crop_name} onChange={(e) => setForm({ ...form, crop_name: e.target.value })} placeholder="e.g. Paddy" className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="State"><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="Telangana" className={inputCls} /></FormField>
              <FormField label="Area (acres)"><input type="number" value={form.area_value} onChange={(e) => setForm({ ...form, area_value: e.target.value })} placeholder="2.5" className={inputCls} /></FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Sowing date"><input type="date" value={form.sowing_date} onChange={(e) => setForm({ ...form, sowing_date: e.target.value })} className={inputCls} /></FormField>
              <FormField label="Expected harvest"><input type="date" value={form.expected_harvest_date} onChange={(e) => setForm({ ...form, expected_harvest_date: e.target.value })} className={inputCls} /></FormField>
            </div>
            <div className="flex gap-2">
              <Button onClick={addPlot} className="flex-1">Save plot</Button>
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-all hover:bg-leaf-50 active:scale-[0.98]">
          <Plus size={15} /> Add plot
        </button>
      )}
    </div>
  );
}
