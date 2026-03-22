import { useParams, useNavigate } from "react-router-dom";
import courses from "@/lib/courses.json";
import type { Course as CourseType } from "@/types/course";

const Topic = () => {
  const { courseSlug, topicSlug } = useParams();
  const navigate = useNavigate();

  const course = (courses as CourseType[]).find((c) => c.slug === courseSlug);

  const topic = course?.topics.find((t) => t.slug === topicSlug);

  if (!course || !topic) return <h2 className="p-6">Topic not found</h2>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6 md:pl-28">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 md:p-8">
          {/* 🎥 Video */}
          <div className="bg-black aspect-video rounded-3xl overflow-hidden shadow-2xl mb-6">
            <iframe width="100%" height="100%" src={topic.videoUrl} title={topic.name} allowFullScreen />
          </div>

          {/* 📘 Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
              <p className="text-gray-500">Subject: {course.name}</p>
            </div>

            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700"
              onClick={() => navigate(`/courses/${course.slug}/${topic.slug}/quiz`)}>
              Take Quiz
            </button>
          </div>

          {/* 📚 Learn Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <h3 className="font-bold mb-4">What you'll learn</h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">✅ Key concepts and terminology</li>
              <li className="flex items-center gap-3 text-gray-600">✅ Real-world applications</li>
              <li className="flex items-center gap-3 text-gray-600">✅ Problem-solving techniques</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topic;
