import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const currentYear = new Date().getFullYear();

function num(v) { return Number(v) || 0; }

function StatRow({ label, value, highlight }) {
  return (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${highlight ? "font-bold" : ""}`}>
      <span className={`text-sm ${highlight ? "text-gray-800" : "text-gray-600"}`}>{label}</span>
      <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${highlight ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-800"}`}>{value}</span>
    </div>
  );
}

function SectionCard({ title, emoji, color, children }) {
  return (
    <div className={`rounded-xl border ${color} p-4 mb-3`}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">{emoji} {title}</h3>
      {children}
    </div>
  );
}

function MasjidCard({ data, expanded, onToggle }) {
  const d = data;
  const taalimTotal = num(d.taalim?.taalim) + num(d.taalim?.sixSifat);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg">🕌</div>
          <div className="text-left">
            <p className="font-bold text-gray-800 text-sm">{d.masjidName}</p>
            <p className="text-xs text-gray-400">{num(d.mens?.houses)} houses · {num(d.mens?.total)} mens</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">

          <SectionCard title="Mens" emoji="♂" color="border-blue-100 bg-blue-50">
            <StatRow label="Total Houses"        value={num(d.mens?.houses)} />
            <StatRow label="Total Mens"          value={num(d.mens?.total)} />
            <StatRow label="4 Month (once)"      value={num(d.mens?.fourMonth_once)} />
            <StatRow label="4 Month (2+ times)"  value={num(d.mens?.fourMonth_moreThan2)} />
            <StatRow label="Berun Saathi"        value={num(d.mens?.berunSaathi)} />
            <StatRow label="40 Days Saathi"      value={num(d.mens?.fortyDaysSaathi)} />
          </SectionCard>

          <SectionCard title="Masturat" emoji="♀" color="border-pink-100 bg-pink-50">
            <StatRow label="Berun Masturat"      value={num(d.masturat?.berun)} />
            <StatRow label="40 Days"             value={num(d.masturat?.fortyDays)} />
            <StatRow label="10 Days"             value={num(d.masturat?.tenDays)} />
            <StatRow label="3 Days"              value={num(d.masturat?.threeDays)} />
          </SectionCard>

          <SectionCard title="Students" emoji="🎒" color="border-purple-100 bg-purple-50">
            <StatRow label="Total Students (School/College)" value={num(d.students?.total)} />
          </SectionCard>

          <SectionCard title="Talba (Madressa)" emoji="📖" color="border-yellow-100 bg-yellow-50">
            <StatRow label="Total Talba" value={num(d.talba?.total)} />
          </SectionCard>

          <SectionCard title="Taalim" emoji="🌿" color="border-emerald-100 bg-emerald-50">
            <StatRow label="Taalim"      value={num(d.taalim?.taalim)} />
            <StatRow label="6 Sifat"     value={num(d.taalim?.sixSifat)} />
            <StatRow label="Total"       value={taalimTotal} highlight />
          </SectionCard>

        </div>
      )}
    </div>
  );
}

function ValodOverview({ valod }) {
  const taalimTotal = num(valod.taalim?.taalim) + num(valod.taalim?.sixSifat);

  return (
    <div className="space-y-3">
      {/* Stat overview pills */}
      <div className="grid grid-cols-3 gap-2 mb-2">
        <BigPill label="Houses" value={num(valod.mens?.houses)} color="bg-blue-600" />
        <BigPill label="Mens" value={num(valod.mens?.total)} color="bg-emerald-600" />
        <BigPill label="Students" value={num(valod.students?.total)} color="bg-purple-600" />
        <BigPill label="Talba" value={num(valod.talba?.total)} color="bg-yellow-500" />
        <BigPill label="Taalim" value={taalimTotal} color="bg-teal-600" />
        <BigPill label="Berun" value={num(valod.mens?.berunSaathi)} color="bg-orange-500" />
      </div>

      <SectionCard title="Mens" emoji="♂" color="border-blue-200 bg-blue-50">
        <StatRow label="Total Houses"        value={num(valod.mens?.houses)} />
        <StatRow label="Total Mens"          value={num(valod.mens?.total)} />
        <StatRow label="4 Month (once)"      value={num(valod.mens?.fourMonth_once)} />
        <StatRow label="4 Month (2+ times)"  value={num(valod.mens?.fourMonth_moreThan2)} />
        <StatRow label="Berun Saathi"        value={num(valod.mens?.berunSaathi)} />
        <StatRow label="40 Days Saathi"      value={num(valod.mens?.fortyDaysSaathi)} />
      </SectionCard>

      <SectionCard title="Masturat" emoji="♀" color="border-pink-200 bg-pink-50">
        <StatRow label="Berun Masturat"      value={num(valod.masturat?.berun)} />
        <StatRow label="40 Days"             value={num(valod.masturat?.fortyDays)} />
        <StatRow label="10 Days"             value={num(valod.masturat?.tenDays)} />
        <StatRow label="3 Days"              value={num(valod.masturat?.threeDays)} />
      </SectionCard>

      <SectionCard title="Students" emoji="🎒" color="border-purple-200 bg-purple-50">
        <StatRow label="Total Students (School/College)" value={num(valod.students?.total)} />
      </SectionCard>

      <SectionCard title="Talba (Madressa)" emoji="📖" color="border-yellow-200 bg-yellow-50">
        <StatRow label="Total Talba" value={num(valod.talba?.total)} />
      </SectionCard>

      <SectionCard title="Taalim" emoji="🌿" color="border-emerald-200 bg-emerald-50">
        <StatRow label="Taalim"   value={num(valod.taalim?.taalim)} />
        <StatRow label="6 Sifat"  value={num(valod.taalim?.sixSifat)} />
        <StatRow label="Total"    value={taalimTotal} highlight />
      </SectionCard>
    </div>
  );
}

function BigPill({ label, value, color }) {
  return (
    <div className={`${color} text-white rounded-xl p-3 text-center shadow-sm`}>
      <div className="text-2xl font-bold leading-tight">{value}</div>
      <div className="text-xs opacity-80 mt-0.5 font-medium">{label}</div>
    </div>
  );
}

function VillagePage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedMasjid, setExpandedMasjid] = useState(null);
  const [activeTab, setActiveTab] = useState("valod");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/masjid-data/${year}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [year]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white px-4 pt-5 pb-10">
        <button onClick={() => navigate(-1)} className="text-emerald-300 text-sm mb-3">← Back</button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold">🏡 Valod Statistics</h1>
            <p className="text-emerald-300 text-sm mt-0.5">Village & Masjid-wise data</p>
          </div>
          {/* Year Selector */}
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <button onClick={() => setYear(y => y - 1)} className="text-white font-bold text-lg leading-none">‹</button>
            <span className="font-bold text-base min-w-[3rem] text-center">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="text-white font-bold text-lg leading-none">›</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-5">
          <button onClick={() => setActiveTab("valod")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === "valod" ? "bg-white text-emerald-800" : "bg-white/15 text-white"}`}>
            🏡 Valod Total
          </button>
          <button onClick={() => setActiveTab("masjids")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${activeTab === "masjids" ? "bg-white text-emerald-800" : "bg-white/15 text-white"}`}>
            🕌 Masjid-wise
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 pb-10">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !data ? (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-2">⚠️</div>
            <p>Could not load data</p>
          </div>
        ) : (
          <>
            {activeTab === "valod" && (
              <div>
                <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-xl">🏡</div>
                    <div>
                      <h2 className="font-bold text-gray-800">Valod — {year}</h2>
                      <p className="text-xs text-gray-400">Combined total of all {data.masjids?.length} masjids</p>
                    </div>
                  </div>
                  <ValodOverview valod={data.valod} />
                </div>
              </div>
            )}

            {activeTab === "masjids" && (
              <div className="pt-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-3 px-1">Tap a masjid to expand</p>
                {data.masjids.map((m) => (
                  <MasjidCard
                    key={m.masjidName}
                    data={m}
                    expanded={expandedMasjid === m.masjidName}
                    onToggle={() => setExpandedMasjid(expandedMasjid === m.masjidName ? null : m.masjidName)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VillagePage;
