import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import jsPDF from "jspdf";

const TYPE_LABELS = { "3days": "3 Days", "10days": "10 Days", "40days": "40 Days", "4months": "4 Months", "2months": "2 Months" };
const TYPE_COLORS = { "3days": "bg-blue-100 text-blue-700", "10days": "bg-purple-100 text-purple-700", "40days": "bg-orange-100 text-orange-700", "4months": "bg-red-100 text-red-700", "2months": "bg-pink-100 text-pink-700" };

function MonthPage() {
  const { year, month } = useParams();
  const navigate = useNavigate();
  const [jammats, setJammats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [masjidFilter, setMasjidFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Derive unique masjids from data
  const masjids = useMemo(() => {
    const set = new Set(jammats.map(j => j.masjidName));
    return ["all", ...set];
  }, [jammats]);

  const filtered = useMemo(() => jammats.filter(j => {
    if (masjidFilter !== "all" && j.masjidName !== masjidFilter) return false;
    if (typeFilter !== "all" && j.type !== typeFilter) return false;
    return true;
  }), [jammats, masjidFilter, typeFilter]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(20);
    doc.setTextColor(6, 95, 70);
    doc.setFont(undefined, "bold");
    doc.text(`${month} ${year} — Jammat Report`, pageW / 2, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.setFont(undefined, "normal");
    doc.text(`Masjid-e-Ayesha & Elaahi Masjid, Valod`, pageW / 2, 28, { align: "center" });

    let y = 38;

    filtered.forEach((j) => {
      if (y > 250) { doc.addPage(); y = 20; }

      const start = new Date(j.startDate).getDate();
      const end = new Date(j.endDate).getDate();
      const isMasturat = j.category === "masturat";

      // Card bg
      doc.setFillColor(isMasturat ? 252 : 240, isMasturat ? 231 : 249, isMasturat ? 243 : 255);
      doc.roundedRect(14, y, pageW - 28, 8, 2, 2, "F");

      // Title bar
      doc.setFontSize(13);
      doc.setFont(undefined, "bold");
      doc.setTextColor(isMasturat ? 157 : 6, isMasturat ? 23 : 95, isMasturat ? 77 : 70);
      const label = isMasturat ? `Masturat Jammat ${j.jammatNo}` : `Jammat ${j.jammatNo}`;
      doc.text(label, 18, y + 6);

      // Type badge
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.setFont(undefined, "normal");
      doc.text(TYPE_LABELS[j.type] || j.type, pageW - 20, y + 6, { align: "right" });

      y += 12;

      doc.setFontSize(12);
      doc.setTextColor(30);
      doc.setFont(undefined, "normal");
      doc.text(`Date: ${start}–${end} ${month} ${year}`, 18, y);
      y += 7;
      doc.text(`Ameer: ${j.ameer || "—"}   |   Saathi: ${j.saathi || "—"}   |   Masjid: ${j.masjidName}`, 18, y);
      y += 7;

      if (j.route && j.route.length) {
        doc.setFont(undefined, "bold");
        doc.text("Route: ", 18, y);
        doc.setFont(undefined, "normal");
        const routeText = j.route.join(" → ");
        const splitRoute = doc.splitTextToSize(routeText, pageW - 50);
        doc.text(splitRoute, 35, y);
        y += splitRoute.length * 6 + 2;
      }

      if (j.isRamzan) {
        doc.setTextColor(180, 120, 0);
        doc.setFont(undefined, "bold");
        doc.text("🌙 Ramzan Jammat", 18, y);
        doc.setFont(undefined, "normal");
        doc.setTextColor(30);
        y += 7;
      }

      // Members
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.text("Members:", 18, y);
      doc.setFont(undefined, "normal");
      y += 6;

      j.members.forEach(group => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setFont(undefined, "bold");
        doc.setTextColor(6, 95, 70);
        doc.text(group.masjid, 22, y);
        doc.setFont(undefined, "normal");
        doc.setTextColor(30);
        y += 6;

        group.names.forEach(name => {
          if (y > 275) { doc.addPage(); y = 20; }
          doc.setFontSize(11);
          doc.text("• " + name, 28, y);
          y += 6;
        });
        y += 2;
      });

      y += 6;
    });

    doc.save(`${month}_${year}_jammat_report.pdf`);
  };

  useEffect(() => {
    const fetchJammats = async () => {
      try {
        const res = await API.get(`/jammat/month/${year}/${month}`);
        setJammats(res.data);
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchJammats();
  }, [year, month]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading jammats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-4 pt-5 pb-8">
        <button onClick={() => navigate(-1)} className="text-emerald-200 text-sm mb-2 flex items-center gap-1">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{month} {year}</h1>
        <p className="text-emerald-200 text-sm mt-1">{jammats.length} Jammat{jammats.length !== 1 ? "s" : ""} recorded</p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => navigate(`/statistics/${year}/${month}`)}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-3 rounded-lg transition flex items-center justify-center gap-2">
            📊 Statistics
          </button>
          <button onClick={exportPDF}
            className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-emerald-900 text-sm font-semibold py-2 px-3 rounded-lg transition flex items-center justify-center gap-2">
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-md mx-auto px-4 -mt-4 mb-4">
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Filters</h3>

          {/* Masjid Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">🕌 Masjid</label>
            <select
              value={masjidFilter}
              onChange={e => setMasjidFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {masjids.map(m => (
                <option key={m} value={m}>{m === "all" ? "All Masjids" : m}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">🏷️ Jammat Type</label>
            <div className="flex flex-wrap gap-2">
              {["all", "3days", "10days", "40days", "4months", "2months"].map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition border ${
                    typeFilter === t
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
                  }`}
                >
                  {t === "all" ? "All" : TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {(masjidFilter !== "all" || typeFilter !== "all") && (
            <p className="text-xs text-emerald-600 font-medium">Showing {filtered.length} of {jammats.length} jammats</p>
          )}
        </div>
      </div>

      {/* Jammat List */}
      <div className="max-w-md mx-auto px-4 pb-8 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-2">🕌</div>
            <p>No jammats found with these filters</p>
          </div>
        )}

        {filtered.map((j) => {
          const start = new Date(j.startDate).getDate();
          const end = new Date(j.endDate).getDate();
          const isMasturat = j.category === "masturat";

          return (
            <div
              key={j._id}
              onClick={() => navigate(`/jammat/${j._id}`)}
              className={`rounded-xl shadow-sm hover:shadow-md active:scale-98 transition cursor-pointer overflow-hidden border ${
                isMasturat ? "border-pink-200 bg-pink-50" : "border-gray-100 bg-white"
              }`}
            >
              <div className={`px-4 py-3 flex items-center justify-between ${isMasturat ? "bg-pink-100" : "bg-emerald-50"}`}>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${isMasturat ? "text-pink-600" : "text-emerald-700"}`}>
                    {isMasturat ? "♀ Masturat" : "♂ Jammat"} #{j.jammatNo}
                  </span>
                  {j.isRamzan && <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">🌙 Ramzan</span>}
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[j.type] || "bg-gray-100 text-gray-600"}`}>
                  {TYPE_LABELS[j.type] || j.type}
                </span>
              </div>

              <div className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 text-lg">{start}–{end} {month}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{j.masjidName} · Ameer: {j.ameer}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">{j.saathi} saathi</div>
                  <div className="text-xs text-gray-400 mt-1">View details →</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthPage;
