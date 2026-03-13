import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

import { useNavigate } from "react-router-dom";

function JammatDetail() {
  const { id } = useParams();

  const [jammat, setJammat] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {

      const res = await API.get(`/jammat/${id}`);

      setJammat(res.data);
    };

    fetchDetail();
  }, [id]);

 

  if (!jammat) {
    return <div className="p-4">Loading...</div>;
  }

  return (
  <div className="min-h-screen bg-gray-100 py-10 px-4">
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">

      {/* Title */}
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        {jammat.category === "masturat" ? "Masturat " : ""}
        Jammat {jammat.jammatNo}
      </h1>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-600">Type:</span>
          <div className="text-lg">{jammat.type}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-600">Masjid:</span>
          <div className="text-lg">{jammat.masjidName}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-600">Ameer:</span>
          <div className="text-lg font-medium text-green-700">{jammat.ameer}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-600">Saathi:</span>
          <div className="text-lg">{jammat.saathi}</div>
        </div>

      </div>

      {/* Route */}
      <div className="mb-6">
        <div className="font-semibold text-gray-700 mb-2">Route</div>
        <div className="bg-blue-50 p-3 rounded-lg text-blue-700 font-medium">
          {jammat.route.join(" → ")}
        </div>
      </div>

      {/* Members */}
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        Members
      </h2>

      <div className="space-y-4">

        {jammat.members.map((group, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
          >
            <div className="font-semibold text-blue-700 mb-2">
              {group.masjid}
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-gray-700">
              {group.names.map((name, idx) => (
                <li key={idx} className="bg-white px-3 py-1 rounded border">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Note */}
      {jammat.note && (
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <span className="font-semibold">Note:</span> {jammat.note}
        </div>
      )}

    </div>
  </div>
);
}

export default JammatDetail;
