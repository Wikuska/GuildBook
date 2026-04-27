import { Outlet } from "react-router-dom";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { CreatePostModal } from "../modals/CreatePostModal";
import { PostViewModal } from "../modals/PostViewModal";

export function AppLayout() {
  return (
    <div className="flex h-screen flex-col bg-bg-deep">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
        <CreatePostModal />
        <PostViewModal />
      </div>
    </div>
  );
}
