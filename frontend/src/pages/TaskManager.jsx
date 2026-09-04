import { useState, useEffect } from 'react';
import { ListTodo, Plus, Trash2, CheckCircle2, Circle, AlertCircle, X } from 'lucide-react';
import appClient from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { FormField } from '../components/kit';

const CATEGORIES = [
  { value: 'planting', label: 'Planting', color: 'bg-leaf-100 text-leaf-700' },
  { value: 'weeding', label: 'Weeding', color: 'bg-amber-100 text-amber-700' },
  { value: 'feeding', label: 'Feeding', color: 'bg-rose-100 text-rose-700' },
  { value: 'irrigation', label: 'Irrigation', color: 'bg-cyan-100 text-cyan-700' },
  { value: 'harvest', label: 'Harvest', color: 'bg-orange-100 text-orange-700' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-blue-100 text-blue-700' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600' },
];
const meta = (v) => CATEGORIES.find((c) => c.value === v) || CATEGORIES[6];
const today = new Date().toISOString().slice(0, 10);
const daysUntil = (d) => Math.ceil((new Date(d) - new Date(today)) / 86400000);
const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'planting', plot_name: '', due_date: '', priority: 'medium', notes: '' });

  const load = () => appClient.entities.FarmTask.list('-due_date').then(setTasks).catch(() => []);
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title) { alert('Please enter a task title'); return; }
    await appClient.entities.FarmTask.create({
      title: form.title, category: form.category, plot_name: form.plot_name || undefined,
      due_date: form.due_date || undefined, priority: form.priority, notes: form.notes || undefined,
    });
    setForm({ title: '', category: 'planting', plot_name: '', due_date: '', priority: 'medium', notes: '' });
    setShowAdd(false);
    load();
  };

  const toggle = async (task) => { await appClient.entities.FarmTask.update(task.id, { status: task.status === 'done' ? 'pending' : 'done' }); load(); };
  const remove = async (id) => { await appClient.entities.FarmTask.delete(id); load(); };

  const sorted = [...tasks].sort((a, b) => {
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (a.status !== 'done' && b.status === 'done') return -1;
    return (a.due_date || '9999').localeCompare(b.due_date || '9999');
  });

  const openCount = tasks.filter((t) => t.status !== 'done').length;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Tasks" icon={ListTodo} subtitle="Field work, never forgotten" />

      {/* Progress hero */}
      <div className="flex animate-fade-up items-center gap-4 rounded-2xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-4 text-white shadow-sm">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
          <svg viewBox="0 0 36 36" className="absolute h-14 w-14 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#bbf7d0" strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={`${(tasks.length ? ((tasks.length - openCount) / tasks.length) : 0) * 97.4} 97.4`} />
          </svg>
          <span className="text-xs font-bold">{tasks.length ? Math.round(((tasks.length - openCount) / tasks.length) * 100) : 0}%</span>
        </div>
        <div>
          <p className="text-lg font-semibold leading-tight">{openCount === 0 ? 'All done!' : `${openCount} task${openCount > 1 ? 's' : ''} to go`}</p>
          <p className="text-xs text-leaf-100/75">{tasks.length} total this season</p>
        </div>
      </div>

      {/* Add */}
      {showAdd ? (
        <div className="mt-4 animate-fade-in rounded-2xl border border-leaf-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">New task</h3>
            <button onClick={() => setShowAdd(false)} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Close"><X size={16} /></button>
          </div>
          <div className="space-y-3">
            <FormField label="Task">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sow tomato seeds" className={inputCls} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Category">
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Priority">
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                </Select>
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Plot">
                <input value={form.plot_name} onChange={(e) => setForm({ ...form, plot_name: e.target.value })} placeholder="Optional" className={inputCls} />
              </FormField>
              <FormField label="Due date">
                <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className={inputCls} />
              </FormField>
            </div>
            <FormField label="Notes">
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional…" className={`${inputCls} resize-none`} />
            </FormField>
            <div className="flex gap-2">
              <Button onClick={save} className="flex-1">Save task</Button>
              <Button onClick={() => setShowAdd(false)} variant="outline" className="flex-1">Cancel</Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-leaf-400 bg-leaf-50/50 py-3 text-sm font-semibold text-leaf-700 transition-all hover:bg-leaf-50 active:scale-[0.98]"
        >
          <Plus size={15} /> Add task
        </button>
      )}

      {/* List */}
      {sorted.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <ListTodo size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-600">No tasks yet</p>
          <p className="text-xs text-gray-400">Add your first task above.</p>
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {sorted.map((task, i) => {
            const m = meta(task.category);
            const d = task.due_date ? daysUntil(task.due_date) : null;
            const overdue = d != null && d < 0 && task.status !== 'done';
            const done = task.status === 'done';
            return (
              <div key={task.id}
                className={`flex animate-fade-up items-start gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-all ${done ? 'border-gray-100 opacity-55' : 'border-gray-200 hover:border-leaf-300'}`}
                style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}
              >
                <button onClick={() => toggle(task)} aria-label={done ? 'Mark pending' : 'Mark done'} className="mt-0.5 shrink-0 transition-transform active:scale-75">
                  {done ? <CheckCircle2 size={20} className="text-leaf-600" /> : <Circle size={20} className="text-gray-300 hover:text-leaf-400" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${m.color}`}>{m.label}</span>
                    {task.priority === 'high' && !done && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600">High</span>}
                    {task.plot_name && <span className="rounded-full border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{task.plot_name}</span>}
                    {d != null && !overdue && !done && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${d <= 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {d === 0 ? 'Today' : `${d} day${d > 1 ? 's' : ''} left`}
                      </span>
                    )}
                    {overdue && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
                        <AlertCircle size={10} /> Overdue
                      </span>
                    )}
                  </div>
                  {task.notes && <p className="mt-1 text-xs text-gray-500">{task.notes}</p>}
                </div>
                <button onClick={() => remove(task.id)} aria-label="Delete task" className="shrink-0 rounded-full p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
