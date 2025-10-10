"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Star, Play, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  price: number;
  currency: string;
  is_free: boolean;
  thumbnail_url: string | null;
  tutor: {
    first_name: string;
    last_name: string;
  };
  attendee_count: number;
}

export default function CoursesGrid() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchCourses = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.courses.list);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        const data = await res.json();
        if (!mounted) return;
        
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses(mockCourses);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load courses');
        setCourses(mockCourses);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    
    fetchCourses();
    return () => { mounted = false };
  }, []);

  const getDefaultThumbnail = (index: number) => {
    const thumbnails = [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386435/pexels-photo-8386435.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=800"
    ];
    return thumbnails[index % thumbnails.length];
  };

  const mockCourses: Course[] = [
    {
      id: "1", title: "Machine Learning Fundamentals", category: "Machine Learning", level: "Beginner",
      price: 5000, currency: "KES", is_free: false, thumbnail_url: null,
      tutor: { first_name: "Dr. Sarah", last_name: "Kimani" }, attendee_count: 245
    },
    {
      id: "2", title: "Deep Learning with Python", category: "Deep Learning", level: "Intermediate",
      price: 8000, currency: "KES", is_free: false, thumbnail_url: null,
      tutor: { first_name: "Prof. John", last_name: "Mwangi" }, attendee_count: 189
    },
    {
      id: "3", title: "Natural Language Processing", category: "NLP", level: "Advanced",
      price: 12000, currency: "KES", is_free: false, thumbnail_url: null,
      tutor: { first_name: "Dr. Grace", last_name: "Wanjiku" }, attendee_count: 156
    },
    {
      id: "4", title: "Computer Vision Basics", category: "Computer Vision", level: "Beginner",
      price: 0, currency: "KES", is_free: true, thumbnail_url: null,
      tutor: { first_name: "James", last_name: "Ochieng" }, attendee_count: 324
    },
    {
      id: "5", title: "AI Ethics and Governance", category: "AI Ethics", level: "Beginner",
      price: 3500, currency: "KES", is_free: false, thumbnail_url: null,
      tutor: { first_name: "Dr. Mary", last_name: "Njeri" }, attendee_count: 98
    },
    {
      id: "6", title: "Business Intelligence with AI", category: "Business AI", level: "Intermediate",
      price: 9500, currency: "KES", is_free: false, thumbnail_url: null,
      tutor: { first_name: "Michael", last_name: "Kariuki" }, attendee_count: 167
    }
  ];

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-6">
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
              <div className="flex items-center gap-4 mb-4">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <p className="text-red-800 text-sm">
            <strong>Note:</strong> Unable to load live courses ({error}). Showing sample courses below.
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course, index) => (
          <Link 
            key={course.id} 
            href={`/courses/${course.id}`}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300 group"
          >
            {/* Course Image */}
            <div className="relative h-48">
              <Image
                src={(course.thumbnail_url || "").trim() || getDefaultThumbnail(index)}
                alt={course.title}
                width={500}
                height={500}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3">
                <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                  {course.level}
                </span>
              </div>
              
              {course.is_free && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#10B981] text-white px-2.5 py-1 rounded text-xs font-bold">FREE</span>
                </div>
              )}

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                  <Play className="w-6 h-6 text-[#1447E6] fill-current" />
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#1447E6] transition-colors">
                {course.title}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                by {course.tutor.first_name} {course.tutor.last_name}
              </p>

              {/* Course Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.attendee_count || 0} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>4.8</span>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                  {course.category}
                </span>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xl font-semibold text-gray-900">
                  {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                </span>
                <button className="bg-[#1447E6] text-white px-4 py-2 rounded-lg hover:bg-[#1039C4] transition-colors text-sm font-medium">
                  View Course
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="bg-[#EBF2FE] text-[#1447E6] px-8 py-3 rounded-lg hover:bg-[#D6E4FD] transition-colors font-medium">
          Load More Courses
        </button>
      </div>
    </div>
  );
}

function getCategoryColor(category: string) {
  const colors: { [key: string]: string } = {
    "Machine Learning": "bg-[#EBF2FE] text-[#1447E6]",
    "Deep Learning": "bg-[#F0FDF4] text-[#10B981]",
    "NLP": "bg-[#FEF3C7] text-[#F59E0B]",
    "Computer Vision": "bg-[#F3E8FF] text-[#9333EA]",
    "AI Ethics": "bg-[#FEF2F2] text-[#EF4444]",
    "Business AI": "bg-[#F0F9FF] text-[#0EA5E9]"
  };
  return colors[category] || "bg-gray-100 text-gray-700";
}
