import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import PageHeader from '../components/PageHeader';

export default function IrrigationPlanner() {
  const { t } = useLang();
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plot_name: '',
    crop_name: '',
    session_date: '',
    duration_minutes: '',
    water_litres: '',
    method: 'drip',
    water_source: '',
    notes: ''
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/irrigation/');
      if (response.ok) {
        const data = await response.json();
        setSessions(data || []);
      }
    } catch (error) {
      console.error('Error fetching irrigation sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.plot_name || !form.session_date) {
      alert('Plot name and date are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/irrigation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          duration_minutes: parseInt(form.duration_minutes) || 0,
          water_litres: parseInt(form.water_litres) || 0,
          status: 'scheduled'
        })
      });

      if (response.ok) {
        setForm({
          plot_name: '',
          crop_name: '',
          session_date: '',
          duration_minutes: '',
          water_litres: '',
          method: 'drip',
          water_source: '',
          notes: ''
        });
        setShowForm(false);
        fetchSessions();
      }
    } catch (error) {
      console.error('Error creating irrigation session:', error);
      alert('Failed to create irrigation session');
    }
  };

  const markDone = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/irrigation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'done' })
      });
      if (response.ok) fetchSessions();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const deleteSession = async (id) => {
    if (!confirm('Delete this irrigation session?')) return;
    try {
      const response = await fetch(`http://localhost:8000/api/irrigation/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) fetchSessions();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const getMethodColor = (method) => {
    const colors = {
      drip: 'bg-blue-100 text-blue-700',
      sprinkler: 'bg-green-100 text-green-700',
      flood: 'bg-orange-100 text-orange-700',
      furrow: 'bg-purple-100 text-purple-700',
      rainfed: 'bg-gray-100 text-gray-700'
    };
    return colors[method] || 'bg-gray-100 text-gray-700';
  };

  const upcoming = sessions.filter(s => s.status === 'scheduled');
  const completed = sessions.filter(s => s.status === 'done');

  return (
    <div>
      <PageHeader titleKey="irrigationPlanner" icon={Droplets} />
      <Button onClick={() => setShowForm(!showForm)} className="w-full mb-4 bg-green-600 hover:bg-green-700">
        <Plus className="h-4 w-4 mr-1" /> Add Irrigation Session
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
                  <Label className="text-sm">Crop</Label>
                  <Input value={form.crop_name} onChange={(e) => setForm({...form, crop_name: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Date *</Label>
                  <Input type="date" value={form.session_date} onChange={(e) => setForm({...form, session_date: e.target.value})} required />
                </div>
                <div>
                  <Label className="text-sm">Method</Label>
                  <select value={form.method} onChange={(e) => setForm({...form, method: e.target.value})} className="w-full border rounded px-3 py-2 text-sm">
                    <option value="drip">Drip</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood</option>
                    <option value="furrow">Furrow</option>
                    <option value="rainfed">Rainfed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-sm">Duration (min)</Label>
                  <Input type="number" value={form.duration_minutes} onChange={(e) => setForm({...form, duration_minutes: e.target.value})} />
                </div>
                <div>
                  <Label className="text-sm">Water (litres)</Label>
                  <Input type="number" value={form.water_litres} onChange={(e) => setForm({...form, water_litres: e.target.value})} />
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

      {upcoming.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Upcoming ({upcoming.length})
          </h3>
          <div className="space-y-2">
            {upcoming.map((s) => (
              <Card key={s.id}>
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{s.plot_name}</span>
                        <Badge className={getMethodColor(s.method)}>{s.method}</Badge>
                      </div>
                      <div className="text-sm text-gray-500">{s.session_date} · {s.duration_minutes || 0} min · {s.water_litres || 0} L</div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => markDone(s.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button onClick={() => deleteSession(s.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {sessions.length === 0 && !loading && (
        <Card><CardContent className="pt-6 text-center text-gray-400">
          <Droplets className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No irrigation sessions yet</p>
        </CardContent></Card>
      )}
    </div>
  );
}
