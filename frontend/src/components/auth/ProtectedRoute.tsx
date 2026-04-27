import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCurrentUser } from "../../hooks/user";

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  useCurrentUser();

  if (!token) return <Navigate to="/auth" replace />;

  return <Outlet />;
}
