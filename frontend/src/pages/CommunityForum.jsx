import { useState, useEffect } from 'react';
import { MessageSquare, Plus, ArrowLeft, ThumbsUp, Send, User } from 'lucide-react';
import appClient from '../api/appClient';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';
import { SectionCard, FormField, EmptyState } from '../components/kit';

const CATEGORIES = ['Crops', 'Livestock', 'Soil', 'Weather', 'Market', 'Schemes', 'Equipment', 'Other'];

const inputCls = 'h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-leaf-500 focus:outline-none focus:ring-4 focus:ring-leaf-100';

function Avatar({ name }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-xs font-bold text-leaf-700">
      {initial}
    </span>
  );
}

export default function CommunityForum() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list');
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', body: '', category: 'Crops' });
  const [reply, setReply] = useState('');
  const [user, setUser] = useState(null);

  const load = async () => {
    const p = await appClient.entities.ForumPost.list('-created_date', 100).catch(() => []);
    setPosts(p);
  };
  useEffect(() => {
    load();
    appClient.auth.me().then(setUser).catch(() => {});
  }, []);

  const create = async () => {
    if (!form.title.trim() || !form.body.trim()) return;
    await appClient.entities.ForumPost.create({
      title: form.title.trim(),
      body: form.body.trim(),
      category: form.category,
      author_name: user?.full_name || user?.email || 'Anonymous',
      replies: [],
      upvotes: 0,
    });
    setForm({ title: '', body: '', category: 'Crops' });
    setView('list');
    load();
  };

  const addReply = async () => {
    if (!reply.trim() || !active) return;
    const newReplies = [...(active.replies || []), { author_name: user?.full_name || user?.email || 'Anonymous', body: reply.trim(), ts: new Date().toISOString() }];
    await appClient.entities.ForumPost.update(active.id, { replies: newReplies });
    setReply('');
    const updated = await appClient.entities.ForumPost.get(active.id);
    setActive(updated);
    load();
  };

  const upvote = async (post) => {
    await appClient.entities.ForumPost.update(post.id, { upvotes: (post.upvotes || 0) + 1 });
    load();
    if (active?.id === post.id) setActive({ ...post, upvotes: (post.upvotes || 0) + 1 });
  };

  if (view === 'detail' && active) {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <button onClick={() => { setView('list'); setActive(null); }} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-leaf-700">
          <ArrowLeft size={15} /> Back to forum
        </button>

        <div className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-base font-bold leading-snug text-gray-900">{active.title}</h2>
            <Badge className="shrink-0 bg-leaf-100 text-leaf-800 hover:bg-leaf-100">{active.category}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Avatar name={active.author_name} />
            <p className="text-xs text-gray-500">{active.author_name} · {new Date(active.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700">{active.body}</p>
          <button onClick={() => upvote(active)}
            className="mt-3 flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-leaf-300 hover:text-leaf-700">
            <ThumbsUp size={12} /> Helpful · {active.upvotes || 0}
          </button>
        </div>

        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <MessageSquare size={13} /> Replies ({(active.replies || []).length})
        </h3>
        {(active.replies || []).length === 0 ? (
          <EmptyState icon={MessageSquare} title="No replies yet" subtitle="Be the first to share your experience." />
        ) : (
          <SectionCard className="mb-4">
            <ul className="divide-y divide-gray-100">
              {(active.replies || []).map((r, i) => (
                <li key={i} className="flex gap-3 px-4 py-3 animate-slide-in" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <Avatar name={r.author_name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-900">{r.author_name} <span className="font-normal text-gray-400">· {new Date(r.ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-700">{r.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        )}

        <div className="flex items-end gap-2">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…"
            className="flex-1 rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100" rows={2} />
          <button onClick={addReply} disabled={!reply.trim()}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-leaf-700 text-white transition-colors hover:bg-leaf-800 disabled:opacity-40">
            <Send size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (view === 'new') {
    return (
      <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
        <button onClick={() => setView('list')} className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-leaf-700">
          <ArrowLeft size={15} /> Back to forum
        </button>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-fade-up">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">New post</h2>
          <div className="space-y-3">
            <FormField label="Title">
              <Input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ask anything — e.g. Best paddy variety for late sowing?" />
            </FormField>
            <FormField label="Category">
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, category: c })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${form.category === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </FormField>
            <FormField label="Your question">
              <Textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} rows={5}
                className="rounded-xl border-gray-200 focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
                placeholder="Give some detail — your crop, location, and what you've tried." />
            </FormField>
            <button onClick={create} disabled={!form.title.trim() || !form.body.trim()}
              className="w-full rounded-xl bg-leaf-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-leaf-800 disabled:opacity-40">
              Post to community
            </button>
          </div>
        </div>
      </div>
    );
  }

  const shown = filter === 'All' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Community Forum" subtitle="Ask questions and share advice with fellow farmers" icon={MessageSquare} />

      <button onClick={() => setView('new')}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-colors hover:bg-leaf-50 animate-fade-up">
        <Plus size={16} /> New post
      </button>

      {posts.length > 0 && (
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {['All', ...CATEGORIES].map((c) => (
            <button key={c} onClick={() => setFilter(c)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filter === c ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 bg-white text-gray-600'}`}>
              {c}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <EmptyState icon={MessageSquare} title={posts.length === 0 ? 'No posts yet' : 'Nothing in this category'}
          subtitle="Be the first to start the conversation." />
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {shown.map((p, i) => (
              <li key={p.id}>
                <button onClick={() => { setActive(p); setView('detail'); }}
                  className="flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-gray-50 animate-slide-in"
                  style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <Avatar name={p.author_name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold leading-snug text-gray-900">{p.title}</p>
                      <Badge className="shrink-0 bg-gray-100 text-gray-600 hover:bg-gray-100">{p.category}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{p.body}</p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] font-medium text-gray-400">
                      <span className="flex items-center gap-1"><User size={11} />{p.author_name}</span>
                      <span className="flex items-center gap-1"><ThumbsUp size={11} />{p.upvotes || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} />{(p.replies || []).length}</span>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
