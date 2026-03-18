import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";

function StatisticsPage() {

  const { year } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {

    const load = async () => {
      try {
        const res = await API.get(`/jammat/statistics/${year}`);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    load();

  }, [year]);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        {year} Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <Card title="Total Members" value={data.totalMembers || 0} />
        <Card title="3 Days" value={data.summary?.["3days"] || 0} />
        <Card title="10 Days" value={data.summary?.["10days"] || 0} />
        <Card title="40 Days" value={data.summary?.["40days"] || 0} />

      </div>

      {/* MEN vs MASTURAT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <Box title="Men Jamaats" data={data.mens} />
        <Box title="Masturat Jamaats" data={data.masturat} />

      </div>

    </div>
  );
}

export default StatisticsPage;


// ✅ Card Component
function Card({ title, value }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition rounded-lg p-4 text-center">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}


// ✅ Box Component
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