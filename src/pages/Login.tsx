import { useState } from "react";

type Role = "student" | "teacher";

export default function Login() {
  const [role, setRole] = useState<Role>("student");

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "#F9FAFB" }}>
      {/* Background blurred circles */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 384,
          height: 384,
          borderRadius: "50%",
          background: "rgba(219, 234, 254, 0.50)",
          filter: "blur(64px)",
          right: "-96px",
          top: "-192px",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 384,
          height: 384,
          borderRadius: "50%",
          background: "rgba(224, 231, 255, 0.50)",
          filter: "blur(64px)",
          left: "-192px",
          bottom: "-192px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full mx-4 flex flex-col items-center"
        style={{
          maxWidth: 448,
          borderRadius: 40,
          border: "1px solid #F3F4F6",
          background: "#FFF",
          boxShadow: "0 20px 50px 0 rgba(0,0,0,0.05)",
          padding: "41px 41px 0 41px",
        }}>
        {/* Brain Icon */}
        <div
          className="flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            background: "#1C398E",
            boxShadow: "0 20px 25px -5px #DBEAFE, 0 8px 10px -6px #DBEAFE",
            flexShrink: 0,
          }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20 8.33334C20.002 7.66672 19.8706 7.00644 19.6137 6.39134C19.3567 5.77623 18.9794 5.21871 18.5038 4.75158C18.0283 4.28444 17.4641 3.91712 16.8445 3.67122C16.2249 3.42532 15.5623 3.3058 14.8959 3.31969C14.2294 3.33358 13.5724 3.4806 12.9636 3.75211C12.3548 4.02362 11.8064 4.41413 11.3507 4.90068C10.895 5.38722 10.5412 5.95998 10.3101 6.58526C10.079 7.21054 9.9753 7.87571 10.005 8.54167C9.02538 8.79356 8.11588 9.26509 7.34543 9.92052C6.57498 10.576 5.96377 11.3981 5.55812 12.3247C5.15246 13.2514 4.96298 14.2582 5.00402 15.2689C5.04507 16.2796 5.31557 17.2677 5.79504 18.1583C4.95201 18.8432 4.28909 19.7237 3.86394 20.7232C3.4388 21.7227 3.26431 22.811 3.35565 23.8933C3.44699 24.9756 3.8014 26.0193 4.38805 26.9334C4.9747 27.8475 5.77582 28.6044 6.72171 29.1383C6.6049 30.0421 6.67461 30.9601 6.92652 31.8359C7.17843 32.7116 7.6072 33.5264 8.18635 34.2299C8.7655 34.9335 9.48273 35.5108 10.2937 35.9263C11.1048 36.3417 11.9923 36.5866 12.9017 36.6456C13.811 36.7046 14.7228 36.5765 15.5807 36.2694C16.4386 35.9622 17.2244 35.4824 17.8896 34.8596C18.5549 34.2368 19.0853 33.4843 19.4483 32.6484C19.8113 31.8126 19.9991 30.9112 20 30V8.33334Z"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 8.33334C19.9981 7.66672 20.1294 7.00644 20.3864 6.39134C20.6433 5.77623 21.0207 5.21871 21.4962 4.75158C21.9718 4.28444 22.536 3.91712 23.1556 3.67122C23.7752 3.42532 24.4377 3.3058 25.1042 3.31969C25.7707 3.33358 26.4276 3.4806 27.0365 3.75211C27.6453 4.02362 28.1937 4.41413 28.6494 4.90068C29.105 5.38722 29.4588 5.95998 29.6899 6.58526C29.921 7.21054 30.0248 7.87571 29.995 8.54167C30.9747 8.79356 31.8842 9.26509 32.6546 9.92052C33.4251 10.576 34.0363 11.3981 34.442 12.3247C34.8476 13.2514 35.0371 14.2582 34.996 15.2689C34.955 16.2796 34.6845 17.2677 34.205 18.1583C35.0481 18.8432 35.711 19.7237 36.1361 20.7232C36.5613 21.7227 36.7358 22.811 36.6444 23.8933C36.5531 24.9756 36.1987 26.0193 35.612 26.9334C35.0254 27.8475 34.2242 28.6044 33.2784 29.1383C33.3952 30.0421 33.3255 30.9601 33.0735 31.8359C32.8216 32.7116 32.3929 33.5264 31.8137 34.2299C31.2346 34.9335 30.5173 35.5108 29.7063 35.9263C28.8953 36.3417 28.0077 36.5866 27.0984 36.6456C26.1891 36.7046 25.2773 36.5765 24.4194 36.2694C23.5615 35.9622 22.7756 35.4824 22.1104 34.8596C21.4452 34.2368 20.9147 33.4843 20.5517 32.6484C20.1888 31.8126 20.001 30.9112 20 30V8.33334Z"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M25 21.6667C23.6007 21.1744 22.3789 20.2783 21.4889 19.0917C20.5989 17.905 20.0808 16.4811 20 15C19.9192 16.4811 19.4011 17.905 18.5111 19.0917C17.6211 20.2783 16.3993 21.1744 15 21.6667"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M29.3317 10.8333C29.735 10.1343 29.9632 9.34803 29.9967 8.54167"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.005 8.54167C10.038 9.34789 10.2656 10.1342 10.6683 10.8333"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5.79504 18.16C6.09994 17.9117 6.42621 17.6908 6.77004 17.5"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M33.23 17.5C33.5738 17.6908 33.9001 17.9117 34.205 18.16"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 30C8.8514 30.0005 7.72212 29.7043 6.72168 29.14"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M33.2783 29.14C32.2779 29.7043 31.1486 30.0005 30 30"
              stroke="white"
              strokeWidth="3.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col items-center gap-3 mt-8 w-full">
          <h1
            className="text-center w-full"
            style={{
              color: "#101828",
              fontFamily: "Inter, sans-serif",
              fontSize: 30,
              fontWeight: 900,
              lineHeight: "36px",
              letterSpacing: "-0.354px",
            }}>
            SmartLearn AI
          </h1>
          <p
            className="text-center"
            style={{
              color: "#6A7282",
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: "-0.312px",
            }}>
            Join the next generation of learners. <br className="hidden sm:block" />
            Experience AI-powered education.
          </p>
        </div>

        {/* Student / Teacher Toggle */}
        <div
          className="flex w-full mt-8"
          style={{
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#F3F4F6",
            boxShadow: "0 2px 4px 0 rgba(0,0,0,0.05) inset",
            padding: "6px 6px 0 6px",
          }}>
          {/* Student Tab */}
          <button
            onClick={() => setRole("student")}
            className="flex-1 flex items-center justify-center gap-2 transition-all"
            style={{
              height: 40,
              borderRadius: 14,
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
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 900,
                lineHeight: "16px",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}>
              Student
            </span>
          </button>

          {/* Teacher Tab */}
          <button
            onClick={() => setRole("teacher")}
            className="flex-1 flex items-center justify-center gap-2 transition-all"
            style={{
              height: 40,
              borderRadius: 14,
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
                fontFamily: "Inter, sans-serif",
                fontSize: 12,
                fontWeight: 900,
                lineHeight: "16px",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
              }}>
              Teacher
            </span>
          </button>
        </div>

        {/* Sign In Button + Terms */}
        <div className="flex flex-col items-center gap-6 w-full mt-6">
          {/* Google Sign In Button */}
          <button
            className="w-full flex items-center justify-center gap-4 transition-opacity hover:opacity-80 active:opacity-70"
            style={{
              height: 60,
              borderRadius: 16,
              border: "2px solid #F3F4F6",
              background: "#FFF",
            }}>
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
            <span
              style={{
                color: "#364153",
                fontFamily: "Inter, sans-serif",
                fontSize: 14,
                fontWeight: 900,
                lineHeight: "20px",
                letterSpacing: "1.25px",
                textTransform: "uppercase",
              }}>
              Sign in as {role}
            </span>
          </button>

          {/* Terms */}
          <div className="flex flex-col items-center" style={{ gap: 0 }}>
            <p
              className="text-center"
              style={{
                color: "#99A1AF",
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "1.117px",
                textTransform: "uppercase",
              }}>
              By continuing, you agree to our
            </p>
            <p
              className="text-center"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 700,
                lineHeight: "20px",
                letterSpacing: "1.117px",
                textTransform: "uppercase",
              }}>
              <a href="#" style={{ color: "#1C398E" }} className="hover:underline">
                Terms of Service
              </a>
              <span style={{ color: "#99A1AF" }}> and </span>
              <a href="#" style={{ color: "#1C398E" }} className="hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>

        {/* Footer divider + social proof */}
        <div
          className="w-full mt-8"
          style={{
            borderTop: "1px solid #F9FAFB",
            paddingTop: 33,
            paddingBottom: 33,
          }}>
          <div className="flex items-center justify-center gap-3">
            {/* Stacked Avatars */}
            <div className="flex items-center" style={{ position: "relative", width: 56, height: 24 }}>
              {[0, 16, 32].map((left, i) => (
                <div
                  key={i}
                  className="absolute flex items-center justify-center overflow-hidden"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "2px solid #FFF",
                    background: "#F3F4F6",
                    boxShadow: "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)",
                    left,
                    top: 0,
                  }}>
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="7" r="4" fill="#C8CDD6" />
                    <path d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8" fill="#C8CDD6" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Label */}
            <span
              style={{
                color: "#99A1AF",
                fontFamily: "Inter, sans-serif",
                fontSize: 10,
                fontWeight: 900,
                lineHeight: "15px",
                letterSpacing: "1.117px",
                textTransform: "uppercase",
              }}>
              50k+ students already joined
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
