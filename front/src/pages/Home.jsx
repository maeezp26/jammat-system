import { useState } from "react";
import { useNavigate } from "react-router-dom";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function Home() {

  const [year,setYear] = useState(new Date().getFullYear());

  const navigate = useNavigate();

  return (

    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-2xl font-bold text-center mb-6">
       Valod Jammat Management
      </h1>

      {/* Admin Login */}
      <button
      onClick={()=>navigate("/admin/login")}
      className="w-full bg-black text-white p-3 rounded mb-4"
      >
      Admin Login
      </button>

      {/* Year Select */}
      <div className="mb-4">

        <label className="block mb-2 font-medium">
        Select Year
        </label>

        <input
        type="number"
        value={year}
        onChange={(e)=>setYear(e.target.value)}
        className="w-full border rounded p-2"
        />

      </div>

      {/* Search */}
      <button
      onClick={()=>navigate("/search")}
      className="w-full bg-green-500 text-white p-3 rounded mb-4"
      >
      Search Member
      </button>

      {/* Statistics */}
      <button
      onClick={()=>navigate(`/statistics/${year}`)}
      className="w-full bg-purple-500 text-white p-3 rounded mb-4"
      >
      View {year} Statistics
      </button>

      {/* Months */}
      <div className="grid grid-cols-2 gap-3">

      {months.map((month)=>(
        <button
        key={month}
        onClick={()=>navigate(`/month/${year}/${month}`)}
        className="bg-blue-500 text-white p-3 rounded shadow"
        >
        {month}
        </button>
      ))}

      </div>

    </div>

  );

}

export default Home;