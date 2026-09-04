import { useState, useEffect, useCallback } from 'react';
import { MessageSquareHeart, Star, Plus, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import { Textarea } from '../components/ui/textarea';
import PageHeader from '../components/PageHeader';
import { SectionCard, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';

export default function FeedbackCorner() {
  const deviceId = getDeviceId();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/chain/feedback/${deviceId}`);
      setBlocks(res.data.blocks || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!rating || !message.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'feedback',
        entity_id: deviceId,
        event_type: 'feedback_submitted',
        payload: { rating, message: message.trim() },
        actor: deviceId,
      });
      setRating(0);
      setMessage('');
      setShowForm(false);
      setSubmitted(true);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const history = [...blocks].reverse();
  const avgRating = history.length ? history.reduce((s, b) => s + (b.payload?.rating || 0), 0) / history.length : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Feedback Corner" subtitle="Tell us what's working and what isn't — it shapes what gets built next" icon={MessageSquareHeart} />

      {/* Hero */}
      <div className="mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-800 to-leaf-950 p-5 text-white shadow-md animate-fade-up">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">Your average rating</p>
            <p className="mt-1 flex items-baseline gap-1 text-4xl font-bold tracking-tight">
              {avgRating ? avgRating.toFixed(1) : '—'}
              {avgRating > 0 && <Star size={18} className="self-center fill-harvest-300 text-harvest-300" />}
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><MessageSquareHeart size={24} /></span>
        </div>
        <div className="mt-4 rounded-2xl bg-white/15 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-white/70">Feedback shared</p>
          <p className="mt-0.5 text-sm font-bold">{history.length}</p>
        </div>
      </div>

      {submitted && !showForm && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm font-semibold text-leaf-800 animate-pop">
          <CheckCircle2 size={16} /> Thank you — your feedback was recorded.
        </div>
      )}

      {/* Form */}
      {!showForm ? (
        <button onClick={() => { setShowForm(true); setSubmitted(false); }}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
          <Plus size={16} /> Share feedback
        </button>
      ) : (
        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">How's your experience?</h3>
            <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="mb-3 flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} aria-label={`${n} star`} className="transition-transform hover:scale-110">
                <Star size={28} className={n <= rating ? 'fill-harvest-400 text-harvest-400' : 'text-gray-200'} />
              </button>
            ))}
          </div>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)}
            placeholder="What worked well, what didn't, what would you like to see?"
            rows={4} className="rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" />
          <button onClick={submit} disabled={saving || !rating || !message.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-50">
            {saving && <Loader2 size={15} className="animate-spin" />} Send feedback
          </button>
        </div>
      )}

      {/* History */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-[84px] rounded-2xl border border-gray-200 bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%] animate-shimmer" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <EmptyState icon={MessageSquareHeart} title="No feedback yet" subtitle="Your ratings and notes appear here after you send them." />
      ) : (
        <SectionCard title="Your feedback" icon={MessageSquareHeart}>
          <ul className="divide-y divide-gray-100">
            {history.map((b, i) => (
              <li key={b.index} className="px-4 py-3.5 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={13} className={n <= (b.payload?.rating || 0) ? 'fill-harvest-400 text-harvest-400' : 'text-gray-200'} />
                  ))}
                  <span className="ml-2 text-[11px] font-medium text-gray-400">
                    {new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">{b.payload?.message}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
