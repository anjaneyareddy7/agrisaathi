import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, IndianRupee, Percent, CalendarClock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../components/PageHeader';
import { SectionCard } from '../components/kit';

const fmt = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

export default function LoanCalculator() {
  const [amount, setAmount] = useState('100000');
  const [rate, setRate] = useState('7');
  const [tenure, setTenure] = useState('5');

  const { emi, principal, totalInterest, totalPayable, schedule } = useMemo(() => {
    const P = Number(amount) || 0;
    const r = (Number(rate) || 0) / 12 / 100;
    const n = (Number(tenure) || 0) * 12;
    if (P <= 0 || n <= 0) return { emi: 0, principal: P, totalInterest: 0, totalPayable: 0, schedule: [] };
    const e = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = e * n;
    const interest = total - P;
    const yearly = [];
    let bal = P;
    for (let y = 1; y <= Number(tenure); y++) {
      let yrInterest = 0, yrPrincipal = 0;
      for (let m = 0; m < 12; m++) {
        const mi = bal * r;
        const mp = e - mi;
        yrInterest += mi; yrPrincipal += mp; bal -= mp;
      }
      yearly.push({ year: `Y${y}`, principal: Math.round(yrPrincipal), interest: Math.round(yrInterest) });
    }
    return { emi: e, principal: P, totalInterest: interest, totalPayable: total, schedule: yearly };
  }, [amount, rate, tenure]);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader
        title="Loan Calculator"
        subtitle="Estimate EMI, interest and repayment before you apply"
        icon={Calculator}
      />

      {/* EMI hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-5 text-white shadow-md animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Monthly EMI</p>
        <p className="mt-1 flex items-baseline text-4xl font-bold tracking-tight">
          <IndianRupee size={22} className="self-center" />{Math.round(emi).toLocaleString('en-IN')}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Total interest</p>
            <p className="mt-0.5 text-sm font-bold">{fmt(totalInterest)}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Total payable</p>
            <p className="mt-0.5 text-sm font-bold">{fmt(totalPayable)}</p>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white/90 transition-all duration-700" style={{ width: `${principal > 0 ? Math.min(100, (principal / (totalPayable || 1)) * 100) : 0}%` }} />
        </div>
        <p className="mt-1.5 text-[10px] text-white/70">
          {Math.round(principal).toLocaleString('en-IN')} principal · {fmt(totalInterest)} interest
        </p>
      </div>

      {/* Inputs */}
      <SectionCard className="mb-4 animate-fade-up" icon={Calculator} title="Loan details">
        <div className="space-y-5 p-4">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Loan amount</span>
              <span className="text-sm font-bold text-gray-900">{fmt(principal)}</span>
            </div>
            <input type="range" min={10000} max={1000000} step={10000} value={Number(amount) || 0}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full accent-leaf-600" />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400"><span>₹10,000</span><span>₹10,00,000</span></div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500"><Percent size={11} /> Interest rate</span>
              <span className="text-sm font-bold text-gray-900">{Number(rate) || 0}% / yr</span>
            </div>
            <input type="range" min={1} max={20} step={0.5} value={Number(rate) || 0}
              onChange={(e) => setRate(e.target.value)}
              className="w-full accent-leaf-600" />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400"><span>1%</span><span>20%</span></div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500"><CalendarClock size={11} /> Tenure</span>
              <span className="text-sm font-bold text-gray-900">{Number(tenure) || 0} year{(Number(tenure) || 0) > 1 ? 's' : ''}</span>
            </div>
            <input type="range" min={1} max={15} step={1} value={Number(tenure) || 0}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full accent-leaf-600" />
            <div className="mt-1 flex justify-between text-[10px] text-gray-400"><span>1 yr</span><span>15 yrs</span></div>
          </div>
        </div>
      </SectionCard>

      {/* Repayment chart */}
      {schedule.length > 0 && (
        <SectionCard className="mb-4 animate-fade-up" icon={TrendingUp} title="Repayment schedule">
          <div className="h-56 px-2 pb-4 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={schedule} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 100000 ? `${Math.round(v / 100000)}L` : `${Math.round(v / 1000)}k`)} />
                <Tooltip formatter={(v) => fmt(v)} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="principal" stackId="a" fill="#16a34a" name="Principal" radius={[0, 0, 0, 0]} maxBarSize={28} />
                <Bar dataKey="interest" stackId="a" fill="#f59e0b" name="Interest" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}
      <p className="text-center text-[11px] text-gray-400">Estimates only — confirm final rates with your bank.</p>
    </div>
  );
}
