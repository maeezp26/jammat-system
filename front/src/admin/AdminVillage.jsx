import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const MASJID_LIST = [
  "Jumma Masjid", "Noorani Masjid", "Ayesha Masjid",
  "Fatima Masjid", "Bilal Masjid", "Medina Masjid",
  "Elaahi Masjid", "Bajipura", "Buhari"
];

const currentYear = new Date().getFullYear();

const DEFAULT_FORM = {
  mens: { houses: 0, total: 0, fourMonth_once: 0, fourMonth_moreThan2: 0, berunSaathi: 0, fortyDaysSaathi: 0 },
  masturat: { berun: 0, fortyDays: 0, tenDays: 0, threeDays: 0 },
  students: { total: 0 },
  talba: { total: 0 },
  taalim: { taalim: 0, sixSifat: 0 }
};

function NumInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 font-medium mb-1">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
}

function SectionHeader({ title, emoji, color }) {
  return (
    <div className={`text-xs font-bold uppercase tracking-widest px-3 py-2 rounded-lg mb-3 ${color}`}>
      {emoji} {title}
    </div>
  );
}

function AdminVillage() {
  const navigate = useNavigate();
  const [year, setYear] = useState(currentYear);
  const [selectedMasjid, setSelectedMasjid] = useState(MASJID_LIST[0]);
  const [form, setForm] = useState(JSON.parse(JSON.stringify(DEFAULT_FORM)));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load data when masjid/year changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setSaved(false);
      try {
        const res = await API.get(`/masjid-data/${year}/${encodeURIComponent(selectedMasjid)}`);
        const d = res.data;
        setForm({
          mens: { 
            houses:              d.mens?.houses || 0,
            total:               d.mens?.total || 0,
            fourMonth_once:      d.mens?.fourMonth_once || 0,
            fourMonth_moreThan2: d.mens?.fourMonth_moreThan2 || 0,
            berunSaathi:         d.mens?.berunSaathi || 0,
            fortyDaysSaathi:     d.mens?.fortyDaysSaathi || 0
          },
          masturat: {
            berun:     d.masturat?.berun || 0,
            fortyDays: d.masturat?.fortyDays || 0,
            tenDays:   d.masturat?.tenDays || 0,
            threeDays: d.masturat?.threeDays || 0
          },
          students: { total: d.students?.total || 0 },
          talba:    { total: d.talba?.total || 0 },
          taalim:   { taalim: d.taalim?.taalim || 0, sixSifat: d.taalim?.sixSifat || 0 }
        });
      } catch (err) {
        setForm(JSON.parse(JSON.stringify(DEFAULT_FORM)));
      }
      setLoading(false);
    };
    load();
  }, [selectedMasjid, year]);

  const setField = (section, key, value) => {
    setForm(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  };

  const save = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      await API.put(`/masjid-data/${year}/${encodeURIComponent(selectedMasjid)}`, form, {
        headers: { Authorization: token }
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Save failed. Please try again.");
    }
    setSaving(false);
  };

  const taalimTotal = (form.taalim?.taalim || 0) + (form.taalim?.sixSifat || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white px-4 pt-5 pb-10">
        <button onClick={() => navigate("/admin/dashboard")} className="text-emerald-300 text-sm mb-3">← Dashboard</button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold">🏡 Village Data</h1>
            <p className="text-emerald-300 text-sm mt-0.5">Edit masjid statistics</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <button onClick={() => setYear(y => y - 1)} className="text-white font-bold text-lg">‹</button>
            <span className="font-bold min-w-[3rem] text-center">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="text-white font-bold text-lg">›</button>
          </div>
        </div>

        {/* Masjid Selector */}
        <div className="mt-4 overflow-x-auto pb-1">
          <div className="flex gap-2" style={{ minWidth: "max-content" }}>
            {MASJID_LIST.map(m => (
              <button key={m} onClick={() => setSelectedMasjid(m)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${selectedMasjid === m ? "bg-white text-emerald-800" : "bg-white/15 text-white hover:bg-white/25"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-4 pb-10 space-y-4">

        {/* Success Banner */}
        {saved && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl px-4 py-3 text-sm font-semibold flex items-center gap-2">
            ✅ Data saved for {selectedMasjid}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-14">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Masjid Label */}
            <div className="bg-white rounded-2xl shadow-sm px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">🕌</div>
              <div>
                <p className="font-bold text-gray-800">{selectedMasjid}</p>
                <p className="text-xs text-gray-400">Year {year}</p>
              </div>
            </div>

            {/* Mens Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <SectionHeader title="Mens" emoji="♂" color="bg-blue-50 text-blue-700" />
              <div className="grid grid-cols-2 gap-3">
                <NumInput label="Total Houses"        value={form.mens.houses}              onChange={v => setField("mens","houses",v)} />
                <NumInput label="Total Mens"          value={form.mens.total}               onChange={v => setField("mens","total",v)} />
                <NumInput label="4 Month (once)"      value={form.mens.fourMonth_once}      onChange={v => setField("mens","fourMonth_once",v)} />
                <NumInput label="4 Month (2+ times)"  value={form.mens.fourMonth_moreThan2} onChange={v => setField("mens","fourMonth_moreThan2",v)} />
                <NumInput label="Berun Saathi"        value={form.mens.berunSaathi}         onChange={v => setField("mens","berunSaathi",v)} />
                <NumInput label="40 Days Saathi"      value={form.mens.fortyDaysSaathi}     onChange={v => setField("mens","fortyDaysSaathi",v)} />
              </div>
            </div>

            {/* Masturat Card */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <SectionHeader title="Masturat" emoji="♀" color="bg-pink-50 text-pink-700" />
              <div className="grid grid-cols-2 gap-3">
                <NumInput label="Berun Masturat" value={form.masturat.berun}     onChange={v => setField("masturat","berun",v)} />
                <NumInput label="40 Days"        value={form.masturat.fortyDays} onChange={v => setField("masturat","fortyDays",v)} />
                <NumInput label="10 Days"        value={form.masturat.tenDays}   onChange={v => setField("masturat","tenDays",v)} />
                <NumInput label="3 Days"         value={form.masturat.threeDays} onChange={v => setField("masturat","threeDays",v)} />
              </div>
            </div>

            {/* Students */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <SectionHeader title="Students (School / College)" emoji="🎒" color="bg-purple-50 text-purple-700" />
              <NumInput label="Total Students" value={form.students.total} onChange={v => setField("students","total",v)} />
            </div>

            {/* Talba */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <SectionHeader title="Talba (Madressa)" emoji="📖" color="bg-yellow-50 text-yellow-700" />
              <NumInput label="Total Talba" value={form.talba.total} onChange={v => setField("talba","total",v)} />
            </div>

            {/* Taalim */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <SectionHeader title="Taalim" emoji="🌿" color="bg-emerald-50 text-emerald-700" />
              <div className="grid grid-cols-2 gap-3">
                <NumInput label="Taalim"   value={form.taalim.taalim}   onChange={v => setField("taalim","taalim",v)} />
                <NumInput label="6 Sifat"  value={form.taalim.sixSifat} onChange={v => setField("taalim","sixSifat",v)} />
              </div>
              <div className="mt-3 flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3">
                <span className="text-sm font-semibold text-emerald-700">Total (Taalim + 6 Sifat)</span>
                <span className="text-lg font-bold text-emerald-700">{taalimTotal}</span>
              </div>
            </div>

            {/* Save Button */}
            <button onClick={save} disabled={saving}
              className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white py-4 rounded-2xl font-bold text-base transition disabled:opacity-60 shadow-lg flex items-center justify-center gap-2">
              {saving
                ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...</>
                : `💾 Save ${selectedMasjid} Data`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminVillage;
