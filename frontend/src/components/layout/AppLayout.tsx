import { Outlet, useLocation } from "react-router-dom"
import { Topbar } from "./Topbar"
import { Sidebar } from "./Sidebar";

export function AppLayout() {
  const { pathname } = useLocation();
  const activePage = pathname.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep">
      <Topbar activePage={activePage} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}