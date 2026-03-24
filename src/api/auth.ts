import { api } from "@/lib/api";

export const teacherLogin = async (email: string, password: string) => {
  const res = await api.post("/admin/teacher-login", {
    email,
    password,
  });
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
