import { useParams, useNavigate } from "react-router-dom";
import courses from "@/lib/courses.json";
import type { Course as CourseType } from "@/types/course";
import { iconMap } from "@/lib/icons";
import { ChevronRight } from "lucide-react";

const Course = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const course = (courses as CourseType[]).find(
    (c) => c.name.toLowerCase() === name,
  );

  if (!course) return <h2 className="p-6 min-h-[50vh]">Course not found</h2>;

  const Icon = iconMap[course.icon as keyof typeof iconMap];

  return (
    <main className="min-h-[50vh]">
      <div className="py-12">
        <div className="p-6 pb-24 md:pb-6 md:pl-28">
          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-900"
          >
            ← Back to Subjects
          </button>

          {/* 📘 Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`${course.color} p-4 rounded-2xl text-white`}>
              {Icon && <Icon size={24} />}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {course.name}
              </h2>
              <p className="text-gray-500">
                {course.topics.length} topics available
              </p>
            </div>
          </div>

          {/* 📚 Topics */}
          <div className="grid gap-4">
            {course.topics.map((topic, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                onClick={() =>
                  navigate(`/courses/${course.slug}/${topic.slug}`)
                }
              >
                <div className="flex items-center gap-4">
                  {/* ▶ Play Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    ▶
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">{topic.name}</h4>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>{topic.time}</span>

                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          topic.level === "Easy"
                            ? "bg-green-100 text-green-600"
                            : topic.level === "Medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {topic.level}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Course;
