import { Search } from "lucide-react";

export default function CoursesHero() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-gray-900 leading-tight mb-6">
          AI Courses for Everyone
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
          Master artificial intelligence with expert-led courses. From beginner-friendly introductions to advanced machine learning techniques.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses, topics, or instructors..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
          <div>
            <span className="font-semibold text-gray-900">50+</span> courses
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div>
            <span className="font-semibold text-gray-900">25+</span> expert instructors
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div>
            <span className="font-semibold text-gray-900">12.5K+</span> students enrolled
          </div>
          <div className="w-px h-4 bg-gray-300" />
          <div>
            <span className="font-semibold text-gray-900">4.9/5</span> average rating
          </div>
        </div>
      </div>
    </section>
  );
}
