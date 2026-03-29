import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        <img src="/jammat-logo.svg" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h1>
        <button onClick={() => navigate("/admin/dashboard")}
          className="w-full bg-emerald-700 text-white py-3 rounded-xl font-bold">
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
