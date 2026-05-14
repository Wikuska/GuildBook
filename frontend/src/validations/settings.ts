import { z } from "zod";

export const updateUserProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .optional()
    .or(z.literal("")),

  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),

  avatar_url: z
    .string()
    .max(500, "URL must be at most 500 characters")
    .optional(),

  banner_url: z
    .string()
    .max(500, "URL must be at most 500 characters")
    .optional(),

  location: z
    .string()
    .max(100, "Location must be at most 100 characters")
    .optional(),
});

export type UpdateUserProfileFormValues = z.infer<
  typeof updateUserProfileSchema
>;

export const changeEmailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: z
      .string()
      .min(6, `At least 6 characters`)
      .max(72, `Max 72 characters`),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
