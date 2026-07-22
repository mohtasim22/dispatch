// src/routes/AdminRoute.jsx
import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const Spinner = () => (
  <div className="min-h-[60vh] grid place-items-center">
    <span className="loading loading-spinner loading-lg text-teal-500" />
  </div>
);

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) return <Spinner />;              // wait for BOTH
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (role !== "admin") return <Navigate to="/dashboard" replace />;   // logged in, wrong role
  return children;
};

export default AdminRoute;
