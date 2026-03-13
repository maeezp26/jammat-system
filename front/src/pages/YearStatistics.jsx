import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";

function YearStatistics() {
  const { year } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/jammat/statistics/${year}`);
        setStats(res.data);
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

    doc.setFontSize(14);
    doc.text("Men Jammat", 20, y);
    y += 10;

    doc.setFontSize(12);

    doc.text(`3 Days: ${stats.mens?.typeStats?.["3days"] || 0}`, 20, y);
    y += 8;

    doc.text(`10 Days: ${stats.mens?.typeStats?.["10days"] || 0}`, 20, y);
    y += 8;

    doc.text(`40 Days: ${stats.mens?.typeStats?.["40days"] || 0}`, 20, y);
    y += 8;

    doc.text(`4 Months: ${stats.mens?.typeStats?.["4months"] || 0}`, 20, y);
    y += 8;

    doc.text(`Ramzan: ${stats.mens?.ramzan || 0}`, 20, y);
    y += 12;

    doc.setFontSize(14);
    doc.text("Masturat Jammat", 20, y);
    y += 10;

    doc.setFontSize(12);

    doc.text(`3 Days: ${stats.masturat?.typeStats?.["3days"] || 0}`, 20, y);
    y += 8;

    doc.text(`10 Days: ${stats.masturat?.typeStats?.["10days"] || 0}`, 20, y);
    y += 8;

    doc.text(`40 Days: ${stats.masturat?.typeStats?.["40days"] || 0}`, 20, y);
    y += 8;

    doc.text(`4 Months: ${stats.masturat?.typeStats?.["4months"] || 0}`, 20, y);
    y += 8;

    doc.text(`Ramzan: ${stats.masturat?.ramzan || 0}`, 20, y);
    y += 12;

    doc.setFontSize(14);
    doc.text("Total Summary", 20, y);
    y += 10;

    doc.setFontSize(12);

    doc.text(
      `3 Days: ${(stats.mens?.typeStats?.["3days"] || 0) +
        (stats.masturat?.typeStats?.["3days"] || 0)}`,
      20,
      y
    );
    y += 8;

    doc.text(
      `10 Days: ${(stats.mens?.typeStats?.["10days"] || 0) +
        (stats.masturat?.typeStats?.["10days"] || 0)}`,
      20,
      y
    );
    y += 8;

    doc.text(
      `40 Days: ${(stats.mens?.typeStats?.["40days"] || 0) +
        (stats.masturat?.typeStats?.["40days"] || 0)}`,
      20,
      y
    );
    y += 8;

    doc.text(
      `4 Months: ${(stats.mens?.typeStats?.["4months"] || 0) +
        (stats.masturat?.typeStats?.["4months"] || 0)}`,
      20,
      y
    );

    doc.save(`${year}_statistics.pdf`);
  };

  if (!stats) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">{year} Effort Statistics</h1>

      <button
        onClick={exportPDF}
        className="w-full bg-blue-600 text-white p-3 rounded mb-4"
      >
        Export PDF
      </button>

      {/* MEN JAMMAT */}
      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Men Jammat</h2>

        <div>3 Days: {stats.mens?.typeStats?.["3days"] || 0}</div>
        <div>10 Days: {stats.mens?.typeStats?.["10days"] || 0}</div>
        <div>40 Days: {stats.mens?.typeStats?.["40days"] || 0}</div>
        <div>4 Months: {stats.mens?.typeStats?.["4months"] || 0}</div>
        <div>Ramzan: {stats.mens?.ramzan || 0}</div>
      </div>

      {/* WOMEN JAMMAT */}
      <div className="bg-pink-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Masturat Jammat</h2>

        <div>3 Days: {stats.masturat?.typeStats?.["3days"] || 0}</div>
        <div>10 Days: {stats.masturat?.typeStats?.["10days"] || 0}</div>
        <div>40 Days: {stats.masturat?.typeStats?.["40days"] || 0}</div>
        <div>4 Months: {stats.masturat?.typeStats?.["4months"] || 0}</div>
        <div>Ramzan: {stats.masturat?.ramzan || 0}</div>
      </div>

      {/* SUMMARY */}
      <div className="bg-green-500 text-white p-4 rounded">
        <h2 className="font-bold mb-2">Total Jammat Summary</h2>

        <div>
          3 Days: {(stats.mens?.typeStats?.["3days"] || 0) +
            (stats.masturat?.typeStats?.["3days"] || 0)}
        </div>

        <div>
          10 Days: {(stats.mens?.typeStats?.["10days"] || 0) +
            (stats.masturat?.typeStats?.["10days"] || 0)}
        </div>

        <div>
          40 Days: {(stats.mens?.typeStats?.["40days"] || 0) +
            (stats.masturat?.typeStats?.["40days"] || 0)}
        </div>

        <div>
          4 Months: {(stats.mens?.typeStats?.["4months"] || 0) +
            (stats.masturat?.typeStats?.["4months"] || 0)}
        </div>
      </div>
    </div>
  );
}

export default YearStatistics; 