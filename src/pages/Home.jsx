import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <h1 className="text-xl font-bold text-gray-800">AgriSaathi</h1>
        </div>
        <button className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">👤</button>
      </div>
      <div className="mx-4 mt-4 bg-[#0b7a3f] rounded-2xl p-5 shadow-md text-white">
        <h2 className="text-lg font-semibold">Welcome back, Farmer!</h2>
        <p className="text-sm text-green-100 mt-1 opacity-90">Let's make your farming smarter with AI.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4">
        <div onClick={() => navigate("/crop-planner")} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🌱</span>
          <span className="font-medium text-gray-700">Crop Planner</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🩺</span>
          <span className="font-medium text-gray-700">Diagnose</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📍</span>
          <span className="font-medium text-gray-700">Near Me</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📊</span>
          <span className="font-medium text-gray-700">Market Prices</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">📒</span>
          <span className="font-medium text-gray-700">Farm Ledger</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">⛅</span>
          <span className="font-medium text-gray-700">Weather</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🧪</span>
          <span className="font-medium text-gray-700">Fertilizer</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition cursor-pointer min-h-[120px]">
          <span className="text-4xl">🌍</span>
          <span className="font-medium text-gray-700">Soil Passport</span>
        </div>
      </div>
    </div>
  );
}
