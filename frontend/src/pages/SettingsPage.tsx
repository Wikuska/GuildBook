import { Link, useLocation, Outlet } from "react-router-dom";

export function SettingsPage() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-bg-deep text-text-mid font-sans">
      <div className="mx-auto flex w-full max-w-360 flex-col border-x border-border-base shadow-2xl">
        {/* Settings Header */}
        <div className="border-b border-border-base p-8 bg-bg-deep/50">
          <h1 className="text-3xl font-bold text-text-light uppercase tracking-wider">
            Settings
          </h1>
          <p className="text-sm mt-2 text-text-mid">
            Manage your guild profile and account details.
          </p>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT COLUMN: Settings Navigation Sidebar */}
          <aside className="w-64 border-r border-border-base p-4 flex flex-col gap-2">
            <Link
              to="/settings/profile"
              className={`px-4 py-2 rounded transition-all duration-200 text-sm font-medium ${
                location.pathname === "/settings/profile"
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-text-mid hover:bg-bg-light/5 hover:text-text-light border border-transparent"
              }`}
            >
              Profile
            </Link>
            <Link
              to="/settings/account"
              className={`px-4 py-2 rounded transition-all duration-200 text-sm font-medium ${
                location.pathname === "/settings/account"
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-text-mid hover:bg-bg-light/5 hover:text-text-light border border-transparent"
              }`}
            >
              Account & Security
            </Link>
          </aside>

          {/* RIGHT COLUMN: Outlet */}
          <div className="flex-1 flex justify-center p-8 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-2xl">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
