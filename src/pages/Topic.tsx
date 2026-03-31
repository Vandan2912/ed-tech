import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { fetchCourses } from "@/store/slices/courseSlice";
import { api } from "@/lib/api";

const Topic = () => {
  const { courseId, topicId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { subjects, loading } = useAppSelector((state) => state.course);

  useEffect(() => {
    if (subjects.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, subjects.length]);

  const course = subjects.find((c) => c.id === Number(courseId));
  const topic = course?.topics?.find((t) => t.id === Number(topicId));

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      if (!topicId) return;
      try {
        const res = await api.get(`/course/video/${topicId}`);
        const data = res.data;
        if (data && data.length > 0 && data[0].youtube_video_id) {
          setVideoUrl(
            `https://www.youtube.com/embed/${data[0].youtube_video_id}?controls=1&rel=0`,
          );
        }
      } catch (err) {
        console.error("Failed to fetch video details", err);
      }
    };
    fetchVideo();
  }, [topicId]);

  if (loading && subjects.length === 0) {
    return <h2 className="p-6">Loading...</h2>;
  }

  if (!course || !topic) return <h2 className="p-6">Topic not found</h2>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-6 md:pl-28">
      <div className="max-w-4xl mx-auto">
        <div className="p-4 md:p-8">
          {/* 🎥 Video */}
          <div className="bg-black aspect-video rounded-3xl overflow-hidden shadow-2xl mb-6">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl || ""}
              title={topic.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* 📘 Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {topic.title}
              </h1>
              <p className="text-gray-500">Subject: {course.name}</p>
            </div>

            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700"
              onClick={() => navigate(`/courses/${course.id}/${topic.id}/quiz`)}
            >
              Take Quiz
            </button>
          </div>

          {/* 📚 Learn Section */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100">
            <h3 className="font-bold mb-4">What you'll learn</h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-600">
                ✅ Key concepts and terminology
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                ✅ Real-world applications
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                ✅ Problem-solving techniques
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topic;
