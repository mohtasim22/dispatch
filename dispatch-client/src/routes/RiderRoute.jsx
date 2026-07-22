// src/routes/RiderRoute.jsx — same shape, allows rider OR admin
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading)
    return <div className="min-h-[60vh] grid place-items-center"><span className="loading loading-spinner loading-lg text-teal-500" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role !== "rider" && role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};

export default RiderRoute;
