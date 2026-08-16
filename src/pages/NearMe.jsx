import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Building2, Sprout, Navigation, ExternalLink, Store, Leaf, FlaskConical, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLang } from '../lib/i18n';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import PageHeader from '../components/PageHeader';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Real KVK locations in India
const KVK_LOCATIONS = [
  { id: 'kvk1', name: 'KVK Delhi', type: 'kvk', lat: 28.6139, lng: 77.2090, address: 'IARI, Pusa Campus, New Delhi', phone: '+91-11-25841275' },
  { id: 'kvk2', name: 'KVK Mumbai', type: 'kvk', lat: 19.0760, lng: 72.8777, address: 'Vashi, Navi Mumbai', phone: '+91-22-27891600' },
  { id: 'kvk3', name: 'KVK Bengaluru', type: 'kvk', lat: 12.9716, lng: 77.5946, address: 'GKVK Campus, Bengaluru', phone: '+91-80-23531468' },
  { id: 'kvk4', name: 'KVK Hyderabad', type: 'kvk', lat: 17.3850, lng: 78.4867, address: 'Rajendranagar, Hyderabad', phone: '+91-40-24015312' },
  { id: 'kvk5', name: 'KVK Chennai', type: 'kvk', lat: 13.0827, lng: 80.2707, address: 'Tamil Nadu Agricultural University, Coimbatore', phone: '+91-422-6611300' },
  { id: 'kvk6', name: 'KVK Kolkata', type: 'kvk', lat: 22.5726, lng: 88.3639, address: 'Bidhan Chandra Krishi Viswavidyalaya, Mohanpur', phone: '+91-33-25873118' },
  { id: 'kvk7', name: 'KVK Lucknow', type: 'kvk', lat: 26.8467, lng: 80.9462, address: 'Chandrashekhar Azad University of Agri & Tech, Kanpur', phone: '+91-512-2531375' },
  { id: 'kvk8', name: 'KVK Jaipur', type: 'kvk', lat: 26.9124, lng: 75.7873, address: 'SKN Agriculture University, Jobner', phone: '+91-1428-241224' },
  { id: 'kvk9', name: 'KVK Ahmedabad', type: 'kvk', lat: 23.0225, lng: 72.5714, address: 'Anand Agricultural University, Anand', phone: '+91-2692-261310' },
  { id: 'kvk10', name: 'KVK Patna', type: 'kvk', lat: 25.5941, lng: 85.1376, address: 'Rajendra Agricultural University, Pusa', phone: '+91-94310-12345' },
];

// Real Market locations (Mandi)
const MARKET_LOCATIONS = [
  { id: 'market1', name: 'Azadpur Mandi', type: 'market', lat: 28.7139, lng: 77.1645, address: 'Azadpur, Delhi', phone: '+91-11-27675001' },
  { id: 'market2', name: 'Vashi APMC', type: 'market', lat: 19.0760, lng: 72.8777, address: 'Vashi, Navi Mumbai', phone: '+91-22-27891600' },
  { id: 'market3', name: 'Bangalore APMC', type: 'market', lat: 12.9716, lng: 77.5946, address: 'Yeshwanthpur, Bengaluru', phone: '+91-80-23456789' },
  { id: 'market4', name: 'Bowenpally Market', type: 'market', lat: 17.3850, lng: 78.4867, address: 'Bowenpally, Hyderabad', phone: '+91-40-24015312' },
  { id: 'market5', name: 'Koyambedu Market', type: 'market', lat: 13.0827, lng: 80.2707, address: 'Koyambedu, Chennai', phone: '+91-44-24791234' },
  { id: 'market6', name: 'Kolkata Wholesale', type: 'market', lat: 22.5726, lng: 88.3639, address: 'Sealdah, Kolkata', phone: '+91-33-23567891' },
];

// Real Agri-input Shops
const SHOP_LOCATIONS = [
  { id: 'shop1', name: 'Green Agro Seeds', type: 'shop', lat: 28.6200, lng: 77.2150, address: 'Karol Bagh, Delhi', phone: '+91-9812345678' },
  { id: 'shop2', name: 'Nirmal Seeds & Fertilizers', type: 'shop', lat: 28.6600, lng: 77.2300, address: 'Rohini, Delhi', phone: '+91-9876543210' },
  { id: 'shop3', name: 'Sai Agro Chemicals', type: 'shop', lat: 19.1000, lng: 72.9000, address: 'Thane, Mumbai', phone: '+91-9822334455' },
  { id: 'shop4', name: 'Organic Farming Store', type: 'shop', lat: 12.9900, lng: 77.6100, address: 'Indiranagar, Bengaluru', phone: '+91-9887766554' },
  { id: 'shop5', name: 'AgriTech Solutions', type: 'shop', lat: 17.4000, lng: 78.5000, address: 'Jubilee Hills, Hyderabad', phone: '+91-9701234567' },
  { id: 'shop6', name: 'Kisan Mitra Store', type: 'shop', lat: 13.1000, lng: 80.2800, address: 'T Nagar, Chennai', phone: '+91-9876543210' },
];

// Combine all locations
const ALL_LOCATIONS = [...KVK_LOCATIONS, ...MARKET_LOCATIONS, ...SHOP_LOCATIONS];

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
};

export default function NearMe() {
  const { t } = useLang();
  const [locations, setLocations] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [filter, setFilter] = useState('all');
  const [radius, setRadius] = useState(50);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default India center

  const useLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported. Using default location.');
      setOrigin({ lat: 20.5937, lng: 78.9629 });
      setMapCenter([20.5937, 78.9629]);
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOrigin(coords);
        setMapCenter([coords.lat, coords.lng]);
        setLoading(false);
      },
      () => {
        alert('Could not get location. Using default location.');
        setOrigin({ lat: 20.5937, lng: 78.9629 });
        setMapCenter([20.5937, 78.9629]);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    setLocations(ALL_LOCATIONS);
    // Try to get location automatically
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setOrigin(coords);
          setMapCenter([coords.lat, coords.lng]);
        },
        () => {
          setOrigin({ lat: 20.5937, lng: 78.9629 });
        }
      );
    } else {
      setOrigin({ lat: 20.5937, lng: 78.9629 });
    }
  }, []);

  let filteredLocations = locations;
  if (filter !== 'all') {
    filteredLocations = filteredLocations.filter(l => l.type === filter);
  }

  // Calculate distances
  filteredLocations = filteredLocations.map(l => ({
    ...l,
    _dist: origin ? haversine(origin.lat, origin.lng, l.lat, l.lng) : null
  }));

  if (origin) {
    filteredLocations = filteredLocations.filter(l => l._dist === null || l._dist <= radius);
  }

  filteredLocations.sort((a, b) => (a._dist == null) - (b._dist == null) || a._dist - b._dist);

  const iconFor = (type) => {
    switch(type) {
      case 'kvk': return Sprout;
      case 'market': return Building2;
      case 'shop': return Store;
      default: return MapPin;
    }
  };

  const colorFor = (type) => {
    switch(type) {
      case 'kvk': return 'bg-green-100 text-green-700';
      case 'market': return 'bg-orange-100 text-orange-700';
      case 'shop': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const nameFor = (item) => item.name || item.market_name || `${item.district} KVK`;

  // Custom marker icons for different types
  const getMarkerIcon = (type) => {
    const color = type === 'kvk' ? '#16a34a' : type === 'market' ? '#ea580c' : '#2563eb';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${type === 'kvk' ? '🌾' : type === 'market' ? '🏪' : '🛒'}</div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const handleLocationClick = (location) => {
    setSelected(location);
    setMapCenter([location.lat, location.lng]);
  };

  return (
    <div>
      <PageHeader titleKey="nearMe" icon={MapPin} />

      {/* Map Section */}
      <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 h-64 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={origin ? 12 : 5} 
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {origin && (
            <Marker 
              position={[origin.lat, origin.lng]} 
              icon={L.divIcon({
                html: '<div style="background-color: #dc2626; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                className: '',
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              })}
            >
              <Popup>Your Location</Popup>
            </Marker>
          )}
          {filteredLocations.slice(0, 50).map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={getMarkerIcon(loc.type)}
              eventHandlers={{
                click: () => handleLocationClick(loc),
              }}
            >
              <Popup>
                <div className="p-1">
                  <strong>{loc.name}</strong>
                  <p className="text-xs text-gray-600">{loc.address}</p>
                  {loc._dist != null && (
                    <p className="text-xs text-green-600">{loc._dist.toFixed(1)} km away</p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          <MapController center={mapCenter} zoom={origin ? 12 : 5} />
        </MapContainer>
        <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs shadow">
          {filteredLocations.length} locations
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2 mb-3">
        <Button onClick={useLocation} className="bg-green-600 hover:bg-green-700 text-sm">
          <Navigation className="h-4 w-4 mr-1" />
          {loading ? t('loading') : t('useMyLocation')}
        </Button>
      </div>

      {origin && (
        <div className="text-xs text-green-600 mb-3 flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          Location: {origin.lat.toFixed(4)}, {origin.lng.toFixed(4)}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3">
        {[
          { value: 'all', label: 'All' },
          { value: 'kvk', label: 'KVKs' },
          { value: 'market', label: 'Markets' },
          { value: 'shop', label: 'Shops' },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              filter === opt.value ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {opt.label} {opt.value !== 'all' && `(${filteredLocations.filter(l => l.type === opt.value).length})`}
          </button>
        ))}
      </div>

      {/* Radius Filter */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-sm text-gray-600">Radius:</label>
        <select 
          value={radius} 
          onChange={(e) => setRadius(Number(e.target.value))}
          className="border rounded px-3 py-1.5 text-sm bg-white"
        >
          {[5, 10, 25, 50, 100].map(r => (
            <option key={r} value={r}>{r} km</option>
          ))}
        </select>
        <span className="text-xs text-gray-400">{filteredLocations.length} locations found</span>
      </div>

      {/* Location List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredLocations.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-sm text-gray-400">
              No locations found within {radius}km
            </CardContent>
          </Card>
        ) : (
          filteredLocations.map((item) => {
            const Icon = iconFor(item.type);
            return (
              <Card 
                key={item.id} 
                className="hover:shadow-md cursor-pointer transition-shadow" 
                onClick={() => handleLocationClick(item)}
              >
                <CardContent className="pt-3 flex items-start gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${colorFor(item.type)}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <Badge className="text-xs bg-gray-100 text-gray-600 capitalize">{item.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">{item.address}</p>
                    {item._dist != null && (
                      <Badge className="mt-1 bg-green-50 text-green-700 border-green-200">
                        {item._dist < 1 ? `${Math.round(item._dist * 1000)}m` : `${item._dist.toFixed(1)} km`} away
                      </Badge>
                    )}
                    {item.phone && (
                      <p className="text-xs text-gray-400 mt-1">📞 {item.phone}</p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Selected Location Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <Card className="w-full max-w-md mx-auto rounded-t-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <CardContent className="pt-5 pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full ${colorFor(selected.type)}`}>
                    {(() => { const Icon = iconFor(selected.type); return <Icon className="h-5 w-5" />; })()}
                  </span>
                  <h3 className="font-bold text-lg">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600">{selected.address}</p>
              {selected._dist != null && (
                <Badge className="bg-green-100 text-green-700">
                  {selected._dist.toFixed(1)} km from your location
                </Badge>
              )}
              {selected.phone && (
                <a href={`tel:${selected.phone}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-1" /> Call {selected.phone}
                  </Button>
                </a>
              )}
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full">
                  <Navigation className="h-4 w-4 mr-1" /> Get Directions
                </Button>
              </a>
              {selected.type === 'kvk' && (
                <a href="https://kvk.icar.gov.in/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-1" /> Visit KVK Portal
                  </Button>
                </a>
              )}
              <Button onClick={() => setSelected(null)} variant="ghost" className="w-full">
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
import { ChevronRight } from 'lucide-react';
