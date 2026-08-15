import React, { useState, useEffect } from 'react';
import { Scale } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Card, CardContent } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Badge } from './ui/badge';

const TYPICAL_YIELD = {
  rice: 22, paddy: 22, wheat: 18, cotton: 10, maize: 28, sugarcane: 350,
  groundnut: 10, soybean: 12,
};

const matchYield = (name) => {
  if (!name) return null;
  const n = name.toLowerCase();
  const key = Object.keys(TYPICAL_YIELD).find((k) => n.includes(k));
  return key ? TYPICAL_YIELD[key] : null;
};

export default function YieldEstimator() {
  const { t } = useLang();
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [plotId, setPlotId] = useState('');
  const [cropName, setCropName] = useState('');
  const [area, setArea] = useState('');
  const [yieldPerAcre, setYieldPerAcre] = useState('');

  useEffect(() => {
    base44.entities.Farm.list().then(setFarms).catch(() => {});
    base44.entities.Crop.list('name_en', 200).then(setCrops).catch(() => {});
  }, []);

  const selectedPlot = farms.find((f) => f.id === plotId);
  const effectiveArea = area || (selectedPlot?.area_value ? String(selectedPlot.area_value) : '');
  const unit = selectedPlot?.area_unit || 'acre';

  useEffect(() => {
    const y = matchYield(cropName);
    if (y) setYieldPerAcre(String(y));
  }, [cropName]);

  const areaInAcres = () => {
    const a = Number(effectiveArea);
    if (!a) return 0;
    if (unit === 'hectare') return a * 2.471;
    if (unit === 'guntha') return a * 0.025;
    return a;
  };

  const yp = Number(yieldPerAcre) || 0;
  const totalYield = areaInAcres() * yp;
  const hasResult = totalYield > 0;

  return (
    <Card className="border-green-200">
      <CardContent className="pt-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
          <Scale className="h-4 w-4 text-green-600" /> {t('yieldEstimator')}
        </h3>
        <p className="text-xs text-amber-700 bg-amber-50 rounded p-1.5">{t('yieldDisclaimer')}</p>
        <div>
          <Label className="mb-1 block text-xs">{t('selectPlot')}</Label>
          <Select value={plotId} onValueChange={(v) => { setPlotId(v); const p = farms.find((f) => f.id === v); if (p?.current_crop) setCropName(p.current_crop); }}>
            <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('selectPlot')} /></SelectTrigger>
            <SelectContent>{farms.map((f) => (
              <SelectItem key={f.id} value={f.id}>{f.plot_name}{f.area_value ? ` · ${f.area_value} ${f.area_unit || 'acre'}` : ''}</SelectItem>
            ))}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="mb-1 block text-xs">{t('area')} ({unit})</Label>
            <Input type="number" value={effectiveArea} onChange={(e) => setArea(e.target.value)} placeholder="0" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t('crop')}</Label>
            <Select value={cropName} onValueChange={setCropName}>
              <SelectTrigger className="h-9 text-sm"><SelectValue placeholder={t('selectCrop')} /></SelectTrigger>
              <SelectContent className="max-h-60">{crops.map((c) => (
                <SelectItem key={c.id} value={c.name_en}>{c.name_en}</SelectItem>
              ))}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="mb-1 block text-xs">{t('yieldPerAcre')} (qtl/acre)</Label>
          <Input type="number" value={yieldPerAcre} onChange={(e) => setYieldPerAcre(e.target.value)} placeholder="0" className="h-9 text-sm" />
        </div>
        {hasResult && (
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{t('estTotalYield')}</p>
            <p className="text-2xl font-bold text-green-700">{totalYield.toLocaleString('en-IN', { maximumFractionDigits: 1 })}</p>
            <p className="text-xs text-gray-500">quintals</p>
            <Badge className="mt-2 bg-white text-green-700">{areaInAcres().toFixed(2)} {t('area')} · {yp} qtl/acre</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
