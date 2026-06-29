import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedAdmin() {
  const loggedIn =
    localStorage.getItem("admin-auth") === "true";

  if (!loggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return <Outlet />;
}