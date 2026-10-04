import { api } from "@/lib/api";

export const teacherLogin = async (email: string, password: string) => {
  const res = await api.post("/api/auth/teacher-login", {
    email,
    password,
  });
  return res.data;
};

export const forgotPassword = async (email: string) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const verifyOtp = async (email: string, otp: string) => {
  const res = await api.post("/auth/verify-otp", { email, otp });
  return res.data;
};

export const resendOtp = async (email: string) => {
  const res = await api.post("/auth/resend-otp", { email });
  return res.data;
};

export const googleAuth = async (token: string, role: string) => {
  const res = await api.post(
    "/auth/google",
    {
      token,
      role,
    },
    {
      headers: {
        Authorization: `${token}`,
      },
    },
  );

  return res.data;
};

/* ---------------- v2 auth ---------------- */

/** Logs in with a Google OAuth access token. */
export const googleLoginV2 = async (credential: string) => {
  const res = await api.post("/api/v2/auth/google", { credential });
  return res.data;
};

/** Logs in with email + password. */
export const emailLoginV2 = async (email: string, password: string) => {
  const res = await api.post("/api/v2/auth/login", { email, password });
  return res.data;
};
