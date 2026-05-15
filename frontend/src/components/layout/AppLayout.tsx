import { Outlet, useLocation } from "react-router-dom";
import { useCallback, useRef } from "react";
import type {
  SseNewMessageEvent,
  SseNewPostEvent,
  SseNotificationEvent,
} from "../../hooks/events";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { CreatePostModal } from "../modals/CreatePostModal";
import { ChatWindowContainer } from "../chat/ChatWindowContainer";
import { useAuthStore } from "../../store/authStore";
import { useLiveEvents } from "../../hooks/events";
import { useQueryClient } from "@tanstack/react-query";
import { useFeedStore } from "../../store/feedStore";
import { getSectionFromCategory } from "../../utils";
import { toast } from "sonner";
import { useChatStore } from "../../store/useChatStore";

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const recentCommentToasts = useRef<Set<number>>(new Set());

  const { setNewPostsFlag } = useFeedStore();

  const handleNewPost = useCallback(
    (event: SseNewPostEvent) => {
      const section = getSectionFromCategory(event.category);
      if (section) setNewPostsFlag(section, true);
    },
    [setNewPostsFlag],
  );

  const handleNewMessage = useCallback(
    (event: SseNewMessageEvent) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      const currentOpenChats = useChatStore.getState().openConversationIds;

      if (!currentOpenChats.includes(event.conversation_id)) {
        toast(`${event.sender_name}: ${event.snippet}`, {
          action: {
            label: "Reply",
            onClick: () => {
              useChatStore.getState().openConversation(event.conversation_id);
            },
          },
        });
      }
    },
    [queryClient],
  );

  const handleNotification = useCallback(
    (event: SseNotificationEvent) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      if (event.action === "user_follow") {
        const actorId = event.actor_id;
        if (!actorId) return;

        toast(`${event.actor_name} started following you`, {
          action: {
            label: "Profile",
            onClick: () => {
              navigate(`/profile/${actorId}`);
            },
          },
        });
      }

      if (event.action === "post_comment") {
        const postId = event.post_id;
        if (!postId) return;

        if (!recentCommentToasts.current.has(postId)) {
          recentCommentToasts.current.add(postId);

          toast(`${event.actor_name} commented on your post`, {
            action: {
              label: "View",
              onClick: () => {
                navigate(`/post/${postId}`, {
                  state: { background: location, feedQueryKey: null },
                });
              },
            },
          });

          setTimeout(() => {
            if (recentCommentToasts.current) {
              recentCommentToasts.current.delete(postId);
            }
          }, 10_000);
        }
      }
    },
    [queryClient],
  );

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
        <main id="main-scroll-container" className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
        <ChatWindowContainer />
        <CreatePostModal />
      </div>
    </div>
  );
}
