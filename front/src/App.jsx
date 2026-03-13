import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import MonthPage from "./pages/MonthPage";
import JammatDetail from "./pages/JammatDetail";

import Login from "./admin/Login";
import AddJammat from "./admin/AddJammat";
import SearchPage from "./pages/SearchPage";
import StatisticsPage from "./pages/StatisticsPage";
import MonthStats from "./pages/MonthStats";
import EditJammat from "./admin/EditJammat";
import AdminDashboard from "./admin/AdminDashboard";
import YearStatistics from "./pages/YearStatistics";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/month/:year/:month" element={<MonthPage />} />
        <Route path="/jammat/:id" element={<JammatDetail />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/statistics/:year/:month" element={<MonthStats />} />
        <Route path="/statistics/:year" element={<YearStatistics />} />

        {/* Admin */}
        <Route path="/admin/edit/:id" element={<EditJammat />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/add" element={<AddJammat />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;