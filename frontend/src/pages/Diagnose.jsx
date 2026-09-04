import React, { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft, Camera, X, Sprout, PawPrint, Mic, AlertTriangle, RotateCcw,
  Leaf, FlaskConical, ShieldAlert, ChevronRight, ScanSearch, Loader2,
} from 'lucide-react';
import axios from 'axios';
import appClient from '@/api/appClient';
import cropData from '@/data/cropEncyclopedia.json';
import animalData from '@/data/animalEncyclopedia.json';
import PageHeader from '@/components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || '';

const STEPS = [
  { id: 1, label: 'Photo' }, { id: 2, label: 'Details' }, { id: 3, label: 'Result' },
];

const cropOptions = cropData.categories.flatMap((c) => c.types.map((t) => ({ id: t.id, name: t.name, category: c.name })));
const animalOptions = animalData.categories.flatMap((c) => c.types.map((t) => ({ id: t.id, name: t.name, category: c.name })));

export default function Diagnose() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [domain, setDomain] = useState('crop');
  const [subject, setSubject] = useState('');
  const [plots, setPlots] = useState([]);
  const [plotId, setPlotId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [listening, setListening] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const subjectOptions = domain === 'crop' ? cropOptions : animalOptions;

  const groupedSubjectOptions = useMemo(() => {
    const groups = {};
    subjectOptions.forEach((o) => {
      if (!groups[o.category]) groups[o.category] = [];
      groups[o.category].push(o);
    });
    return groups;
  }, [subjectOptions]);

  React.useEffect(() => {
    appClient.entities.Farm.list('plot_name', 50)
      .then((rows) => setPlots(Array.isArray(rows) ? rows : []))
      .catch(() => setPlots([]));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const removeFile = () => { setFile(null); setPreview(null); setResult(null); };

  const goNextFromStep1 = () => {
    if (!file) { setError('Please take or upload a photo first'); return; }
    setError(null);
    setStep(2);
  };

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setSymptoms((prev) => (prev ? `${prev} ${text}` : text));
    };
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const analyze = async () => {
    if (!subject) {
      setError(domain === 'crop' ? 'Please select a crop' : 'Please select an animal type');
      return;
    }
    setLoading(true); setError(null); setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop_hint', subject);
    formData.append('domain', domain);
    formData.append('subject', subject);
    if (plotId) formData.append('plot_id', plotId);
    if (symptoms) formData.append('symptoms_text', symptoms);

    try {
      const response = await axios.post(`${API_URL}/api/diagnosis/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });
      setResult(response.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Failed to analyze image. Please try again.');
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    setStep(1); setFile(null); setPreview(null); setSubject('');
    setPlotId(''); setSymptoms(''); setResult(null); setError(null);
  };

  const confidencePct =
    result?.confidence !== undefined && result?.confidence !== null
      ? Math.round(result.confidence * 100) : null;

  const likelyIssue = result?.likely_issue || result?.disease_name || 'Unable to determine';
  const alternatives = result?.alternatives || [];
  const evidence = result?.evidence || result?.detailed_analysis || result?.description || '';
  const organicTreatment = result?.organic_treatment ||
    (result?.treatment_advice && result.treatment_advice.length ? result.treatment_advice.join(' ') : '');
  const chemicalTreatment = result?.chemical_treatment || result?.recommended_action || '';
  const precautions = result?.precautions ||
    (result?.prevention && result.prevention.length ? result.prevention.join(' ') : '');

  const inputCls = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100';

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <div className="flex items-center gap-2">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 active:scale-90"
            aria-label="Back"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className="flex-1">
          <PageHeader title="Diagnose" icon={ScanSearch} subtitle="AI-powered crop & livestock diagnosis" />
        </div>
      </div>

      {/* Step progress */}
      <div className="mb-4 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold transition-all ${
              step > s.id ? 'bg-leaf-600 text-white' : step === s.id ? 'animate-pop bg-leaf-800 text-white' : 'bg-gray-100 text-gray-400'
            }`}>{step > s.id ? '✓' : s.id}</span>
            <span className={`text-xs font-medium ${step >= s.id ? 'text-gray-800' : 'text-gray-400'}`}>{s.label}</span>
            {i < STEPS.length - 1 && <span className={`h-0.5 flex-1 rounded-full transition-colors ${step > s.id ? 'bg-leaf-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* STEP 1 — photo */}
      {step === 1 && (
        <div className="animate-fade-up space-y-4">
          <label className="group block cursor-pointer rounded-3xl border-2 border-dashed border-leaf-300 bg-leaf-50/50 p-8 text-center transition-all hover:border-leaf-500 hover:bg-leaf-50">
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="mx-auto max-h-72 rounded-2xl object-contain shadow-md" />
                <button
                  onClick={(e) => { e.preventDefault(); removeFile(); }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-md transition-transform hover:scale-110 active:scale-90"
                  aria-label="Remove photo"
                >
                  <X size={16} />
                </button>
                <p className="mt-3 truncate text-xs text-gray-500">{file.name}</p>
              </div>
            ) : (
              <>
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-leaf-600 shadow-sm transition-transform group-hover:scale-110">
                  <Camera size={26} />
                </span>
                <p className="mt-3 text-sm font-semibold text-leaf-800">Take or upload a photo</p>
                <p className="mt-1 text-xs text-gray-400">Leaf, stem, animal skin — close and clear works best</p>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          {error && <ErrorBox>{error}</ErrorBox>}

          <button
            onClick={goNextFromStep1} disabled={!file}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-leaf-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-leaf-700 active:scale-[0.98] disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* STEP 2 — details */}
      {step === 2 && (
        <div className="animate-fade-up space-y-4">
          <div className="flex gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 p-1.5">
            {[
              { id: 'crop', label: 'Crop', icon: Sprout },
              { id: 'livestock', label: 'Animal / Livestock', icon: PawPrint },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setDomain(id); setSubject(''); }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all active:scale-95 ${
                  domain === id ? 'bg-white text-leaf-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {preview && (
            <img src={preview} alt="" className="h-20 w-full rounded-2xl object-cover shadow-sm" />
          )}

          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Select {domain === 'crop' ? 'crop' : 'animal'} <span className="text-red-500">*</span>
            </span>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className={inputCls}>
              <option value="">Choose from the list…</option>
              {Object.entries(groupedSubjectOptions).map(([category, opts]) => (
                <optgroup key={category} label={category}>
                  {opts.map((o) => <option key={o.id} value={o.name}>{o.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Plot (optional)</span>
            <select value={plotId} onChange={(e) => setPlotId(e.target.value)} className={inputCls}>
              <option value="">Not linked to a plot</option>
              {plots.map((p) => <option key={p.id} value={p.id}>{p.plot_name || p.id}</option>)}
            </select>
          </div>

          <div>
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Symptoms (optional)</span>
            <div className="relative">
              <textarea
                value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. leaves turning yellow with brown spots" rows={3}
                className={`${inputCls} resize-none pr-14`}
              />
              <button
                type="button" onClick={toggleMic} aria-label="Describe by voice"
                className={`absolute bottom-2.5 right-2.5 flex h-9 w-9 items-center justify-center rounded-full text-white transition-all active:scale-90 ${
                  listening ? 'animate-pulse bg-red-500' : 'bg-leaf-600 hover:bg-leaf-700'
                }`}
              >
                <Mic size={15} />
              </button>
            </div>
          </div>

          {error && <ErrorBox>{error}</ErrorBox>}

          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="flex-1 rounded-xl border border-gray-300 bg-white py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]">
              Back
            </button>
            <button
              onClick={analyze} disabled={!subject || loading}
              className="inline-flex flex-[2] items-center justify-center gap-1.5 rounded-xl bg-leaf-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-leaf-700 active:scale-[0.98] disabled:opacity-40"
            >
              {loading ? (<><Loader2 size={16} className="animate-spin" /> Analyzing…</>) : (<>Analyze photo <ChevronRight size={16} /></>)}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — result */}
      {step === 3 && (
        <div className="animate-fade-up space-y-3">
          {loading && (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => <div key={i} className="animate-shimmer h-24 rounded-2xl bg-gray-100 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:400px_100%]" />)}
              <p className="text-center text-xs text-gray-400">Our AI is examining your photo…</p>
            </div>
          )}

          {error && !loading && <ErrorBox>{error}</ErrorBox>}

          {result && result.source !== 'unavailable' && !loading && (
            <>
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-leaf-700 to-leaf-900 p-5 text-white shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-leaf-100">
                      <Leaf size={12} /> Likely issue
                    </span>
                    <h2 className="mt-3 text-xl font-semibold leading-snug">{likelyIssue}</h2>
                    {subject && <p className="mt-1 text-xs text-leaf-100/75">{subject}</p>}
                  </div>
                  {confidencePct !== null && (
                    <div className="shrink-0 text-center">
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                        <span className="text-lg font-bold">{confidencePct}%</span>
                      </div>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-leaf-100/70">confidence</p>
                    </div>
                  )}
                </div>
              </div>

              {alternatives.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">Other possibilities</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {alternatives.map((a, i) => (
                      <span key={i} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {evidence && (
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400">What we see</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{evidence}</p>
                </div>
              )}

              {organicTreatment && <ResultCard icon={Leaf} tone="bg-leaf-100 text-leaf-700" title="Organic — try first" body={organicTreatment} />}
              {chemicalTreatment && <ResultCard icon={FlaskConical} tone="bg-blue-100 text-blue-700" title="Chemical option" body={chemicalTreatment} />}
              {precautions && <ResultCard icon={ShieldAlert} tone="bg-amber-100 text-amber-700" title="Precautions" body={precautions} />}

              <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3.5">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-700">
                  {result.disclaimer || 'AI-assisted estimate only. Confirm with a KVK expert before applying treatment.'}
                </p>
              </div>

              {(result.source || result.model_name) && (
                <p className="text-[10px] text-gray-300">Source: {result.source} {result.model_name ? `| Model: ${result.model_name}` : ''}</p>
              )}
            </>
          )}

          {result && result.source === 'unavailable' && !loading && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-700">{result.description || 'Diagnosis service temporarily unavailable'}</p>
            </div>
          )}

          {!loading && (
            <button
              onClick={startOver}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white py-3.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              <RotateCcw size={15} /> Diagnose another
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ErrorBox({ children }) {
  return (
    <div className="animate-fade-up rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-sm font-medium text-red-600">{children}</p>
    </div>
  );
}

function ResultCard({ icon: Icon, tone, title, body }) {
  return (
    <div className="flex animate-fade-up gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={17} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{body}</p>
      </div>
    </div>
  );
}
