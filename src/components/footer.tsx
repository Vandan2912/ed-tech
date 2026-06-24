import { useTranslation } from "@/i18n/useTranslation";

export function Footer() {
  const t = useTranslation();
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-19 md:pb-12 md:mt-20">
      {/* <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="">
              <Brain size={20} className="text-blue-600" />
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              SmartLearn <span className="text-blue-600 text-sm">AI</span>
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Empowering 5th to 12th standard learners with AI-driven personalized
            education and cognitive tracking.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-gray-900 mb-4">Subjects</h4>
          <ul className="space-y-2 text-sm text-gray-500">
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
          <ul className="space-y-2 text-sm text-gray-500">
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
          <ul className="space-y-2 text-sm text-gray-500">
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
      </div> */}

      <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8 text-center text-sm font-medium text-gray-400">
        {t.footer.copyright}
      </div>
    </footer>
  );
}
