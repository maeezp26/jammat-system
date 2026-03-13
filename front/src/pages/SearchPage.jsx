import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

function SearchPage() {

  const [name, setName] = useState("");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchResults = async () => {

      if (!name.trim()) {
        setResults([]);
        return;
      }

      try {

        const res = await API.get(`/jammat/search/member?name=${name}`);

        setResults(res.data);

      } catch (err) {

        console.log(err);

      }

    };

    // debounce to avoid too many requests
    const delay = setTimeout(fetchResults, 400);

    return () => clearTimeout(delay);

  }, [name]);

  return (

    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Search Member
      </h1>

      {/* Search Input */}
      <input
        placeholder="Search member name..."
        className="border p-3 w-full mb-4 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* No result message */}
      {!results.length && name && (
        <p className="text-gray-500 mb-4">
          No member found
        </p>
      )}

      {/* Results */}
      <div className="space-y-3">

        {results.map((j) => {

          const start = new Date(j.startDate).getDate();
          const end = new Date(j.endDate).getDate();

          return (

            <div
              key={j._id}
              className="bg-white p-4 rounded-lg shadow-md active:scale-95 transition cursor-pointer"
              onClick={() => navigate(`/jammat/${j._id}`)}
            >

              <div className="font-semibold">
                {j.month} | {start}-{end}
              </div>

              <div className="text-sm text-gray-600">
                {j.category === "masturat" ? "Masturat " : ""}
                Jammat {j.jammatNo}
              </div>

              <div className="text-sm text-gray-500">
                {j.masjidName}
              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

export default SearchPage;