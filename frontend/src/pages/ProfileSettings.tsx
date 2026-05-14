import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateUserProfileSchema,
  type UpdateUserProfileFormValues,
} from "../validations/settings";
import {
  useProfileSettings,
  useUpdateProfileSettings,
} from "../hooks/settings";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function ProfileSettings() {
  const { data: user, isLoading: isFetching } = useProfileSettings();
  const { mutate: updateUserSettings, isPending: isUpdating } =
    useUpdateProfileSettings();

  const form = useForm<UpdateUserProfileFormValues>({
    resolver: zodResolver(updateUserProfileSchema),
    values: {
      username: user?.username || "",
      bio: user?.bio || "",
      location: user?.location || "",
      avatar_url: user?.avatar_url || "",
      banner_url: user?.banner_url || "",
    },
  });

  const bioValue = form.watch("bio") || "";

  const onSubmit = (values: UpdateUserProfileFormValues) => {
    updateUserSettings(values);
  };

  return (
    <div>
      <h2 className="text-xl text-text-mid font-bold text-text-light mb-6">
        Edit Profile
      </h2>

      {isFetching ? (
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-border-base rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-border-base rounded"></div>
              <div className="h-4 bg-border-base rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div>
            <Input
              label="Avatar URL"
              placeholder="https://example.com/your-avatar.jpg"
              error={form.formState.errors.avatar_url?.message}
              containerClassName="mb-1"
              {...form.register("avatar_url")}
            />
            <p className="text-xs text-text-mid">
              Paste a direct link to your avatar image.
            </p>
          </div>

          <div>
            <Input
              label="Banner URL"
              placeholder="https://example.com/your-banner.jpg"
              error={form.formState.errors.banner_url?.message}
              containerClassName="mb-1"
              {...form.register("banner_url")}
            />
            <p className="text-xs text-text-mid">
              Paste a direct link to your profile banner image.
            </p>
          </div>

          <div className="pt-4 border-t border-border-base">
            <Input
              label="Username"
              error={form.formState.errors.username?.message}
              containerClassName="mb-0"
              {...form.register("username")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="block text-[11px] uppercase tracking-[1.5px] text-text-mid">
              Bio
            </label>
            <textarea
              {...form.register("bio")}
              className="bg-bg-input border border-border-base rounded p-3 text-[14px] text-parchment h-32 resize-none focus:border-gold outline-none transition-all custom-scrollbar placeholder:text-text-dim"
              placeholder="Write your character's backstory..."
            />
            <span
              className={`text-xs  ${
                bioValue.length >= 500 ? "text-red-500" : "text-text-mid"
              }`}
            >
              {bioValue.length}/500
            </span>
            {form.formState.errors.bio && (
              <span className="text-red-500 text-[11px]">
                {form.formState.errors.bio.message}
              </span>
            )}
          </div>

          <div>
            <Input
              label="Location"
              placeholder="e.g., The Northern Realms"
              error={form.formState.errors.location?.message}
              containerClassName="mb-0"
              {...form.register("location")}
            />
          </div>

          <div className="pt-5 border-t border-border-base">
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-auto px-5 mt-0 "
              variant="subtle"
            >
              {isUpdating ? "Saving Scrolls..." : "Save Changes"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
