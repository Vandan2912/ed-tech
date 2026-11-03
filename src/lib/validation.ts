import { z } from "zod";

/** Minimum password length — must match the backend rule. */
export const PASSWORD_MIN = 8;

export const passwordMinMessage = `Password must be at least ${PASSWORD_MIN} characters`;

/** Rules for creating a new password; mirrors the backend validation. */
export const PASSWORD_RULES: {
  label: string;
  message: string;
  test: (value: string) => boolean;
}[] = [
  {
    label: `At least ${PASSWORD_MIN} characters`,
    message: passwordMinMessage,
    test: (v) => v.length >= PASSWORD_MIN,
  },
  {
    label: "One uppercase letter",
    message: "Password must contain an uppercase letter",
    test: (v) => /[A-Z]/.test(v),
  },
  {
    label: "One lowercase letter",
    message: "Password must contain a lowercase letter",
    test: (v) => /[a-z]/.test(v),
  },
  {
    label: "One number",
    message: "Password must contain a number",
    test: (v) => /\d/.test(v),
  },
  {
    label: "One special character",
    message: "Password must contain a special character",
    test: (v) => /[^A-Za-z0-9]/.test(v),
  },
];

/** Schema for a newly created password (onboarding, reset password). */
export const newPasswordSchema = z.string().superRefine((value, ctx) => {
  const failed = PASSWORD_RULES.find((rule) => !rule.test(value));
  if (failed) ctx.addIssue({ code: "custom", message: failed.message });
});

/** Schema for entering an existing password at login (length only). */
export const loginPasswordSchema = z
  .string()
  .min(1, "Password is required")
  .min(PASSWORD_MIN, passwordMinMessage);
