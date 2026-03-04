import { NavLink } from "react-router-dom";

export default function Header() {
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
        <a
          href="/profile"
          className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-stone-200 hover:ring-rose-300 transition-all duration-200 flex items-center justify-center"
        >
          <img
            src="../../public/user.png"
            alt="User Icon"
            className="w-full h-full object-cover"
          />
        </a>
      </nav>
    </header>
  );
}
