import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, Mic, Volume2, Send } from 'lucide-react';
import axios from 'axios';
import { INDIAN_LANGUAGES } from '../lib/indianLanguages';
import { useHelperRouter } from '../lib/useHelperRouter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function collectContextData() {
  const snapshot = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('agrisaathi_entity_')) {
      try {
        snapshot[key.replace('agrisaathi_entity_', '')] = JSON.parse(localStorage.getItem(key));
      } catch {
        // skip malformed entries
      }
    }
  }
  return snapshot;
}

export default function AgriHelperWidget() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help you find or fill anything in AgriSaathi. Tap the mic or type.' },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  // Deterministic, client-side page router — replaces backend page-guessing.
  const { handleRouterTurn } = useHelperRouter();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const currentLocale = INDIAN_LANGUAGES.find((l) => l.code === lang)?.locale || 'en-IN';

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = currentLocale;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang === currentLocale || v.lang.startsWith(lang));
    if (match) utter.voice = match;
    window.speechSynthesis.speak(utter);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Voice input is not supported on this browser.' }]);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = currentLocale;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendMessage = async (textOverride) => {
    const text = (textOverride ?? input).trim();
    if (!text) return;

    setMessages((m) => [...m, { role: 'user', text }]);
    setInput('');

    // 1. Try the deterministic router FIRST — handles page navigation and
    //    yes/no confirmation locally, with zero chance of hallucinating a page.
    const routed = handleRouterTurn(text);
    if (routed.handled) {
      setMessages((m) => [...m, { role: 'assistant', text: routed.reply }]);
      speak(routed.reply);
      return;
    }

    // 2. Not a navigation turn — fall back to the backend for open Q&A only.
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/helper/chat`, {
        message: text,
        language: lang,
        context_data: collectContextData(),
      });

      const { reply_text } = response.data;
      setMessages((m) => [...m, { role: 'assistant', text: reply_text }]);
      speak(reply_text);
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I had trouble understanding that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-50 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700"
        aria-label="Open Agri Helper"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full sm:w-96 h-[70vh] sm:h-[32rem] sm:bottom-20 sm:right-4 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">Agri Helper</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs border border-gray-200 rounded px-1 py-0.5"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>
        <button onClick={() => setOpen(false)} aria-label="Close">
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${m.role === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p>{m.text}</p>
              {m.role === 'assistant' && (
                <button onClick={() => speak(m.text)} className="mt-1 flex items-center gap-1 text-xs opacity-70 hover:opacity-100">
                  <Volume2 className="h-3 w-3" /> Read aloud
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && <p className="text-xs text-gray-400">Thinking...</p>}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 border-t border-gray-100 flex items-center gap-2">
        <button
          onClick={startListening}
          className={`p-2 rounded-full ${listening ? 'bg-red-500' : 'bg-green-600'} text-white`}
          aria-label="Speak"
        >
          <Mic className="h-4 w-4" />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type or tap mic..."
          className="flex-1 border border-gray-200 rounded-full px-3 py-2 text-sm"
        />
        <button onClick={() => sendMessage()} className="p-2 rounded-full bg-green-600 text-white" aria-label="Send">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
