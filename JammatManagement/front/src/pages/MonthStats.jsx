import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import API from "../api/axios";

function MonthStats() {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/jammat/statistics/${year}/${month}`);
      setStats(res.data);
    };
    load();
  }, [year, month]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(20); doc.setFont(undefined, "bold"); doc.setTextColor(6, 95, 70);
    doc.text(`${month} ${year} — Monthly Statistics`, pageW / 2, 20, { align: "center" });
    doc.setFontSize(11); doc.setFont(undefined, "normal"); doc.setTextColor(100);
    doc.text("Masjid-e-Ayesha & Elaahi Masjid, Valod", pageW / 2, 28, { align: "center" });

    let y = 40;
    const section = (title) => {
      doc.setFontSize(15); doc.setFont(undefined, "bold"); doc.setTextColor(6, 95, 70);
      doc.text(title, 18, y); y += 9;
      doc.setFont(undefined, "normal"); doc.setFontSize(13); doc.setTextColor(30);
    };
    const row = (label, val) => { doc.text(`   ${label}: ${val}`, 18, y); y += 8; };

    section("Men Jammat");
    row("3 Days", stats.mens?.typeStats?.["3days"] || 0);
    row("10 Days", stats.mens?.typeStats?.["10days"] || 0);
    row("40 Days", stats.mens?.typeStats?.["40days"] || 0);
    row("4 Months", stats.mens?.typeStats?.["4months"] || 0);
    row("Ramzan", stats.mens?.ramzan || 0);
    y += 4;

    section("Masturat Jammat");
    row("3 Days", stats.masturat?.typeStats?.["3days"] || 0);
    row("10 Days", stats.masturat?.typeStats?.["10days"] || 0);
    row("40 Days", stats.masturat?.typeStats?.["40days"] || 0);
    row("4 Months", stats.masturat?.typeStats?.["4months"] || 0);
    row("Ramzan", stats.masturat?.ramzan || 0);
    y += 4;

    section("Total Summary");
    row("3 Days", stats.summary?.["3days"] || 0);
    row("10 Days", stats.summary?.["10days"] || 0);
    row("40 Days", stats.summary?.["40days"] || 0);
    row("4 Months", stats.summary?.["4months"] || 0);

    doc.save(`${month}_${year}_statistics.pdf`);
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const total = (stats.summary?.["3days"] || 0) + (stats.summary?.["10days"] || 0)
    + (stats.summary?.["40days"] || 0) + (stats.summary?.["4months"] || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-4 pt-5 pb-10">
        <button onClick={() => navigate(-1)} className="text-emerald-200 text-sm mb-2">← Back</button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">{month} {year}</h1>
            <p className="text-emerald-200 text-sm mt-0.5">Monthly statistics</p>
          </div>
          <button onClick={exportPDF} className="bg-yellow-400 hover:bg-yellow-300 text-emerald-900 text-sm font-semibold py-2 px-4 rounded-lg transition">
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5 space-y-4 pb-10">

        {/* Summary Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-600 text-white rounded-xl shadow-md p-4">
            <div className="text-xs opacity-80">Total Jammats</div>
            <div className="text-3xl font-bold">{total}</div>
          </div>
          <div className="bg-blue-600 text-white rounded-xl shadow-md p-4">
            <div className="text-xs opacity-80">🌙 Ramzan</div>
            <div className="text-3xl font-bold">{(stats.mens?.ramzan || 0) + (stats.masturat?.ramzan || 0)}</div>
          </div>
        </div>

        {/* Men */}
        <StatCard title="♂ Men Jammat" data={stats.mens} borderColor="border-blue-200" bgColor="bg-blue-50" headColor="text-blue-700" />

        {/* Masturat */}
        <StatCard title="♀ Masturat Jammat" data={stats.masturat} borderColor="border-pink-200" bgColor="bg-pink-50" headColor="text-pink-600" />

        {/* Summary */}
        <div className="bg-emerald-600 text-white rounded-xl shadow-md p-4">
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider">Combined Summary</h2>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            {[["3 Days", "3days"], ["10 Days", "10days"], ["40 Days", "40days"], ["4 Months", "4months"]].map(([l, k]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="opacity-75">{l}:</span>
                <span className="font-bold text-lg">{stats.summary?.[k] || 0}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, data, borderColor, bgColor, headColor }) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl p-4 shadow-sm`}>
      <h2 className={`font-bold text-sm uppercase tracking-wider ${headColor} mb-3`}>{title}</h2>
      <div className="space-y-2">
        {[["3 Days", "3days"], ["10 Days", "10days"], ["40 Days", "40days"], ["4 Months", "4months"]].map(([label, key]) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{label}</span>
            <span className="font-bold text-gray-800 bg-white px-2 py-0.5 rounded-full shadow-sm">{data?.typeStats?.[key] || 0}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-sm pt-1 border-t border-current border-opacity-20">
          <span className="text-gray-600">🌙 Ramzan</span>
          <span className={`font-bold ${headColor} bg-white px-2 py-0.5 rounded-full shadow-sm`}>{data?.ramzan || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default MonthStats;
