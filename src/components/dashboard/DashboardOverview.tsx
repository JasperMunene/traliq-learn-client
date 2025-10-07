import { ArrowRight, Clock, Users, Star, Play, TrendingUp, Sparkles, Calendar, BookOpen, Zap, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    course_type?: 'public' | 'corporate';
    tutor: { id: string; first_name: string; last_name: string; avatar_url: string | null };
    attendee_count: number;
    published_at?: string | null;
    scheduled_start?: string | null;
}

interface Enrollment { id: string; course_id: string; }

export default function DashboardOverview({ user }: DashboardOverviewProps) {
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
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
    const upcomingLiveSessions = courses
        .filter(c => !!c.scheduled_start)
        .sort((a, b) => (new Date(a.scheduled_start || 0).getTime()) - (new Date(b.scheduled_start || 0).getTime()))
        .slice(0, 2);
    const recommendedCourses = [...courses]
        .filter(c => !enrolledCourseIds.has(c.id))
        .sort((a, b) => (b.attendee_count || 0) - (a.attendee_count || 0))
        .slice(0, 3);
    const trendingCourses = [...courses]
        .sort((a, b) => (b.attendee_count || 0) - (a.attendee_count || 0))
        .slice(0, 3);

    const getDefaultThumbnail = (index: number) => {
        const thumbnails = [
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400",
            "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400"
        ];
        return thumbnails[index % thumbnails.length];
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 dark:border-brand-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 dark:from-brand-700 dark:via-brand-800 dark:to-brand-900 rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-theme-xl)' }}>
                <div className="p-8 md:p-10 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="flex items-start justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                                <Zap className="w-4 h-4" />
                                Your AI Learning Hub
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                Welcome back, {user ? user.first_name : '...'}! 🚀
                            </h1>
                            <p className="text-lg text-white/90 mb-2 max-w-2xl">
                                {enrolledCourses.length > 0 ? `You're enrolled in ${enrolledCourses.length} course${enrolledCourses.length > 1 ? 's' : ''}. Keep the momentum going!` : 'Start your AI mastery journey today. Join thousands of learners transforming their careers.'}
                            </p>
                            <p className="text-sm text-white/75 mb-6 max-w-2xl">
                                💎 Live sessions • 🎓 Expert instructors • ♾️ Lifetime access
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/dashboard/courses"
                                    className="bg-white hover:bg-gray-50 text-brand-600 dark:text-brand-700 px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    {enrolledCourses.length > 0 ? 'Explore More Courses' : 'Browse All Courses'}
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                {upcomingLiveSessions.length > 0 && (
                                    <Link
                                        href="#live-sessions"
                                        className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Join Live Sessions
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center" style={{ boxShadow: 'var(--shadow-theme-lg)' }}>
                                <Award className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Live Sessions */}
            {upcomingLiveSessions.length > 0 && (
            <div id="live-sessions">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Upcoming Live Sessions</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Join experts in real-time • Limited seats available</p>
                    </div>
                    <Link href="/dashboard/courses" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {upcomingLiveSessions.map((session, idx) => {
                        const isLive = session.published_at && session.scheduled_start && new Date(session.scheduled_start) <= new Date();
                        const scheduledDate = session.scheduled_start ? new Date(session.scheduled_start) : null;
                        return (
                        <Link key={session.id} href={`/dashboard/courses/${session.id}`} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all group" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                            <div className="relative h-48">
                                <Image src={session.thumbnail_url || getDefaultThumbnail(idx)} alt={session.title} width={400} height={200} className="w-full h-full object-cover" />
                                {isLive && (
                                    <div className="absolute top-3 left-3 bg-error-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full"></span>
                                        LIVE NOW
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {session.attendee_count || 0}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">{session.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">by {session.tutor.first_name} {session.tutor.last_name}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        {scheduledDate ? scheduledDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                    </div>
                                    <span className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5">
                                        <Play className="w-3.5 h-3.5" />
                                        {isLive ? 'Join Now' : 'Reserve Seat'}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    )})}</div>
            </div>
            )}

            {/* Continue Learning */}
            {enrolledCourses.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Enrolled Courses</h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Continue your learning journey</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {enrolledCourses.slice(0, 2).map((course, idx) => (
                            <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl transition-all group" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                                <div className="flex">
                                    <div className="relative w-40 h-32 flex-shrink-0">
                                        <Image src={course.thumbnail_url || getDefaultThumbnail(idx)} alt={course.title} width={160} height={128} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">{course.title}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">by {course.tutor.first_name} {course.tutor.last_name}</p>
                                        <div className="mt-auto">
                                            <span className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-medium">
                                                <Play className="w-3 h-3" />
                                                Continue watching
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended For You */}
            {recommendedCourses.length > 0 && (
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Hot Courses - Enroll Now</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Most popular courses • Join thousands of learners</p>
                    </div>
                    <Link href="/dashboard/courses" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium text-sm flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {recommendedCourses.map((course, idx) => (
                        <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-2xl hover:scale-105 transition-all group" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                            <div className="relative h-40">
                                <Image src={course.thumbnail_url || getDefaultThumbnail(idx)} alt={course.title} width={400} height={160} className="w-full h-full object-cover" />
                                {course.is_free && (
                                    <div className="absolute top-3 right-3 bg-success-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">FREE</div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">by {course.tutor.first_name} {course.tutor.last_name}</p>
                                <div className="flex items-center gap-3 text-sm mb-4">
                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                        <Users className="w-4 h-4" />
                                        <span>{(course.attendee_count || 0).toLocaleString()}</span>
                                    </div>
                                    <div className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs">
                                        {course.level}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">{course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}</span>
                                    <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                                        Enroll
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            )}

            {/* Trending Courses */}
            {trendingCourses.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">🚀 Most Popular Right Now</h2>
                </div>
                <div className="space-y-4">
                    {trendingCourses.map((course, index) => (
                        <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800 -mx-3 px-3 rounded-lg transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-sm">
                                    #{index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{course.title}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{(course.attendee_count || 0).toLocaleString()} students enrolled</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 px-2 py-1 rounded text-xs font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    Hot
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            )}
            </div>

            {/* Mini Sidebar */}
            <div className="hidden xl:block w-80 space-y-6 flex-shrink-0">
                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 sticky top-6" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Your Progress</h3>
                    <div className="space-y-4">
                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Courses Enrolled</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{enrolledCourses.length}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Available Courses</span>
                                <span className="text-lg font-bold text-gray-900 dark:text-white">{courses.length}</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Keep Learning</span>
                                <span className="text-2xl">🔥</span>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Start Today!</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Build your AI skills</p>
                        </div>
                    </div>
                </div>

                {/* Course Resources */}
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5" style={{ boxShadow: 'var(--shadow-theme-md)' }}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Access</h3>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/courses"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">All Courses</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{courses.length} available</p>
                            </div>
                        </Link>

                        <Link
                            href="/dashboard/courses"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-success-600 dark:text-success-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">My Courses</p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{enrolledCourses.length} enrolled</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-700 dark:to-brand-900 border border-brand-500 dark:border-brand-800 rounded-xl p-5" style={{ boxShadow: 'var(--shadow-theme-lg)' }}>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white mb-1">Start Learning Today</h3>
                            <p className="text-sm text-white/90 mb-3">Join {courses.length}+ AI courses and transform your career</p>
                            <Link href="/dashboard/courses" className="inline-block bg-white text-brand-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}