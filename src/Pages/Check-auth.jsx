// import { Navigate, useLocation } from "react-router-dom";

// export default function CheckAuth({ isAuthenticated, user, children }) {
//   const location = useLocation();
//   console.log(location.pathname, isAuthenticated);

//   if (location.pathname === "/") {
//     if (!isAuthenticated) {
//       return <Navigate to="/login" />;
//     } else {
//       if (user?.role === "Admin") { 
//         return <Navigate to="/admin/dashboard" />;
//       } else {
//         return <Navigate to="/" />;
//       }
//     }
//   }

//   if (
//     !isAuthenticated &&
//     !(
//       location.pathname.includes("/login") ||
//       location.pathname.includes("/register")
//     )
//   ) {
//     return <Navigate to="/login" />;
//   }

//   if (
//     isAuthenticated &&
//     (location.pathname.includes("/login") || location.pathname.includes("/register"))
//   ) {
//     if (user?.role === "Admin") {
//       return <Navigate to="/admin/dashboard" />;
//     } else {
//       return <Navigate to="/" />;
//     }
//   }
//   if (
//     isAuthenticated &&
//     user?.role !== "Admin" &&    
//     location.pathname.startsWith("/admin")
//   ) {
//     // return <Navigate to="/unauth-page" replace />;
//   }

//   return <>{children}</>;
// }


import { Navigate, useLocation } from "react-router-dom";

export default function CheckAuth({ isAuthencated, user, requiredRole, children }) {
  const location = useLocation();
 
  if (
    !isAuthencated &&
    !location.pathname.startsWith("/login") &&
    !location.pathname.startsWith("/register")
  ) {
    return <Navigate to="/login" replace />;
  }

  // Redirect authenticated users away from login/register
  if (
    isAuthencated &&
    (location.pathname.startsWith("/login") || location.pathname.startsWith("/register"))
  ) {
    if (user?.role === "Admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // Role-based access control
  if (
    isAuthencated &&
    requiredRole &&
    user?.role !== requiredRole
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
