import { apiFetch } from "./client";
import { type RaceResponse } from "./lookup";
import { type UpdateUserProfileFormValues } from "../validations/settings";
import type {
  ChangeEmailFormValues,
  ChangePasswordFormValues,
} from "../validations/settings";

interface FeedProfileResponse {
  id: number;
  username: string;
  race: RaceResponse;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
}

interface UserProfileSettingsResponse {
  email: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
}

export const fetchFeedProfile = () => {
  return apiFetch<FeedProfileResponse>("/me/feed-profile", {
    method: "GET",
  });
};

export const fetchProfileSettings = () => {
  return apiFetch<UserProfileSettingsResponse>("/me");
};

export const updateProfileSettings = (data: UpdateUserProfileFormValues) => {
  return apiFetch<UserProfileSettingsResponse>("/me", {
    method: "PATCH",
    body: data,
  });
};

export const changeEmail = (data: ChangeEmailFormValues) => {
  return apiFetch("/me/change-email", {
    method: "POST",
    body: data,
  });
};

export const changePassword = (data: ChangePasswordFormValues) => {
  return apiFetch("/me/change-password", {
    method: "POST",
    body: data,
  });
};
