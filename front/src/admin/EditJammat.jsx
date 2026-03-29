import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white transition";

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function EditJammat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/jammat/${id}`).then(res => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const removeMember = (gi, ni) => {
    const u = [...form.members];
    u[gi].names.splice(ni, 1);
    setForm({ ...form, members: u });
  };

  const removeMasjidGroup = (gi) => {
    const u = [...form.members];
    u.splice(gi, 1);
    setForm({ ...form, members: u });
  };

  const handleMemberChange = (gi, ni, val) => {
    const u = [...form.members];
    u[gi].names[ni] = val;
    setForm({ ...form, members: u });
  };

  const handleMasjidChange = (gi, val) => {
    const u = [...form.members];
    u[gi].masjid = val;
    setForm({ ...form, members: u });
  };

  const addMember = (gi) => {
    const u = [...form.members];
    u[gi].names.push("");
    setForm({ ...form, members: u });
  };

  const addMasjidGroup = () => {
    setForm({ ...form, members: [...form.members, { masjid: "", names: [""] }] });
  };

  const update = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await API.put(`/jammat/${id}`, form, { headers: { Authorization: token } });
      alert("Updated successfully ✅");
      navigate(`/jammat/${id}`);
    } catch (err) {
      alert("Update failed. Please try again.");
    }
    setLoading(false);
  };

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const typeOptions = [["3days","3 Days"],["10days","10 Days"],["40days","40 Days"],["2months","2 Months"],["4months","4 Months"]];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-4 pt-5 pb-8">
        <button onClick={() => navigate(-1)} className="text-yellow-200 text-sm mb-3">← Back</button>
        <h1 className="text-2xl font-bold">Edit Jammat</h1>
        <p className="text-yellow-100 text-sm mt-0.5">#{form.jammatNo} · {form.month} {form.year}</p>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-2 pb-10 space-y-4">

        {/* Core Details */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-2">📋 Jammat Details</h2>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Year">
              <input name="year" value={form.year} onChange={handleChange} className={inputCls} />
            </FormField>
            <FormField label="Jammat No">
              <input name="jammatNo" value={form.jammatNo} onChange={handleChange} className={inputCls} />
            </FormField>
          </div>

          <FormField label="Month">
            <input name="month" value={form.month} onChange={handleChange} className={inputCls} />
          </FormField>

          <FormField label="Category">
            <div className="flex gap-3">
              {["men","masturat"].map(c => (
                <button key={c} type="button"
                  onClick={() => setForm({ ...form, category: c })}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition ${form.category === c ? (c === "men" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-pink-500 border-pink-500 text-white") : "bg-white border-gray-200 text-gray-600"}`}>
                  {c === "men" ? "♂ Men" : "♀ Masturat"}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Jammat Type">
            <div className="flex flex-wrap gap-2">
              {typeOptions.map(([val, label]) => (
                <button key={val} type="button"
                  onClick={() => setForm({ ...form, type: val })}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition ${form.type === val ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-gray-200 text-gray-600"}`}>
                  {label}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Masjid Name">
            <input name="masjidName" value={form.masjidName || ""} onChange={handleChange} className={inputCls} />
          </FormField>

          <FormField label="Ameer">
            <input name="ameer" value={form.ameer || ""} onChange={handleChange} className={inputCls} />
          </FormField>

          <FormField label="Saathi">
            <input name="saathi" value={form.saathi || ""} onChange={handleChange} className={inputCls} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start Date">
              <input type="date" name="startDate" value={form.startDate ? form.startDate.slice(0,10) : ""} onChange={handleChange} className={inputCls} />
            </FormField>
            <FormField label="End Date">
              <input type="date" name="endDate" value={form.endDate ? form.endDate.slice(0,10) : ""} onChange={handleChange} className={inputCls} />
            </FormField>
          </div>

          <FormField label="Note">
            <textarea name="note" value={form.note || ""} onChange={handleChange} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </FormField>

          <label className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl cursor-pointer">
            <input type="checkbox" name="isRamzan" checked={form.isRamzan || false} onChange={handleChange} className="w-5 h-5 accent-yellow-500" />
            <div>
              <p className="text-sm font-semibold text-yellow-800">🌙 Ramzan Jammat</p>
            </div>
          </label>
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wider border-b pb-2">👥 Members</h2>

          {(form.members || []).map((group, gi) => (
            <div key={gi} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={group.masjid}
                  onChange={e => handleMasjidChange(gi, e.target.value)}
                  placeholder="Masjid name"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <button onClick={() => removeMasjidGroup(gi)}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-semibold transition">
                  Remove
                </button>
              </div>

              <div className="space-y-2">
                {group.names.map((name, ni) => (
                  <div key={ni} className="flex items-center gap-2">
                    <input
                      value={name}
                      onChange={e => handleMemberChange(gi, ni, e.target.value)}
                      placeholder="Member name"
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    <button onClick={() => removeMember(gi, ni)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-sm transition font-bold flex-shrink-0">
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => addMember(gi)}
                className="mt-3 text-xs bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-semibold px-3 py-1.5 rounded-full transition">
                + Add Member
              </button>
            </div>
          ))}

          <button onClick={addMasjidGroup}
            className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 text-emerald-600 font-semibold py-3 rounded-xl text-sm transition">
            + Add Masjid Group
          </button>
        </div>

        {/* Update Button */}
        <button onClick={update} disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-white py-4 rounded-2xl font-bold text-base transition disabled:opacity-60 shadow-lg flex items-center justify-center gap-2">
          {loading ? <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Updating...</> : "💾 Update Jammat"}
        </button>
      </div>
    </div>
  );
}

export default EditJammat;
