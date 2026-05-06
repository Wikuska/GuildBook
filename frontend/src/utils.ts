import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatMembershipDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export type FeedSection = "feed" | "market" | "help" | "contracts";
export type MaybeFeedSection = FeedSection | null;

export const CATEGORY_TO_SECTION: Record<string, FeedSection> = {
  discussion: "feed",
  announcement: "feed",
  event: "feed",
  market: "market",
  help_request: "help",
  contract: "contracts",
};

export const getSectionFromCategory = (category: string): MaybeFeedSection =>
  CATEGORY_TO_SECTION[category] ?? null;
