import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({
  isAuthencated,
  user,
  requiredRole,
  children,
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
    // 🔥 Redirect based on role
    if (user?.role === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "Manager") {
      return <Navigate to="/manager/dashboard" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}