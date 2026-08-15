import React, { useState, useEffect } from 'react';
import { Wheat, Plus, Calendar, TrendingUp, Trash2 } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';

export default function HarvestRecords() {
  const { t } = useLang();
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plot_name: '',
    crop_name: '',
    harvest_date: '',
    quantity: '',
    quantity_unit: 'quintal',
    area_harvested: '',
    quality_grade: '',
    sale_price_per_unit: '',
    season: '',
    notes: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/harvest/');
      if (response.ok) {
        const data = await response.json();
        setRecords(data || []);
      }
    } catch (error) {
      console.error('Error fetching harvest records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plot_name || !form.crop_name || !form.harvest_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/harvest/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          quantity: parseFloat(form.quantity) || 0,
          area_harvested: parseFloat(form.area_harvested) || 0,
          sale_price_per_unit: parseFloat(form.sale_price_per_unit) || 0
        })
      });

      if (response.ok) {
        setForm({
          plot_name: '',
          crop_name: '',
          harvest_date: '',
          quantity: '',
          quantity_unit: 'quintal',
          area_harvested: '',
          quality_grade: '',
          sale_price_per_unit: '',
          season: '',
          notes: ''
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating harvest record:', error);
      alert('Failed to create harvest record');
    }
  };

  const deleteRecord = async (id) => {
    if (!confirm('Delete this harvest record?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/harvest/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  const totalQuantity = records.reduce((sum, r) => sum + (r.quantity || 0), 0);
  const totalValue = records.reduce((sum, r) => sum + ((r.quantity || 0) * (r.sale_price_per_unit || 0)), 0);

  return (
    <div>
      <PageHeader titleKey="harvestRecords" icon={Wheat} />

      {records.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-3 text-center">
              <div className="text-xl font-bold text-green-700">{totalQuantity.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Total Quantity (q)</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-3 text-center">
              <div className="text-xl font-bold text-blue-700">₹{totalValue.toLocaleString('en-IN')}</div>
              <div className="text-xs text-gray-500">Total Value</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Button onClick={() => setShowForm(!showForm)} className="w-full mb-4 bg-green-600 hover:bg-green-700">
        <Plus className="h-4 w-4 mr-1" /> Log Harvest
      </Button>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Plot Name *</Label>
                  <Input value={form.plot_name} onChange={(e) => setForm({...form, plot_name: e.target.value})} required />
                </div>
                <div>
                  <Label className="text-sm">Crop Name *</Label>
                  <Input value={form.crop_name} onChange={(e) => setForm({...form, crop_name: e.target.value})} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Harvest Date *</Label>
                  <Input type="date" value={form.harvest_date} onChange={(e) => setForm({...form, harvest_date: e.target.value})} required />
                </div>
                <div>
                  <Label className="text-sm">Season</Label>
                  <select value={form.season} onChange={(e) => setForm({...form, season: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="">Select Season</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Quantity (quintals)</Label>
                  <Input type="number" value={form.quantity} onChange={(e) => setForm({...form, quantity: e.target.value})} />
                </div>
                <div>
                  <Label className="text-sm">Area Harvested (acres)</Label>
                  <Input type="number" value={form.area_harvested} onChange={(e) => setForm({...form, area_harvested: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Quality Grade</Label>
                  <select value={form.quality_grade} onChange={(e) => setForm({...form, quality_grade: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="">Select Grade</option>
                    <option value="A">A - Premium</option>
                    <option value="B">B - Standard</option>
                    <option value="C">C - Fair</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm">Price per Unit (₹)</Label>
                  <Input type="number" value={form.sale_price_per_unit} onChange={(e) => setForm({...form, sale_price_per_unit: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">Save</Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && <div className="text-center py-4">Loading...</div>}

      {records.length > 0 && (
        <div className="space-y-2">
          {records.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{r.crop_name}</span>
                      {r.quality_grade && <Badge className="bg-green-100 text-green-700">Grade {r.quality_grade}</Badge>}
                    </div>
                    <div className="text-sm text-gray-500">{r.plot_name} · {r.harvest_date} · {r.quantity || 0} {r.quantity_unit}</div>
                    {r.sale_price_per_unit > 0 && (
                      <div className="text-sm text-green-600">₹{((r.quantity || 0) * (r.sale_price_per_unit || 0)).toLocaleString('en-IN')}</div>
                    )}
                  </div>
                  <button onClick={() => deleteRecord(r.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {records.length === 0 && !loading && (
        <Card><CardContent className="pt-6 text-center text-gray-400">
          <Wheat className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No harvest records yet</p>
        </CardContent></Card>
      )}
    </div>
  );
}
