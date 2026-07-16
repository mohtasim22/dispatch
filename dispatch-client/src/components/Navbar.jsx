import { Link, NavLink } from "react-router";
import Logo from "./Logo";

// Public navbar (logged-out variant). Design only — no auth state yet.
// When auth is wired, swap the Log in / Sign up buttons for a
// notifications bell + avatar dropdown based on `user`.
const Navbar = () => {
  // active link = teal, otherwise muted grey
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-teal-400 font-semibold"
      : "text-gray-400 hover:text-white font-medium";

  const links = (
    <>
      <li>
        <NavLink to="/" className={linkClass} end>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/how" className={linkClass}>
          How it works
        </NavLink>
      </li>
      <li>
        <NavLink to="/coverage" className={linkClass}>
          Coverage
        </NavLink>
      </li>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-gray-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* left: logo */}
        <Logo />

        {/* center: desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm">{links}</ul>

        {/* right: actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-4 py-2 rounded-lg text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 text-sm font-semibold transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold transition-colors"
          >
            Sign up
          </Link>

          {/* mobile menu (CSS-only daisyUI dropdown — no state needed) */}
          <div className="dropdown dropdown-end md:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-sm px-2" aria-label="Menu">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu mt-2 w-44 rounded-box bg-gray-900 shadow border border-gray-800 p-2 text-sm"
            >
              {links}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
