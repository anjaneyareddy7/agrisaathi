import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Camera, Droplets, Sprout, Leaf, MapPin, Wallet, Stethoscope, TrendingUp, FlaskConical, ShieldCheck, Landmark, Wheat, User, Banknote, MessageSquare, CloudRain, Store, GraduationCap, FolderArchive, ShieldPlus, Package, FileDown, Activity, Calculator, Tractor, ListTodo, BarChart3, LifeBuoy, Bug, Gauge, UserCheck, Trophy, BellRing, Contact, Bell, FileSpreadsheet } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import WeatherCard from '../components/WeatherCard';
import WeatherAlerts from '../components/WeatherAlerts';
import UrgentNotifications from '../components/UrgentNotifications';
import HarvestReminders from '../components/HarvestReminders';

const INTENTS = [
  { keys: ['disease', 'pest', 'yellow', 'leaf', 'rot', 'wilt', 'spot'], to: '/diagnose', label: { en: 'Diagnose crop issue', hi: 'फसल समस्या निदान', te: 'పంట సమస్య నిర్ధారణ' } },
  { keys: ['fertiliz', 'dose', 'npk'], to: '/fertilize', label: { en: 'Fertilizer dosage', hi: 'खाद्य मात्रा', te: 'ఎరువు మోతాదు' } },
  { keys: ['soil', 'ph', 'card'], to: '/soil-passport', label: { en: 'Soil passport', hi: 'मिट्टी पासपोर्ट', te: 'నేల పాస్‌పోర్ట్' } },
  { keys: ['grow', 'crop', 'plant'], to: '/crop-planner', label: { en: 'Plan a crop', hi: 'फसल योजना', te: 'పంట ప్రణాళిక' } },
  { keys: ['cow', 'goat', 'poultry', 'fish', 'bee', 'animal'], to: '/beyond-crops', label: { en: 'Livestock help', hi: 'पशु सहायता', te: 'పశువుల సహాయం' } },
  { keys: ['market', 'price', 'mandi'], to: '/market-prices', label: { en: 'Market prices', hi: 'बाजार भाव', te: 'మార్కెట్ ధరలు' } },
];

export default function Home() {
  const { t, lang } = useLang();
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [recent, setRecent] = useState([]);
  const recRef = useRef(null);

  useEffect(() => {
    base44.entities.Diagnosis.list('-created_date', 5)
      .then(setRecent)
      .catch(() => setRecent([]));
  }, []);

  const intent = INTENTS.find((i) => i.keys.some((k) => transcript.toLowerCase().includes(k)));

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice not supported on this browser'); return; }
    const rec = new SR();
    rec.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN';
    rec.interimResults = false;
    rec.onresult = (e) => setTranscript(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
  };

  const quickLinks = [
    { to: '/diagnose', icon: Camera, label: t('diagnose'), color: 'bg-amber-50 text-amber-700' },
    { to: '/fertilize', icon: Droplets, label: t('fertilize'), color: 'bg-blue-50 text-blue-700' },
    { to: '/soil-passport', icon: Sprout, label: t('soilPassport'), color: 'bg-green-50 text-green-700' },
    { to: '/crop-planner', icon: TrendingUp, label: t('cropPlanner'), color: 'bg-purple-50 text-purple-700' },
    { to: '/beyond-crops', icon: Stethoscope, label: t('beyondCrops'), color: 'bg-rose-50 text-rose-700' },
    { to: '/livestock-care', icon: Leaf, label: t('livestockCare'), color: 'bg-teal-50 text-teal-700' },
    { to: '/market-prices', icon: Wallet, label: t('marketPrices'), color: 'bg-orange-50 text-orange-700' },
    { to: '/near-me', icon: MapPin, label: t('nearMe'), color: 'bg-indigo-50 text-indigo-700' },
    { to: '/sensor-lab', icon: FlaskConical, label: t('sensorLab'), color: 'bg-cyan-50 text-cyan-700' },
    { to: '/farm-ledger', icon: Wallet, label: t('farmLedger'), color: 'bg-lime-50 text-lime-700' },
    { to: '/crop-passport', icon: ShieldCheck, label: t('cropPassport'), color: 'bg-emerald-50 text-emerald-700' },
    { to: '/schemes', icon: Landmark, label: t('govSchemes'), color: 'bg-blue-50 text-blue-700' },
    { to: '/irrigation-planner', icon: Droplets, label: t('irrigationPlanner'), color: 'bg-cyan-50 text-cyan-700' },
    { to: '/harvest-records', icon: Wheat, label: t('harvestRecords'), color: 'bg-amber-50 text-amber-700' },
  ];

  return (
    <div className="space-y-5">
      <div className="text-center py-2">
        <h2 className="text-2xl font-bold text-green-800">{t('speak')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('tapToSpeak')}</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={startVoice}
          className={`flex h-28 w-28 items-center justify-center rounded-full text-white shadow-lg transition-all ${listening ? 'bg-red-500 animate-pulse scale-105' : 'bg-green-600 hover:bg-green-700'}`}
        >
          <Mic className="h-12 w-12" />
        </button>
        <span className="text-sm font-medium text-gray-500">{listening ? t('listening') : t('tapToSpeak')}</span>
      </div>

      {transcript && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <p className="text-sm text-gray-700">"{transcript}"</p>
            {intent && (
              <Link to={intent.to}>
                <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">
                  {intent.label[lang]} →
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      <WeatherCard />
      <WeatherAlerts />
      <UrgentNotifications />
      <HarvestReminders />

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">{t('recentActivity')}</h3>
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400">No recent activity yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((d) => (
              <Link to="/diagnose" key={d.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-3 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{d.subject || d.input_text?.slice(0, 50)}</p>
                        <p className="text-xs text-gray-400 truncate">{d.likely_issue || 'Analysis'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${d.escalate ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {d.confidence || '—'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 mb-2">{t('more')}</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, color }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5">
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-[11px] text-gray-600 text-center leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
