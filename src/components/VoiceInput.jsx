import React, { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { useLang } from '../lib/i18n';

const LANG_MAP = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };

export default function VoiceInput({ value, onChange, placeholder, rows = 3 }) {
  const { lang } = useLang();
  const [listening, setListening] = useState(false);
  const recRef = useRef(null);

  const toggle = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert('Voice input is not supported on this browser. Please type instead.');
      return;
    }
    const rec = new SR();
    rec.lang = LANG_MAP[lang] || 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      onChange(value ? value + ' ' + text : text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  return (
    <div className="relative">
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="pr-12 resize-none" />
      <button
        type="button"
        onClick={toggle}
        className={`absolute right-2 bottom-2 h-9 w-9 rounded-full flex items-center justify-center transition-colors ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-600 text-white'}`}
        aria-label="Voice input"
      >
        {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
    </div>
  );
}
