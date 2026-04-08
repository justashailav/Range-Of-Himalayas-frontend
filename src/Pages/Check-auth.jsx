import { Navigate, useLocation, Outlet } from "react-router-dom";

export default function CheckAuth({
  isAuthencated,
  user,
  requiredRole,
}) {
  const location = useLocation();

  /* ---------------- NOT LOGGED IN ---------------- */
  if (
    !isAuthencated &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/register")
  ) {
    return <Navigate to="/login" replace />;
  }

  /* ---------------- ALREADY LOGGED IN ---------------- */
  if (
    isAuthencated &&
    (location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/register"))
  ) {
    if (user?.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "Manager") {
      return <Navigate to="/manager/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  /* ---------------- ROLE PROTECTION ---------------- */
  if (isAuthencated && requiredRole && user?.role !== requiredRole) {
    if (user?.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "Manager") {
      return <Navigate to="/manager/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <Outlet />; // ✅ IMPORTANT
}