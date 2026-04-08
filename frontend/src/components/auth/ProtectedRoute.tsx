import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Topbar } from "../nav/Topbar";
import { useLocation } from "react-router-dom";

export function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  const { pathname } = useLocation();
  useCurrentUser();

  if (!token) return <Navigate to="/auth" replace />;

  const activePage = pathname.slice(1);

  return (
    <div className="min-h-screen bg-deep">
      <Topbar activePage={activePage} />
      <Outlet />
    </div>
  );
}
