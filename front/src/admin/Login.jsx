import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const login = async () => {
    if (!username || !password) return alert("Please enter both fields");
    setLoading(true);
    try {
      const res = await API.post("/admin/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Invalid Username or Password");
    }
    setLoading(false);
  };

  const handleKey = (e) => { if (e.key === "Enter") login(); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur mb-4 shadow-lg">
            <img src="/jammat-logo.svg" alt="Logo" className="w-14 h-14" />
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight">Valod Jammat</h1>
          <p className="text-emerald-300 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="text-gray-800 font-bold text-lg mb-5 text-center">Sign In</h2>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKey}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKey}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full mt-6 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white py-3 rounded-xl font-bold text-base transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span> Signing in...</>
            ) : "Sign In →"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition py-2"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
