import { useNavigate } from "react-router-dom";

function Dashboard() {

  const navigate = useNavigate();

  return (

    <div className="p-4 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Admin Dashboard
      </h1>

      <button
        onClick={()=>navigate("/admin/add")}
        className="w-full bg-green-500 text-white p-3 rounded"
      >
        Add Jammat
      </button>

    </div>

  );

}

export default Dashboard;