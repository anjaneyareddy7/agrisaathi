import { useState, useEffect, useRef } from 'react';
import { Mic, Square, Trash2, MapPin, Loader2, Play, Pause, AudioLines } from 'lucide-react';
import appClient from '../api/appClient';
import { Button } from '../components/ui/button';
import { SectionCard } from '../components/kit';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';

export default function VoiceNotes() {
  const [farms, setFarms] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState('');
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [saving, setSaving] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const recRef = useRef(null);

  const load = async () => {
    const [f, n] = await Promise.all([
      appClient.entities.Farm.list().catch(() => []),
      appClient.entities.VoiceNote.list('-created_date', 100).catch(() => []),
    ]);
    setFarms(f); setNotes(n);
  };
  useEffect(() => { load(); }, []);

  const startRec = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input is not supported in this browser.'); return; }
    const rec = new SR();
    rec.lang = 'en-IN';
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let final = '';
      let tmp = '';
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else tmp += e.results[i][0].transcript;
      }
      if (final) setTranscript((p) => (p ? p + ' ' : '') + final);
      setInterim(tmp);
    };
    rec.onerror = () => setRecording(false);
    rec.onend = () => setRecording(false);
    rec.start();
    recRef.current = rec;
    setRecording(true);
    setTranscript('');
    setInterim('');
  };
  const stopRec = () => { recRef.current?.stop(); setRecording(false); };

  const save = async () => {
    if (!transcript.trim()) return;
    setSaving(true);
    try {
      const plot = farms.find((f) => f.plot_name === selectedPlot);
      await appClient.entities.VoiceNote.create({
        transcript: transcript.trim(),
        plot_name: selectedPlot || undefined,
        farm_id: plot?.id || undefined,
        title: transcript.trim().slice(0, 50),
      });
      setTranscript('');
      setInterim('');
      load();
    } catch { alert('Could not save the note. Please try again.'); } finally { setSaving(false); }
  };
  const remove = async (id) => { await appClient.entities.VoiceNote.delete(id); load(); };

  const speak = (note) => {
    if (speakingId === note.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(note.transcript);
    utter.lang = 'en-IN';
    utter.onend = () => setSpeakingId(null);
    setSpeakingId(note.id);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      <PageHeader title="Voice Notes" icon={Mic} subtitle="Speak your field notes — we keep them forever" />

      {/* Plot selector */}
      <div className="animate-fade-up">
        <Select value={selectedPlot || '__none__'} onValueChange={(v) => setSelectedPlot(v === '__none__' ? '' : v)}>
          <SelectTrigger><SelectValue placeholder="Tag to a plot (optional)" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__none__">General (no plot)</SelectItem>
            {farms.map((f) => <SelectItem key={f.id} value={f.plot_name}>{f.plot_name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Recorder */}
      <div className="mt-6 flex animate-fade-up flex-col items-center" style={{ animationDelay: '60ms' }}>
        <button
          onClick={recording ? stopRec : startRec}
          aria-label={recording ? 'Stop recording' : 'Start recording'}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg transition-all active:scale-90 ${
            recording ? 'animate-pulse bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-leaf-500 to-leaf-800 hover:shadow-glow'
          }`}
        >
          {recording && (
            <>
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-400" />
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-red-300" style={{ animationDelay: '0.5s' }} />
            </>
          )}
          {recording ? <Square size={30} className="relative" /> : <Mic size={34} className="relative" />}
        </button>
        <span className="mt-3 text-sm font-medium text-gray-500">
          {recording ? 'Listening… speak your note' : 'Tap to speak'}
        </span>
        {recording && (
          <span className="mt-2 flex items-end gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span key={i} className="w-1 animate-bounce-soft rounded-full bg-leaf-500" style={{ height: `${8 + (i % 3) * 6}px`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        )}
      </div>

      {/* Live transcript */}
      {(transcript || interim) && (
        <div className="mt-5 animate-fade-up rounded-2xl border border-leaf-200 bg-leaf-50/60 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-leaf-700">Live transcript</p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
            {transcript} <span className="italic text-gray-400">{interim}</span>
          </p>
          <Button onClick={save} disabled={saving || !transcript.trim()} className="mt-3 w-full">
            {saving ? (<><Loader2 size={15} className="animate-spin" /> Saving…</>) : 'Save note'}
          </Button>
        </div>
      )}

      {/* Saved notes */}
      <h3 className="mb-2.5 mt-6 flex items-baseline gap-2 text-sm font-semibold text-gray-900">
        <AudioLines size={15} className="text-leaf-600" /> Saved notes
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">{notes.length}</span>
      </h3>
      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 py-10 text-center">
          <Mic size={26} className="mx-auto text-gray-300" />
          <p className="mt-2 text-sm font-medium text-gray-600">No notes yet</p>
          <p className="text-xs text-gray-400">Record your first note above — like "sprayed neem on plot 2".</p>
        </div>
      ) : (
        <SectionCard>
          <ul className="divide-y divide-gray-100">
            {notes.map((n, i) => (
              <li key={n.id} className="flex animate-slide-in items-start gap-3 px-4 py-3" style={{ animationDelay: `${Math.min(i, 8) * 35}ms` }}>
                <button
                  onClick={() => speak(n)}
                  aria-label={speakingId === n.id ? 'Stop playing' : 'Play note'}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
                    speakingId === n.id ? 'bg-leaf-600 text-white' : 'bg-leaf-50 text-leaf-700 hover:bg-leaf-100'
                  }`}
                >
                  {speakingId === n.id ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-relaxed text-gray-700">{n.transcript}</p>
                  <div className="mt-1 flex items-center gap-2">
                    {n.plot_name && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                        <MapPin size={9} /> {n.plot_name}
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      {new Date(n.created_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
                <button onClick={() => remove(n.id)} aria-label="Delete note" className="shrink-0 rounded-full p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}
    </div>
  );
}
