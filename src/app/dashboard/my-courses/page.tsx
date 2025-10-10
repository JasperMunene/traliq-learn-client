"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Enrollment {
  id: string;
  course_id: string;
  user_id: string;
  status: string;
  progress_percentage: number;
  completed: boolean;
  completed_at: string | null;
  has_lifetime_access: boolean;
  attended_live_session: boolean;
  certificate_issued: boolean;
  certificate_url: string | null;
  enrolled_at: string;
  last_accessed_at: string | null;
  course_title: string;
  course_category: string;
  course_level: string;
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: string;
  thumbnail_url: string | null;
  tutor: {
    first_name: string;
    last_name: string;
  };
}

interface EnrollmentWithCourse extends Enrollment {
  course?: Course;
}

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(API_ENDPOINTS.enrollments.mine);

      if (!response.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const data = await response.json();
      console.log("Enrollments data:", data);

      // Fetch course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        data.enrollments.map(async (enrollment: Enrollment) => {
          try {
            const courseResponse = await fetch(
              API_ENDPOINTS.courses.detail(enrollment.course_id)
            );
            if (courseResponse.ok) {
              const courseData = await courseResponse.json();
              return { ...enrollment, course: courseData };
            }
            return enrollment;
          } catch (err) {
            console.error(`Error fetching course ${enrollment.course_id}:`, err);
            return enrollment;
          }
        })
      );

      setEnrollments(enrollmentsWithCourses);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError(err instanceof Error ? err.message : "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultThumbnail = (index: number) => {
    const thumbnails = [
      "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];
    return thumbnails[index % thumbnails.length];
  };

  const filteredEnrollments = enrollments.filter((enrollment) => {
    // Filter by status
    if (filter === "completed" && !enrollment.completed) return false;
    if (filter === "in-progress" && enrollment.completed) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const title = enrollment.course_title?.toLowerCase() || "";
      const category = enrollment.course_category?.toLowerCase() || "";
      return title.includes(query) || category.includes(query);
    }

    return true;
  });

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e) => !e.completed).length,
    completed: enrollments.filter((e) => e.completed).length,
    certificates: enrollments.filter((e) => e.certificate_issued).length,
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200 mb-2">
            Failed to Load Courses
          </h3>
          <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
          <button
            onClick={fetchEnrollments}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress and continue where you left off
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Courses
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                In Progress
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.inProgress}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Completed
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.completed}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Certificates
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.certificates}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("in-progress")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "in-progress"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-12 border border-gray-200 dark:border-gray-800 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {searchQuery || filter !== "all" ? "No courses found" : "No enrolled courses yet"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || filter !== "all"
              ? "Try adjusting your filters or search query"
              : "Start learning by enrolling in a course"}
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEnrollments.map((enrollment, index) => {
            const course = enrollment.course;
            const thumbnailUrl = course?.thumbnail_url
              ? (course.thumbnail_url || "").trim() || getDefaultThumbnail(index)
              : getDefaultThumbnail(index);

            return (
              <Link
                key={enrollment.id}
                href={`/dashboard/courses/${enrollment.course_id}`}
                className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-40">
                  <Image
                    src={thumbnailUrl}
                    alt={enrollment.course_title}
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  {enrollment.completed && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Completed
                      </span>
                    </div>
                  )}
                  {enrollment.certificate_issued && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-purple-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Certified
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {enrollment.course_category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {enrollment.course_title}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {course?.tutor
                      ? `${course.tutor.first_name} ${course.tutor.last_name}`
                      : "Instructor"}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {enrollment.progress_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    {enrollment.completed ? "Review Course" : "Continue Learning"}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
