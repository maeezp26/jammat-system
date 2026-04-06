import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

function JammatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jammat, setJammat] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await API.get(`/jammat/${id}`);
      setJammat(res.data);
    };
    fetchDetail();
  }, [id]);

  if (!jammat) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const start = new Date(jammat.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const end = new Date(jammat.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const isMasturat = jammat.category === "masturat";

  const TYPE_LABELS = { "3days": "3 Days", "10days": "10 Days", "40days": "40 Days", "4months": "4 Months", "2months": "2 Months" };
  const TYPE_COLORS = { "3days": "bg-blue-100 text-blue-700", "10days": "bg-purple-100 text-purple-700", "40days": "bg-orange-100 text-orange-700", "4months": "bg-red-100 text-red-700", "2months": "bg-pink-100 text-pink-700" };

  const totalMembers = jammat.members.reduce((sum, g) => sum + g.names.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`text-white px-4 pt-5 pb-10 ${isMasturat ? "bg-gradient-to-r from-pink-700 to-pink-500" : "bg-gradient-to-r from-emerald-800 to-emerald-600"}`}>
        <button onClick={() => navigate(-1)} className="text-white/70 text-sm mb-3 flex items-center gap-1">
          ← Back
        </button>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
              {isMasturat ? "♀ Masturat Jammat" : "♂ Men's Jammat"}
            </p>
            <h1 className="text-2xl font-bold">Jammat #{jammat.jammatNo}</h1>
            <p className="text-white/80 text-sm mt-1">{jammat.month} {jammat.year}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-white/20`}>
              {TYPE_LABELS[jammat.type] || jammat.type}
            </span>
            {jammat.isRamzan && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
                🌙 Ramzan
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-5 space-y-4 pb-10">

        {/* Date + Overview */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-2 gap-4">
            <InfoItem icon="📅" label="Start Date" value={start} />
            <InfoItem icon="📅" label="End Date" value={end} />
            <InfoItem icon="🕌" label="Masjid" value={jammat.masjidName} />
            <InfoItem icon="👥" label="Total Members" value={`${totalMembers} saathi`} />
            <InfoItem icon="👑" label="Ameer" value={jammat.ameer} highlight />
            <InfoItem icon="🔢" label="Saathi Count" value={jammat.saathi} />
          </div>
        </div>

        {/* Route */}
        {jammat.route && jammat.route.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Route</h2>
            <div className="flex flex-wrap items-center gap-2">
              {jammat.route.map((stop, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">{stop}</span>
                  {i < jammat.route.length - 1 && <span className="text-gray-400 text-sm">→</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Members by Masjid */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Members ({totalMembers})
          </h2>
          <div className="space-y-4">
            {jammat.members.map((group, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-emerald-700 text-sm">{group.masjid}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{group.names.length} members</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {group.names.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-800 text-sm">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        {jammat.note && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h2 className="text-xs font-semibold text-yellow-700 uppercase tracking-widest mb-1">📝 Note</h2>
            <p className="text-gray-700 text-sm">{jammat.note}</p>
          </div>
        )}

      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, highlight }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-0.5">{icon} {label}</div>
      <div className={`text-sm font-semibold ${highlight ? "text-emerald-700" : "text-gray-800"}`}>{value || "—"}</div>
    </div>
  );
}

export default JammatDetail;
