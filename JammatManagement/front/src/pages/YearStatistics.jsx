import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function YearStatistics() {
  const { year } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [masjidStats, setMasjidStats] = useState([]);
  const [ramzanStats, setRamzanStats] = useState([]);
  const [showRamzan, setShowRamzan] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [r1, r2, r3] = await Promise.all([
          API.get(`/jammat/statistics/${year}`),
          API.get(`/jammat/masjid-stats/${year}`),
          API.get(`/jammat/ramzan-masjid-stats/${year}`)
        ]);
        setStats(r1.data);
        setMasjidStats(Array.isArray(r2.data) ? r2.data : []);
        setRamzanStats(Array.isArray(r3.data) ? r3.data : []);
      } catch (err) { console.error(err); }
    };
    load();
  }, [year]);

  const exportPDF = () => {
    if (!stats) return;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    doc.setFontSize(20); doc.setTextColor(6, 95, 70); doc.setFont(undefined, "bold");
    doc.text(`${year} — Yearly Jammat Statistics`, pageW / 2, 20, { align: "center" });
    doc.setFontSize(11); doc.setTextColor(100); doc.setFont(undefined, "normal");
    doc.text("Masjid-e-Ayesha & Elaahi Masjid, Valod", pageW / 2, 28, { align: "center" });

    let y = 40;
    const section = (title) => {
      doc.setFontSize(14); doc.setFont(undefined, "bold"); doc.setTextColor(6, 95, 70);
      doc.text(title, 18, y); y += 8;
      doc.setFont(undefined, "normal"); doc.setTextColor(30); doc.setFontSize(12);
    };
    const row = (label, val) => { doc.text(`${label}: ${val}`, 22, y); y += 7; };

    section("Overall Summary");
    row("Total Members", stats.totalMembers || 0);
    row("3 Days Jammats", stats.summary?.["3days"] || 0);
    row("10 Days Jammats", stats.summary?.["10days"] || 0);
    row("40 Days Jammats", stats.summary?.["40days"] || 0);
    row("4 Months Jammats", stats.summary?.["4months"] || 0);
    y += 4;

    section("Men Jammats");
    row("3 Days", stats.mens?.typeStats?.["3days"] || 0);
    row("10 Days", stats.mens?.typeStats?.["10days"] || 0);
    row("40 Days", stats.mens?.typeStats?.["40days"] || 0);
    row("4 Months", stats.mens?.typeStats?.["4months"] || 0);
    row("Ramzan", stats.mens?.ramzan || 0);
    y += 4;

    section("Masturat Jammats");
    row("3 Days", stats.masturat?.typeStats?.["3days"] || 0);
    row("10 Days", stats.masturat?.typeStats?.["10days"] || 0);
    row("40 Days", stats.masturat?.typeStats?.["40days"] || 0);
    row("Ramzan", stats.masturat?.ramzan || 0);

    doc.save(`${year}_statistics.pdf`);
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const data = showRamzan ? ramzanStats : masjidStats;
  const totalJammats = (stats.summary?.["3days"] || 0) + (stats.summary?.["10days"] || 0) + (stats.summary?.["40days"] || 0) + (stats.summary?.["4months"] || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-4 pt-5 pb-10">
        <button onClick={() => navigate(-1)} className="text-emerald-200 text-sm mb-2">← Back</button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">{year} Statistics</h1>
            <p className="text-emerald-200 text-sm mt-0.5">Full year overview</p>
          </div>
          <button onClick={exportPDF} className="bg-yellow-400 hover:bg-yellow-300 text-emerald-900 text-sm font-semibold py-2 px-4 rounded-lg transition">
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5 space-y-4 pb-10">

        {/* Big Number Cards */}
        <div className="grid grid-cols-2 gap-3">
          <BigCard title="Total Members" value={stats.totalMembers || 0} icon="👥" color="bg-emerald-600" />
          <BigCard title="Total Jammats" value={totalJammats} icon="🕌" color="bg-blue-600" />
        </div>

        {/* Breakdown by Type */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wider">Jammat Type Breakdown</h2>
          <div className="space-y-3">
            <TypeBar label="3 Days" value={stats.summary?.["3days"] || 0} total={totalJammats} color="bg-blue-500" />
            <TypeBar label="10 Days" value={stats.summary?.["10days"] || 0} total={totalJammats} color="bg-purple-500" />
            <TypeBar label="40 Days" value={stats.summary?.["40days"] || 0} total={totalJammats} color="bg-orange-500" />
            <TypeBar label="4 Months" value={stats.summary?.["4months"] || 0} total={totalJammats} color="bg-red-500" />
          </div>
        </div>

        {/* Men vs Masturat */}
        <div className="grid grid-cols-2 gap-3">
          <CategoryBox title="Men" emoji="♂" data={stats.mens} color="bg-blue-50 border-blue-200" headColor="text-blue-700" />
          <CategoryBox title="Masturat" emoji="♀" data={stats.masturat} color="bg-pink-50 border-pink-200" headColor="text-pink-600" />
        </div>

        {/* Ramzan Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
              {showRamzan ? "🌙 Ramzan Stats" : "🕌 Masjid Wise Stats"}
            </h2>
            <button onClick={() => setShowRamzan(!showRamzan)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${showRamzan ? "bg-yellow-400 text-yellow-900" : "bg-gray-100 text-gray-600 hover:bg-yellow-100"}`}>
              {showRamzan ? "Show All" : "Ramzan Only 🌙"}
            </button>
          </div>
          {data.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No data available</p>
          ) : (
            <div className="space-y-2">
              {data.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="text-sm font-medium text-gray-700">{m.masjid?.trim() || "Unknown"}</div>
                  <div className="text-right">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold mr-1">{m.totalJammats ?? 0} jammats</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{m.totalPeople ?? 0} people</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function BigCard({ title, value, icon, color }) {
  return (
    <div className={`${color} text-white rounded-xl shadow-md p-4 flex items-center gap-3`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="text-xs opacity-80 font-medium">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function TypeBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{value} <span className="text-gray-400 font-normal text-xs">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: pct + "%" }}></div>
      </div>
    </div>
  );
}

function CategoryBox({ title, emoji, data, color, headColor }) {
  if (!data) return null;
  return (
    <div className={`${color} border rounded-xl p-4`}>
      <h3 className={`font-bold text-sm ${headColor} mb-2`}>{emoji} {title}</h3>
      <div className="space-y-1 text-xs text-gray-600">
        <div className="flex justify-between"><span>3 Days</span><span className="font-semibold">{data.typeStats?.["3days"] || 0}</span></div>
        <div className="flex justify-between"><span>10 Days</span><span className="font-semibold">{data.typeStats?.["10days"] || 0}</span></div>
        <div className="flex justify-between"><span>40 Days</span><span className="font-semibold">{data.typeStats?.["40days"] || 0}</span></div>
        <div className="flex justify-between"><span>4 Months</span><span className="font-semibold">{data.typeStats?.["4months"] || 0}</span></div>
        <div className="flex justify-between pt-1 border-t border-current border-opacity-20">
          <span>🌙 Ramzan</span><span className="font-bold">{data.ramzan || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default YearStatistics;
