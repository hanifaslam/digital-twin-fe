import z from "zod";

export const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export const createPasswordSchema = () =>
  z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      passwordRegex,
      "Password must contain uppercase, lowercase, number, and special character",
    );

export const passwordSchema = createPasswordSchema(); // fallback

export type Password = z.infer<ReturnType<typeof createPasswordSchema>>;
