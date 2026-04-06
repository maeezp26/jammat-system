import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/jammat-logo.svg" alt="Logo" className="w-9 h-9 rounded-full bg-emerald-700 p-0.5" />
          <span className="font-bold text-base leading-tight">
            <span className="text-yellow-300">Valod</span> Jammat
          </span>
        </Link>
        <div className="hidden sm:flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-yellow-300 transition">Home</Link>
          <Link to="/search" className="hover:text-yellow-300 transition">Search</Link>
          <Link to={"/statistics/" + new Date().getFullYear()} className="hover:text-yellow-300 transition">Stats</Link>
          <Link to="/admin/login" className="bg-yellow-400 text-emerald-900 px-3 py-1 rounded-full font-semibold hover:bg-yellow-300 transition text-xs">Admin</Link>
        </div>
        <button className="sm:hidden p-2 rounded-lg hover:bg-emerald-700 transition" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>
      {open && (
        <div className="sm:hidden bg-emerald-900 border-t border-emerald-700 px-4 py-3 space-y-1 text-sm font-medium">
          <Link to="/" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-300">🏠 Home</Link>
          <Link to="/search" onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-300">🔍 Search Member</Link>
          <Link to={"/statistics/" + new Date().getFullYear()} onClick={() => setOpen(false)} className="block py-2 hover:text-yellow-300">📊 Statistics</Link>
          <Link to="/admin/login" onClick={() => setOpen(false)} className="block py-2 text-yellow-300">🔐 Admin Login</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
