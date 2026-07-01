import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { iconMap } from "@/lib/icons";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";

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

const Courses = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { subjects, loading, error } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, subjects.length]);

  if (loading && subjects.length === 0) {
    return (
      <main className="min-h-[50vh]">
        <div className="py-12 p-6 md:pl-28">
          <p className="text-gray-500">Loading courses...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-[50vh]">
        <div className="py-12 p-6 md:pl-28">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[50vh]">
      <div className="pt-12 pb-0 md:pb-12">
        <div className="p-6 pb-0 md:pb-6 md:px-28">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What do you want to learn?
          </h2>
          <p className="text-gray-500 mb-8">
            Select a subject to begin your journey
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {subjects.map((course, index) => {
              // Extract icon name and capitalize if it was sent correctly or fallback
              const iconKey = course.icon?.replace(/\.[^/.]+$/, "");
              const normalizedIconKey = iconKey
                ? iconKey.charAt(0).toUpperCase() + iconKey.slice(1)
                : "";
              const Icon =
                iconMap[course.icon as keyof typeof iconMap] ||
                iconMap[normalizedIconKey as keyof typeof iconMap] ||
                iconMap["Layers" as keyof typeof iconMap];

              const topicCount = course.topics?.length || 0;
              const color = colors[index % colors.length];

              return (
                <div
                  key={course.id || course.name}
                  onClick={() => navigate(`/courses/${course.id}`)}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer flex flex-col items-center text-center gap-4 hover:-translate-y-1 transition">
                  <div
                    className={`${color} p-5 rounded-2xl text-white shadow-lg`}>
                    {Icon ? <Icon size={24} /> : <div className="w-6 h-6" />}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 capitalize">
                      {course.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {topicCount} Topics
                    </p>
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
