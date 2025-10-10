"use client";

import { useState, useEffect } from "react";
import { Users, Clock, Star, Play, Calendar, CheckCircle, Globe, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { API_ENDPOINTS } from "@/lib/config";

interface CourseDetailProps {
  courseId: string;
}

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
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string | null;
    bio?: string;
  };
  enrollment_count: number;
  description?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  average_rating?: number;
}

interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  position: number;
  duration_minutes?: number | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function CourseDetailClient({ courseId }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchCourse = async () => {
      try {
        const url = API_ENDPOINTS.courses.detail(courseId);
        console.log('Fetching course from:', url);
        console.log('Course ID:', courseId);
        
        const res = await fetch(url);
        console.log('Response status:', res.status);
        console.log('Response ok:', res.ok);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log('Error response:', errorText);
          throw new Error(`HTTP error! status: ${res.status} - ${errorText}`);
        }
        
        const data = await res.json();
        console.log('Course data received:', data);
        
        if (!mounted) return;
        
        // Check if we have course data - server returns course data directly
        if (data && data.id) {
          console.log('Setting course data:', data);
          setCourse(data);
          // Fetch modules after course loads
          fetchModules();
        } else {
          console.log('No valid course data, using mock course');
          setCourse(mockCourse);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load course');
        setCourse(mockCourse);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };
    
    fetchCourse();
    return () => { mounted = false };
  }, [courseId]);

  const fetchModules = async () => {
    try {
      setModulesLoading(true);
      console.log('Fetching modules for course:', courseId);
      const res = await fetch(API_ENDPOINTS.courses.modules(courseId));
      
      if (res.ok) {
        const data = await res.json();
        console.log('Modules data received:', data);
        
        // Handle both possible response formats
        const modulesList = data.modules || data || [];
        setModules(Array.isArray(modulesList) ? modulesList : []);
      } else {
        console.log('Failed to fetch modules, status:', res.status);
        setModules([]);
      }
    } catch (err) {
      console.error('Error fetching modules:', err);
      setModules([]);
    } finally {
      setModulesLoading(false);
    }
  };

  const mockCourse: Course = {
    id: courseId,
    title: "Machine Learning Fundamentals",
    category: "Machine Learning",
    level: "Beginner",
    price: 5000,
    currency: "KES",
    is_free: false,
    thumbnail_url: null,
    tutor: { 
      id: "mock-tutor-id",
      first_name: "Dr. Sarah", 
      last_name: "Kimani",
      avatar_url: null,
      bio: "AI Research Scientist"
    },
    enrollment_count: 245,
    description: "Master the fundamentals of machine learning with hands-on projects and real-world applications. This comprehensive course covers everything from basic concepts to advanced algorithms.",
    average_rating: 4.8
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="h-64 bg-gray-200 rounded mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-8">The course you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/courses" className="bg-[#1447E6] text-white px-6 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium">
            Browse All Courses
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Course Info */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#EBF2FE] text-[#1447E6] px-3 py-1 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <span className="bg-[#F0FDF4] text-[#10B981] px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                  {course.title}
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  {course.description || "Learn from industry experts with hands-on projects and real-world applications."}
                </p>

                {/* Course Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrollment_count} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{course.average_rating?.toFixed(1) || '4.8'} (124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>8 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {course.tutor.first_name[0]}{course.tutor.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {course.tutor.first_name} {course.tutor.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{course.tutor.bio || 'AI Research Scientist'}</p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/auth/signup?redirect=/dashboard/courses/${course.id}`}
                    className="bg-[#1447E6] text-white px-8 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium"
                  >
                    {course.is_free ? 'Enroll for Free' : `Enroll Now - ${course.currency} ${course.price.toLocaleString()}`}
                  </Link>
                  <button className="bg-[#EBF2FE] text-[#1447E6] px-8 py-3 rounded-lg hover:bg-[#D6E4FD] transition-colors font-medium">
                    Preview Course
                  </button>
                </div>
              </div>

              {/* Course Image/Video */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={(course.thumbnail_url || "").trim() || "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800"}
                    alt={course.title}
                    width={600}
                    height={400}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors">
                      <Play className="w-8 h-8 text-[#1447E6] fill-current ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Content */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">What you&apos;ll learn</h2>
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  {[
                    "Understand machine learning fundamentals",
                    "Build and train ML models",
                    "Work with real-world datasets",
                    "Deploy models to production",
                    "Master Python for data science",
                    "Learn industry best practices"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Course curriculum</h2>
                <div className="space-y-4">
                  {modulesLoading ? (
                    // Loading skeleton for modules
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : modules.length > 0 ? (
                    modules
                      .sort((a, b) => a.position - b.position)
                      .map((module, index) => (
                        <div key={module.id} className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {index + 1}. {module.title}
                              </h3>
                              {module.description && (
                                <p className="text-sm text-gray-600">{module.description}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {module.duration_minutes && (
                                <span>{module.duration_minutes} min</span>
                              )}
                              {module.is_published ? (
                                <span className="text-green-600 font-medium">Published</span>
                              ) : (
                                <span className="text-gray-400 font-medium">Draft</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    // Fallback to mock data if no modules are available
                    [
                      { title: "Introduction to Machine Learning", lessons: 5, duration: "45 min" },
                      { title: "Data Preprocessing", lessons: 8, duration: "1h 20min" },
                      { title: "Supervised Learning", lessons: 12, duration: "2h 15min" },
                      { title: "Unsupervised Learning", lessons: 7, duration: "1h 30min" },
                      { title: "Model Evaluation", lessons: 6, duration: "1h 10min" },
                      { title: "Final Project", lessons: 3, duration: "2h" }
                    ].map((module, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{module.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{module.lessons} lessons</span>
                            <span>{module.duration}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div>
                <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-semibold text-gray-900 mb-2">
                      {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                    </div>
                    {!course.is_free && (
                      <div className="text-sm text-gray-600">One-time payment • Lifetime access</div>
                    )}
                  </div>

                  <Link
                    href={`/auth/signup?redirect=/dashboard/courses/${course.id}`}
                    className="w-full block text-center bg-[#1447E6] text-white px-6 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium mb-4"
                  >
                    {course.is_free ? 'Enroll for Free' : 'Enroll Now'}
                  </Link>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">8 weeks of content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Join {course.enrollment_count}+ students</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
