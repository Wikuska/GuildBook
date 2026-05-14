import { apiFetch } from "./client";
import { type UpdateUserProfileFormValues } from "../validations/settings";
import type {
  ChangeEmailFormValues,
  ChangePasswordFormValues,
} from "../validations/settings";

interface UserProfileSettingsResponse {
  email: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
}

export const fetchProfileSettings = () => {
  return apiFetch<UserProfileSettingsResponse>("/auth/me");
};

export const updateProfileSettings = (data: UpdateUserProfileFormValues) => {
  return apiFetch<UserProfileSettingsResponse>("/users/me", {
    method: "PATCH",
    body: data,
  });
};

export const changeEmail = (data: ChangeEmailFormValues) => {
  return apiFetch("/users/me/change-email", {
    method: "POST",
    body: data,
  });
};

export const changePassword = (data: ChangePasswordFormValues) => {
  return apiFetch("/users/me/change-password", {
    method: "POST",
    body: data,
  });
};
