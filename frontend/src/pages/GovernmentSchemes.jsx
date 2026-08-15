import React, { useState, useEffect } from 'react';
import { Landmark, CheckCircle2, XCircle, ExternalLink, Loader2, MapPin } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { base44 } from '../api/base44Client';
import { STATES } from '../lib/indianLocations';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';

export default function GovernmentSchemes() {
  const { t } = useLang();
  const [schemes, setSchemes] = useState([]);
  const [farms, setFarms] = useState([]);
  const [eligibility, setEligibility] = useState({});
  const [checking, setChecking] = useState(null);
  const [filterState, setFilterState] = useState('');

  useEffect(() => {
    base44.entities.GovScheme.list('name', 200).then(setSchemes).catch(() => {});
    base44.entities.Farm.list().then(setFarms).catch(() => {});
    base44.auth.me().then((u) => { if (u.state) setFilterState(u.state); }).catch(() => {});
  }, []);

  const matchesState = (s) => {
    if (!filterState) return true;
    const scope = (s.state_scope || '').toLowerCase().trim();
    if (!scope || scope === 'all india' || scope === 'all') return true;
    return scope.includes(filterState.toLowerCase());
  };
  const visibleSchemes = schemes.filter(matchesState);

  const farmProfile = farms.length
    ? farms.map((f) => `Plot ${f.plot_name}: ${f.state || ''} ${f.district || ''}, ${f.area_value || ''} ${f.area_unit || ''}, crop ${f.current_crop || 'none'}, type ${f.farm_type || ''}.`).join(' ')
    : 'No farm plots registered yet.';

  const checkEligibility = async (scheme) => {
    setChecking(scheme.id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an eligibility checker for Indian government agricultural schemes. Given the farmer's profile and a scheme's eligibility summary, determine if the farmer is likely ELIGIBLE, PARTIALLY eligible, or NOT eligible. Be conservative; if unsure, say PARTIALLY. Explain briefly in simple farmer-friendly language.

Farmer profile: ${farmProfile}

Scheme: ${scheme.name}
Ministry: ${scheme.ministry || 'N/A'}
Eligibility: ${scheme.eligibility_summary || 'Not specified'}
State scope: ${scheme.state_scope || 'All India'}`,
        response_json_schema: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['eligible', 'partially', 'not_eligible'] },
            reason: { type: 'string' },
            next_steps: { type: 'string' },
          },
          required: ['status', 'reason'],
        },
      });
      setEligibility((prev) => ({ ...prev, [scheme.id]: res }));
    } catch {
      setEligibility((prev) => ({ ...prev, [scheme.id]: { status: 'partially', reason: t('checkFailed') } }));
    } finally {
      setChecking(null);
    }
  };

  const statusStyle = (s) =>
    s === 'eligible' ? 'bg-green-100 text-green-700' :
    s === 'partially' ? 'bg-amber-100 text-amber-700' :
    'bg-red-100 text-red-700';
  const statusLabel = (s) =>
    s === 'eligible' ? t('eligible') :
    s === 'partially' ? t('partiallyEligible') :
    t('notEligible');

  return (
    <div>
      <PageHeader titleKey="govSchemes" icon={Landmark} />
      <p className="text-xs text-gray-500 mb-3">{t('schemesIntro')}</p>

      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-4 w-4 text-green-600 shrink-0" />
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={t('allStates')} /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value={null}>{t('allIndia')}</SelectItem>
            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {filterState && <p className="text-xs text-green-700 mb-3">{t('showingSchemesFor')} {filterState}</p>}

      {visibleSchemes.length === 0 ? (
        <Card><CardContent className="pt-6 text-center text-sm text-gray-400">{schemes.length === 0 ? t('noSchemes') : t('noSchemesForState')}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {visibleSchemes.map((s) => {
            const e = eligibility[s.id];
            return (
              <Card key={s.id}><CardContent className="pt-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{s.name}</h3>
                  {e && <Badge className={statusStyle(e.status)}>{statusLabel(e.status)}</Badge>}
                </div>
                {s.ministry && <p className="text-xs text-gray-500">{s.ministry}</p>}
                {s.benefit_summary && <p className="text-sm text-gray-700">{s.benefit_summary}</p>}
                {s.eligibility_summary && <p className="text-xs text-gray-500"><span className="font-medium">Eligibility:</span> {s.eligibility_summary}</p>}
                {e?.reason && <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-600">{e.reason}</div>}
                {e?.next_steps && <div className="bg-green-50 rounded-lg p-2 text-xs text-green-700">{e.next_steps}</div>}
                <div className="flex gap-2 pt-1">
                  <Button size="sm" variant="outline" onClick={() => checkEligibility(s)} disabled={checking === s.id} className="flex-1">
                    {checking === s.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    {t('checkEligibility')}
                  </Button>
                  {s.apply_link && (
                    <Button size="sm" variant="ghost" asChild>
                      <a href={s.apply_link} target="_blank" rel="noreferrer"><ExternalLink className="h-3 w-3" /></a>
                    </Button>
                  )}
                </div>
              </CardContent></Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
