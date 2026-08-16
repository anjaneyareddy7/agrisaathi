import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CalendarClock } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
};

export default function HarvestReminders() {
  const { t } = useLang();
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    base44.entities.CropCycle.list('-expected_harvest_date', 50)
      .then((list) => setCycles(list.filter((c) => c.status !== 'harvested' && c.expected_harvest_date)))
      .catch(() => {});
  }, []);

  const upcoming = cycles
    .map((c) => ({ ...c, days: daysUntil(c.expected_harvest_date) }))
    .filter((c) => c.days != null && c.days >= 0 && c.days <= 21)
    .sort((a, b) => a.days - b.days);

  if (upcoming.length === 0) return null;

  const tone = (days) => {
    if (days <= 3) return { bg: 'bg-red-50 border-red-200', badge: 'bg-red-100 text-red-700', label: t('harvestUrgent') };
    if (days <= 7) return { bg: 'bg-amber-50 border-amber-200', badge: 'bg-amber-100 text-amber-700', label: t('harvestSoon') };
    return { bg: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700', label: t('harvestUpcoming') };
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-1.5">
        <Bell className="h-4 w-4 text-amber-500" /> {t('harvestReminders')}
      </h3>
      <div className="space-y-2">
        {upcoming.map((c) => {
          const toneCfg = tone(c.days);
          return (
            <Link to="/dashboard" key={c.id}>
              <Card className={`${toneCfg.bg} border`}>
                <CardContent className="pt-3 pb-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{c.crop_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {new Date(c.expected_harvest_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {c.plot_name ? ` · ${c.plot_name}` : ''}
                    </p>
                  </div>
                  <Badge className={toneCfg.badge}>
                    {c.days === 0 ? t('harvestToday') : `${c.days} ${t('daysLeft')}`}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
