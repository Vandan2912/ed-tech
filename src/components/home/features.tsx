import { motion } from "motion/react";
import { Target, Award, Brain, ChartColumn } from "lucide-react";
export function Features() {
  const features = [
    {
      title: "Adaptive Learning Paths",
      desc: "Our AI analyzes your performance to create a custom curriculum that focuses on your weak areas while accelerating through what you know.",
      icon: <Brain size={24} className="text-blue-600" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Cognitive Load Tracking",
      desc: "Unique analytics that monitor your mental pressure and focus levels, helping you optimize study sessions for peak productivity.",
      icon: <ChartColumn size={24} className="text-purple-600" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "AI-Powered Assessment",
      desc: "Quizzes are dynamically generated based on video context, providing instant feedback and clear performance benchmarks.",
      icon: <Target size={24} className="text-emerald-600" />,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Global Certification",
      desc: "Earn recognized certificates for scoring over 70%, valid for your academic portfolio and future college applications.",
      icon: <Award size={24} className="text-orange-600" />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <section className="px-8 py-5 md:py-24 text-center">
      <div className="max-w-3xl mx-auto mb-16">
        <h2 className="md:text-4xl mb-6 text-[#101828] text-center text-3xl not-italic font-black leading-9 tracking-[0.396px]">
          Why Choose Mastishq.ai?
        </h2>
        <p className="max-w-2xl mx-auto text-[#364153] text-center text-base not-italic font-normal leading-6 tracking-[-0.312px]">
          We combine advanced artificial intelligence with cognitive science to create the most effective learning environment for 5th to 12th-grade students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="group p-8 rounded-[32px] bg-white border border-gray-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-50 transition-all duration-300 text-start">
            <div
              className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-8`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {" "}
              {feature.title}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
