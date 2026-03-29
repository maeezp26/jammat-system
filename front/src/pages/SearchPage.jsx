import { useState, useEffect, useCallback } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const TYPE_LABELS = { "3days": "3 Days", "10days": "10 Days", "40days": "40 Days", "4months": "4 Months", "2months": "2 Months" };
const TYPE_COLORS = { "3days": "bg-blue-100 text-blue-700", "10days": "bg-purple-100 text-purple-700", "40days": "bg-orange-100 text-orange-700", "4months": "bg-red-100 text-red-700", "2months": "bg-pink-100 text-pink-700" };
const MASJIDS = ["Masjid-e-Ayesha", "Elaahi Masjid"];

function SearchPage() {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [masjidFilter, setMasjidFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const fetchResults = useCallback(async () => {
    if (!name.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const params = new URLSearchParams({ name });
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (masjidFilter !== "all") params.append("masjid", masjidFilter);
      if (yearFilter !== "all") params.append("year", yearFilter);
      const res = await API.get(`/jammat/search/member?${params.toString()}`);
      setResults(res.data);
    } catch (err) { console.log(err); }
    setLoading(false);
  }, [name, categoryFilter, typeFilter, masjidFilter, yearFilter]);

  // Debounce name search
  useEffect(() => {
    const delay = setTimeout(fetchResults, 400);
    return () => clearTimeout(delay);
  }, [fetchResults]);

  const activeFilterCount = [categoryFilter, typeFilter, masjidFilter, yearFilter].filter(f => f !== "all").length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white px-4 pt-5 pb-8">
        <h1 className="text-2xl font-bold mb-1">Search Member</h1>
        <p className="text-emerald-200 text-sm">Find any member across all jammats</p>

        {/* Search Box */}
        <div className="mt-4 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            placeholder="Type member name..."
            className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
          {name && (
            <button onClick={() => { setName(""); setResults([]); setSearched(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
          )}
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="max-w-md mx-auto px-4 -mt-4 mb-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <span className="flex items-center gap-2">
              🎛️ Filters
              {activeFilterCount > 0 && (
                <span className="bg-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </span>
            <span className="text-gray-400">{showFilters ? "▲" : "▼"}</span>
          </button>

          {showFilters && (
            <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                <div className="flex gap-2">
                  {["all", "men", "masturat"].map(c => (
                    <button key={c} onClick={() => setCategoryFilter(c)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${categoryFilter === c ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                      {c === "all" ? "All" : c === "men" ? "♂ Men" : "♀ Masturat"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Jammat Type</label>
                <div className="flex flex-wrap gap-2">
                  {["all", "3days", "10days", "40days", "4months", "2months"].map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${typeFilter === t ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                      {t === "all" ? "All Types" : TYPE_LABELS[t]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Masjid */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Masjid</label>
                <div className="flex flex-wrap gap-2">
                  {["all", ...MASJIDS].map(m => (
                    <button key={m} onClick={() => setMasjidFilter(m)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition border ${masjidFilter === m ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 border-gray-200"}`}>
                      {m === "all" ? "All Masjids" : m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Year</label>
                <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="all">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              {activeFilterCount > 0 && (
                <button onClick={() => { setCategoryFilter("all"); setTypeFilter("all"); setMasjidFilter("all"); setYearFilter("all"); }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium">Clear all filters</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-md mx-auto px-4 pb-8">
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400 text-sm">Searching...</p>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">🔍</div>
            <p className="font-medium">No member found</p>
            <p className="text-sm mt-1">Try a different name or remove filters</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-10 text-gray-400">
            <div className="text-4xl mb-2">👥</div>
            <p className="text-sm">Start typing to search for a member</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 font-medium">{results.length} result{results.length !== 1 ? "s" : ""} found</p>
            {results.map((j) => {
              const start = new Date(j.startDate).getDate();
              const end = new Date(j.endDate).getDate();
              const isMasturat = j.category === "masturat";
              return (
                <div key={j._id} onClick={() => navigate(`/jammat/${j._id}`)}
                  className={`rounded-xl shadow-sm hover:shadow-md active:scale-98 transition cursor-pointer overflow-hidden border ${isMasturat ? "border-pink-200" : "border-gray-100"}`}>
                  <div className={`px-4 py-2 flex items-center justify-between ${isMasturat ? "bg-pink-50" : "bg-emerald-50"}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isMasturat ? "text-pink-600" : "text-emerald-700"}`}>
                      {isMasturat ? "♀ Masturat" : "♂ Men"} · {j.month} {j.year}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[j.type] || "bg-gray-100 text-gray-600"}`}>
                      {TYPE_LABELS[j.type] || j.type}
                    </span>
                  </div>
                  <div className="bg-white px-4 py-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">Jammat #{j.jammatNo}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{start}–{end} {j.month} · {j.masjidName}</div>
                    </div>
                    <span className="text-gray-400 text-sm">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
