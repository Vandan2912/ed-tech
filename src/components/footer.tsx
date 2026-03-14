import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <Brain size={20} />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              SmartLearn <span className="text-blue-600 text-sm">AI</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Empowering 5th to 12th standard learners with AI-driven personalized education and cognitive tracking.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Subjects</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Science & Tech
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Mathematics
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                History & Social
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Literature
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Leaderboard
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Certifications
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                AI Tutors
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Parent Portal
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-6">Support</h4>
          <ul className="space-y-4 text-sm font-medium text-gray-500">
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 text-center text-sm font-medium text-gray-400">
        © 2026 SmartLearn AI Education Platform. All rights reserved.
      </div>
    </footer>
  );
}
