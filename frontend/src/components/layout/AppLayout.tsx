import { Outlet } from "react-router-dom";
import { useCallback } from "react";
import type { SseNewPostEvent } from "../../hooks/events";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { CreatePostModal } from "../modals/CreatePostModal";
import { PostViewModal } from "../modals/PostViewModal";
import { ChatWindowContainer } from "../chat/ChatWindowContainer";
import { useAuthStore } from "../../store/authStore";
import { useLiveEvents } from "../../hooks/events";
import { useQueryClient } from "@tanstack/react-query";
import { useFeedStore } from "../../store/feedStore";
import { getSectionFromCategory } from "../../utils";

export function AppLayout() {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const { setNewPostsFlag } = useFeedStore();

  const handleNewPost = useCallback(
    (event: SseNewPostEvent) => {
      const section = getSectionFromCategory(event.category);
      if (section) setNewPostsFlag(section, true);
    },
    [setNewPostsFlag],
  );

  const handleNewMessage = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  }, [queryClient]);

  const handleNotification = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  useLiveEvents({
    token,
    onNewPost: handleNewPost,
    onNewMessage: handleNewMessage,
    onNotification: handleNotification,
  });

  return (
    <div className="flex h-screen flex-col bg-bg-deep">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
        <ChatWindowContainer />
        <CreatePostModal />
        <PostViewModal />
      </div>
    </div>
  );
}
