import { useState } from "react";
import { useNavigate } from "react-router-dom";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December","Ramzan"
];

const monthEmojis = ["❄️","🌧️","🌸","🌷","🌻","☀️","⛅","🌿","🍂","🍁","🌫️","🎄","🌙"];

function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-600 text-white px-4 pt-8 pb-10 text-center">
        <div className="flex justify-center mb-3">
          <img src="/jammat-logo.svg" alt="Logo" className="w-16 h-16 rounded-full bg-emerald-700 p-1 shadow-lg" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Valod Jammat Management</h1>

        {/* Year Selector */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <button onClick={() => setYear(y => Number(y) - 1)}
            className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-600 font-bold text-lg flex items-center justify-center transition">‹</button>
          <span className="text-2xl font-bold tracking-widest">{year}</span>
          <button onClick={() => setYear(y => Number(y) + 1)}
            className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-600 font-bold text-lg flex items-center justify-center transition">›</button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-md mx-auto px-4 -mt-4 mb-5 grid grid-cols-2 gap-3">
        <button onClick={() => navigate("/search")}
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 hover:shadow-lg transition active:scale-95">
          <span className="text-2xl">🔍</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800 text-sm">Search</div>
            <div className="text-xs text-gray-500">Find a member</div>
          </div>
        </button>
        <button onClick={() => navigate("/statistics/" + year)}
          className="bg-white rounded-xl shadow-md p-4 flex items-center gap-3 hover:shadow-lg transition active:scale-95">
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <div className="font-semibold text-gray-800 text-sm">Statistics</div>
            <div className="text-xs text-gray-500">Yearly overview</div>
          </div>
        </button>
      </div>

      {/* Month Grid */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">Select Month</h2>
        <div className="grid grid-cols-2 gap-3">
          {months.map((month, i) => (
            <button
              key={month}
              onClick={() => navigate("/month/" + year + "/" + month)}
              className={`rounded-xl p-4 text-left shadow-sm hover:shadow-md transition active:scale-95 flex items-center gap-3 
                ${month === "Ramzan" 
                  ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-white" 
                  : "bg-white text-gray-800 hover:bg-emerald-50"}`}
            >
              <span className="text-2xl">{monthEmojis[i]}</span>
              <span className="font-semibold text-sm">{month}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
