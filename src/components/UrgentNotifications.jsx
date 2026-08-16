import React, { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';

const today = new Date().toISOString().slice(0, 10);

export default function UrgentNotifications() {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [dx] = await Promise.all([
        base44.entities.Diagnosis.list('-created_date', 20).catch(() => []),
      ]);
      const cropAlerts = dx
        .filter((d) => d.escalate || d.confidence === 'high')
        .map((d) => ({
          id: 'dx_' + d.id,
          type: 'crop',
          title: d.subject || 'Crop diagnosis',
          detail: d.likely_issue || d.escalation_note || 'High-priority issue detected',
          link: '/diagnose',
        }));
      setItems([...cropAlerts]);
    };
    load();
  }, []);

  const visible = items.filter((i) => !dismissed.includes(i.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-2">
      {visible.slice(0, 4).map((i) => {
        const isCrop = i.type === 'crop';
        return (
          <Link key={i.id} to={i.link}>
            <div className={`flex items-start gap-2 rounded-lg p-2.5 border ${isCrop ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'}`}>
              <AlertTriangle className={`h-5 w-5 shrink-0 ${isCrop ? 'text-red-600' : 'text-orange-600'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${isCrop ? 'text-red-700' : 'text-orange-700'}`}>{isCrop ? t('cropAlert') : t('livestockAlert')}</p>
                <p className={`text-sm font-medium truncate ${isCrop ? 'text-red-800' : 'text-orange-800'}`}>{i.title}</p>
                <p className={`text-xs truncate ${isCrop ? 'text-red-600' : 'text-orange-600'}`}>{i.detail}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setDismissed([...dismissed, i.id]); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
