import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { iconMap } from "@/lib/icons";
import { ChevronRight } from "lucide-react";

const colors = [
  "bg-blue-600",
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-rose-600",
  "bg-orange-600",
  "bg-teal-600",
  "bg-purple-600",
  "bg-amber-600",
];

const Course = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, subjects.length]);

  const course = subjects.find((c) => c.id === Number(courseId));

  if (loading && subjects.length === 0) {
    return <h2 className="p-6 min-h-[50vh]">Loading...</h2>;
  }

  if (!course) return <h2 className="p-6 min-h-[50vh]">Course not found</h2>;

  const iconKey = course.icon?.replace(/\.[^/.]+$/, "");
  const normalizedIconKey = iconKey
    ? iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
    : "";
  const Icon =
    iconMap[course.icon as keyof typeof iconMap] ||
    iconMap[normalizedIconKey as keyof typeof iconMap] ||
    iconMap["Layers" as keyof typeof iconMap];

  const color = colors[(course.id || 0) % colors.length];

  return (
    <main className="min-h-[50vh]">
      <div className="pt-12 pb-0 md:pb-12">
        <div className="p-6 pb-0 md:pb-6 md:px-28">
          {/* 🔙 Back Button */}
          <button
            onClick={() => navigate("/courses")}
            className="flex items-center gap-2 text-gray-500 mb-6 hover:text-gray-900">
            ← Back to Subjects
          </button>

          {/* 📘 Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`${color} p-4 rounded-2xl text-white`}>
              {Icon && <Icon size={24} />}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {course.name}
              </h2>
              <p className="text-gray-500">
                {course.topics?.length || 0} topics available
              </p>
            </div>
          </div>

          {/* 📚 Topics */}
          <div className="grid gap-4">
            {course.topics?.map((topic) => (
              <div
                key={topic.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/courses/${course.id}/${topic.id}`)}>
                <div className="flex items-center gap-4">
                  {/* ▶ Play Icon */}
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                    ▶
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900">{topic.title}</h4>

                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      <span>{topic.description}</span>

                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          topic.difficulty === "Easy"
                            ? "bg-green-100 text-green-600"
                            : topic.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                        }`}>
                        {topic.difficulty}
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
