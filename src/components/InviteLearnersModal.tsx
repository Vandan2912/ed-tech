import { useState } from "react";
import { X, Search, Users, Check, Copy, Link } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CLASSMATES = [
  { id: 1, name: "Arjun Mehta", avatar: "AM", level: 24, subject: "Mathematics" },
  { id: 2, name: "Sara Khan", avatar: "SK", level: 22, subject: "Physics" },
  { id: 3, name: "Leo Das", avatar: "LD", level: 21, subject: "Chemistry" },
  { id: 4, name: "Priya Sharma", avatar: "PS", level: 19, subject: "History" },
  { id: 5, name: "Zoya Ali", avatar: "ZA", level: 21, subject: "Biology" },
  { id: 6, name: "Rohan Gupta", avatar: "RG", level: 17, subject: "Mathematics" },
];

const ROOM_CODE = "SMART-4X9K";

export default function InviteLearnersModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [search, setSearch] = useState("");
  const [invited, setInvited] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);

  const filtered = CLASSMATES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleInvite = (id: number) => {
    setInvited((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(ROOM_CODE).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setSearch("");
    setInvited([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#101828]/60 z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[460px] rounded-3xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-[#101828] tracking-tight leading-tight">
                      Invite Learners
                    </h2>
                    <p className="text-[12px] text-gray-400 font-medium mt-0.5">
                      Send invites to classmates and grow your study group
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-gray-500 shrink-0 ml-4 focus-visible:outline-none"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Room code */}
              <div className="mx-6 mb-4 flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3">
                <Link size={14} className="text-blue-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-0.5">Room Code</p>
                  <p className="text-[14px] font-black text-[#1C398E] tracking-widest">{ROOM_CODE}</p>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-none"
                >
                  {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Search */}
              <div className="px-6 mb-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search classmates..."
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-[13px] font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Classmate list */}
              <div className="px-6 pb-2 max-h-64 overflow-y-auto space-y-1 hideScrollbar">
                {filtered.map((c) => {
                  const isInvited = invited.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[11px] font-black text-gray-600 shrink-0">
                        {c.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#101828] leading-tight">{c.name}</p>
                        <p className="text-[11px] text-gray-400 font-medium">
                          LVL {c.level} · {c.subject}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleInvite(c.id)}
                        className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl transition-colors focus-visible:outline-none ${isInvited
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-[#1C398E] text-white hover:bg-[#162d72]"
                          }`}
                      >
                        {isInvited ? (
                          <>
                            <Check size={11} /> Invited
                          </>
                        ) : (
                          "Invite"
                        )}
                      </button>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-400 text-[13px] font-medium py-6">
                    No classmates found.
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[12px] text-gray-400 font-semibold">
                  {invited.length > 0
                    ? `${invited.length} invite${invited.length > 1 ? "s" : ""} sent`
                    : "No invites sent yet"}
                </span>
                <button
                  onClick={handleClose}
                  className="px-5 py-2 bg-[#101828] hover:bg-[#1C398E] text-white text-[12px] font-black uppercase tracking-wider rounded-xl transition-colors focus-visible:outline-none"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
