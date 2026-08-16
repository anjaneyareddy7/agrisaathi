import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // REAL SPEECH RECOGNITION LOGIC
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Sorry, your browser doesn't support speech recognition. Please use Chrome or Edge.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    setShowSearch(true);
    setIsListening(true);
    setTranscript("Listening...");

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      
      if (event.results[current].isFinal) {
        setIsListening(false);
        // You can replace this logic to trigger specific pages based on voice commands
        console.log("User said:", transcriptText);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setTranscript("Error: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const moreFeatures = [
    { name: "Diagnose", icon: "🩺", color: "bg-orange-100", path: "/diagnose" },
    { name: "Fertilizer", icon: "💧", color: "bg-blue-100", path: "/fertilize" },
    { name: "Soil Passport", icon: "🌱", color: "bg-green-100", path: "/soil-passport" },
    { name: "Crop Planner", icon: "📈", color: "bg-purple-100", path: "/crop-planner" },
    { name: "Beyond Crops", icon: "🌿", color: "bg-red-100", path: "/beyond-crops" },
    { name: "Livestock Care", icon: "🐄", color: "bg-green-100", path: "/livestock" },
    { name: "Market Prices", icon: "📦", color: "bg-orange-100", path: "/market-prices" },
    { name: "Near Me", icon: "📍", color: "bg-blue-100", path: "/near-me" },
    { name: "Sensor Lab", icon: "🧪", color: "bg-blue-100", path: "/sensor-lab" },
    { name: "Farm Ledger", icon: "📒", color: "bg-green-100", path: "/farm-ledger" },
    { name: "Crop Passport", icon: "🛡️", color: "bg-green-100", path: "/crop-passport" },
    { name: "Government Schemes", icon: "🏛️", color: "bg-blue-100", path: "/schemes" },
  ];

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Top Section: Voice & Weather */}
      <div className="p-6 flex flex-col items-center pt-10 relative">
        <h2 className="text-xl font-bold text-green-700">Speak to AgriSaathi</h2>
        <p className="text-xs text-gray-500 mb-4">Tap and speak your problem</p>
        
        <div 
          onClick={handleMicClick}
          className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg mb-4 cursor-pointer transition-all duration-300 ${isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-green-500'}`}
        >
          <span className="text-4xl text-white">🎤</span>
        </div>
        <p className="text-xs text-gray-500">{isListening ? "Listening..." : "Tap and speak your problem"}</p>

        {/* Voice Search Popup */}
        {showSearch && (
          <div className="absolute top-full mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <p className="text-xs text-gray-500">{isListening ? "Listening..." : "Ready"}</p>
            </div>
            <input 
              type="text" 
              value={transcript} 
              readOnly 
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm mb-2 focus:outline-none"
              placeholder="Ask anything about farming"
            />
            <div className="flex gap-2 text-[10px]">
              <span className="bg-gray-100 px-2 py-1 rounded-full border border-gray-200">Crop</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full border border-gray-200">Livestock</span>
              <span className="bg-gray-100 px-2 py-1 rounded-full border border-gray-200">Weather</span>
            </div>
            {!isListening && transcript !== "Listening..." && transcript !== "" && (
              <button className="w-full mt-3 bg-green-600 text-white text-sm py-2 rounded-lg font-bold">
                Search for "{transcript}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Weather Card */}
      <div className="mx-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-bold text-blue-800">🌤️ Live weather</h3>
          <span className="text-blue-500 text-xs">🔄</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-bold">30°C</span>
            <p className="text-xs text-blue-700">Light drizzle</p>
          </div>
          <div className="text-right text-xs text-blue-600">
            <p>💧 61%</p>
            <p>💨 23 km/h</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 text-center text-xs text-blue-800">
          <div className="bg-white p-2 rounded"><p>Sat</p><span>🌤️</span><p>30°</p></div>
          <div className="bg-white p-2 rounded"><p>Sun</p><span>☀️</span><p>29°</p></div>
          <div className="bg-white p-2 rounded"><p>Mon</p><span>☁️</span><p>27°</p></div>
          <div className="bg-white p-2 rounded"><p>Tue</p><span>🌤️</span><p>27°</p></div>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="mx-4 mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
        <span className="text-blue-600 mt-1">📢</span>
        <div>
          <p className="text-sm font-bold text-blue-800">Heavy rain alert</p>
          <p className="text-xs text-blue-600">4.5mm rain — 2026-08-15</p>
        </div>
        <button className="ml-auto text-blue-400 text-xs">✕</button>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Recent activity</h3>
        <p className="text-xs text-gray-400">No recent activity yet.</p>
      </div>

      {/* More Grid (12 Icons) */}
      <div className="px-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">More</h3>
        <div className="grid grid-cols-4 gap-x-2 gap-y-6">
          {moreFeatures.map((item) => (
            <div 
              key={item.name} 
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition"
            >
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center text-xl`}>
                {item.icon}
              </div>
              <span className="text-[10px] text-gray-600 text-center font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav (Simulated, styled to match) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-2 text-[10px] text-gray-500">
        <div className="flex flex-col items-center text-green-700"><span className="text-lg">🏠</span>Home</div>
        <div className="flex flex-col items-center"><span className="text-lg">🩺</span>Diagnose</div>
        <div className="flex flex-col items-center"><span className="text-lg">📍</span>Near Me</div>
        <div className="flex flex-col items-center"><span className="text-lg">🌱</span>Crops</div>
        <div className="flex flex-col items-center"><span className="text-lg">📊</span>Dashboard</div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer" onClick={handleMicClick}>
        <span className="text-2xl text-white">🎤</span>
      </div>
    </div>
  );
}
