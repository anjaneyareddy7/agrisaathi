import { useState, useEffect } from 'react';
import { ScanSearch, Leaf, FlaskConical, ShieldAlert, CalendarClock, Sprout, Search, Sparkles, Phone } from 'lucide-react';
import appClient, { ai } from '../api/appClient';
import PageHeader from '../components/PageHeader';
import { SectionCard } from '../components/kit';
import { Button } from '../components/ui/button';
import { FormField } from '../components/kit';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';

export default function Treatments() {
  const [crops, setCrops] = useState([]);
  const [crop, setCrop] = useState('');
  const [issue, setIssue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { appClient.entities.Crop.list('name_en', 200).then(setCrops).catch(() => {}); }, []);

  const search = async () => {
    if (!crop || !issue) return;
    setLoading(true); setResult(null);
    try {
      const res = await ai.invoke({
        prompt: `You are an AI agricultural treatment advisor for Indian farmers. Crop: ${crop}. Issue: ${issue}. Provide organic treatment (try first), chemical treatment with active ingredient, application method, timing, safety precautions, and pre-harvest interval if known. Cite general authoritative sources (ICAR/KVK). Never recommend banned substances or invent dosages. Simple language.`,
        response_json_schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            organic_treatment: { type: 'string' },
            chemical_treatment: { type: 'string' },
            application_method: { type: 'string' },
            timing: { type: 'string' },
            precautions: { type: 'string' },
            pre_harvest_interval: { type: 'string' },
            source: { type: 'string' },
          },
          required: ['summary'],
        },
      });
      setResult(res);
    } catch { alert('Could not get advice right now — please try again.'); } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Treatments" icon={ScanSearch} subtitle="Organic-first cures for crop problems" />

      {/* Query card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Crop">
            <Select value={crop} onValueChange={setCrop}>
              <SelectTrigger><SelectValue placeholder="Select crop" /></SelectTrigger>
              <SelectContent className="max-h-72">{crops.map((c) => <SelectItem key={c.id} value={c.name_en}>{c.name_en}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField label="Disease / pest / issue">
            <input
              value={issue} onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. powdery mildew, aphids…"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
            />
          </FormField>
        </div>
        <Button onClick={search} disabled={loading} size="lg" className="mt-4 w-full">
          {loading ? (<><Sparkles size={16} className="animate-spin" /> Thinking…</>) : (<><Search size={16} /> Get treatment</>)}
        </Button>
        <p className="mt-2 text-center text-[11px] text-gray-400">AI-assisted advice — always confirm doses with your KVK or dealer</p>
      </div>

      {/* Result */}
      {loading && (
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-20 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
        </div>
      )}

      {result && (
        <div className="mt-4 animate-fade-up space-y-3">
          <div className="rounded-2xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-5 text-white shadow-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf-100">
              <Sprout size={12} /> {crop}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-snug">{result.summary}</h2>
          </div>

          {result.organic_treatment && (
            <Advice icon={Leaf} tone="bg-leaf-100 text-leaf-700" title="Organic first" body={result.organic_treatment} />
          )}
          {result.chemical_treatment && (
            <Advice icon={FlaskConical} tone="bg-blue-100 text-blue-700" title="Chemical option" body={result.chemical_treatment} />
          )}
          {result.application_method && (
            <Advice icon={ScanSearch} tone="bg-violet-100 text-violet-700" title="How to apply" body={result.application_method} />
          )}
          {result.timing && (
            <Advice icon={CalendarClock} tone="bg-cyan-100 text-cyan-700" title="When to apply" body={result.timing} />
          )}
          {result.precautions && (
            <Advice icon={ShieldAlert} tone="bg-amber-100 text-amber-700" title="Precautions" body={result.precautions} />
          )}

          {(result.pre_harvest_interval || result.source) && (
            <p className="px-1 text-[11px] leading-relaxed text-gray-400">
              {result.pre_harvest_interval && <>Pre-harvest interval: {result.pre_harvest_interval}. </>}
              {result.source && <>Source: {result.source}.</>}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Advice({ icon: Icon, tone, title, body }) {
  return (
    <SectionCard>
      <div className="flex gap-3 p-4">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
          <Icon size={17} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{body}</p>
        </div>
      </div>
    </SectionCard>
  );
}
