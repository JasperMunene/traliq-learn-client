import { ArrowRight, Users, Play, BookOpen, Target, CheckCircle, Trophy, Award } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

interface UserData {
    first_name: string;
}

interface DashboardOverviewProps {
    user: UserData | null;
}

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    currency: string;
    is_free: boolean;
    thumbnail_url: string | null;
    tutor: { id: string; first_name: string; last_name: string; avatar_url: string | null };
    attendee_count: number;
}

interface Enrollment { 
    id: string; 
    course_id: string; 
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesResp, enrollResp] = await Promise.all([
                    fetchWithAuth(API_ENDPOINTS.courses.list),
                    fetchWithAuth(API_ENDPOINTS.enrollments.mine),
                ]);

                if (coursesResp.ok) {
                    const data = await coursesResp.json();
                    setCourses(Array.isArray(data.courses) ? data.courses : []);
                }
                if (enrollResp.ok) {
                    const data = await enrollResp.json();
                    setEnrollments(Array.isArray(data.enrollments) ? data.enrollments : []);
                }
            } catch (e) {
                console.error('Error loading dashboard data', e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const enrolledCourseIds = new Set(enrollments.map(e => e.course_id));
    const enrolledCourses = courses.filter(c => enrolledCourseIds.has(c.id));
    const recommendedCourses = courses.filter(c => !enrolledCourseIds.has(c.id)).slice(0, 6);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Premium Hero Section */}
            <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full -ml-40 -mb-40 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/10 rounded-full animate-bounce delay-500"></div>
                    <div className="absolute top-1/4 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-bounce delay-700"></div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
                    <div className="flex items-center justify-between">
                        <div className="flex-1 max-w-4xl">
                            {/* Premium Badge */}
                            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <Target className="w-4 h-4" />
                                <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-semibold">
                                    Your AI Learning Journey
                                </span>
                            </div>
                            
                            {/* Main Heading with Gradient Text */}
                            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                                <span className="block">Welcome back,</span>
                                <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent">
                                    {user ? user.first_name : 'Learner'}! 🚀
                                </span>
                            </h1>
                            
                            {/* Enhanced Description */}
                            <div className="space-y-4 mb-10">
                                <p className="text-xl lg:text-2xl text-blue-100 font-light leading-relaxed">
                                    {enrolledCourses.length > 0 
                                        ? `Continue your journey with ${enrolledCourses.length} enrolled course${enrolledCourses.length > 1 ? 's' : ''}` 
                                        : 'Start your AI mastery journey today'
                                    }
                                </p>
                                <div className="flex flex-wrap items-center gap-6 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        <span className="text-sm font-medium">Expert Instructors</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                        <span className="text-sm font-medium">Industry Certificates</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                        <span className="text-sm font-medium">Lifetime Access</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Premium CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/courses"
                                    className="group bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                                >
                                    <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                    {enrolledCourses.length > 0 ? 'Explore More Courses' : 'Browse All Courses'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </Link>
                                
                                {enrolledCourses.length > 0 && (
                                    <Link
                                        href="#my-courses"
                                        className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center justify-center gap-3 hover:scale-105 transform"
                                    >
                                        <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                        Continue Learning
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    </Link>
                                )}
                            </div>
                        </div>
                        
                        {/* Premium Right Side Illustration */}
                        <div className="hidden lg:block relative">
                            <div className="relative">
                                {/* Floating Achievement Cards */}
                                <div className="absolute -top-8 -left-8 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">Course Completed!</p>
                                            <p className="text-xs text-white/70">Machine Learning Basics</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Main Trophy */}
                                <div className="w-40 h-40 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
                                    <Trophy className="w-20 h-20 text-yellow-400 animate-pulse" />
                                </div>
                                
                                {/* Floating Stats Card */}
                                <div className="absolute -bottom-6 -right-6 bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl animate-float delay-1000">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{courses.length}+ Courses</p>
                                            <p className="text-xs text-white/70">Available to learn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg className="w-full h-12 text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="currentColor"></path>
                        <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="currentColor"></path>
                        <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor"></path>
                    </svg>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Premium Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 transform relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-7 h-7 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{enrolledCourses.length}</p>
                            <p className="text-gray-600 font-medium">Enrolled Courses</p>
                            <div className="mt-4 flex items-center text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                Active Learning
                            </div>
                        </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 transform relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-50 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{Math.floor(enrolledCourses.length * 0.3)}</p>
                            <p className="text-gray-600 font-medium">Completed</p>
                            <div className="mt-4 flex items-center text-sm text-blue-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                {enrolledCourses.length > 0 ? Math.round((Math.floor(enrolledCourses.length * 0.3) / enrolledCourses.length) * 100) : 0}% Progress
                            </div>
                        </div>
                    </div>
                    
                    <div className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 transform relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative">
                            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Award className="w-7 h-7 text-purple-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{Math.floor(enrolledCourses.length * 0.2)}</p>
                            <p className="text-gray-600 font-medium">Certificates</p>
                            <div className="mt-4 flex items-center text-sm text-purple-600">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                                Industry Recognized
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Recommended Courses */}
                <div>
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2">Recommended for You</h2>
                            <p className="text-lg text-gray-600">Curated courses to accelerate your AI journey</p>
                        </div>
                        <Link 
                            href="/courses" 
                            className="hidden md:flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                        >
                            View All Courses
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedCourses.map((course) => (
                            <Link 
                                key={course.id} 
                                href={`/courses/${course.id}`} 
                                className="group bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:scale-105 transform overflow-hidden"
                            >
                                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-2xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
                                    <div className="absolute top-4 left-4">
                                        {course.is_free ? (
                                            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">FREE</span>
                                        ) : (
                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">PREMIUM</span>
                                        )}
                                    </div>
                                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                                        <Users className="w-3 h-3" />
                                        {(course.attendee_count || 0).toLocaleString()}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Play className="w-8 h-8 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs font-medium">
                                            {course.level}
                                        </span>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                                            {course.category}
                                        </span>
                                    </div>
                                    
                                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 text-sm mb-4 flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-xs font-medium">{course.tutor.first_name[0]}</span>
                                        </div>
                                        by {course.tutor.first_name} {course.tutor.last_name}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-gray-900">
                                                {course.is_free ? 'Free' : `KES ${course.price.toLocaleString()}`}
                                            </span>
                                            {!course.is_free && (
                                                <p className="text-xs text-gray-500">One-time payment</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                            <span>Enroll</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Mobile View All Button */}
                    <div className="md:hidden mt-8 text-center">
                        <Link 
                            href="/courses" 
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
                        >
                            View All Courses
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
