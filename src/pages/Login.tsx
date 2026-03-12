import { useState } from "react";
import brain from "@/assets/brain.svg";
import { useGoogleLogin } from "@react-oauth/google";

type Role = "student" | "teacher";

export default function Login() {
  const [role, setRole] = useState<Role>("student");

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`,
      );

      const user = await res.json();

      console.log("User:", user);
      console.log("Role:", role);
      console.log("Token Response:", tokenResponse);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", tokenResponse.access_token);
      localStorage.setItem("role", role);

      // send to backend later
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div
      className="min-h-screen w-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#F9FAFB" }}>
      {/* Background blurred circles */}
      <div className="absolute pointer-events-none  w-[24rem] h-96 rounded-full bg-blue-100/50 blur-3xl -right-24 -top-48" />
      <div className="absolute pointer-events-none w-[24rem] h-96 rounded-full bg-blue-100/50 blur-3xl -left-48 -bottom-48" />

      {/* Card */}
      <div className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 text-center relative z-10">
        {/* Brain Icon */}
        <div className="w-20 h-20 bg-blue-900 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-100 transition-colors duration-300">
          <img
            src={brain}
            alt="Brain Icon"
            style={{
              width: 40,
              height: 40,
            }}
          />
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h1 className="text-3xl! font-black! text-gray-900! mb-3! mt-0! tracking-tight!">SmartLearn AI</h1>
          <p className="text-gray-500 font-medium!">
            Join the next generation of learners. <br className="hidden sm:block" />
            Experience AI-powered education.
          </p>
        </div>

        {/* Student / Teacher Toggle */}
        <div className="flex w-full bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200 shadow-inner">
          {/* Student Tab */}
          <button
            onClick={() => setRole("student")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white text-blue-900 shadow-sm"
            style={{
              background: role === "student" ? "#FFF" : "transparent",
              boxShadow: role === "student" ? "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)" : "none",
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_student)">
                <path
                  d="M8 4.66666V14"
                  stroke={role === "student" ? "#1C398E" : "#99A1AF"}
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.00004 12C1.82323 12 1.65366 11.9298 1.52864 11.8047C1.40361 11.6797 1.33337 11.5101 1.33337 11.3333V2.66667C1.33337 2.48986 1.40361 2.32029 1.52864 2.19526C1.65366 2.07024 1.82323 2 2.00004 2H5.33337C6.04062 2 6.7189 2.28095 7.21899 2.78105C7.71909 3.28115 8.00004 3.95942 8.00004 4.66667C8.00004 3.95942 8.28099 3.28115 8.78109 2.78105C9.28119 2.28095 9.95946 2 10.6667 2H14C14.1769 2 14.3464 2.07024 14.4714 2.19526C14.5965 2.32029 14.6667 2.48986 14.6667 2.66667V11.3333C14.6667 11.5101 14.5965 11.6797 14.4714 11.8047C14.3464 11.9298 14.1769 12 14 12H10C9.46961 12 8.9609 12.2107 8.58583 12.5858C8.21075 12.9609 8.00004 13.4696 8.00004 14C8.00004 13.4696 7.78933 12.9609 7.41425 12.5858C7.03918 12.2107 6.53047 12 6.00004 12H2.00004Z"
                  stroke={role === "student" ? "#1C398E" : "#99A1AF"}
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_student">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span
              style={{
                color: role === "student" ? "#1C398E" : "#99A1AF",
              }}>
              Student
            </span>
          </button>

          {/* Teacher Tab */}
          <button
            onClick={() => setRole("teacher")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white text-blue-900 shadow-sm"
            style={{
              background: role === "teacher" ? "#FFF" : "transparent",
              boxShadow: role === "teacher" ? "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)" : "none",
            }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14.28 7.28134C14.3993 7.22869 14.5006 7.14218 14.5713 7.03254C14.6419 6.9229 14.6789 6.79493 14.6775 6.6645C14.6762 6.53406 14.6366 6.40689 14.5637 6.29873C14.4908 6.19057 14.3877 6.10617 14.2673 6.056L8.55332 3.45334C8.37961 3.3741 8.19091 3.3331 7.99999 3.3331C7.80906 3.3331 7.62036 3.3741 7.44665 3.45334L1.73332 6.05334C1.61463 6.10532 1.51366 6.19076 1.44277 6.29921C1.37187 6.40767 1.33411 6.53443 1.33411 6.664C1.33411 6.79358 1.37187 6.92034 1.44277 7.02879C1.51366 7.13725 1.61463 7.22269 1.73332 7.27467L7.44665 9.88C7.62036 9.95924 7.80906 10.0002 7.99999 10.0002C8.19091 10.0002 8.37961 9.95924 8.55332 9.88L14.28 7.28134Z"
                stroke={role === "teacher" ? "#1C398E" : "#99A1AF"}
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.6667 6.66666V10.6667"
                stroke={role === "teacher" ? "#1C398E" : "#99A1AF"}
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 8.33334V10.6667C4 11.1971 4.42143 11.7058 5.17157 12.0809C5.92172 12.456 6.93913 12.6667 8 12.6667C9.06087 12.6667 10.0783 12.456 10.8284 12.0809C11.5786 11.7058 12 11.1971 12 10.6667V8.33334"
                stroke={role === "teacher" ? "#1C398E" : "#99A1AF"}
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                color: role === "teacher" ? "#1C398E" : "#99A1AF",
              }}>
              Teacher
            </span>
          </button>
        </div>

        {/* Sign In Button + Terms */}
        <div className="space-y-6">
          {/* Google Sign In Button */}
          <button
            className="group w-full bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 focus:outline-none focus:ring-4 hover:border-blue-600 hover:bg-blue-50/30 focus:ring-blue-100"
            onClick={() => googleLogin()}>
            {/* Google Icon */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#FFF",
                boxShadow: "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)",
                flexShrink: 0,
              }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              Sign in as {role}
            </span>
          </button>

          {/* Terms */}
          <div
            className="text-[10px] text-gray-400 font-bold! uppercase tracking-widest leading-loose"
            style={{ gap: 0 }}>
            <p className="text-center">By continuing, you agree to our</p>
            <p className="text-center">
              <a href="#" className="text-blue-900 cursor-pointer">
                Terms of Service
              </a>
              <span style={{ color: "#99A1AF" }}> and </span>
              <a href="#" className="text-blue-900 cursor-pointer">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Footer divider + social proof */}
        <div className="mt-12 pt-8 border-t border-gray-50">
          <div className="flex items-center justify-center gap-3">
            {/* Stacked Avatars */}
            <div className="flex -space-x-2">
              {[0, 16, 32].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                  <div className=" bg-gray-100 text-center align-middle flex items-center justify-center w-full h-full">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="7" r="4" fill="#C8CDD6" />
                      <path d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#C8CDD6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Label */}
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              50k+ students already joined
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
