import React, { useState, useEffect } from 'react';
import { User, MapPin, Globe, Save, Plus, Trash2 } from 'lucide-react';
import { useLang, LANGS } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import LocationFields from '../components/LocationFields';
import PageHeader from '../components/PageHeader';

export default function ProfileSettings() {
  const { t, lang, setLang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ full_name: '', phone: '', state: '', district: '', mandal: '', village: '', geo_lat: null, geo_lng: null, preferred_language: 'en' });
  const [farms, setFarms] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFarm, setShowFarm] = useState(false);
  const [farmForm, setFarmForm] = useState({ plot_name: '', state: '', district: '', mandal: '', village: '', geo_lat: null, geo_lng: null, area_value: '', area_unit: 'acre' });

  useEffect(() => {
    base44.auth.me().then((u) => {
      setUser(u);
      setProfile({
        full_name: u.full_name || '',
        phone: u.phone || '',
        state: u.state || '',
        district: u.district || '',
        mandal: u.mandal || '',
        village: u.village || '',
        geo_lat: u.geo_lat ?? null,
        geo_lng: u.geo_lng ?? null,
        preferred_language: u.preferred_language || 'en',
      });
    }).catch(() => {});
    base44.entities.Farm.list().then(setFarms).catch(() => {});
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        full_name: profile.full_name,
        phone: profile.phone,
        state: profile.state,
        district: profile.district,
        mandal: profile.mandal,
        village: profile.village,
        geo_lat: profile.geo_lat,
        geo_lng: profile.geo_lng,
        preferred_language: profile.preferred_language,
      });
      if (profile.preferred_language !== lang) setLang(profile.preferred_language);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert(t('saveFailed')); } finally { setSaving(false); }
  };

  const addFarm = async () => {
    if (!farmForm.plot_name) return;
    await base44.entities.Farm.create({ ...farmForm, area_value: farmForm.area_value ? Number(farmForm.area_value) : undefined, geo_lat: farmForm.geo_lat || undefined, geo_lng: farmForm.geo_lng || undefined });
    setFarmForm({ plot_name: '', state: '', district: '', mandal: '', village: '', geo_lat: null, geo_lng: null, area_value: '', area_unit: 'acre' });
    setShowFarm(false);
    base44.entities.Farm.list().then(setFarms);
  };
  const removeFarm = async (id) => { await base44.entities.Farm.delete(id); base44.entities.Farm.list().then(setFarms); };

  return (
    <div>
      <PageHeader titleKey="profileSettings" icon={User} />

      <Card className="mb-4"><CardContent className="pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><User className="h-4 w-4 text-green-600" />{t('personalInfo')}</h3>
        <div><Label className="mb-1 block">{t('fullName')}</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
        <div><Label className="mb-1 block">{t('phone')}</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="10-digit mobile" /></div>
        {user?.email && <p className="text-xs text-gray-400">{t('email')}: {user.email}</p>}
      </CardContent></Card>

      <Card className="mb-4"><CardContent className="pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><MapPin className="h-4 w-4 text-green-600" />{t('farmAddress')}</h3>
        <LocationFields value={profile} onChange={(v) => setProfile({ ...profile, ...v })} />
      </CardContent></Card>

      <Card className="mb-4"><CardContent className="pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Globe className="h-4 w-4 text-green-600" />{t('regionalPrefs')}</h3>
        <div><Label className="mb-1 block">{t('language')}</Label>
          <Select value={profile.preferred_language} onValueChange={(v) => setProfile({ ...profile, preferred_language: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent className="max-h-72">{LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      <Button onClick={saveProfile} disabled={saving} className="w-full mb-4 bg-green-600 hover:bg-green-700">
        <Save className="h-4 w-4" /> {saved ? t('saved') : t('save')}
      </Button>

      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{t('myPlots')}</h3>
        <Button size="sm" variant="outline" onClick={() => setShowFarm(!showFarm)}><Plus className="h-3 w-3" />{t('addPlot')}</Button>
      </div>

      {showFarm && (
        <Card className="mb-3"><CardContent className="pt-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div><Label className="mb-1 block">{t('plotName')}</Label><Input value={farmForm.plot_name} onChange={(e) => setFarmForm({ ...farmForm, plot_name: e.target.value })} /></div>
            <div><Label className="mb-1 block">{t('area')}</Label><Input type="number" value={farmForm.area_value} onChange={(e) => setFarmForm({ ...farmForm, area_value: e.target.value })} /></div>
          </div>
          <LocationFields value={farmForm} onChange={(v) => setFarmForm({ ...farmForm, ...v })} compact />
          <Button onClick={addFarm} size="sm" className="w-full bg-green-600 hover:bg-green-700">{t('save')}</Button>
        </CardContent></Card>
      )}

      {farms.length === 0 ? (
        <p className="text-xs text-gray-400">{t('noPlots')}</p>
      ) : (
        <div className="space-y-2">
          {farms.map((f) => (
            <Card key={f.id}><CardContent className="pt-3 pb-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{f.plot_name}</p>
                <p className="text-xs text-gray-500">{[f.village, f.district, f.state].filter(Boolean).join(', ') || '—'}{f.area_value ? ` · ${f.area_value} ${f.area_unit}` : ''}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => removeFarm(f.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </CardContent></Card>
          ))}
        </div>
      )}
    </div>
  );
}
