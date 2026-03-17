import { api } from "@/lib/api";

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
