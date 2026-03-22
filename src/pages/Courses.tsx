import courses from "@/lib/courses.json";
import { useNavigate } from "react-router-dom";
import { iconMap } from "@/lib/icons";
import type { Course } from "@/types/course";

const Courses = () => {
  const navigate = useNavigate();

  return (
    <main className="">
      <div className="py-12">
        <div className="p-6 pb-24 md:pb-6 md:pl-28">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What do you want to learn?</h2>
          <p className="text-gray-500 mb-8">Select a subject to begin your journey</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(courses as Course[]).map((course) => {
              const Icon = iconMap[course.icon as keyof typeof iconMap];

              return (
                <div
                  key={course.name}
                  onClick={() => navigate(`/courses/${course.name.toLowerCase()}`)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition">
                  <div className={`${course.color} p-5 rounded-2xl text-white shadow-lg`}>
                    {Icon && <Icon size={24} />}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">{course.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{course.topics_count} Topics</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Courses;

// "icon": <BarChart3 size={24} className="text-white" />,
