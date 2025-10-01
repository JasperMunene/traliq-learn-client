import { Users, DollarSign, Video, TrendingUp, BookOpen, Star } from "lucide-react";
import Link from "next/link";

interface UserData {
    first_name: string;
}

interface TutorOverviewProps {
    user: UserData | null;
}

export default function TutorOverview({ user }: TutorOverviewProps) {
    const stats = [
        {
            label: "Total Students",
            value: "124",
            change: "+12 this month",
            icon: Users,
            color: "bg-blue-100 text-blue-900"
        },
        {
            label: "Active Courses",
            value: "8",
            change: "3 in progress",
            icon: BookOpen,
            color: "bg-green-100 text-green-900"
        },
        {
            label: "Monthly Revenue",
            value: "$2,450",
            change: "+15% from last month",
            icon: DollarSign,
            color: "bg-purple-100 text-purple-900"
        },
        {
            label: "Average Rating",
            value: "4.8",
            change: "Based on 89 reviews",
            icon: Star,
            color: "bg-yellow-100 text-yellow-900"
        }
    ];

    const upcomingSessions = [
        {
            title: "Machine Learning Fundamentals",
            students: 24,
            time: "Today, 2:00 PM",
            duration: "90 min"
        },
        {
            title: "Deep Learning Advanced",
            students: 18,
            time: "Tomorrow, 10:00 AM",
            duration: "120 min"
        },
        {
            title: "AI Ethics Workshop",
            students: 32,
            time: "Mar 25, 3:00 PM",
            duration: "60 min"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user ? user.first_name : '...'} 👋
                    </h1>
                    <p className="text-gray-600">
                        Here&apos;s what&apos;s happening with your courses today.
                    </p>
                </div>
                <Link
                    href="/dashboard/course/create"
                    className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Course</span>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
                                <p className="text-xs text-gray-900 font-medium">{stat.change}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                            <Video className="w-5 h-5 text-gray-900" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                            <p className="text-sm text-gray-600">Your scheduled live classes</p>
                        </div>
                    </div>
                    <Link
                        href="/dashboard?tab=sessions"
                        className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors hover:underline"
                    >
                        View all
                    </Link>
                </div>

                <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {session.students} students
                                    </span>
                                    <span>{session.time}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{session.duration}</span>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all text-sm font-medium">
                                Start Session
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-purple-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Revenue Trend</h2>
                            <p className="text-sm text-gray-600">Last 6 months</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between h-32 gap-2">
                        {[65, 78, 82, 75, 88, 95].map((height, i) => (
                            <div key={i} className="flex-1 bg-gray-200 rounded-t-lg relative" style={{ height: `${height}%` }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-gray-700 rounded-t-lg"></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                        <span>Oct</span>
                        <span>Nov</span>
                        <span>Dec</span>
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                    </div>
                </div>

                {/* Top Courses */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-green-900" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Top Performing Courses</h2>
                            <p className="text-sm text-gray-600">By enrollment</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "Machine Learning Basics", students: 124, rating: 4.9 },
                            { name: "Deep Learning Advanced", students: 98, rating: 4.8 },
                            { name: "AI Ethics", students: 87, rating: 4.7 }
                        ].map((course, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{course.name}</p>
                                    <p className="text-xs text-gray-600">{course.students} students</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    <span className="font-semibold text-gray-900">{course.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
