import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import {
  changeEmailSchema,
  type ChangeEmailFormValues,
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../validations/settings";
import {
  useProfileSettings,
  useChangeEmail,
  useChangePassword,
} from "../hooks/settings";

export function AccountSettings() {
  const { data: user, isLoading } = useProfileSettings();

  const { mutate: changeEmail, isPending: isChangingEmail } = useChangeEmail();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const emailForm = useForm<ChangeEmailFormValues>({
    resolver: zodResolver(changeEmailSchema),
    values: {
      new_email: user?.email || "",
    },
  });

  const onEmailSubmit = (values: ChangeEmailFormValues) => {
    changeEmail(values);
  };

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onPasswordSubmit = (values: ChangePasswordFormValues) => {
    changePassword(values, {
      onSuccess: () => passwordForm.reset(),
    });
  };

  return (
    <div className=" flex flex-col gap-12">
      <section>
        <h2 className="text-xl text-text-mid font-bold text-text-light mb-4">
          Email Address
        </h2>
        {isLoading ? (
          <div className="h-24 bg-border-base rounded animate-pulse w-full opacity-20"></div>
        ) : (
          <form
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
            className="flex flex-col gap-4 bg-bg-deep p-6 border border-border-base rounded-lg"
          >
            <Input
              label="Current Email"
              type="email"
              error={emailForm.formState.errors.new_email?.message}
              containerClassName="mb-0"
              {...emailForm.register("new_email")}
            />
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isChangingEmail}
                className="w-auto px-5 mt-0 "
                variant="subtle"
              >
                {isChangingEmail ? "Updating..." : "Update Email"}
              </Button>
            </div>
          </form>
        )}
      </section>

      <section>
        <h2 className="text-xl text-text-mid font-bold text-text-light mb-4">
          Change Password
        </h2>
        <form
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          className="flex flex-col gap-4 bg-bg-deep p-6 border border-border-base rounded-lg"
        >
          <Input
            label="Old Password"
            type="password"
            error={passwordForm.formState.errors.old_password?.message}
            containerClassName="mb-0"
            {...passwordForm.register("old_password")}
          />

          <Input
            label="New Password"
            type="password"
            error={passwordForm.formState.errors.new_password?.message}
            containerClassName="mb-0 "
            {...passwordForm.register("new_password")}
          />

          <Input
            label="Confirm New Password"
            type="password"
            error={passwordForm.formState.errors.confirm_password?.message}
            containerClassName="mb-0"
            {...passwordForm.register("confirm_password")}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-auto px-5 mt-0"
              variant="danger"
            >
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
