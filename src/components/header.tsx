import { Brain, Flame, Target, Bell } from "lucide-react";
// import { imgUser } from "./assets";

export function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-8 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1.5 rounded-lg text-white">
          <Brain size={20} />
        </div>
        <span className="font-bold text-xl text-gray-900 tracking-tight">
          SmartLearn <span className="text-blue-600 text-sm">AI</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#" className="text-gray-900 font-semibold border-b-2 border-blue-600 pb-1">
          HOME
        </a>
        <a href="#" className="hover:text-gray-900">
          COURSES v
        </a>
        <a href="#" className="hover:text-gray-900">
          RANKS
        </a>
        <a href="#" className="hover:text-gray-900">
          STATS
        </a>
        <a href="#" className="hover:text-gray-900">
          PROGRESS
        </a>
        <a href="#" className="flex items-center gap-1 hover:text-gray-900">
          <Target size={16} /> STUDY
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            <Flame size={16} fill="currentColor" /> 7
          </div>
          <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold">
            <span className="text-blue-500 font-black text-lg leading-none">♦</span> 4
          </div>
        </div>
        <div className="relative cursor-pointer text-gray-400 hover:text-gray-600">
          <Bell size={24} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>
        {/* <img src={imgUser} alt="User avatar" className="w-10 h-10 rounded-full border border-gray-200 object-cover" /> */}
      </div>
    </header>
  );
}
