import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December","Ramzan"
];

const TYPE_LABELS = { "3days":"3 Days","10days":"10 Days","40days":"40 Days","4months":"4 Months","2months":"2 Months" };
const TYPE_COLORS = { "3days":"bg-blue-100 text-blue-700","10days":"bg-purple-100 text-purple-700","40days":"bg-orange-100 text-orange-700","4months":"bg-red-100 text-red-700","2months":"bg-pink-100 text-pink-700" };

function AdminDashboard() {
  const navigate = useNavigate();
  const [jammats, setJammats] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ year });
        if (month) query.append("month", month);
        if (type) query.append("type", type);
        const res = await API.get(`/jammat/filter?${query.toString()}`);
        setJammats(res.data);
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    load();
  }, [year, month, type]);

  const filtered = jammats.filter(j => {
    if (category && j.category !== category) return false;
    if (searchText && !j.masjidName?.toLowerCase().includes(searchText.toLowerCase()) && !j.ameer?.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await API.delete(`/jammat/${id}`, { headers: { Authorization: token } });
    setJammats(prev => prev.filter(j => j._id !== id));
    setDeleteId(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white px-4 pt-5 pb-10 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/jammat-logo.svg" alt="Logo" className="w-10 h-10 rounded-full bg-emerald-800 p-0.5" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Admin Panel</h1>
              <p className="text-emerald-300 text-xs">Valod Jammat Management</p>
            </div>
          </div>
          <button onClick={logout} className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg transition font-medium">
            🚪 Logout
          </button>
        </div>

        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto mt-5 grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/admin/add")}
            className="bg-yellow-400 hover:bg-yellow-300 text-emerald-900 font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow">
            ＋ Add Jammat
          </button>
          <button onClick={() => navigate(`/statistics/${year}`)}
            className="bg-white/15 hover:bg-white/25 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
            📊 Statistics
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 pb-10 space-y-4">

        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow-md p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Filter & Search</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {[2024,2025,2026,2027,2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Month</label>
              <select value={month} onChange={e => setMonth(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">All Months</option>
                {months.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Type</label>
            <div className="flex flex-wrap gap-2">
              {["","3days","10days","40days","4months"].map(t => (
                <button key={t} onClick={() => setType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${type === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                  {t === "" ? "All Types" : TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <div className="flex gap-2">
              {["","men","masturat"].map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${category === c ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                  {c === "" ? "All" : c === "men" ? "♂ Men" : "♀ Masturat"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              placeholder="Search by masjid or ameer..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-500 font-medium">
            {loading ? "Loading..." : `${filtered.length} jammat${filtered.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Jammat Cards */}
        {!loading && filtered.map(j => {
          const start = new Date(j.startDate).getDate();
          const end = new Date(j.endDate).getDate();
          const isMasturat = j.category === "masturat";

          return (
            <div key={j._id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${isMasturat ? "border-pink-200" : "border-gray-100"}`}>
              <div className={`px-4 py-2.5 flex items-center justify-between ${isMasturat ? "bg-pink-50" : "bg-emerald-50"}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isMasturat ? "text-pink-600" : "text-emerald-700"}`}>
                    {isMasturat ? "♀" : "♂"} {j.month} — #{j.jammatNo}
                  </span>
                  {j.isRamzan && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">🌙</span>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${TYPE_COLORS[j.type] || "bg-gray-100 text-gray-600"}`}>
                  {TYPE_LABELS[j.type] || j.type}
                </span>
              </div>

              <div className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-800">{start}–{end} {j.month}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{j.masjidName} · Ameer: {j.ameer}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">{j.saathi} saathi</p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigate(`/jammat/${j._id}`)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded-lg transition">
                    👁️ View
                  </button>
                  <button onClick={() => navigate(`/admin/edit/${j._id}`)}
                    className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-semibold py-2 rounded-lg transition">
                    ✏️ Edit
                  </button>
                  <button onClick={() => setDeleteId(j._id)}
                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold py-2 rounded-lg transition">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-2">🕌</div>
            <p className="font-medium">No jammats found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="font-bold text-gray-800 text-lg">Delete Jammat?</h3>
              <p className="text-gray-500 text-sm mt-1">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
