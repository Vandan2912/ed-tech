/* Student / Teacher role toggle */

type Role = "student" | "teacher";

export default function RoleToggle({
  role,
  setRole,
}: {
  role: Role;
  setRole: (r: Role) => void;
}) {
  return (
    <div className="flex w-full bg-gray-100 p-1.5 rounded-2xl mb-8 border border-gray-200 shadow-inner">
      {/* Student Tab */}
      <button
        onClick={() => setRole("student")}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white text-blue-900 shadow-sm"
        style={{
          background: role === "student" ? "#FFF" : "transparent",
          boxShadow:
            role === "student"
              ? "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)"
              : "none",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
        <span style={{ color: role === "student" ? "#1C398E" : "#99A1AF" }}>
          Student
        </span>
      </button>

      {/* Teacher Tab */}
      <button
        onClick={() => setRole("teacher")}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all bg-white text-blue-900 shadow-sm"
        style={{
          background: role === "teacher" ? "#FFF" : "transparent",
          boxShadow:
            role === "teacher"
              ? "0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)"
              : "none",
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
        <span style={{ color: role === "teacher" ? "#1C398E" : "#99A1AF" }}>
          Teacher
        </span>
      </button>
    </div>
  );
}
