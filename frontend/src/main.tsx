import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: Error) => {
        if (error instanceof ApiError && error.status < 500) return;
        toast.error("Connection failed", {
          id: "global-network-error",
          description:
            "The gates of the database are closed. Check your internet connection.",
          duration: Infinity,
        });
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="bottom-left" richColors theme="dark" closeButton />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/feed/market" element={<MarketPage />} />
              <Route path="/feed/help" element={<HelpPage />} />
              <Route path="/feed/contracts" element={<ContractsPage />} />
              <Route path="/profile/:id" element={<UserProfile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
