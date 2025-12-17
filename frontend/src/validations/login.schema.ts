import z from "zod";

export const LoginSchema = z.object({
  email: z.email().max(100),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must have less than 32 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
