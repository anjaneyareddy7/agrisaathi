import { ai } from '../api/appClient';
import { useState, useEffect } from 'react';
import { Banknote, CheckCircle2, FileText, ExternalLink, Loader2, Sparkles, ShieldQuestion } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/kit';

export default function LoanEligibility() {
  const [loans, setLoans] = useState([]);
  const [farms, setFarms] = useState([]);
  const [results, setResults] = useState({});
  const [checking, setChecking] = useState(null);

  useEffect(() => {
    appClient.entities.GovLoan.list('name', 50).then(setLoans).catch(() => {});
    appClient.entities.Farm.list().then(setFarms).catch(() => {});
  }, []);

  const farmProfile = farms.length
    ? farms.map((f) => `Plot ${f.plot_name}: ${f.state || ''} ${f.district || ''}, ${f.area_value || ''} ${f.area_unit || ''}, crop ${f.current_crop || 'none'}, type ${f.farm_type || ''}.`).join(' ')
    : 'No farm plots registered yet.';

  const check = async (loan) => {
    setChecking(loan.id);
    try {
      const res = await ai.invoke({
        prompt: `You are a farm loan eligibility assistant for Indian government agricultural loans. Given the farmer's profile and loan details, assess eligibility as ELIGIBLE, PARTIALLY, or NOT eligible. List the documents the farmer should prepare. Be conservative; if unsure say PARTIALLY. Simple farmer-friendly language.

Farmer profile: ${farmProfile}

Loan: ${loan.name}
Provider: ${loan.provider || 'N/A'}
Max amount: ₹${loan.max_amount || 'N/A'}
Interest: ${loan.interest_rate || 'N/A'}
Purpose: ${loan.purpose || 'N/A'}
Eligibility: ${loan.eligibility_summary || 'Not specified'}
Known required documents: ${(loan.required_documents || []).join(', ')}`,
        response_json_schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['eligible', 'partially', 'not_eligible'] },
            reason: { type: 'string' },
            documents_needed: { type: 'array', items: { type: 'string' } },
            next_steps: { type: 'string' },
          },
          required: ['status', 'reason'],
        },
      });
      setResults((prev) => ({ ...prev, [loan.id]: res }));
    } catch {
      setResults((prev) => ({ ...prev, [loan.id]: { status: 'partially', reason: 'Check failed — try again.', documents_needed: loan.required_documents || [] } }));
    } finally {
      setChecking(null);
    }
  };

  const statusStyle = (s) =>
    s === 'eligible' ? 'bg-leaf-100 text-leaf-800' :
    s === 'partially' ? 'bg-amber-100 text-amber-800' :
    'bg-red-100 text-red-700';
  const statusLabel = (s) =>
    s === 'eligible' ? 'Eligible' :
    s === 'partially' ? 'Partially eligible' :
    'Not eligible';

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Loan Eligibility" subtitle="AI checks your farm profile against each government loan" icon={Banknote} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Government loans</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{loans.length}</p>
            <p className="mt-2 max-w-[280px] text-xs leading-relaxed text-white/80">
              {farms.length > 0
                ? `Checked against your ${farms.length} registered plot${farms.length > 1 ? 's' : ''}.`
                : 'Add plots in Dashboard so checks use your real farm profile.'}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><Banknote size={24} /></span>
        </div>
      </div>

      {loans.length === 0 ? (
        <EmptyState icon={Banknote} title="No loans listed" subtitle="Government loan schemes will appear here once loaded." />
      ) : (
        <div className="space-y-2">
          {loans.map((l, i) => {
            const r = results[l.id];
            return (
              <div key={l.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-leaf-300 animate-slide-in"
                style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold leading-snug text-gray-900">{l.name}</h3>
                    {l.provider && <p className="mt-0.5 text-xs text-gray-500">{l.provider}</p>}
                  </div>
                  {r && <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle(r.status)}`}>{statusLabel(r.status)}</span>}
                </div>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  {l.max_amount && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">₹{l.max_amount.toLocaleString('en-IN')} max</span>}
                  {l.interest_rate && <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">{l.interest_rate}</span>}
                </div>

                {l.purpose && <p className="mt-2.5 text-xs leading-relaxed text-gray-600">{l.purpose}</p>}
                {l.eligibility_summary && <p className="mt-1.5 text-xs text-gray-500"><span className="font-semibold text-gray-700">Eligibility:</span> {l.eligibility_summary}</p>}

                {r?.reason && <div className="mt-3 rounded-xl bg-gray-50 px-3 py-2.5 text-xs leading-relaxed text-gray-600">{r.reason}</div>}
                {r?.documents_needed?.length > 0 && (
                  <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50/70 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide text-blue-700"><FileText size={11} /> Documents needed</p>
                    <ul className="mt-1 space-y-0.5">
                      {r.documents_needed.map((d, j) => <li key={j} className="text-xs text-blue-700/90">• {d}</li>)}
                    </ul>
                  </div>
                )}
                {r?.next_steps && <div className="mt-2 rounded-xl border border-leaf-100 bg-leaf-50/70 px-3 py-2.5 text-xs leading-relaxed text-leaf-800">{r.next_steps}</div>}

                <div className="mt-3 flex gap-2">
                  <button onClick={() => check(l)} disabled={checking === l.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-leaf-300 bg-leaf-50/50 py-2.5 text-xs font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 disabled:opacity-60">
                    {checking === l.id ? <Loader2 size={13} className="animate-spin" /> : r ? <CheckCircle2 size={13} /> : <Sparkles size={13} />}
                    {checking === l.id ? 'Checking…' : r ? 'Re-check eligibility' : 'Check eligibility'}
                  </button>
                  {l.apply_link && (
                    <a href={l.apply_link} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center rounded-xl border border-gray-200 px-3 text-gray-500 transition-colors hover:bg-gray-50">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-gray-400">
        <ShieldQuestion size={12} /> AI guidance only — confirm with your bank before applying.
      </p>
    </div>
  );
}
