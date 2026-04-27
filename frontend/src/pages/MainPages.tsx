import { PostFeed } from "../components/posts/PostFeed";

export function FeedPage() {
  return <PostFeed endpoint="feed" title="Latest scrolls" />;
}

export function MarketPage() {
  return <PostFeed endpoint="feed/market" title="Market scrolls" />;
}

export function HelpPage() {
  return <PostFeed endpoint="feed/help" title="In need of help" />;
}

export function ContractsPage() {
  return <PostFeed endpoint="feed/contracts" title="Active contracts" />;
}
