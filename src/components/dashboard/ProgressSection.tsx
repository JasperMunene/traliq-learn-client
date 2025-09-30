import { TrendingUp } from "lucide-react";

interface ProgressSectionProps {
    detailed?: boolean;
}

export default function ProgressSection({ detailed = false }: ProgressSectionProps) {
    const weeklyProgress = [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 1.8 },
        { day: 'Wed', hours: 3.2 },
        { day: 'Thu', hours: 2.1 },
        { day: 'Fri', hours: 2.8 },
        { day: 'Sat', hours: 4.1 },
        { day: 'Sun', hours: 1.5 }
    ];

    const maxHours = Math.max(...weeklyProgress.map(d => d.hours));

    const courseProgress = [
        { name: "Machine Learning Fundamentals", progress: 75, color: "bg-blue-400" },
        { name: "Deep Learning with PyTorch", progress: 45, color: "bg-green-400" },
        { name: "Computer Vision Applications", progress: 20, color: "bg-purple-400" },
        { name: "Natural Language Processing", progress: 100, color: "bg-orange-400" }
    ];

    const achievements = [
        { title: "First Course Completed", date: "March 15, 2025", icon: "🎓" },
        { title: "7-Day Learning Streak", date: "March 20, 2025", icon: "🔥" },
        { title: "ML Fundamentals Expert", date: "March 22, 2025", icon: "🏆" },
        { title: "Community Contributor", date: "March 25, 2025", icon: "⭐" }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Progress</h2>

                {/* Weekly Activity */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">This Week&apos;s Activity</h3>
                            <p className="text-gray-600 text-sm">18.0 hours of learning</p>
                        </div>
                        <div className="flex items-center gap-2 text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-sm font-medium">+15% from last week</span>
                        </div>
                    </div>

                    <div className="flex items-end justify-between h-32 gap-2">
                        {weeklyProgress.map((day, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100px' }}>
                                    <div
                                        className="bg-blue-400 rounded-t-lg absolute bottom-0 w-full transition-all duration-500"
                                        style={{ height: `${(day.hours / maxHours) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 mt-2">{day.day}</span>
                                <span className="text-xs text-gray-400">{day.hours}h</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Course Progress */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Progress</h3>
                    <div className="space-y-4">
                        {courseProgress.map((course, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-900">{course.name}</span>
                                    <span className="text-gray-600">{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${course.color}`}
                                        style={{ width: `${course.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {detailed && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Achievements</h3>
                        <div className="space-y-4">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-lg">
                                        {achievement.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{achievement.title}</p>
                                        <p className="text-sm text-gray-600">{achievement.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}