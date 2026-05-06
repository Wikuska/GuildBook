import { useLocation } from "react-router-dom";
import type { MaybeFeedSection } from "../../utils";

export function useCurrentSection(): MaybeFeedSection {
  const { pathname } = useLocation();

  if (pathname === "/feed") return "feed";
  if (pathname.includes("/feed/market")) return "market";
  if (pathname.includes("/feed/help")) return "help";
  if (pathname.includes("/feed/contracts")) return "contracts";

  return null;
}
