import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BarChart3, Atom, FlaskConical, ChevronDown, Layers, Dna, Play, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CoursesDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isActive = window.location.pathname.startsWith("/courses");

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          className={`flex justify-center items-center px-3.75 py-1.5 rounded-full ${
            isActive ? "text-[#1C398E] bg-white shadow-sm text-center " : "hover:text-[#1C398E]"
          }`}>
          COURSES
          <ChevronDown size={12} className={`ms-1 ${open ? "rotate-180" : ""} transition-transform`} />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="center"
        className="w-65 p-3 shadow-xl border border-gray-100 rounded-3xl border-solid space-y-1">
        <div
          className="text-[#155DFC] flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-full text-center cursor-pointer text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase"
          onClick={() => {
            navigate("/courses");
          }}>
          <Layers size={16} className="text-[#155DFC]" />
          EXPLORE ALL SUBJECTS
        </div>

        {/* Maths */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 focus:bg-gray-100 data-[state=open]:bg-gray-100 group">
            <BarChart3 size={16} className="group-hover:stroke-[#155DFC]" />
            Maths
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-65 p-3 rounded-2xl">
            <div className="text-xs text-[#155DFC] mb-0.5 text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase px-3">
              LEARNING PATH
            </div>
            <div className="flex justify-between items-center mb-4 px-3">
              <div className="text-[#101828] text-sm not-italic font-black leading-5 tracking-[-0.15px]">Maths</div>
              <div className="flex justify-center items-center px-2 py-1 rounded-[10px] bg-[#F9FAFB]">
                <p className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[-0.283px] uppercase">
                  2 Modules
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Algebra Basics
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    18:30 <span>•</span> <span className="text-orange-500">MEDIUM</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Trigonometry
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    22:10 <span>•</span> <span className="text-red-500">HARD</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Physics */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 focus:bg-gray-100 data-[state=open]:bg-gray-100 group">
            <Atom size={16} className="group-hover:stroke-[#155DFC]" />
            Physics
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-65 p-3 rounded-2xl">
            <div className="text-xs text-[#155DFC] mb-0.5 text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase px-3">
              LEARNING PATH
            </div>
            <div className="flex justify-between items-center mb-4 px-3">
              <div className="text-[#101828] text-sm not-italic font-black leading-5 tracking-[-0.15px]">Physics</div>
              <div className="flex justify-center items-center px-2 py-1 rounded-[10px] bg-[#F9FAFB]">
                <p className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[-0.283px] uppercase">
                  2 Modules
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Algebra Basics
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    18:30 <span>•</span> <span className="text-orange-500">MEDIUM</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Trigonometry
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    22:10 <span>•</span> <span className="text-red-500">HARD</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Chemistry */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 focus:bg-gray-100 data-[state=open]:bg-gray-100 group">
            <FlaskConical size={16} className="group-hover:stroke-[#155DFC]" />
            Chemistry
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-65 p-3 rounded-2xl">
            <div className="text-xs text-[#155DFC] mb-0.5 text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase px-3">
              LEARNING PATH
            </div>
            <div className="flex justify-between items-center mb-4 px-3">
              <div className="text-[#101828] text-sm not-italic font-black leading-5 tracking-[-0.15px]">Chemistry</div>
              <div className="flex justify-center items-center px-2 py-1 rounded-[10px] bg-[#F9FAFB]">
                <p className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[-0.283px] uppercase">
                  2 Modules
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Algebra Basics
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    18:30 <span>•</span> <span className="text-orange-500">MEDIUM</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Trigonometry
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    22:10 <span>•</span> <span className="text-red-500">HARD</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Biology */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-3 rounded-xl px-3 py-2 focus:bg-gray-100 data-[state=open]:bg-gray-100 group mb-0">
            <Dna size={16} className="group-hover:stroke-[#155DFC]" />
            Biology
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent className="w-65 p-3 rounded-2xl">
            <div className="text-xs text-[#155DFC] mb-0.5 text-[10px] not-italic font-black leading-3.75 tracking-[1.117px] uppercase px-3">
              LEARNING PATH
            </div>
            <div className="flex justify-between items-center mb-4 px-3">
              <div className="text-[#101828] text-sm not-italic font-black leading-5 tracking-[-0.15px]">Biology</div>
              <div className="flex justify-center items-center px-2 py-1 rounded-[10px] bg-[#F9FAFB]">
                <p className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[13.5px] tracking-[-0.283px] uppercase">
                  2 Modules
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Algebra Basics
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    18:30 <span>•</span> <span className="text-orange-500">MEDIUM</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
              <div className="flex items-center gap-3 group hover:bg-[#EFF6FF80] border border-transparent hover:border-[#EFF6FF80] rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gray-100 group-hover:bg-white group-hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)] rounded-lg flex items-center justify-center">
                  <Play
                    size={16}
                    className="fill-[#99A1AF] stroke-[#99A1AF] group-hover:fill-[#155DFC] group-hover:stroke-[#155DFC]"
                  />
                </div>
                <div>
                  <div className="text-[#4A5565] group-hover:text-[#1447E6] text-sm not-italic font-bold leading-[17.5px] tracking-[-0.15px]">
                    Trigonometry
                  </div>
                  <div className="text-[#99A1AF] text-[9px] not-italic font-bold leading-[12.857px] tracking-[0.617px] uppercase flex items-center gap-2">
                    22:10 <span>•</span> <span className="text-red-500">HARD</span>
                  </div>
                </div>
                <div className="w-6 h-6 justify-center items-center shadow-[0_10px_15px_-3px_#BEDBFF,0_4px_6px_-4px_#BEDBFF] px-1.5 py-0 rounded-full bg-[#155DFC] text-white hidden group-hover:flex ml-auto">
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
