import { useChatStore } from "../../store/useChatStore";
import { ChatWindow } from "./ChatWindow";

export function ChatWindowContainer() {
  const { openConversationIds } = useChatStore();

  if (openConversationIds.length === 0) return null;

  return (
    <>
      {openConversationIds.map((id, index) => (
        <ChatWindow key={id} conversationId={id} index={index} />
      ))}
    </>
  );
}
