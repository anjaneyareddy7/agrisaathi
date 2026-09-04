import { useState, useEffect } from 'react';
import { FileDown, Loader2, Download, BookOpen, Wheat, FlaskConical, FileText, CheckCircle2 } from 'lucide-react';
import appClient from '../api/appClient';
import { Checkbox } from '../components/ui/checkbox';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';
import jsPDF from 'jspdf';

export default function ExportReports() {
  const [sections, setSections] = useState({ ledger: true, yield: true, soil: true });
  const [generating, setGenerating] = useState(false);
  const [data, setData] = useState({ ledger: [], harvest: [], soil: [] });

  useEffect(() => {
    Promise.all([
      appClient.entities.FarmLedgerEntry.list('-entry_date', 200).catch(() => []),
      appClient.entities.HarvestRecord.list('-harvest_date', 100).catch(() => []),
      appClient.entities.SoilRecord.list('-test_date', 100).catch(() => []),
    ]).then(([l, h, s]) => setData({ ledger: l, harvest: h, soil: s }));
  }, []);

  const toggle = (k) => setSections((s) => ({ ...s, [k]: !s[k] }));

  const ROWS = [
    { k: 'ledger', label: 'Farm Ledger', icon: BookOpen, count: data.ledger.length, tone: 'bg-leaf-100 text-leaf-700' },
    { k: 'yield', label: 'Harvest Records', icon: Wheat, count: data.harvest.length, tone: 'bg-harvest-100 text-harvest-700' },
    { k: 'soil', label: 'Soil Records', icon: FlaskConical, count: data.soil.length, tone: 'bg-cyan-100 text-cyan-700' },
  ];
  const totalSelected = ROWS.filter((r) => sections[r.k]).reduce((s, r) => s + r.count, 0);

  const generate = async () => {
    setGenerating(true);
    try {
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(18); doc.setTextColor(22, 101, 52);
      doc.text('AgriSaathi - Farm Report', 105, y, { align: 'center' });
      y += 8;
      doc.setFontSize(10); doc.setTextColor(100);
      doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 105, y, { align: 'center' });
      y += 10;

      if (sections.ledger) {
        doc.setFontSize(14); doc.setTextColor(0);
        doc.text('Farm Ledger', 14, y); y += 7;
        doc.setFontSize(9);
        const exp = data.ledger.filter((e) => e.kind === 'expense');
        const rev = data.ledger.filter((e) => e.kind === 'revenue');
        const totExp = exp.reduce((s, e) => s + (e.amount || 0), 0);
        const totRev = rev.reduce((s, e) => s + (e.amount || 0), 0);
        doc.text(`Total Expense: Rs ${totExp.toLocaleString('en-IN')}`, 14, y); y += 5;
        doc.text(`Total Revenue: Rs ${totRev.toLocaleString('en-IN')}`, 14, y); y += 5;
        doc.text(`Net: Rs ${(totRev - totExp).toLocaleString('en-IN')}`, 14, y); y += 7;
        doc.text('Date        Type      Category       Amount', 14, y); y += 5;
        data.ledger.slice(0, 30).forEach((e) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`${(e.entry_date || '').slice(0, 10).padEnd(11)}${(e.kind || '').padEnd(9)}${(e.category || '').padEnd(14)}Rs ${(e.amount || 0).toLocaleString('en-IN')}`, 14, y);
          y += 5;
        });
        y += 8;
      }

      if (sections.yield) {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14); doc.setTextColor(0);
        doc.text('Harvest Records', 14, y); y += 7;
        doc.setFontSize(9);
        data.harvest.forEach((h) => {
          if (y > 270) { doc.addPage(); y = 20; }
          const val = (h.quantity || 0) * (h.sale_price_per_unit || 0);
          doc.text(`${(h.harvest_date || '').slice(0, 10)}  ${h.crop_name || ''} - ${h.plot_name || ''}  ${(h.quantity || 0)} ${h.quantity_unit || ''}  Rs ${val.toLocaleString('en-IN')}`, 14, y);
          y += 5;
        });
        y += 8;
      }

      if (sections.soil) {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(14); doc.setTextColor(0);
        doc.text('Soil Records', 14, y); y += 7;
        doc.setFontSize(9);
        data.soil.forEach((r) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(`${(r.test_date || '').slice(0, 10)}  ${r.plot_name || ''}  pH:${r.ph ?? '-'} N:${r.nitrogen ?? '-'} P:${r.phosphorus ?? '-'} K:${r.potassium ?? '-'}`, 14, y);
          y += 5;
        });
      }

      doc.save(`AgriSaathi-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch { /* ignore */ }
    finally { setGenerating(false); }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Export Reports" subtitle="Build a shareable PDF farm report" icon={FileDown} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Records in report</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{totalSelected}</p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><FileText size={24} /></span>
        </div>
        <p className="mt-3 text-xs text-white/70">A clean PDF with your ledger totals, harvest log and soil tests — ready to share with a bank or agent.</p>
      </div>

      {/* Section picker */}
      <SectionCard className="mb-4 animate-fade-up" icon={FileDown} title="Include sections">
        <ul className="divide-y divide-gray-100">
          {ROWS.map((r) => (
            <li key={r.k} className="flex items-center gap-3 px-4 py-3.5">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${r.tone}`}><r.icon size={17} /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{r.label}</p>
                <p className="text-xs text-gray-500">{r.count} records</p>
              </div>
              <Checkbox checked={sections[r.k]} onCheckedChange={() => toggle(r.k)} id={r.k} className="h-5 w-5" />
            </li>
          ))}
        </ul>
      </SectionCard>

      {totalSelected === 0 ? (
        <EmptyState icon={FileDown} title="Nothing selected" subtitle="Tick at least one section to build your report." />
      ) : (
        <button onClick={generate} disabled={generating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-60 animate-fade-up">
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {generating ? 'Generating…' : 'Download PDF'}
        </button>
      )}
      <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
        <CheckCircle2 size={12} /> Generated on your phone — nothing is uploaded.
      </p>
    </div>
  );
}
