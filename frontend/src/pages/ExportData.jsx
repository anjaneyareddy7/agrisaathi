import { useState, useEffect } from 'react';
import { FileSpreadsheet, FileJson, Download, Loader2, CheckCircle2, FileText, Wheat, BookOpen, FlaskConical } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const DATASETS = [
  { key: 'farms', label: 'Plots & farms', icon: FileText, list: () => appClient.entities.Farm.list() },
  { key: 'harvest', label: 'Harvest records', icon: Wheat, list: () => appClient.entities.HarvestRecord.list('-harvest_date', 500) },
  { key: 'ledger', label: 'Farm ledger', icon: BookOpen, list: () => appClient.entities.FarmLedgerEntry.list('-entry_date', 500) },
  { key: 'soil', label: 'Soil tests', icon: FlaskConical, list: () => appClient.entities.SoilRecord.list('-test_date', 500) },
];

function toCsv(rows) {
  if (!rows.length) return '';
  const cols = [...new Set(rows.flatMap((r) => Object.keys(r)))].filter((k) => typeof rows[0][k] !== 'object' || rows[0][k] === null);
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportData() {
  const [selected, setSelected] = useState({ farms: true, harvest: true, ledger: true, soil: true });
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState('');

  useEffect(() => {
    Promise.all(DATASETS.map((d) => d.list().catch(() => []))).then((results) => {
      const c = {};
      results.forEach((r, i) => { c[DATASETS[i].key] = r.length; });
      setCounts(c);
      setLoading(false);
    });
  }, []);

  const toggle = (k) => setSelected((s) => ({ ...s, [k]: !s[k] }));

  const exportAs = async (format) => {
    setDone('');
    const stamp = new Date().toISOString().slice(0, 10);
    const chosen = DATASETS.filter((d) => selected[d.key]);
    if (!chosen.length) return;
    if (format === 'csv') {
      for (const d of chosen) {
        const rows = await d.list().catch(() => []);
        download(`agrisaathi-${d.key}-${stamp}.csv`, toCsv(rows), 'text/csv');
      }
    } else {
      const bundle = {};
      for (const d of chosen) {
        bundle[d.key] = await d.list().catch(() => []);
      }
      download(`agrisaathi-data-${stamp}.json`, JSON.stringify({ exported_at: new Date().toISOString(), data: bundle }, null, 2), 'application/json');
    }
    setDone(`${format.toUpperCase()} downloaded`);
    setTimeout(() => setDone(''), 2500);
  };

  const totalSelected = DATASETS.filter((d) => selected[d.key]).reduce((s, d) => s + (counts[d.key] || 0), 0);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Export My Data"
        subtitle="Download your farm records as CSV or JSON"
        icon={FileSpreadsheet}
      />

      {/* Summary hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Records ready to export</p>
        <p className="mt-1 text-4xl font-bold tracking-tight">{loading ? '…' : totalSelected}</p>
        <p className="mt-2 text-xs text-white/70">
          {DATASETS.filter((d) => selected[d.key]).length} of {DATASETS.length} datasets selected
        </p>
      </div>

      {/* Dataset picker */}
      <SectionCard className="mb-4 animate-fade-up" icon={FileSpreadsheet} title="Choose datasets">
        {loading ? (
          <div className="space-y-2 p-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {DATASETS.map((d) => (
              <li key={d.key}>
                <button onClick={() => toggle(d.key)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${selected[d.key] ? 'bg-leaf-100 text-leaf-700' : 'bg-gray-100 text-gray-400'}`}>
                    <d.icon size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">{d.label}</p>
                    <p className="text-xs text-gray-500">{counts[d.key] || 0} records</p>
                  </div>
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${selected[d.key] ? 'border-leaf-600 bg-leaf-600 text-white' : 'border-gray-300'}`}>
                    {selected[d.key] && <CheckCircle2 size={14} />}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {!loading && totalSelected === 0 ? (
        <EmptyState icon={FileSpreadsheet} title="Nothing to export" subtitle="Select at least one dataset above." />
      ) : (
        <div className="grid grid-cols-2 gap-3 animate-fade-up">
          <button
            onClick={() => exportAs('csv')}
            disabled={loading || totalSelected === 0}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white py-5 shadow-sm transition-all hover:border-leaf-300 hover:shadow disabled:opacity-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-100 text-leaf-700"><FileText size={20} /></span>
            <span className="text-sm font-semibold text-gray-900">CSV</span>
            <span className="text-[11px] text-gray-400">One file per dataset</span>
          </button>
          <button
            onClick={() => exportAs('json')}
            disabled={loading || totalSelected === 0}
            className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white py-5 shadow-sm transition-all hover:border-leaf-300 hover:shadow disabled:opacity-50"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700"><FileJson size={20} /></span>
            <span className="text-sm font-semibold text-gray-900">JSON</span>
            <span className="text-[11px] text-gray-400">Single bundle file</span>
          </button>
        </div>
      )}

      {done && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-leaf-700 animate-fade-up">
          <Download size={13} /> {done}
        </p>
      )}
      <p className="mt-4 text-center text-[11px] text-gray-400">Exports run on your phone — data goes directly to your downloads, nowhere else.</p>
    </div>
  );
}
