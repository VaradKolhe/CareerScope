import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import Context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext); // Use Real User Data
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getLinkClass = (path, isMobile = false) => {
    const base = isMobile
      ? "block px-4 py-3 rounded-lg text-base font-medium transition-colors"
      : "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";

    const active =
      "bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20";
    const inactive = "text-slate-400 hover:text-cyan-400 hover:bg-slate-800";

    return `${base} ${isActive(path) ? active : inactive}`;
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-3"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center text-slate-900 font-black text-xl shadow-lg shadow-cyan-500/20">
                C
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-100">
                Career<span className="text-cyan-400">Scope</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/quiz-u10" className={getLinkClass("/quiz-u10")}>
              Stream Quiz
            </Link>

            {user && (
              <Link to="/profile" className={getLinkClass("/profile")}>
                Dashboard
              </Link>
            )}

            <div className="h-6 w-px bg-slate-700 mx-4"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="px-5 py-2 text-sm font-bold text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button (omitted for brevity, keep existing code) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 focus:outline-none"
            >
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown (Keep structure but update logic) */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 shadow-2xl absolute w-full left-0">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <Link
              to="/"
              className={getLinkClass("/", true)}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/quiz-u10"
              className={getLinkClass("/quiz-u10", true)}
              onClick={() => setIsOpen(false)}
            >
              Stream Quiz
            </Link>

            {user && (
              <Link
                to="/profile"
                className={getLinkClass("/profile", true)}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}

            <div className="pt-4 mt-2 border-t border-slate-800">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-center px-4 py-3 text-base font-bold text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800"
                >
                  Logout ({user.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center px-4 py-3 text-base font-bold text-slate-900 bg-cyan-400 rounded-lg hover:bg-cyan-300 cursor-pointer shadow-lg shadow-cyan-500/20"
                  onClick={() => setIsOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
