import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* Logo + Brand */}
      <div className="flex items-center gap-2.5">
        <img
          src="../../public/closet.png"
          alt="Closet AI Logo"
          className="w-9 h-9 object-contain"
        />
        <span className="text-lg font-semibold tracking-tight text-stone-800">
          Closet AI
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-1">
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            }`
          }
        >
          Chat
        </NavLink>
        <NavLink
          to="/closet"
          className={({ isActive }) =>
            `text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 ${
              isActive
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            }`
          }
        >
          My Closet
        </NavLink>

        {/* Divider */}
        <div className="w-px h-5 bg-stone-200 mx-2" />

        {/* Profile */}
        <div>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-stone-200 hover:ring-rose-300 transition-all duration-200 flex items-center justify-center"
          >
            <img
              src="../../public/user.png"
              alt="User Icon"
              className="w-full h-full object-cover"
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-stone-200 rounded-2xl shadow-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-stone-100">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-medium">
                  Account
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-all duration-200 flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
