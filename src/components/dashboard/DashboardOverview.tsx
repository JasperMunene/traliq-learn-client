import { Clock, BookOpen, Award, TrendingUp, Video } from "lucide-react";
import Link from "next/link";

interface UserData {
    first_name: string;
}

interface DashboardOverviewProps {
    user: UserData | null;
}

export default function DashboardOverview({ user }: DashboardOverviewProps) {
    const stats = [
        {
            label: "Courses Enrolled",
            value: "12",
            change: "+2 this month",
            icon: BookOpen,
            color: "bg-gray-100 text-gray-900"
        },
        {
            label: "Hours Learned",
            value: "147",
            change: "+23 this week",
            icon: Clock,
            color: "bg-gray-100 text-gray-900"
        },
        {
            label: "Certificates Earned",
            value: "8",
            change: "+1 this week",
            icon: Award,
            color: "bg-gray-100 text-gray-900"
        },
        {
            label: "Skill Level",
            value: "Advanced",
            change: "Intermediate → Advanced",
            icon: TrendingUp,
            color: "bg-gray-100 text-gray-900"
        }
    ];

    return (
        <div>
            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {user ? user.first_name : '...'}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Continue your AI learning journey. You&apos;re making great progress!
                    </p>
                </div>
                <Link
                    href="http://localhost:3000/dashboard/join/7743fbdb-9489-4921-8ea0-b12c8069194f"
                    className="flex-shrink-0 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 shadow-sm"
                >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Join Class</span>
                </Link>
            </div>

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
        </div>
    );
}