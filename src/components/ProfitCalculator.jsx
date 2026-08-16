import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const DEFAULT_YIELD = 12;

export default function ProfitCalculator() {
  const { t } = useLang();
  const [data, setData] = useState(null);

  useEffect(() => {
    const load = async () => {
      const [entries, cycles, farms, prices] = await Promise.all([
        base44.entities.FarmLedgerEntry.list('-entry_date', 200).catch(() => []),
        base44.entities.CropCycle.list().catch(() => []),
        base44.entities.Farm.list().catch(() => []),
        base44.entities.MarketPrice.list('-price_date', 200).catch(() => []),
      ]);
      const totalExpense = entries.filter((e) => e.kind === 'expense').reduce((s, e) => s + (e.amount || 0), 0);
      const farmArea = {};
      farms.forEach((f) => { farmArea[f.id] = f.area_value || 1; });
      const activeCycles = cycles.filter((c) => c.status !== 'harvested' && c.crop_name);
      let estRevenue = 0;
      const breakdown = [];
      activeCycles.forEach((c) => {
        const area = farmArea[c.farm_id] || 1;
        const match = prices.find((p) => p.commodity && p.commodity.toLowerCase().includes(c.crop_name.toLowerCase()));
        const price = match?.modal_price || 0;
        const value = price * area * DEFAULT_YIELD;
        estRevenue += value;
        breakdown.push({ crop: c.crop_name, plot: c.plot_name, area, price, value });
      });
      setData({ totalExpense, estRevenue, net: estRevenue - totalExpense, breakdown });
    };
    load();
  }, []);

  if (!data) return null;
  const within = data.net >= 0;

  return (
    <Card className={within ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
      <CardContent className="pt-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5 mb-3"><Scale className="h-4 w-4 text-green-700" />{t('profitCalculator')}</h3>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-gray-500">{t('totalExpense')}</p>
            <p className="text-sm font-bold text-red-600">₹{data.totalExpense.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-gray-500">{t('estHarvestValue')}</p>
            <p className="text-sm font-bold text-green-600">₹{data.estRevenue.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="flex items-center justify-between bg-white/60 rounded-lg p-2">
          <span className="text-xs font-medium text-gray-600">{t('netEstimate')}</span>
          <Badge className={within ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
            {within ? <TrendingUp className="h-3 w-3 inline mr-1" /> : <TrendingDown className="h-3 w-3 inline mr-1" />}
            ₹{data.net.toLocaleString('en-IN')} · {within ? t('withinBudget') : t('overBudget')}
          </Badge>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">* {t('profitDisclaimer')}</p>
      </CardContent>
    </Card>
  );
}
