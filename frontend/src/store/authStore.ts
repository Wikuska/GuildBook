import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const decodeUserId = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Number(payload.sub) || null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      isAuthenticated: false,

      setToken: (token) =>
        set({
          token,
          userId: decodeUserId(token),
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          token: null,
          userId: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "guildbook-auth",
    },
  ),
);
