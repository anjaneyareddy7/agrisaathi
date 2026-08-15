import React, { useState, useEffect } from 'react';
import { PawPrint, Syringe, Wheat, Thermometer, Clock } from 'lucide-react';
import axios from 'axios';
import PageHeader from '../components/PageHeader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AnimalEncyclopedia() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('reference_data');

  useEffect(() => {
    axios.get(`${API_URL}/api/animal-encyclopedia`)
      .then((res) => {
        setCategories(res.data.categories);
        setDataSource(res.data.source);
        setSelected(res.data.categories[0]?.category || null);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const current = categories.find((c) => c.category === selected);

  return (
    <div className="p-4 max-w-md mx-auto">
      <PageHeader title="Animal Encyclopedia" icon={PawPrint} />

      {dataSource === 'reference_data' && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
          Showing reference data. Live data.gov.in livestock data will replace this once the API key is active.
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Loading...</p>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => setSelected(c.category)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  selected === c.category
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {current && (
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-lg border">
                <p className="text-xs text-gray-500 mb-1">Common breeds</p>
                <p className="text-sm text-gray-800">{current.breeds.join(', ')}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-2">
                  <Syringe className="h-3 w-3" /> Vaccination schedule
                </p>
                <div className="space-y-1">
                  {current.vaccination_schedule.map((v, i) => (
                    <div key={i} className="text-xs text-gray-600 flex justify-between border-b border-gray-50 pb-1">
                      <span className="font-medium">{v.age}</span>
                      <span className="flex-1 text-right">{v.vaccine}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                  <Wheat className="h-3 w-3" /> Feed
                </p>
                <p className="text-sm text-gray-700">{current.feed}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                  <Thermometer className="h-3 w-3" /> Environment
                </p>
                <p className="text-sm text-gray-700">{current.environment}</p>
              </div>

              <div className="bg-white p-3 rounded-lg border">
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1 mb-1">
                  <Clock className="h-3 w-3" /> Yield timeline
                </p>
                <p className="text-sm text-gray-700">{current.yield_timeline}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
