/* Google sign-in button for student login */

import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "@/api/auth";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function StudentLogin({
  setLoading,
}: {
  setLoading: (v: boolean) => void;
}) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        const res = await googleAuth(tokenResponse.access_token, "student");

        login(res.token, res.user);

        const isNewUser = res.isNewUser;
        const openOnBoarding = isNewUser ? true : !res.user?.is_onboarded;

        if (openOnBoarding) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error("Google login failed", err);
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      console.error("Login Failed");
    },
  });

  return (
    <button
      className="group w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 focus:outline-none focus:ring-4 hover:border-blue-600 hover:bg-blue-50/30 focus:ring-blue-100"
      onClick={() => googleLogin()}
    >
      {/* Google Icon */}
      <div
        className="flex items-center justify-center"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#FFF",
          boxShadow:
            "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)",
          flexShrink: 0,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.04 8.16666C15.04 7.64666 14.9933 7.14666 14.9067 6.66666H8V9.50666H11.9467C11.7733 10.42 11.2533 11.1933 10.4733 11.7133V13.56H12.8533C14.24 12.28 15.04 10.4 15.04 8.16666Z"
            fill="#4285F4"
          />
          <path
            d="M8.00004 15.3333C9.98004 15.3333 11.64 14.68 12.8534 13.56L10.4734 11.7133C9.82004 12.1533 8.9867 12.42 8.00004 12.42C6.09337 12.42 4.47337 11.1333 3.89337 9.39999H1.45337V11.2933C2.66004 13.6867 5.13337 15.3333 8.00004 15.3333Z"
            fill="#34A853"
          />
          <path
            d="M3.89329 9.39332C3.74663 8.95332 3.65996 8.48665 3.65996 7.99998C3.65996 7.51332 3.74663 7.04665 3.89329 6.60665V4.71332H1.45329C0.953293 5.69998 0.666626 6.81332 0.666626 7.99998C0.666626 9.18665 0.953293 10.3 1.45329 11.2867L3.89329 9.39332Z"
            fill="#FBBC05"
          />
          <path
            d="M8.00004 3.58666C9.08004 3.58666 10.04 3.95999 10.8067 4.67999L12.9067 2.57999C11.6334 1.39332 9.98004 0.666656 8.00004 0.666656C5.13337 0.666656 2.66004 2.31332 1.45337 4.71332L3.89337 6.60666C4.47337 4.87332 6.09337 3.58666 8.00004 3.58666Z"
            fill="#EA4335"
          />
        </svg>
      </div>
      <span className="font-black text-sm uppercase tracking-widest text-gray-700 group-hover:text-blue-900">
        Sign in as student
      </span>
    </button>
  );
}
