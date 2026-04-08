import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({
  isAuthencated,
  user,
  requiredRole,
  children,
}) {
  const location = useLocation();

  console.log("📍 Current Path:", location.pathname);
  console.log("🔐 isAuthencated:", isAuthencated);
  console.log("👤 User:", user);
  console.log("🎭 Role:", user?.role);
  console.log("🛡 Required Role:", requiredRole);

  /* ---------------- NOT LOGGED IN ---------------- */
  if (
    !isAuthencated &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/register")
  ) {
    console.log("❌ Not authenticated → redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  /* ---------------- ALREADY LOGGED IN ---------------- */
  if (
    isAuthencated &&
    (location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/register"))
  ) {
    console.log("✅ Already logged in, checking role...");

    if (user?.role === "Admin") {
      console.log("👑 Admin → redirecting to /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "Manager") {
      console.log("🏬 Manager → redirecting to /manager/dashboard");
      return <Navigate to="/manager/dashboard" replace />;
    }

    console.log("👤 Normal user → redirecting to /");
    return <Navigate to="/" replace />;
  }

  /* ---------------- ROLE PROTECTION ---------------- */
  if (isAuthencated && requiredRole && user?.role !== requiredRole) {
    console.log("🚫 Role mismatch!");
    console.log("User role:", user?.role, "| Required:", requiredRole);

    if (user?.role === "Admin") {
      console.log("👑 Redirecting Admin → /admin/dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user?.role === "Manager") {
      console.log("🏬 Redirecting Manager → /manager/dashboard");
      return <Navigate to="/manager/dashboard" replace />;
    }

    console.log("👤 Redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("✅ Access granted → rendering children");

  return <>{children}</>;
}