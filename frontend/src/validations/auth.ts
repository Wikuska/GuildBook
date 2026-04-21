import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, `At least 3 characters`)
      .max(50, `Max 50 characters`),
    email: z.email("Invalid email"),
    password: z
      .string()
      .min(6, `At least 6 characters`)
      .max(72, `Max 72 characters`),
    confirmPassword: z.string(),
    race_id: z.number().min(1, "Please choose your race"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
