import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AuthPage } from "./pages/AuthPage";
import {
  FeedPage,
  MarketPage,
  HelpPage,
  ContractsPage,
} from "./pages/MainPages";
import UserProfile from "./pages/UserProfile";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { Toaster, toast } from "sonner";
import { ApiError } from "./api/client";
import "./index.css";
import { PostViewModal } from "./components/modals/PostViewModal";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status === 401) return;

        if (error.status < 500) {
          toast.error(error.message, {
            id: "api-error",
            description: "The scrolls reject your request.",
          });
        } else {
          toast.error("Server error", {
            id: "server-error",
            description: "The Great Archive is currently unavailable.",
          });
        }
        return;
      }
      toast.error("Connection failed", {
        id: "global-network-error",
        description:
          "The gates of the database are closed. Check your connection.",
        duration: Infinity,
      });
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          (error.status === 404 || error.status === 403)
        ) {
          return false;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60 * 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 10,
    },

    mutations: {
      retry: 0,
    },
  },
});

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { background?: Location };
  const background = state?.background;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/auth" element={<AuthPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/feed/market" element={<MarketPage />} />
            <Route path="/feed/help" element={<HelpPage />} />
            <Route path="/feed/contracts" element={<ContractsPage />} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/post/:id" element={<PostViewModal />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      {background && (
        <Routes>
          <Route path="/post/:id" element={<PostViewModal />} />
        </Routes>
      )}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="bottom-left" richColors theme="dark" closeButton />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
