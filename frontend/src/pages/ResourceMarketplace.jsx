import React, { useState, useEffect } from 'react';
import { Store, Search, Filter, Star, Package, Leaf, Truck, ShoppingCart } from 'lucide-react';

const ResourceMarketplace = () => {
  const [resources, setResources] = useState([
    { id: 1, name: 'Organic Fertilizer', type: 'fertilizer', price: '₹450/bag', rating: 4.5, seller: 'GreenHarvest Co.' },
    { id: 2, name: 'Hybrid Seeds - Tomato', type: 'seeds', price: '₹120/kg', rating: 4.8, seller: 'SeedPro India' },
    { id: 3, name: 'Drip Irrigation Kit', type: 'equipment', price: '₹3,500', rating: 4.2, seller: 'AgriTech Solutions' },
    { id: 4, name: 'NPK Fertilizer', type: 'fertilizer', price: '₹380/bag', rating: 4.6, seller: 'Farmers Choice' },
    { id: 5, name: 'Pesticide - Organic', type: 'pesticide', price: '₹250/ltr', rating: 4.3, seller: 'EcoAgri' },
    { id: 6, name: 'Wheat Seeds - HD-2967', type: 'seeds', price: '₹95/kg', rating: 4.7, seller: 'SeedPro India' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = resources.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || r.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
        <Store className="text-green-600" /> Resource Marketplace
      </h1>
      <p className="text-sm text-gray-500 mb-4">Find quality agricultural inputs and equipment</p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All</option>
          <option value="seeds">Seeds</option>
          <option value="fertilizer">Fertilizer</option>
          <option value="pesticide">Pesticide</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.seller}</p>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {item.type}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">{item.price}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {item.rating}
              </span>
            </div>
            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              <ShoppingCart size={14} className="inline mr-1" /> Contact Seller
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceMarketplace;
