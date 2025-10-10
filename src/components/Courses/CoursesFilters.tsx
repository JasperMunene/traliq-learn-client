"use client";

import { useState } from "react";
import { Filter, ChevronDown } from "lucide-react";

export default function CoursesFilters() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showLevelFilter, setShowLevelFilter] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const filters = [
    { id: "all", label: "All Courses", count: 50 },
    { id: "live", label: "Live Sessions", count: 12 },
    { id: "on-demand", label: "On-Demand", count: 38 },
    { id: "free", label: "Free", count: 8 },
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];
  const categories = ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "AI Ethics", "Business AI"];

  return (
    <div className="mb-12">
      {/* Main Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Filter by:</span>
        </div>
        
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === filter.id
                ? "bg-[#1447E6] text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter.label}
            <span className="ml-2 text-sm opacity-75">({filter.count})</span>
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Level Filter */}
        <div className="relative">
          <button
            onClick={() => setShowLevelFilter(!showLevelFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Level
            <ChevronDown className={`w-4 h-4 transition-transform ${showLevelFilter ? 'rotate-180' : ''}`} />
          </button>
          
          {showLevelFilter && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {levels.map((level) => (
                  <label key={level} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#1447E6] focus:ring-[#1447E6]" />
                    <span className="text-sm text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Category
            <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryFilter ? 'rotate-180' : ''}`} />
          </button>
          
          {showCategoryFilter && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-2">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-[#1447E6] focus:ring-[#1447E6]" />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort By */}
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1447E6] focus:border-transparent">
          <option>Sort by: Popular</option>
          <option>Sort by: Newest</option>
          <option>Sort by: Price: Low to High</option>
          <option>Sort by: Price: High to Low</option>
          <option>Sort by: Rating</option>
        </select>
      </div>
    </div>
  );
}
