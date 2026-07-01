import { useEffect, useState } from "react";
import {
  Atom,
  Award,
  BookOpen,
  CheckCircle2,
  CircuitBoard,
  Clock,
  Cpu,
  Eye,
  FlaskConical,
  Globe,
  GraduationCap,
  Languages,
  Leaf,
  Loader2,
  Network,
  Target,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/auth/useAuth";
import { getCertificates, type SubjectCertificate } from "@/api/certificates";
import {
  CertificateModal,
  type CertificateData,
} from "@/components/CertificateModal";

const TITLE_GRADIENT =
  "linear-gradient(90deg, rgb(21, 93, 252) 0%, rgb(152, 16, 250) 100%)";

// Colour palette cycled across subjects so every card gets a distinct,
// consistent gradient regardless of how many subjects the API returns.
const PALETTE: { tile: string; bar: string }[] = [
  { tile: "135deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%", bar: "90deg, rgb(43, 127, 255) 0%, rgb(21, 93, 252) 100%" },
  { tile: "135deg, rgb(173, 70, 255) 0%, rgb(152, 16, 250) 100%", bar: "90deg, rgb(173, 70, 255) 0%, rgb(152, 16, 250) 100%" },
  { tile: "135deg, rgb(0, 201, 80) 0%, rgb(0, 166, 62) 100%", bar: "90deg, rgb(0, 201, 80) 0%, rgb(0, 166, 62) 100%" },
  { tile: "135deg, rgb(0, 188, 125) 0%, rgb(0, 153, 102) 100%", bar: "90deg, rgb(0, 188, 125) 0%, rgb(0, 153, 102) 100%" },
  { tile: "135deg, rgb(255, 137, 4) 0%, rgb(245, 73, 0) 100%", bar: "90deg, rgb(255, 137, 4) 0%, rgb(245, 73, 0) 100%" },
  { tile: "135deg, rgb(244, 63, 94) 0%, rgb(225, 29, 72) 100%", bar: "90deg, rgb(244, 63, 94) 0%, rgb(225, 29, 72) 100%" },
  { tile: "135deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%", bar: "90deg, rgb(99, 102, 241) 0%, rgb(79, 70, 229) 100%" },
  { tile: "135deg, rgb(6, 182, 212) 0%, rgb(8, 145, 178) 100%", bar: "90deg, rgb(6, 182, 212) 0%, rgb(8, 145, 178) 100%" },
];

const SUBJECT_ICONS: Record<string, LucideIcon> = {
  mathematics: Target,
  maths: Target,
  math: Target,
  physics: Atom,
  chemistry: FlaskConical,
  biology: Leaf,
  "computer science": Cpu,
  cs: Cpu,
  sst: Globe,
  "social studies": Globe,
  sanskrit: Languages,
  hindi: Languages,
  english: Languages,
  dld: CircuitBoard,
  hld: Network,
};

const iconFor = (subject: string): LucideIcon =>
  SUBJECT_ICONS[subject.trim().toLowerCase()] ?? GraduationCap;

export default function Certificates() {
  const { user } = useAuth();
  const [data, setData] = useState<SubjectCertificate[]>([]);
  const [summary, setSummary] = useState({
    certified: 0,
    pending: 0,
    topicsCompleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CertificateData | null>(null);

  useEffect(() => {
    getCertificates()
      .then((res) => {
        setData(res.certificates);
        setSummary(res.summary);
      })
      .catch(() => {
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const recipient =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Student";

  const stats = [
    { icon: Award, iconColor: "#007a55", bg: "#ecfdf5", value: summary.certified, label: "Certified" },
    { icon: Clock, iconColor: "#f54900", bg: "#fff7ed", value: summary.pending, label: "Pending" },
    { icon: BookOpen, iconColor: "#155dfc", bg: "#eff6ff", value: summary.topicsCompleted, label: "Topics Completed" },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-[24px] font-semibold leading-8 tracking-[0.07px] text-[#101828]">
            {"My Certificates"}
          </h1>
          <p className="mt-1 text-[14px] tracking-[-0.15px] text-[#6a7282]">
            {"Track your progress and earned certifications"}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-[14px] border border-[#e5e7eb] bg-white p-6"
              >
                <div
                  className="flex size-10 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon size={20} style={{ color: stat.iconColor }} />
                </div>
                <div>
                  <p className="text-[24px] font-semibold leading-8 tracking-[0.07px] text-[#101828]">
                    {stat.value}
                  </p>
                  <p className="text-[12px] text-[#6a7282]">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-bold">{"Loading certificates..."}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && data.length === 0 && (
          <div className="flex items-center justify-center rounded-[16px] border border-gray-100 py-16 text-sm font-bold text-gray-400">
            {"No certificates yet — complete topics to earn them!"}
          </div>
        )}

        {/* Certificate cards */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {data.map((cert, i) => {
              const Icon = iconFor(cert.subject);
              const palette = PALETTE[i % PALETTE.length];
              const tileGradient = `linear-gradient(${palette.tile})`;
              const barGradient = `linear-gradient(${palette.bar})`;
              const certified = cert.status === "certified";
              const percent = Math.max(0, Math.min(100, cert.progressPercent));

              return (
                <div
                  key={cert.subjectId}
                  className={`rounded-[16px] border bg-white p-8 ${
                    certified
                      ? "border-[#a4f4cf] drop-shadow-[0px_1px_1.5px_rgba(0,0,0,0.1),0px_1px_1px_rgba(0,0,0,0.1)]"
                      : "border-[#e5e7eb]"
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div
                      className="flex size-12 items-center justify-center rounded-[14px]"
                      style={{ backgroundImage: tileGradient }}
                    >
                      <Icon size={24} className="text-white" />
                    </div>
                    {certified && (
                      <div className="flex items-center gap-1.5 rounded-[10px] bg-[#ecfdf5] px-2.5 py-1">
                        <CheckCircle2 size={14} className="text-[#007a55]" />
                        <span className="text-[12px] font-medium text-[#007a55]">
                          {"Certified"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subject */}
                  <h3 className="mt-6 text-[20px] font-semibold leading-7 tracking-[-0.45px] text-[#101828]">
                    {cert.subject}
                  </h3>

                  {/* Progress */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[14px] tracking-[-0.15px] text-[#4a5565]">
                      {"Progress"}
                    </span>
                    <span className="text-[14px] font-medium tracking-[-0.15px] text-[#101828]">
                      {cert.completedTopics}/{cert.totalTopics}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${percent}%`, backgroundImage: barGradient }}
                    />
                  </div>
                  <p className="mt-2 text-[12px] text-[#6a7282]">
                    {percent}{"% complete"}
                  </p>

                  {/* Footer */}
                  <div className="mt-6 border-t border-[#f3f4f6] pt-6">
                    {certified ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[12px] text-[#6a7282]">{"Grade"}</p>
                            <p className="text-[20px] font-semibold leading-7 tracking-[-0.45px] text-[#101828]">
                              {cert.grade ?? "—"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setSelected({
                                subject: cert.subject,
                                grade: cert.grade ?? "—",
                                date: cert.date,
                                completed: cert.completedTopics,
                                total: cert.totalTopics,
                                icon: Icon,
                                gradient: tileGradient,
                                titleGradient: TITLE_GRADIENT,
                              })
                            }
                            className="flex h-8 items-center gap-2 rounded-[10px] bg-[#101828] px-4 text-[12px] font-medium text-white transition-colors hover:bg-[#1d2939] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#155dfc] focus-visible:ring-offset-2"
                          >
                            <Eye size={16} />
                            {"View"}
                          </button>
                        </div>
                        {cert.date && (
                          <p className="mt-3 text-[12px] text-[#99a1af]">
                            {cert.date}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-[14px] tracking-[-0.15px] text-[#4a5565]">
                        {cert.remainingTopics} {"more topics to certify"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CertificateModal
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
        certificate={selected}
        recipient={recipient}
      />
    </div>
  );
}
