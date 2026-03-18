import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [jammats, setJammats] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
const [masjid, setMasjid] = useState("");

 useEffect(() => {

  const load = async () => {
    try {

      const query = new URLSearchParams({
  year,
  month,
  type,
  masjidName: masjid
}).toString();

      const res = await API.get(`/jammat/filter?${query}`);

      setJammats(res.data);

    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  load();

}, [year, month, type, masjid]);

  const filtered = jammats.filter((j) =>
    j.masjidName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {/* Header with Logout at Top Right */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Controls - Stacked on mobile, 3 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">

  {/* Year */}
  <select
    value={year}
    onChange={(e) => setYear(e.target.value)}
    className="border p-2"
  >
    {[2024, 2025, 2026, 2027, 2028].map((y) => (
      <option key={y} value={y}>{y}</option>
    ))}
  </select>

  {/* Month */}
  <select
    value={month}
    onChange={(e) => setMonth(e.target.value)}
    className="border p-2"
  >
    <option value="">All Months</option>
    {months.map((m) => (
      <option key={m} value={m}>{m}</option>
    ))}
  </select>

  {/* Type */}
  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
    className="border p-2"
  >
    <option value="">All Types</option>
    <option value="3days">3 Days</option>
    <option value="10days">10 Days</option>
    <option value="40days">40 Days</option>
    <option value="4months">4 Months</option>
  </select>

  {/* Masjid Filter */}
  <input
    placeholder="Filter Masjid..."
    value={masjid}
    onChange={(e) => setMasjid(e.target.value)}
    className="border p-2"
  />

  {/* Search */}
  <input
    placeholder="Search masjid..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-2"
  />

</div>

      <button
        onClick={() => navigate("/admin/add")}
        className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg mb-6 w-full font-semibold shadow-sm transition-colors"
      >
        + Add New Jammat
      </button>

      <button
  onClick={() => navigate(`/statistics/${year}`)}
  className="bg-purple-600 text-white p-3 rounded mb-4 w-full"
>
  View Dashboard
</button>

      {/* Table Container with Horizontal Scroll for Mobile */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 font-semibold">Month</th>
                <th className="p-3 font-semibold">No.</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Masjid</th>
                <th className="p-3 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length > 0 ? (
                filtered.map((j) => (
                  <tr key={j._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 whitespace-nowrap">{j.month}</td>
                    <td className="p-3">{j.jammatNo}</td>
                    <td className="p-3">{j.type}</td>
                    <td className="p-3 font-medium">{j.masjidName}</td>
                    <td className="p-3 flex justify-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${j._id}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/jammat/${j._id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      <button
onClick={async ()=>{
  if(!window.confirm("Delete this jammat?")) return;

  const token = localStorage.getItem("token");

  await API.delete(`/jammat/${j._id}`,{
    headers:{ Authorization: token }
  });

  window.location.reload();
}}
className="bg-red-500 text-white px-2 py-1 rounded"
>
Delete
</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    No records found for "{search}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
