import z from "zod";

export const RegisterSchema = z
  .object({
    email: z.email().max(100),

    username: z
      .string()
      .max(32)
      .regex(/^[a-zA-Z0-9_.-]+$/, "Use only letters and numbers"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must have less than 32 characters"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
