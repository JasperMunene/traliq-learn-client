import { ArrowRight, Clock, Users, Star, Play, TrendingUp, Sparkles, Calendar, BookOpen } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserData {
    first_name: string;
}

interface DashboardOverviewProps {
    user: UserData | null;
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 12 });

    // Countdown timer for live session
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { hours: prev.hours, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const upcomingLiveSessions = [
        {
            id: "1",
            title: "Deep Learning with PyTorch",
            instructor: "Dr. Sarah Chen",
            time: "Today, 3:00 PM",
            attendees: 127,
            live: true,
            thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400"
        },
        {
            id: "2",
            title: "NLP Transformers Workshop",
            instructor: "Prof. James Miller",
            time: "Tomorrow, 2:00 PM",
            attendees: 89,
            live: false,
            thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400"
        }
    ];

    const continueWatching = [
        {
            id: "1",
            title: "Introduction to Machine Learning",
            progress: 67,
            lastWatched: "2 hours ago",
            thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400"
        },
        {
            id: "2",
            title: "Advanced Neural Networks",
            progress: 34,
            lastWatched: "Yesterday",
            thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"
        }
    ];

    const recommendedCourses = [
        {
            id: "1",
            title: "AI Ethics & Responsible AI",
            instructor: "Dr. Maya Patel",
            rating: 4.9,
            students: 2341,
            price: "KES 4,500",
            thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400"
        },
        {
            id: "2",
            title: "Computer Vision Masterclass",
            instructor: "Alex Thompson",
            rating: 4.8,
            students: 1892,
            price: "KES 5,200",
            thumbnail: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400"
        },
        {
            id: "3",
            title: "Reinforcement Learning",
            instructor: "Dr. Kevin Zhang",
            rating: 4.9,
            students: 1567,
            price: "KES 6,000",
            thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"
        }
    ];

    const trendingCourses = [
        { title: "GPT & Large Language Models", students: 3456, trend: "+245% this week" },
        { title: "Stable Diffusion AI Art", students: 2891, trend: "+189% this week" },
        { title: "AutoGPT & AI Agents", students: 2103, trend: "+156% this week" }
    ];

    return (
        <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="p-8 md:p-10 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
                    
                    <div className="flex items-start justify-between gap-6 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-medium mb-4">
                                <Sparkles className="w-4 h-4" />
                                Your Learning Hub
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                Welcome back, {user ? user.first_name : '...'}! 🎯
                            </h1>
                            <p className="text-lg text-blue-50 mb-6 max-w-2xl">
                                Ready to level up your AI skills? Explore new courses or join a live session today.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/dashboard/courses"
                                    className="bg-white hover:bg-blue-50 text-blue-600 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
                                >
                                    Explore Courses
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="#live-sessions"
                                    className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <Calendar className="w-4 h-4" />
                                    View Live Sessions
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                <BookOpen className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Live Sessions */}
            <div id="live-sessions">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Upcoming Live Sessions</h2>
                        <p className="text-gray-600 text-sm mt-1">Join experts in real-time learning</p>
                    </div>
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {upcomingLiveSessions.map((session) => (
                        <div key={session.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="relative h-48">
                                <img src={session.thumbnail} alt={session.title} className="w-full h-full object-cover" />
                                {session.live && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full"></span>
                                        LIVE NOW
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {session.attendees}
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{session.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{session.instructor}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        {session.time}
                                    </div>
                                    <Link
                                        href={`#`}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5"
                                    >
                                        <Play className="w-3.5 h-3.5" />
                                        {session.live ? 'Join Now' : 'Reserve Seat'}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Continue Learning */}
            {continueWatching.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Continue Learning</h2>
                            <p className="text-gray-600 text-sm mt-1">Pick up where you left off</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {continueWatching.map((course) => (
                            <Link key={course.id} href={`#`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group">
                                <div className="flex">
                                    <div className="relative w-40 h-32 flex-shrink-0">
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                                <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-4">
                                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-xs text-gray-500 mb-3">{course.lastWatched}</p>
                                        <div>
                                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                                <span>{course.progress}% complete</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                <div
                                                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended For You */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
                        <p className="text-gray-600 text-sm mt-1">Curated based on your learning path</p>
                    </div>
                    <Link href="/dashboard/courses" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {recommendedCourses.map((course) => (
                        <Link key={course.id} href={`#`} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                            <div className="relative h-40">
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{course.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>
                                <div className="flex items-center gap-3 text-sm mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-semibold text-gray-900">{course.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900">{course.price}</span>
                                    <span className="text-blue-600 font-medium text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                                        Enroll Now
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Trending Courses */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-5">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-bold text-gray-900">Trending This Week</h2>
                </div>
                <div className="space-y-4">
                    {trendingCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">
                                    #{index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{course.title}</p>
                                    <p className="text-sm text-gray-600">{course.students.toLocaleString()} students enrolled</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    {course.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>

            {/* Mini Sidebar */}
            <div className="hidden xl:block w-80 space-y-6 flex-shrink-0">
                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Completion Rate</span>
                                <span className="text-sm font-bold text-gray-900">67%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                            </div>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Courses Enrolled</span>
                                <span className="text-lg font-bold text-gray-900">12</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Hours Learned</span>
                                <span className="text-lg font-bold text-gray-900">147</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-sm text-gray-600">Certificates</span>
                                <span className="text-lg font-bold text-gray-900">8</span>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Current Streak</span>
                                <span className="text-2xl">🔥</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 mt-1">28 days</p>
                            <p className="text-xs text-gray-500 mt-1">Keep it going!</p>
                        </div>
                    </div>
                </div>

                {/* Course Resources */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Access</h3>
                    <div className="space-y-3">
                        <Link
                            href="#"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">My Notes</p>
                                <p className="text-xs text-gray-500">24 notes</p>
                            </div>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Star className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Saved Items</p>
                                <p className="text-xs text-gray-500">18 items</p>
                            </div>
                        </Link>

                        <Link
                            href="#"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Study Groups</p>
                                <p className="text-xs text-gray-500">3 active</p>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">This Week</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Videos Watched</span>
                            <span className="text-sm font-bold text-gray-900">23</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Quizzes Taken</span>
                            <span className="text-sm font-bold text-gray-900">8</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Study Time</span>
                            <span className="text-sm font-bold text-gray-900">12.5h</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">Assignments</span>
                            <span className="text-sm font-bold text-green-600">4/5 Done</span>
                        </div>
                    </div>
                </div>

                {/* Upcoming Deadline */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">Upcoming Deadline</h3>
                            <p className="text-sm text-gray-700 mb-2">ML Final Project</p>
                            <p className="text-xs text-orange-700 font-medium">Due in 3 days</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}