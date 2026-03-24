/* Footer social proof section */

export default function SocialProof() {
  return (
    <div className="mt-12 pt-8 border-t border-gray-50">
      <div className="flex items-center justify-center gap-3">
        {/* Stacked Avatars */}
        <div className="flex -space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm"
            >
              <div className="bg-gray-100 text-center align-middle flex items-center justify-center w-full h-full">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="10" cy="7" r="4" fill="#C8CDD6" />
                  <path
                    d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8"
                    fill="#C8CDD6"
                  />
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
  );
}
