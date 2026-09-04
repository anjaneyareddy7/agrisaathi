import { useState, useEffect } from 'react';
import { BarChart3, TrendingDown, PieChart as PieIcon, IndianRupee, CalendarRange, Tag } from 'lucide-react';
import appClient from '../api/appClient';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const PIE_COLORS = ['#16a34a', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899', '#14b8a6', '#64748b'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ExpenseAnalytics() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    appClient.entities.FarmLedgerEntry.list('-entry_date', 200).then(setEntries).catch(() => []).finally(() => setLoading(false));
  }, []);

  const expenses = entries.filter((e) => e.kind === 'expense');
  const byCategory = {};
  expenses.forEach((e) => { const c = e.category || 'Other'; byCategory[c] = (byCategory[c] || 0) + (e.amount || 0); });
  const pieData = Object.entries(byCategory).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const byMonth = {};
  expenses.forEach((e) => {
    if (!e.entry_date) return;
    const m = e.entry_date.slice(0, 7);
    byMonth[m] = (byMonth[m] || 0) + (e.amount || 0);
  });
  const monthData = Object.entries(byMonth).sort().map(([k, v]) => ({ month: MONTHS[Number(k.slice(5)) - 1] || k, amount: v }));

  const total = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const avgMonth = monthData.length ? total / monthData.length : 0;
  const topCategory = pieData[0];

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <div className="mb-4 h-[132px] rounded-3xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
        <div className="mb-4 h-52 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Expense Analytics" subtitle="See where your farm money goes, month by month" icon={BarChart3} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-5 text-white shadow-md animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Total spent</p>
        <p className="mt-1 flex items-baseline text-4xl font-bold tracking-tight">
          <IndianRupee size={22} className="self-center" />{total.toLocaleString('en-IN')}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><CalendarRange size={10} /> Avg / month</p>
            <p className="mt-0.5 text-sm font-bold">₹{Math.round(avgMonth).toLocaleString('en-IN')}</p>
          </div>
          <div className="rounded-2xl bg-white/15 px-3 py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-white/70"><Tag size={10} /> Top category</p>
            <p className="mt-0.5 truncate text-sm font-bold">{topCategory ? topCategory.name : '—'}</p>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState icon={BarChart3} title="No expenses logged yet" subtitle="Add expense entries in Farm Ledger to see analytics here." />
      ) : (
        <>
          {pieData.length > 0 && (
            <SectionCard className="mb-4 animate-fade-up" icon={PieIcon} title="Spending by category">
              <div className="h-52 px-2 pb-4 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={{ fontSize: 10 }}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => '₹' + Number(v).toLocaleString('en-IN')} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          )}

          {monthData.length > 0 && (
            <SectionCard className="mb-4 animate-fade-up" icon={TrendingDown} title="Monthly trend" tone="bg-red-100 text-red-600">
              <div className="h-52 px-2 pb-4 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthData} margin={{ top: 5, right: 16, left: -8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)} />
                    <Tooltip formatter={(v) => '₹' + Number(v).toLocaleString('en-IN')} contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                    <Bar dataKey="amount" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
