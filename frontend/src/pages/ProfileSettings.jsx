import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, MapPin, Plus, Trash2, Check, Pencil, Tractor, FolderArchive,
  FileSpreadsheet, Bell, LifeBuoy, ChevronRight, Phone, Globe2, Sprout,
} from 'lucide-react';
import { useLang } from '../lib/i18n';
import { INDIAN_LANGUAGES } from '../lib/indianLanguages';
import appClient from '../api/appClient';
import LocationFields from '../components/LocationFields';

const PROFILE_KEY = 'agrisaathi_profile';

const EMPTY_PROFILE = {
  full_name: '',
  phone: '',
  email: '',
  state: '',
  district: '',
  mandal: '',
  village: '',
};

const QUICK_LINKS = [
  { to: '/document-wallet', icon: FolderArchive, label: 'My documents', desc: 'Land papers & certificates' },
  { to: '/export-data', icon: FileSpreadsheet, label: 'Export my data', desc: 'Download everything as a file' },
  { to: '/alerts-center', icon: Bell, label: 'Alerts & notifications', desc: 'Price and weather alerts' },
  { to: '/support-tickets', icon: LifeBuoy, label: 'Help & support', desc: 'Get answers from our team' },
];

function loadProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...EMPTY_PROFILE };
}

function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return null;
  return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
}

export default function ProfileSettings() {
  const { lang, setLang } = useLang();
  const [profile, setProfile] = useState(loadProfile);
  const [farms, setFarms] = useState([]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [farmForm, setFarmForm] = useState({
    plot_name: '', state: '', district: '', mandal: '', village: '',
    geo_lat: null, geo_lng: null, area_value: '', area_unit: 'acre',
  });

  /* Merge any server-side account info (name/email) into the local profile */
  useEffect(() => {
    appClient.auth.me().then((u) => {
      if (!u) return;
      setProfile((prev) => ({
        ...prev,
        full_name: prev.full_name || u.full_name || '',
        phone: prev.phone || u.phone || '',
        email: u.email || prev.email || '',
      }));
    }).catch(() => {});
    appClient.entities.Farm.list().then(setFarms).catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    const doc = { ...profile, preferred_language: lang };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(doc));
    try {
      await appClient.auth.updateMe({
        full_name: profile.full_name,
        phone: profile.phone,
        state: profile.state,
        district: profile.district,
        mandal: profile.mandal,
        village: profile.village,
        preferred_language: lang,
      });
    } catch { /* offline-first: local copy already saved */ }
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2200);
  };

  const addFarm = async () => {
    if (!farmForm.plot_name.trim()) return;
    await appClient.entities.Farm.create({
      ...farmForm,
      area_value: farmForm.area_value ? Number(farmForm.area_value) : undefined,
      geo_lat: farmForm.geo_lat || undefined,
      geo_lng: farmForm.geo_lng || undefined,
    });
    setFarmForm({ plot_name: '', state: '', district: '', mandal: '', village: '', geo_lat: null, geo_lng: null, area_value: '', area_unit: 'acre' });
    setShowFarmForm(false);
    appClient.entities.Farm.list().then(setFarms);
  };

  const removeFarm = async (id) => {
    await appClient.entities.Farm.delete(id);
    appClient.entities.Farm.list().then(setFarms);
  };

  const langName = (INDIAN_LANGUAGES.find((l) => l.code === lang) || {}).label || 'English';
  const avatar = initials(profile.full_name);
  const placeLine = [profile.village, profile.mandal, profile.district, profile.state].filter(Boolean).join(', ');

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6">
      {/* ── Profile hero ─────────────────────────────── */}
      <div className="animate-fade-up overflow-hidden rounded-3xl border border-gray-200">
        <div className="relative h-20 bg-gradient-to-r from-leaf-600 to-leaf-800">
          <Sprout size={120} className="absolute -bottom-4 right-4 text-white/15" strokeWidth={1.2} />
        </div>
        <div className="relative px-5 pb-5">
          <div className="-mt-9 flex items-end justify-between">
            <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-leaf-100 font-display text-2xl font-bold text-leaf-800 shadow-sm">
              {avatar || <User size={30} className="text-leaf-600" />}
            </span>
            <button
              onClick={() => setEditing((v) => !v)}
              className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition-all hover:border-leaf-400 hover:text-leaf-700 active:scale-95"
            >
              <Pencil size={13} /> {editing ? 'Close' : 'Edit profile'}
            </button>
          </div>

          <div className="mt-3">
            <h1 className="text-xl font-semibold text-gray-900">
              {profile.full_name || 'Welcome, Farmer'}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
              {profile.phone && (
                <span className="inline-flex items-center gap-1"><Phone size={12} /> {profile.phone}</span>
              )}
              {placeLine && (
                <span className="inline-flex items-center gap-1"><MapPin size={12} /> {placeLine}</span>
              )}
              <span className="inline-flex items-center gap-1"><Globe2 size={12} /> {langName}</span>
            </div>
            {profile.email && <p className="mt-1 text-xs text-gray-400">{profile.email}</p>}
          </div>
        </div>
      </div>

      {/* ── Edit: personal info ──────────────────────── */}
      {editing && (
        <div className="mt-4 animate-fade-up rounded-2xl border border-gray-200 p-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-leaf-100 text-leaf-700">
              <User size={14} />
            </span>
            Personal information
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">Full name</span>
              <input
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-gray-500">Mobile number</span>
              <input
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="10-digit mobile"
                inputMode="tel"
                className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
              />
            </label>
          </div>

          <h2 className="mt-5 flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-leaf-100 text-leaf-700">
              <MapPin size={14} />
            </span>
            Farm location
          </h2>
          <div className="mt-3">
            <LocationFields value={profile} onChange={(v) => setProfile({ ...profile, ...v })} />
          </div>

          <button
            onClick={saveProfile}
            disabled={saving}
            className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all active:scale-[0.98] ${
              saved ? 'bg-emerald-600' : 'bg-leaf-600 hover:bg-leaf-700'
            }`}
          >
            {saved ? (<><Check size={16} /> Saved</>) : saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}

      {/* ── My plots ─────────────────────────────────── */}
      <div className="mt-4 animate-fade-up overflow-hidden rounded-2xl border border-gray-200" style={{ animationDelay: '60ms' }}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-lime-100 text-lime-700">
              <Tractor size={14} />
            </span>
            My plots
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">{farms.length}</span>
          </h2>
          <button
            onClick={() => setShowFarmForm((v) => !v)}
            className="inline-flex items-center gap-1 rounded-lg bg-leaf-600 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-leaf-700 active:scale-95"
          >
            <Plus size={13} /> Add plot
          </button>
        </div>

        {showFarmForm && (
          <div className="animate-fade-in space-y-3 border-b border-gray-100 bg-gray-50/60 px-4 py-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Plot name</span>
                <input
                  value={farmForm.plot_name}
                  onChange={(e) => setFarmForm({ ...farmForm, plot_name: e.target.value })}
                  placeholder="e.g. Kharif paddy field"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-500">Area (acres)</span>
                <input
                  type="number"
                  value={farmForm.area_value}
                  onChange={(e) => setFarmForm({ ...farmForm, area_value: e.target.value })}
                  placeholder="e.g. 2.5"
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none transition-all focus:border-leaf-500 focus:ring-4 focus:ring-leaf-100"
                />
              </label>
            </div>
            <LocationFields value={farmForm} onChange={(v) => setFarmForm({ ...farmForm, ...v })} compact />
            <button
              onClick={addFarm}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-leaf-600 py-2.5 text-sm font-semibold text-white transition-all hover:bg-leaf-700 active:scale-[0.98]"
            >
              Save plot
            </button>
          </div>
        )}

        {farms.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-gray-400">
            No plots added yet — add your first plot to get personalised advice
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {farms.map((f) => (
              <li key={f.id} className="flex animate-slide-in items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-gray-50">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
                    <Sprout size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900">{f.plot_name}</p>
                    <p className="truncate text-xs text-gray-400">
                      {[f.village, f.district, f.state].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {f.area_value && (
                    <span className="rounded-full bg-leaf-50 px-2.5 py-1 text-xs font-semibold text-leaf-700">
                      {f.area_value} {f.area_unit || 'acre'}
                    </span>
                  )}
                  <button
                    onClick={() => removeFarm(f.id)}
                    aria-label="Remove plot"
                    className="rounded-full p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Language ─────────────────────────────────── */}
      <div className="mt-4 animate-fade-up rounded-2xl border border-gray-200 px-4 py-4" style={{ animationDelay: '120ms' }}>
        <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <Globe2 size={14} />
          </span>
          App language
          <span className="ml-auto text-xs font-medium text-gray-400">Applied instantly</span>
        </h2>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {INDIAN_LANGUAGES.map((l) => {
            const active = l.code === lang;
            return (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...profile, preferred_language: l.code }));
                }}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                  active
                    ? 'animate-pop border-leaf-600 bg-leaf-600 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-leaf-400 hover:text-leaf-700'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Quick links ──────────────────────────────── */}
      <div className="mt-4 animate-fade-up overflow-hidden rounded-2xl border border-gray-200" style={{ animationDelay: '180ms' }}>
        <ul className="divide-y divide-gray-100">
          {QUICK_LINKS.map(({ to, icon: Icon, label, desc }) => (
            <li key={to}>
              <Link to={to} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 active:bg-gray-100">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-gray-900">{label}</span>
                  <span className="block truncate text-xs text-gray-400">{desc}</span>
                </span>
                <ChevronRight size={16} className="shrink-0 text-gray-300" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        AgriSaathi · Free for every farmer
      </p>
    </div>
  );
}
