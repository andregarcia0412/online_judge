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
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Use uppercase and lowercase letters, numbers and symbols"
      ),

    confirmPassword: z
      .string()
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
        "Use uppercase and lowercase letters, numbers and symbols"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;
