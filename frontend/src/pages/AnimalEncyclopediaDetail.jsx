import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Home, Syringe, Utensils, Thermometer, TrendingUp,
  AlertTriangle, IndianRupee, Droplets,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/PageHeader';
import animalData from '@/data/animalEncyclopedia.json';

export default function AnimalEncyclopediaDetail() {
  const { categoryId, typeId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();

  const category = animalData.categories.find((c) => c.id === categoryId);
  const animal = category?.types.find((tItem) => tItem.id === typeId);

  if (!animal) {
    return (
      <div>
        <PageHeader titleKey="animalEncyclopedia" icon={Home} />
        <p className="text-sm text-gray-400 text-center py-8">{t('animalTypeNotFound')}</p>
        <button onClick={() => navigate('/animal-encyclopedia')} className="text-sm text-green-700 flex items-center gap-1 mx-auto">
          <ArrowLeft className="h-4 w-4" />{t('backToEncyclopedia')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/animal-encyclopedia')}
        className="flex items-center gap-1 text-xs text-gray-500 mb-2"
      >
        <ArrowLeft className="h-3.5 w-3.5" />{t('backToEncyclopedia')}
      </button>

      <div className="mb-4">
        <h1 className="text-lg font-bold text-gray-800">{animal.name}</h1>
        <p className="text-sm text-gray-500">{category.name} &middot; {animal.purpose}</p>
      </div>

      {/* Breeds */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('breeds')}</h3>
          <div className="space-y-2">
            {animal.breeds.map((b) => (
              <div key={b.name} className="border border-gray-100 rounded-lg p-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium">{b.name}</p>
                  <Badge className="bg-gray-100 text-gray-600 text-[10px]">{b.origin}</Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{b.traits}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Housing / Environment */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Thermometer className="h-4 w-4 text-blue-600" />{t('housingEnvironment')}
          </h3>
          <dl className="text-xs text-gray-600 space-y-1.5">
            <div><dt className="inline font-medium text-gray-700">{t('housingType')}: </dt><dd className="inline">{animal.housing.type}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('spaceRequirement')}: </dt><dd className="inline">{animal.housing.space_requirement}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('temperatureRange')}: </dt><dd className="inline">{animal.housing.temperature_range}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('humidity')}: </dt><dd className="inline">{animal.housing.humidity}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('ventilation')}: </dt><dd className="inline">{animal.housing.ventilation}</dd></div>
            {animal.housing.notes && (
              <p className="text-[11px] text-gray-500 italic mt-1">{animal.housing.notes}</p>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Feed */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-amber-600" />{t('feedRequirements')}
          </h3>
          <dl className="text-xs text-gray-600 space-y-1.5">
            <div><dt className="inline font-medium text-gray-700">{t('feedType')}: </dt><dd className="inline">{animal.feed.type}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('dailyQuantity')}: </dt><dd className="inline">{animal.feed.daily_quantity}</dd></div>
            <div><dt className="inline font-medium text-gray-700">{t('keyIngredients')}: </dt><dd className="inline">{animal.feed.key_ingredients}</dd></div>
            <div className="flex items-center gap-1"><Droplets className="h-3 w-3 text-cyan-500" /><dt className="inline font-medium text-gray-700">{t('waterRequirement')}: </dt><dd className="inline">{animal.feed.water_requirement}</dd></div>
          </dl>
        </CardContent>
      </Card>

      {/* Vaccination Schedule */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Syringe className="h-4 w-4 text-rose-600" />{t('vaccinationSchedule')}
          </h3>
          <div className="space-y-2">
            {animal.vaccination_schedule.map((v, i) => (
              <div key={i} className="flex gap-2 border-l-2 border-rose-200 pl-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className="bg-rose-50 text-rose-700 text-[10px]">{v.age}</Badge>
                    <span className="text-xs font-medium">{v.vaccine}</span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {t('prevents')}: {v.disease_prevented} &middot; {t('route')}: {v.route}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yield Timeline */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-green-600" />{t('yieldTimeline')}
          </h3>
          <div className="relative pl-4 space-y-3">
            <div className="absolute left-1.5 top-1 bottom-1 w-px bg-green-200" />
            {animal.yield_timeline.map((y, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-4 top-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                <p className="text-xs font-semibold text-gray-700">{y.stage} <span className="text-gray-400 font-normal">&middot; {y.age_range}</span></p>
                <p className="text-[11px] text-gray-500">{y.milestone}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Diseases */}
      <Card className="mb-3">
        <CardContent className="pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-orange-600" />{t('commonDiseases')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {animal.common_diseases.map((d) => (
              <Badge key={d} className="bg-orange-50 text-orange-700 text-[10px]">{d}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economics */}
      {animal.economics && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4 text-emerald-600" />{t('quickFacts')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(animal.economics).map(([k, v]) => (
                <div key={k} className="bg-emerald-50 border border-emerald-100 rounded-lg p-2">
                  <p className="text-[10px] text-gray-500 capitalize">{k.replace(/_/g, ' ')}</p>
                  <p className="text-xs font-semibold text-emerald-700">{String(v)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
