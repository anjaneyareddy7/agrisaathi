import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    { name: "Crop Planner", icon: "🌱", path: "/crop-planner" },
    { name: "Diagnose", icon: "🩺", path: "/diagnose" },
    { name: "Near Me", icon: "📍", path: "/near-me" },
    { name: "Market Prices", icon: "📊", path: "/market-prices" },
    { name: "Farm Ledger", icon: "📒", path: "/farm-ledger" },
    { name: "Weather", icon: "🌤️", path: "/weather" },
    { name: "Fertilizer", icon: "🧪", path: "/fertilize" },
    { name: "Soil Passport", icon: "🌍", path: "/soil-passport" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🌾 AgriSaathi</h1>
        <div className="bg-green-100 p-2 rounded-full text-green-700">👤</div>
      </div>
      
      <div className="bg-green-700 text-white p-6 rounded-xl mb-6 shadow-md">
        <h2 className="text-xl font-bold">Welcome back, Farmer!</h2>
        <p className="text-sm opacity-90 mt-1">Let's make your farming smarter with AI.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {features.map((f, i) => (
          <div key={i} onClick={() => navigate(f.path)} className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer flex flex-col items-center justify-center py-6">
            <span className="text-4xl mb-2">{f.icon}</span>
            <span className="font-medium text-center">{f.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
