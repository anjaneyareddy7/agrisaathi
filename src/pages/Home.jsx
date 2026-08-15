import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="px-6 py-4 bg-white flex justify-between items-center sticky top-0 z-20 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-gray-800">AgriSaathi</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">👤</div>
      </div>

      {/* Green Banner */}
      <div className="mx-4 mt-4 bg-[#16803b] rounded-2xl p-5 text-white shadow-sm">
        <h2 className="text-lg font-semibold">Welcome back, Farmer!</h2>
        <p className="text-sm text-green-100 mt-1 opacity-90">Let's make your farming smarter with AI.</p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-2 gap-4 p-4">
        <div onClick={() => navigate("/crop-planner")} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🌱</span>
          <span className="font-medium text-gray-700 text-sm">Crop Planner</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🩺</span>
          <span className="font-medium text-gray-700 text-sm">Diagnose</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📍</span>
          <span className="font-medium text-gray-700 text-sm">Near Me</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📊</span>
          <span className="font-medium text-gray-700 text-sm">Market Prices</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📒</span>
          <span className="font-medium text-gray-700 text-sm">Farm Ledger</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">⛅</span>
          <span className="font-medium text-gray-700 text-sm">Weather</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🧪</span>
          <span className="font-medium text-gray-700 text-sm">Fertilizer</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🌍</span>
          <span className="font-medium text-gray-700 text-sm">Soil Passport</span>
        </div>
      </div>
    </div>
  );
}
