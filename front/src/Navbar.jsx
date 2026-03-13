import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="max-w-6xl mx-auto flex gap-4">

        <Link to="/" className="font-semibold">
          Home
        </Link>

        <Link to="/search">
          Search
        </Link>


        <Link to="/statistics/2026">
          Statistics
        </Link>

      </div>
    </nav>
  );
}

export default Navbar;