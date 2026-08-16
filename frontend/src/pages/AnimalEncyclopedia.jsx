import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PawPrint, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AnimalEncyclopedia() {
  const [animals, setAnimals] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/livestock/encyclopedia/`)
      .then((res) => setAnimals(res.data.animals || []))
      .catch(() => setAnimals([]));
  }, []);

  const toggle = (name) => {
    if (expanded === name) { setExpanded(null); return; }
    setExpanded(name);
    if (!details[name]) {
      setLoadingDetail(name);
      axios.get(`${API_URL}/api/livestock/details/${encodeURIComponent(name)}`)
        .then((res) => setDetails((d) => ({ ...d, [name]: res.data })))
        .catch(() => setDetails((d) => ({ ...d, [name]: { detail_level: 'not_found' } })))
        .finally(() => setLoadingDetail(null));
    }
  };

  const categories = ['all', ...Array.from(new Set(animals.map((a) => a.category).filter(Boolean)))];
  const filtered = animals.filter((a) => {
    const matchesCategory = activeCategory === 'all' || a.category === activeCategory;
    const matchesQuery = !query || (a.name_en || '').toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <PageHeader titleKey="animalEncyclopedia" icon={PawPrint} />

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search breed name..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
        {categories.map((c) => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border ${activeCategory === c ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-600 border-gray-200'}`}>
            {c === 'all' ? 'All' : c}
          </button>
        ))}
      </div>

      {animals.length === 0 && <p className="text-sm text-gray-400">No livestock reference data loaded yet.</p>}

      <div className="space-y-2">
        {filtered.map((a, i) => {
          const isOpen = expanded === a.name_en;
          const detail = details[a.name_en];
          return (
            <Card key={`${a.name_en}_${i}`}>
              <CardContent className="pt-3 cursor-pointer" onClick={() => toggle(a.name_en)}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{a.name_en}</p>
                  <div className="flex items-center gap-2">
                    {a.category && <Badge className="bg-green-100 text-green-700">{a.category}</Badge>}
                    {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                  </div>
                </div>
                {a.notes && <p className="text-xs text-gray-500 mt-1">{a.notes}</p>}

                {isOpen && (
                  <div className="mt-3 pt-3 border-t space-y-3" onClick={(e) => e.stopPropagation()}>
                    {loadingDetail === a.name_en && <p className="text-xs text-gray-400">Loading details...</p>}

                    {detail?.detail_level === 'full' && (
                      <>
                        <p className="text-xs text-gray-600">{detail.description}</p>
                        <p className="text-xs"><span className="font-medium text-gray-500">Origin:</span> {detail.origin}</p>

                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Environment</p>
                          <p className="text-xs text-gray-600">Housing: {detail.environment?.housing}</p>
                          <p className="text-xs text-gray-600">Space: {detail.environment?.space}</p>
                          <p className="text-xs text-gray-600">Temperature: {detail.environment?.temperature}</p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Feed schedule</p>
                          {detail.feed_schedule?.map((f, idx) => (
                            <p key={idx} className="text-xs text-gray-600">• {f.stage}: {f.diet}</p>
                          ))}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Vaccination schedule</p>
                          {detail.vaccination_schedule?.map((v, idx) => (
                            <p key={idx} className="text-xs text-gray-600">• {v.age}: {v.vaccine}</p>
                          ))}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Growth timeline</p>
                          {detail.growth_timeline?.map((g, idx) => (
                            <p key={idx} className="text-xs text-gray-600">• {g.stage} ({g.duration}): {g.notes}</p>
                          ))}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-1">Common diseases</p>
                          <div className="flex flex-wrap gap-1">
                            {detail.common_diseases?.map((d, idx) => (
                              <Badge key={idx} className="bg-red-50 text-red-600">{d}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="bg-gray-50 rounded p-2 text-center">
                            <div className="text-[10px] text-gray-400">Maturity</div>
                            <div className="text-xs font-medium">{detail.quick_facts?.maturity_days}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-center">
                            <div className="text-[10px] text-gray-400">Yield</div>
                            <div className="text-xs font-medium">{detail.quick_facts?.yield}</div>
                          </div>
                          <div className="bg-gray-50 rounded p-2 text-center">
                            <div className="text-[10px] text-gray-400">Price range</div>
                            <div className="text-xs font-medium">{detail.quick_facts?.market_price_range}</div>
                          </div>
                        </div>
                      </>
                    )}

                    {detail?.detail_level === 'basic' && (
                      <p className="text-xs text-gray-400">{detail.note}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-300 mt-3">
        Reference data compiled from general agricultural extension guidance. Tap a breed for full details where curated.
      </p>
    </div>
  );
}
