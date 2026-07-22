import { Link, NavLink, Outlet } from "react-router";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const handleLogout = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: "success",
        title: "Logged out",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Logout failed", text: error.message });
    }
  };

  const itemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? "bg-teal-600 text-white"
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* sidebar */}
      <aside className="w-60 shrink-0 border-r border-gray-800 bg-gray-900 p-4 hidden md:flex flex-col gap-1">
        <div className="mb-6 px-1">
          <Logo />
        </div>

        <p className="px-3 text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
          Menu
        </p>
        <NavLink to="/dashboard" end className={itemClass}>
          Overview
        </NavLink>
        {role === "user" && (
          <>
            <NavLink to="/dashboard/book" className={itemClass}>
              Book a parcel
            </NavLink>
            <NavLink to="/dashboard/parcels" className={itemClass}>
              My parcels
            </NavLink>
            <NavLink to="/dashboard/payments" className={itemClass}>
              Payments
            </NavLink>
            <NavLink to="/dashboard/be-a-rider" className={itemClass}>
              Become a rider
            </NavLink>
          </>
        )}
        {role === "rider" && (
          <NavLink to="/dashboard/tasks" className={itemClass}>
            Assigned deliveries
          </NavLink>
        )}
        {role === "admin" && (
          <>
            <NavLink to="/dashboard/users" className={itemClass}>
              Manage users
            </NavLink>
            <NavLink to="/dashboard/riders" className={itemClass}>
              Approve riders
            </NavLink>
            <NavLink to="/dashboard/all-parcels" className={itemClass}>
              All parcels
            </NavLink>
          </>
        )}

        <p className="px-3 mt-5 text-[11px] uppercase tracking-wider text-gray-500 font-bold mb-1">
          Account
        </p>
        <NavLink to="/dashboard/profile" className={itemClass}>
          Profile
        </NavLink>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          Back to site
        </Link>

        <button
          onClick={handleLogout}
          className="mt-auto px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-300 hover:bg-rose-500/10 text-left"
        >
          Log out
        </button>
      </aside>

      {/* main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="font-bold">Dashboard</h1>
          <span
            className="text-sm text-gray-400 truncate max-w-40"
            title={user?.email}
          >
            {user?.displayName || user?.email}
          </span>
        </header>

        <main className="flex-1 p-6">
          <Outlet /> {/* ← dashboard pages render here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
