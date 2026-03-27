import { useState } from "react";
import { useAuth } from "@/auth/useAuth";
import { Plus, Play, FileText, Eye, Trash2 } from "lucide-react";
import CreateContentModal from "@/components/CreateContentModal";

type ContentItem = {
  id: string;
  type: "LESSON" | "QUIZ";
  title: string;
  status: "PUBLISHED" | "DRAFT";
  subject: string;
  date: string;
  duration: string;
};

const mockContent: ContentItem[] = [
  {
    id: "1",
    type: "LESSON",
    title: "Introduction to Algebra",
    status: "PUBLISHED",
    subject: "Mathematics",
    date: "Feb 10, 2026",
    duration: "22 min",
  },
  {
    id: "2",
    type: "QUIZ",
    title: "Laws of Motion Quiz",
    status: "PUBLISHED",
    subject: "Physics",
    date: "Feb 08, 2026",
    duration: "10 questions",
  },
  {
    id: "3",
    type: "LESSON",
    title: "Periodic Table Deep Dive",
    status: "DRAFT",
    subject: "Chemistry",
    date: "Feb 15, 2026",
    duration: "30 min",
  },
  {
    id: "4",
    type: "QUIZ",
    title: "Cell Biology Assessment",
    status: "DRAFT",
    subject: "Biology",
    date: "Feb 18, 2026",
    duration: "15 questions",
  },
];

export default function Content() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const publishedCount = mockContent.filter((c) => c.status === "PUBLISHED").length;

  return (
    <div className="bg-[#f9fafb] w-full min-h-screen font-['Inter']">
      <div className="pt-10 pb-24 relative px-4 md:px-8 max-w-[1129px] mx-auto space-y-10">
        
        {/* Welcome Banner */}
        <div className="bg-linear-to-r from-[#4f39f6] to-[#1447e6] rounded-[32px] p-8 md:p-10 relative overflow-hidden text-white shadow-sm h-[132px] flex items-center">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <h1 className="text-[30px] font-black leading-[36px] tracking-[0.3955px] mb-2">
              Welcome back, {user?.first_name || "Aksh"}!
            </h1>
            <p className="text-[#e0e7ff] text-[16px] leading-[24px] tracking-[-0.3125px]">
              Create and manage your lessons and quizzes for the class.
            </p>
          </div>
        </div>

        {/* Header & Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-[#101828] text-[14px] font-black uppercase tracking-[0.5496px]">
              CONTENT LIBRARY
            </h3>
            <p className="text-[#6a7282] text-[12px] mt-1">
              {mockContent.length} items · {publishedCount} published
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#155dfc] text-white px-6 py-3 rounded-[16px] shadow-[0px_10px_15px_0px_#bedbff,0px_4px_6px_0px_#bedbff] font-bold text-[14px] flex items-center gap-2 tracking-[-0.1504px] hover:opacity-90 transition-opacity"
          >
            <Plus size={20} />
            Create New
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {mockContent.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <CreateContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

function ContentCard({ item }: { item: ContentItem }) {
  const isLesson = item.type === "LESSON";
  const isPublished = item.status === "PUBLISHED";

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-[24px] p-6 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] flex flex-col gap-4">
      {/* Target header section */}
      <div className="flex justify-between items-start w-full">
        <div className="flex gap-3 items-center">
          <div
            className={`w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0 ${
              isLesson ? "bg-[#dbeafe]" : "bg-[#f3e8ff]"
            }`}
          >
            {isLesson ? (
              <Play size={20} className="text-[#155dfc] fill-[#155dfc]" />
            ) : (
              <FileText size={20} className="text-[#9810fa]" />
            )}
          </div>
          <div>
            <p
              className={`text-[8px] font-black uppercase tracking-[1.0057px] ${
                isLesson ? "text-[#155dfc]" : "text-[#9810fa]"
              }`}
            >
              {item.type}
            </p>
            <p className="text-[#101828] text-[14px] font-bold tracking-[-0.1504px] leading-5">
              {item.title}
            </p>
          </div>
        </div>
        
        {/* Status Pill */}
        <div
          className={`px-2 py-1.5 rounded-[10px] ${
            isPublished ? "bg-[#d0fae5]" : "bg-[#fef3c6]"
          }`}
        >
          <p
            className={`text-[8px] font-black uppercase tracking-[0.2057px] leading-3 ${
              isPublished ? "text-[#009966]" : "text-[#e17100]"
            }`}
          >
            {item.status}
          </p>
        </div>
      </div>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 py-1">
        <p className="text-[#99a1af] text-[10px] font-bold tracking-[0.1172px]">
          {item.subject}
        </p>
        <p className="text-[#99a1af] text-[10px] font-bold">|</p>
        <p className="text-[#99a1af] text-[10px] font-bold tracking-[0.1172px]">
          {item.date}
        </p>
        <p className="text-[#99a1af] text-[10px] font-bold">|</p>
        <p className="text-[#99a1af] text-[10px] font-bold tracking-[0.1172px]">
          {item.duration}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 mt-2">
        <button className="flex-1 bg-[#f9fafb] hover:bg-gray-100 transition-colors h-[35px] rounded-[14px] flex items-center justify-center gap-2 text-[#4a5565] text-[10px] font-black uppercase tracking-[1.1172px]">
          <Eye size={14} className="text-[#4a5565]" />
          Preview
        </button>
        <button className="w-[46px] h-[35px] shrink-0 bg-[#fef2f2] hover:bg-red-100 transition-colors rounded-[14px] flex items-center justify-center text-[#fb2c36]">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
