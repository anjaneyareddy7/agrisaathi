import { useState } from "react";

export default function CropPlanner() {
  const [location, setLocation] = useState("");
  const [soil, setSoil] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePlan = async () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        crops: ["Soybean", "Wheat", "Cotton"],
        confidence: 92.5,
        irrigation: "Drip irrigation recommended. Water every 3 days."
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">🌱 AI Crop Planner</h1>
        <p className="text-gray-500 mb-6 text-sm">Get AI recommendations based on soil and location</p>
        <label className="block text-sm font-medium mb-1">Your Location</label>
        <input className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g., Hirdi, Maharashtra" onChange={(e) => setLocation(e.target.value)}/>
        <label className="block text-sm font-medium mb-1">Soil Type</label>
        <select className="w-full border p-3 rounded-lg mb-6 focus:ring-2 focus:ring-green-500 outline-none bg-white" onChange={(e) => setSoil(e.target.value)}>
          <option value="">Select Soil</option>
          <option value="Alluvial">Alluvial</option>
          <option value="Black">Black (Regur)</option>
          <option value="Red">Red</option>
          <option value="Laterite">Laterite</option>
          <option value="Arid">Arid / Desert</option>
        </select>
        <button onClick={handlePlan} disabled={loading} className="w-full bg-green-700 text-white py-3 rounded-lg font-bold shadow-md hover:bg-green-800 transition">
          {loading ? "🤖 Analyzing..." : "Get Recommendations"}
        </button>
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-pulse">
            <h2 className="font-bold text-green-800 mb-2">✅ Recommended Crops</h2>
            <p className="text-xl font-bold text-green-700">{result.crops.join(" • ")}</p>
            <div className="mt-3 text-sm text-gray-700">
              <p><span className="font-semibold">Confidence:</span> {result.confidence}%</p>
              <p className="mt-1"><span className="font-semibold">Irrigation:</span> {result.irrigation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
