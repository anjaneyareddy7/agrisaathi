import { useState } from "react";
const states = ["Andhra Pradesh", "Telangana", "Maharashtra", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Punjab", "Rajasthan", "Gujarat", "Madhya Pradesh", "West Bengal", "Bihar"];
const districts = {
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Ramagundam", "Khammam", "Mahbubnagar", "Nalgonda", "Adilabad"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Amravati"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Belagavi", "Davanagere", "Kalaburagi", "Tumakuru"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Anantapur", "Kakinada"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Vellore"]
};
const allSoils = ["Alluvial", "Black (Regur)", "Red", "Laterite", "Arid", "Desert", "Peaty", "Saline", "Forest", "Mountain"];
export default function CropPlanner() {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [soil, setSoil] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const handlePlan = async () => {
    if (!state || !district || !soil) return alert("Please select State, District, and Soil Type.");
    setLoading(true);
    setTimeout(() => {
      setResult({ recommended_crops: ["Soybean", "Wheat", "Cotton"], confidence_score: 92.5, irrigation_schedule: "Drip irrigation recommended. Water every 3 days." });
      setLoading(false);
    }, 1500);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border">
        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">🌱 AI Crop Planner</h1>
        <p className="text-gray-500 mb-6 text-sm border-l-4 border-green-500 pl-3">Get AI recommendations based on soil and location</p>
        <label className="block text-sm font-medium mb-1 text-gray-700">Select State</label>
        <select className="w-full border p-3 rounded-lg mb-4 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => { setState(e.target.value); setDistrict(""); }}>
          <option value="">Select State</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <label className="block text-sm font-medium mb-1 text-gray-700">Select District</label>
        <select className="w-full border p-3 rounded-lg mb-4 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
          <option value="">Select District</option>
          {state && districts[state]?.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <label className="block text-sm font-medium mb-1 text-gray-700">Soil Type</label>
        <select className="w-full border p-3 rounded-lg mb-6 bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" onChange={(e) => setSoil(e.target.value)}>
          <option value="">Select Soil</option>
          {allSoils.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={handlePlan} disabled={loading} className="w-full bg-[#0b7a3f] text-white py-3 rounded-lg font-bold shadow-md hover:bg-green-800 transition">
          {loading ? "🤖 Analyzing..." : "Get AI Recommendations"}
        </button>
        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-bold text-green-800 mb-2">✅ Recommended Crops</h2>
            <p className="text-xl font-bold text-green-700">{result.recommended_crops?.join(" • ")}</p>
            <div className="mt-3 text-sm text-gray-700">
              <p><span className="font-semibold">Confidence:</span> {result.confidence_score}%</p>
              <p className="mt-1"><span className="font-semibold">Irrigation:</span> {result.irrigation_schedule}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
