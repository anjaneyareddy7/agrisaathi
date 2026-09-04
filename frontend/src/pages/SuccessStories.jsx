import { useState, useEffect, useCallback } from 'react';
import { Trophy, Plus, Sprout, X, Quote } from 'lucide-react';
import axios from 'axios';
import { getDeviceId } from '../lib/deviceId';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { FormField, EmptyState } from '../components/kit';

const API_URL = import.meta.env.VITE_API_URL || '';
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

export default function SuccessStories() {
  const deviceId = getDeviceId();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ farmer_name: '', crop: '', story: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/ledger/list/success_story`, { params: { limit: 50 } });
      setStories(res.data.blocks || []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!form.farmer_name || !form.crop || !form.story) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/api/ledger/log`, {
        entity_type: 'success_story', entity_id: deviceId,
        event_type: 'story_shared', payload: form, actor: deviceId,
      });
      setForm({ farmer_name: '', crop: '', story: '' });
      setShowForm(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Success Stories" icon={Trophy} subtitle="Real wins, shared by farmers like you" />

      {/* Hero */}
      <div className="flex animate-fade-up items-center justify-between rounded-2xl bg-gradient-to-br from-harvest-500 to-harvest-700 p-4 text-white shadow-sm">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-harvest-100">Community wall</p>
          <p className="mt-1 text-2xl font-bold leading-none">{loading ? '—' : stories.length} <span className="text-sm font-medium">stories</span></p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-xs font-bold backdrop-blur transition-all hover:bg-white/30 active:scale-95"
        >
          <Plus size={14} /> Share yours
        </button>
      </div>

      {showForm && (
        <div className="mt-4 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Share your story</h3>
            <button onClick={() => setShowForm(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Your name">
                <input value={form.farmer_name} onChange={(e) => setForm({ ...form, farmer_name: e.target.value })} placeholder="e.g. Ravi Kumar" className={inputCls} />
              </FormField>
              <FormField label="Crop">
                <input value={form.crop} onChange={(e) => setForm({ ...form, crop: e.target.value })} placeholder="e.g. Chilli" className={inputCls} />
              </FormField>
            </div>
            <FormField label="Your story">
              <textarea value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} rows={4}
                placeholder="What changed, what worked, what would you tell other farmers?" className={`${inputCls} resize-none`} />
            </FormField>
            <Button className="w-full" onClick={submit} disabled={saving || !form.farmer_name || !form.crop || !form.story}>
              {saving ? 'Sharing…' : 'Share with the community'}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-28 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
        </div>
      ) : stories.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <EmptyState icon={Trophy} title="No stories shared yet" subtitle="Be the first to inspire other farmers!" />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {stories.map((b, i) => (
            <figure key={b.hash} className="animate-fade-up rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-harvest-100 text-sm font-bold text-harvest-700">
                  {(b.payload?.farmer_name || 'F').charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{b.payload?.farmer_name}</p>
                  <p className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Sprout size={10} /> {b.payload?.crop} · {new Date(b.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <Quote size={15} className="ml-auto shrink-0 text-gray-200" />
              </div>
              <blockquote className="mt-2.5 text-sm leading-relaxed text-gray-600">{b.payload?.story}</blockquote>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
