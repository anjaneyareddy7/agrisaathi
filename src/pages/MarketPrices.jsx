import React, { useState, useEffect } from 'react';
import { Wallet, Search, X, AlertCircle } from 'lucide-react';
import { useLang } from '../lib/i18n';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import PageHeader from '../components/PageHeader';

export default function MarketPrices() {
  const { t } = useLang();
  const [prices, setPrices] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCommodities();
    fetchPrices();
  }, []);

  const fetchCommodities = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/market/commodities');
      if (response.ok) {
        const data = await response.json();
        setCommodities(data.commodities || []);
      }
    } catch (error) {
      console.error('Error fetching commodities:', error);
    }
  };

  const fetchPrices = async (commodity = '') => {
    setLoading(true);
    setError(null);
    try {
      let url = 'http://localhost:8000/api/market/prices';
      if (commodity) {
        url += `?commodity=${encodeURIComponent(commodity)}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPrices(data.prices || []);
      } else {
        setError('Failed to fetch market prices');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCommoditySelect = (commodity) => {
    setSelectedCommodity(commodity);
    setSearchTerm('');
    fetchPrices(commodity);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCommodity('');
    fetchPrices();
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return Number(price).toLocaleString('en-IN');
  };

  return (
    <div>
      <PageHeader titleKey="marketPrices" icon={Wallet} />
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search commodity, market, or state..."
              className="pl-9"
              onKeyPress={(e) => e.key === 'Enter' && fetchPrices(searchTerm)}
            />
          </div>
          {(searchTerm || selectedCommodity) && (
            <Button onClick={clearSearch} variant="outline" className="px-3">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <button 
            onClick={clearSearch}
            className={`px-3 py-1.5 rounded-full text-xs ${
              !selectedCommodity && !searchTerm ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All
          </button>
          {commodities.slice(0, 12).map((c) => (
            <button
              key={c}
              onClick={() => handleCommoditySelect(c)}
              className={`px-3 py-1.5 rounded-full text-xs ${
                selectedCommodity === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center py-8 text-red-500">{error}</div>}

      {!loading && !error && prices.length === 0 && (
        <Card><CardContent className="pt-6 text-center text-gray-400">No market prices found</CardContent></Card>
      )}

      {!loading && !error && prices.length > 0 && (
        <div className="space-y-2">
          {prices.map((p, index) => (
            <Card key={index}>
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{p.commodity}</span>
                      <Badge className="bg-gray-100 text-gray-600 text-xs">{p.unit || 'quintal'}</Badge>
                      {p.state && <Badge variant="outline" className="text-xs">{p.state}</Badge>}
                    </div>
                    <p className="text-sm text-gray-600">{p.market}</p>
                    <p className="text-xs text-gray-400">{p.price_date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-700">₹{formatPrice(p.modal_price)}</div>
                    <div className="text-xs text-gray-400">
                      Min: ₹{formatPrice(p.min_price)} · Max: ₹{formatPrice(p.max_price)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
