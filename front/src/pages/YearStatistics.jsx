import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

function YearStatistics() {
  const { year } = useParams();

  const [stats, setStats] = useState(null);
  const [masjidStats, setMasjidStats] = useState([]);
  const [ramzanStats, setRamzanStats] = useState([]);

  const [showRamzan, setShowRamzan] = useState(false); // ✅ TOGGLE

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/jammat/statistics/${year}`);
        setStats(res.data);

        const res2 = await API.get(`/jammat/masjid-stats/${year}`);
        setMasjidStats(res2.data);

        const res3 = await API.get(`/jammat/ramzan-masjid-stats/${year}`);
        setRamzanStats(res3.data);

      } catch (err) {
        console.error("Failed to load statistics", err);
      }
    };

    load();
  }, [year]);

  const exportPDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`${year} Jammat Statistics`, 20, 20);

    let y = 40;

    doc.setFontSize(12);
    doc.text(`Total Members: ${stats.totalMembers || 0}`, 20, y);
    y += 10;

    doc.text(`3 Days: ${stats.summary?.["3days"] || 0}`, 20, y);
    y += 8;
    doc.text(`10 Days: ${stats.summary?.["10days"] || 0}`, 20, y);
    y += 8;
    doc.text(`40 Days: ${stats.summary?.["40days"] || 0}`, 20, y);
    y += 8;
    doc.text(`4 Months: ${stats.summary?.["4months"] || 0}`, 20, y);

    doc.save(`${year}_statistics.pdf`);
  };

  if (!stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold mb-4 text-center">
        {year} Dashboard
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-3 justify-center mb-6 flex-wrap">

        <button
          onClick={exportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          Export PDF
        </button>

        {/* ✅ TOGGLE BUTTON */}
        <button
          onClick={() => setShowRamzan(!showRamzan)}
          className={`px-4 py-2 rounded shadow text-white ${
            showRamzan ? "bg-yellow-500" : "bg-gray-700"
          }`}
        >
          {showRamzan ? "Showing Ramzan 🌙" : "Show Ramzan Only"}
        </button>

      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <Card title="Total Members" value={stats.totalMembers || 0} />
        <Card title="3 Days" value={stats.summary?.["3days"] || 0} />
        <Card title="10 Days" value={stats.summary?.["10days"] || 0} />
        <Card title="40 Days" value={stats.summary?.["40days"] || 0} />

      </div>

      {/* MEN + MASTURAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <Box title="Men Jamaats" data={stats.mens} />
        <Box title="Masturat Jamaats" data={stats.masturat} />

      </div>

      {/* TOTAL SUMMARY */}
      <div className="bg-green-500 text-white p-4 rounded mb-6 shadow">
        <h2 className="font-bold mb-2">Total Summary</h2>

        <div>3 Days: {stats.summary?.["3days"] || 0}</div>
        <div>10 Days: {stats.summary?.["10days"] || 0}</div>
        <div>40 Days: {stats.summary?.["40days"] || 0}</div>
        <div>4 Months: {stats.summary?.["4months"] || 0}</div>
      </div>

      {/* ✅ MASJID SECTION WITH TOGGLE */}
      <div className="bg-white p-4 rounded shadow">

        <h2 className="font-bold mb-3 text-lg">
          {showRamzan ? "Ramzan Masjid Stats 🌙" : "Masjid Wise Stats"}
        </h2>

        {(showRamzan ? ramzanStats : masjidStats).length === 0 && (
          <p className="text-gray-500">No data</p>
        )}

        {(showRamzan ? ramzanStats : masjidStats).map((m, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2 hover:bg-gray-50 px-2 rounded"
          >
            <div className="font-medium">{m.masjid}</div>

            <div className="text-sm text-gray-600">
              {m.totalJammats} Jammats | {m.totalPeople} People
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}

export default YearStatistics;


// ✅ CARD
function Card({ title, value }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-4 text-center">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}


// ✅ BOX
function Box({ title, data }) {

  if (!data) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">

      <h2 className="font-semibold mb-3 text-lg">
        {title}
      </h2>

      <div className="space-y-2 text-sm">

        <div>3 Days: {data.typeStats?.["3days"] || 0}</div>
        <div>10 Days: {data.typeStats?.["10days"] || 0}</div>
        <div>40 Days: {data.typeStats?.["40days"] || 0}</div>
        <div>4 Months: {data.typeStats?.["4months"] || 0}</div>

        <div className="font-bold mt-2">
          Ramzan: {data.ramzan || 0}
        </div>

      </div>

    </div>
  );
}