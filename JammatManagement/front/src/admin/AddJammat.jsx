import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const masjidList = [
  "Masjid-e-Ayesha",
  "Elaahi Masjid",
  "Jumma Masjid",
  "Noorani Masjid",
  "Fatima Masjid",
  "Bilal Masjid",
  "Medina Masjid",
  "Bajipura",
  "Buhari"
];

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December","Ramzan"
];

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition";
const readOnlyCls = "w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 bg-gray-50 cursor-not-allowed";

function AddJammat() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    year: "", month: "", category: "men", jammatNo: "",
    type: "3days", masjidName: "", route: "",
    startDate: "", endDate: "", note: "", isRamzan: false, ameer: ""
  });

  const [members, setMembers] = useState([]);
  const saathiCount = members.filter(m => m.name.trim() !== "").length;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let updated = { ...form, [name]: type === "checkbox" ? checked : value };
    if (name === "startDate") {
      const d = new Date(value);
      if (!isNaN(d)) { updated.month = months[d.getMonth()]; updated.year = d.getFullYear(); }
    }
    setForm(updated);
  };

  const addMember = (masjid) => setMembers([...members, { masjid, name: "" }]);
  const updateMember = (i, val) => { const u = [...members]; u[i].name = val; setMembers(u); };
  const removeMember = (i) => { const u = [...members]; u.splice(i, 1); setMembers(u); };

  const submit = async () => {
    if (!form.startDate || !form.endDate || !form.jammatNo || !form.masjidName || !form.ameer) {
      return alert("Please fill all required fields");
    }
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await API.post("/jammat", {
        ...form,
        masjidName: form.masjidName.trim(),
        saathi: saathiCount,
        route: form.route.split(",").map(r => r.trim()).filter(Boolean),
        members: Object.values(
          members.reduce((acc, m) => {
            if (!m.name.trim()) return acc;
            if (!acc[m.masjid]) acc[m.masjid] = { masjid: m.masjid, names: [] };
            acc[m.masjid].names.push(m.name);
            return acc;
          }, {})
        )
      }, { headers: { Authorization: token } });

      alert("Jammat Added Successfully ✅");
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Error adding jammat. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 text-white px-4 pt-5 pb-8">
        <button onClick={() => navigate("/admin/dashboard")} className="text-emerald-300 text-sm mb-3">← Dashboard</button>
        <h1 className="text-2xl font-bold">Add New Jammat</h1>
        <p className="text-emerald-300 text-sm mt-0.5">Fill in the details below</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-2 pb-10 space-y-4">

        {/* Basic Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-2">📋 Jammat Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date *">
              <input type="date" name="startDate" onChange={handleChange} className={inputCls} />
            </FormField>
            <FormField label="End Date *">
              <input type="date" name="endDate" onChange={handleChange} className={inputCls} />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Month (Auto)">
              <input value={form.month} readOnly className={readOnlyCls} placeholder="Auto" />
            </FormField>
            <FormField label="Year (Auto)">
              <input value={form.year} readOnly className={readOnlyCls} placeholder="Auto" />
            </FormField>
          </div>

          <FormField label="Category *">
            <div className="flex gap-3">
              {["men", "masturat"].map(c => (
                <button key={c} type="button"
                  onClick={() => setForm({ ...form, category: c })}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition ${form.category === c ? (c === "men" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-pink-500 border-pink-500 text-white") : "bg-white border-gray-200 text-gray-600"}`}>
                  {c === "men" ? "♂ Men" : "♀ Masturat"}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Jammat Type *">
            <div className="flex flex-wrap gap-2">
              {[["3days","3 Days"],["10days","10 Days"],["40days","40 Days"],["2months","2 Months"],["4months","4 Months"]].map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setForm({ ...form, type: val })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition ${form.type === val ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-200 text-gray-600"}`}>
                  {label}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Jammat Number *">
            <input name="jammatNo" placeholder="e.g. 5" onChange={handleChange} type="number" className={inputCls} />
          </FormField>

          <FormField label="Masjid Name *">
            <select name="masjidName" onChange={handleChange} className={inputCls}>
              <option value="">Select Masjid...</option>
              {masjidList.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormField>

          <FormField label="Route (comma separated)">
            <input name="route" placeholder="e.g. Surat, Navsari, Valsad" onChange={handleChange} className={inputCls} />
          </FormField>

          <FormField label="Saathi Count">
            <input value={saathiCount} readOnly className={readOnlyCls} />
          </FormField>

          <FormField label="Note (optional)">
            <textarea name="note" placeholder="Any additional notes..." onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </FormField>

          <label className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer">
            <input type="checkbox" name="isRamzan" onChange={handleChange}
              className="w-5 h-5 rounded accent-yellow-500" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">🌙 Ramzan Jammat</p>
              <p className="text-xs text-yellow-600">Check if this went during Ramzan</p>
            </div>
          </label>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-2">👥 Members & Ameer</h2>

          {form.ameer && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm">
              <span className="text-emerald-600 font-semibold">👑 Ameer: </span>
              <span className="text-emerald-800 font-bold">{form.ameer}</span>
            </div>
          )}

          {masjidList.map(masjid => {
            const masjidMembers = members.filter(m => m.masjid === masjid);
            return (
              <div key={masjid} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-emerald-700">{masjid}</span>
                  <button type="button" onClick={() => addMember(masjid)}
                    className="text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-3 py-1 rounded-full transition">
                    + Add
                  </button>
                </div>

                {masjidMembers.length === 0 && (
                  <p className="text-xs text-gray-400 italic">No members added yet</p>
                )}

                <div className="space-y-2">
                  {members.map((m, i) => m.masjid === masjid && (
                    <div key={i} className="flex items-center gap-2">
                      <button type="button"
                        onClick={() => setForm({ ...form, ameer: m.name })}
                        title="Set as Ameer"
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 text-sm transition ${form.ameer === m.name ? "bg-yellow-400 border-yellow-400 text-yellow-900" : "border-gray-200 text-gray-300 hover:border-yellow-300"}`}>
                        👑
                      </button>
                      <input
                        placeholder="Member name"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        value={m.name}
                        onChange={e => updateMember(i, e.target.value)}
                      />
                      <button type="button" onClick={() => removeMember(i)}
                        className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-sm transition">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button onClick={submit} disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white py-4 rounded-2xl font-bold text-base transition disabled:opacity-60 shadow-lg flex items-center justify-center gap-2">
          {loading ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Saving...</> : "✅ Save Jammat"}
        </button>
      </div>
    </div>
  );
}

export default AddJammat;
