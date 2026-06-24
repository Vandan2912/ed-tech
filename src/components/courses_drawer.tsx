import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  BarChart3,
  Atom,
  FlaskConical,
  ChevronDown,
  Layers,
  Dna,
  Play,
  ChevronRight,
  Globe,
  Users,
  ChartPie,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { useTranslation } from "@/i18n/useTranslation";
import { useLocalizeContent } from "@/i18n/localizeContent";

const IconMap: Record<string, any> = {
  BarChart3,
  Atom,
  FlaskConical,
  Layers,
  Dna,
  Globe,
  Users,
  ChartPie,
};

export function CoursesDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isActive = window.location.pathname.startsWith("/courses");
  const t = useTranslation();
  const { localizeSubject, localizeDifficulty } = useLocalizeContent();

  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (open && subjects.length === 0 && !loading) {
      dispatch(fetchCourses());
    }
  }, [open, dispatch, subjects.length, loading]);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex justify-center items-center px-3.75 py-1.5 rounded-full cursor-pointer ${isActive
              ? "text-[#1C398E] bg-white shadow-sm text-center "
              : "hover:text-[#1C398E]"
            }`}
        >
          {t.coursesDropdown.label}
          <ChevronDown
            size={12}
            className={`ms-1 ${open ? "rotate-180" : ""} transition-transform`}
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-65 p-3 shadow-xl border border-gray-100 rounded-3xl border-solid space-y-1"
      >
        {loading && subjects.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400">
            {t.coursesDropdown.loading}
          </div>
        ) : (
          subjects.map((course) => {
            const iconKey = course.icon?.replace(/\.[^/.]+$/, "");
            const normalizedIconKey = iconKey
              ? iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
              : "";
            const Icon =
              IconMap[course.icon] || IconMap[normalizedIconKey] || Layers;

            return (
              <DropdownMenuSub key={course.id || course.name}>
                <DropdownMenuSubTrigger
                  onClick={() =>
                    navigate(`/courses/${course.id}`)
                  }
                  className="flex items-center gap-3 rounded-xl px-3 py-2 focus:bg-gray-100 data-[state=open]:bg-gray-100 group cursor-pointer"
                >
                  <Icon size={16} className="group-hover:stroke-[#155DFC]" />
                  <span className="capitalize">{localizeSubject(course.name)}</span>
                </DropdownMenuSubTrigger>

                <DropdownMenuSubContent className="w-65 p-3 rounded-2xl ml-3">
                  <div className="text-xs text-[#155DFC] mb-0.5 text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase px-3">
                    {t.coursesDropdown.learningPath}
                  </div>
                  <div className="flex justify-between items-center mb-4 px-3">
                    <div className="text-[#101828] text-sm not-italic font-black leading-5 tracking-[-0.15px] capitalize">
                      {localizeSubject(course.name)}
                    </div>
                    <div className="flex justify-center items-center px-2 py-1 rounded-[10px] bg-[#F9FAFB]">
                      <p className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[-0.283px] uppercase">
                        {course.topics?.length || 0} {t.coursesDropdown.modules}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {course.topics?.map((topic) => (
                      <div
                        key={topic.id}
                        onClick={() =>
                          navigate(`/courses/${course.id}/${topic.id}`)
                        }
                        className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2 cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                          <Play
                            size={16}
                            className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                          />
                        </div>
                        <div>
                          <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                            {topic.title}
                          </div>
                          <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                            <span
                              className={
                                topic.difficulty?.toLowerCase() === "hard"
                                  ? "text-red-500"
                                  : topic.difficulty?.toLowerCase() === "medium"
                                    ? "text-orange-500"
                                    : "text-green-500"
                              }
                            >
                              {localizeDifficulty(topic.difficulty ?? "")}
                            </span>
                          </div>
                        </div>
                        <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                          <ChevronRight size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          })
        )}

        <div
          className="text-[#155DFC] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-full text-center cursor-pointer text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase"
          onClick={() => {
            navigate("/courses");
          }}
        >
          <Layers size={16} className="text-[#155DFC]" />
          {t.coursesDropdown.exploreAll}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
