import React, { useState, useEffect, useRef } from 'react';
import { Camera, ImageIcon, AlertTriangle, Leaf, FlaskConical, Shield, ChevronRight, RotateCcw, CloudOff, PawPrint, Sprout } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { enqueue, isOnline, flush } from '../lib/offlineQueue';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Image } from '../components/ui/image';
import VoiceInput from '../components/VoiceInput';
import PageHeader from '../components/PageHeader';

export default function Diagnose() {
  const { t } = useLang();
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [step, setStep] = useState(1);
  const [photoUrl, setPhotoUrl] = useState('');
  const [cropName, setCropName] = useState('');
  const [plotId, setPlotId] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [domain, setDomain] = useState('crop');
  const [animalType, setAnimalType] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [queuedOffline, setQueuedOffline] = useState(false);
  const analyzedRef = useRef(false);

  useEffect(() => {
    base44.entities.Crop.list('name_en', 200).then(setCrops).catch(() => {});
    base44.entities.Farm.list().then(setFarms).catch(() => {});
  }, []);

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (!isOnline()) {
        const reader = new FileReader();
        reader.onload = () => setPhotoUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setPhotoUrl(file_url);
      }
    } catch (err) {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const selectedPlot = farms.find((f) => f.id === plotId);

  const analyze = async () => {
    setLoading(true);
    setResult(null);
    setQueuedOffline(false);
    const profile = selectedPlot
      ? `Plot: ${selectedPlot.plot_name}, State: ${selectedPlot.state || 'unknown'}, Soil: ${selectedPlot.soil_type || 'unknown'}, Water: ${selectedPlot.water_source || 'unknown'}.`
      : 'No plot profile selected.';
    const subject = domain === 'animal' ? (animalType || 'Livestock/animal') : (cropName || 'Crop');
    const prompt = `You are an AI agricultural assistant for Indian farmers. Analyze this ${domain === 'animal' ? 'livestock / animal health' : 'crop'} issue.
${domain === 'animal' ? 'Animal type' : 'Crop'}: ${subject}.
Symptoms described: ${symptoms || 'none — rely on the photo'}.
Farm profile: ${profile}
Based on the photo and description, identify the LIKELY issue. Never claim certainty. If evidence is weak, say so. Prefer organic/safe treatments first. If it is a serious disease/outbreak risk or a veterinarian is needed, set escalate=true. Respond in simple farmer-friendly language.`;
    const schema = {
      type: 'object',
      properties: {
        likely_issue: { type: 'string' },
        alternatives: { type: 'array', items: { type: 'string' } },
        confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
        evidence: { type: 'string' },
        organic_treatment: { type: 'string' },
        chemical_treatment: { type: 'string' },
        precautions: { type: 'string' },
        escalate: { type: 'boolean' },
        escalation_note: { type: 'string' },
      },
      required: ['likely_issue', 'confidence'],
    };
    const record = {
      domain,
      subject,
      farm_id: plotId || undefined,
      input_text: symptoms,
      language: undefined,
    };
    try {
      if (!isOnline()) {
        enqueue({
          type: 'diagnose',
          prompt,
          schema,
          photoDataUrl: photoUrl && photoUrl.startsWith('data:') ? photoUrl : undefined,
          record,
        });
        setQueuedOffline(true);
        return;
      }
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: photoUrl && !photoUrl.startsWith('data:') ? [photoUrl] : undefined,
        response_json_schema: schema,
      });
      setResult(res);
      await base44.entities.Diagnosis.create({
        ...record,
        image_url: photoUrl && !photoUrl.startsWith('data:') ? photoUrl : undefined,
        likely_issue: res.likely_issue,
        alternatives: res.alternatives,
        confidence: res.confidence,
        evidence: res.evidence,
        organic_treatment: res.organic_treatment,
        chemical_treatment: res.chemical_treatment,
        precautions: res.precautions,
        escalate: res.escalate,
        escalation_note: res.escalation_note,
      });
    } catch (err) {
      // leave result null; step 3 shows retry state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 3 && !analyzedRef.current) {
      analyzedRef.current = true;
      analyze();
    }
  }, [step]);

  const reset = () => {
    setStep(1);
    setPhotoUrl('');
    setCropName('');
    setPlotId('');
    setSymptoms('');
    setDomain('crop');
    setAnimalType('');
    setResult(null);
    setQueuedOffline(false);
    analyzedRef.current = false;
  };

  const steps = [t('step1Photo'), t('step2Crop'), t('step3Advice')];

  return (
    <div>
      <PageHeader titleKey="diagnose" icon={Camera} />
      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mb-4">
        ⚠️ {t('aiAssisted')}
      </p>

      <div className="flex items-center gap-1 mb-4">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div className={`h-1.5 rounded-full ${step > i + 1 ? 'bg-green-600' : step === i + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <p className={`text-[10px] mt-1 ${step >= i + 1 ? 'text-green-700 font-medium' : 'text-gray-400'}`}>{s}</p>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden">
                <Image src={photoUrl} className="w-full h-56" fittingType="fill" />
                <button onClick={() => setPhotoUrl('')} className="absolute top-2 right-2 bg-white/90 rounded-full px-3 py-1 text-xs">{t('back')}</button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-green-300 rounded-xl cursor-pointer bg-green-50/50 hover:bg-green-50">
                {uploading ? <span className="text-sm text-gray-500">{t('loading')}</span> : (
                  <>
                    <ImageIcon className="h-10 w-10 text-green-500 mb-2" />
                    <span className="text-sm text-green-700 font-medium">{t('takePhoto')}</span>
                  </>
                )}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhoto} />
              </label>
            )}
          </div>
          <Button onClick={() => setStep(2)} disabled={uploading} className="w-full bg-green-600 hover:bg-green-700 h-12 text-base">
            {t('next')} <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button onClick={() => setDomain('crop')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium ${domain === 'crop' ? 'bg-white text-green-700 shadow' : 'text-gray-500'}`}>
              <Sprout className="h-4 w-4" />{t('crop')}
            </button>
            <button onClick={() => setDomain('animal')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium ${domain === 'animal' ? 'bg-white text-green-700 shadow' : 'text-gray-500'}`}>
              <PawPrint className="h-4 w-4" />{t('animalLivestock')}
            </button>
          </div>

          {domain === 'crop' ? (
            <div>
              <Label className="mb-1.5 block">{t('selectCrop')} *</Label>
              <Select value={cropName} onValueChange={setCropName}>
                <SelectTrigger><SelectValue placeholder={t('selectCrop')} /></SelectTrigger>
                <SelectContent className="max-h-72">{crops.map((c) => (
                  <SelectItem key={c.id} value={c.name_en}>{c.name_en} · {c.category}</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label className="mb-1.5 block">{t('animalType')} *</Label>
              <Select value={animalType} onValueChange={setAnimalType}>
                <SelectTrigger><SelectValue placeholder={t('selectAnimal')} /></SelectTrigger>
                <SelectContent className="max-h-72">
                  {['Cow', 'Buffalo', 'Goat', 'Sheep', 'Pig', 'Poultry (Chicken)', 'Duck', 'Horse', 'Camel', 'Fish', 'Other'].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {farms.length > 0 && (
            <div>
              <Label className="mb-1.5 block">{t('selectPlot')}</Label>
              <Select value={plotId} onValueChange={setPlotId}>
                <SelectTrigger><SelectValue placeholder={t('selectPlot')} /></SelectTrigger>
                <SelectContent>{farms.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.plot_name}{f.state ? ` · ${f.state}` : ''}</SelectItem>
                ))}</SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label className="mb-1.5 block">{t('describeSymptoms')}</Label>
            <VoiceInput value={symptoms} onChange={setSymptoms} placeholder="e.g. leaves turning yellow with brown spots" />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">{t('back')}</Button>
            <Button onClick={() => { analyzedRef.current = false; setStep(3); }} disabled={domain === 'crop' ? !cropName : !animalType} className="flex-1 bg-green-600 hover:bg-green-700">
              {t('analyze')} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {loading ? (
            <Card><CardContent className="pt-6 text-center">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('analyzing')}</p>
            </CardContent></Card>
          ) : queuedOffline ? (
            <Card className="border-amber-200"><CardContent className="pt-6 text-center">
              <CloudOff className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-amber-700 mb-1">{t('savedOffline')}</p>
              <p className="text-xs text-gray-500 mb-3">{t('diagnoseQueued')}</p>
              <Button onClick={async () => { await flush(); }} variant="outline" className="mb-2">{t('syncNow')}</Button>
              <Button onClick={reset} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-1" />{t('startOver')}</Button>
            </CardContent></Card>
          ) : result ? (
            <Card className="border-green-200">
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5"><Leaf className="h-4 w-4 text-green-600" />{t('likelyIssue')}</h3>
                  <Badge className={result.confidence === 'high' ? 'bg-green-100 text-green-700' : result.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}>
                    {t('confidence')}: {result.confidence}
                  </Badge>
                </div>
                <p className="text-sm">{result.likely_issue}</p>

                {result.alternatives?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{t('alternatives')}</p>
                    <ul className="text-sm list-disc pl-5 text-gray-700">
                      {result.alternatives.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  </div>
                )}
                {result.evidence && (
                  <div><p className="text-xs font-semibold text-gray-500">{t('evidence')}</p><p className="text-sm text-gray-700">{result.evidence}</p></div>
                )}
                {result.organic_treatment && (
                  <div className="bg-green-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-green-700 flex items-center gap-1"><Leaf className="h-3 w-3" />{t('organicFirst')}</p>
                    <p className="text-sm mt-0.5">{result.organic_treatment}</p>
                  </div>
                )}
                {result.chemical_treatment && (
                  <div className="bg-blue-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-blue-700 flex items-center gap-1"><FlaskConical className="h-3 w-3" />{t('chemical')}</p>
                    <p className="text-sm mt-0.5">{result.chemical_treatment}</p>
                  </div>
                )}
                {result.precautions && (
                  <div className="bg-amber-50 rounded-lg p-2.5">
                    <p className="text-xs font-semibold text-amber-700 flex items-center gap-1"><Shield className="h-3 w-3" />{t('precautions')}</p>
                    <p className="text-sm mt-0.5">{result.precautions}</p>
                  </div>
                )}
                {result.escalate && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">{t('consultExpert')}</p>
                      {result.escalation_note && <p className="text-xs text-red-600 mt-0.5">{result.escalation_note}</p>}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card><CardContent className="pt-6 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">Analysis failed. Please try again.</p>
              <Button onClick={() => analyze()} className="bg-green-600 hover:bg-green-700">Retry</Button>
            </CardContent></Card>
          )}
          <Button onClick={reset} variant="outline" className="w-full"><RotateCcw className="h-4 w-4 mr-1" />{t('startOver')}</Button>
        </div>
      )}
    </div>
  );
}
