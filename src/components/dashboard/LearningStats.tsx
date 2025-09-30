import { Target, Award, TrendingUp } from "lucide-react";

export default function LearningStats() {
    const goals = [
        { label: "Weekly Goal", current: 18, target: 20, unit: "hours" },
        { label: "Monthly Goal", current: 65, target: 80, unit: "hours" },
        { label: "Course Goal", current: 3, target: 5, unit: "courses" }
    ];

    const streakData = {
        current: 28,
        best: 45,
        thisWeek: 7
    };

    return (
        <div className="space-y-6">
            {/* Learning Goals */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    Learning Goals
                </h3>

                <div className="space-y-4">
                    {goals.map((goal, index) => {
                        const percentage = (goal.current / goal.target) * 100;
                        return (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-900">{goal.label}</span>
                                    <span className="text-gray-600">
                    {goal.current}/{goal.target} {goal.unit}
                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {percentage >= 100 ? 'Goal achieved! 🎉' : `${Math.round(percentage)}% complete`}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-400" />
                    Learning Streak
                </h3>

                <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{streakData.current}</div>
                    <div className="text-sm text-gray-600">days in a row</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-gray-900">{streakData.best}</div>
                        <div className="text-xs text-gray-600">Best streak</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-lg font-bold text-gray-900">{streakData.thisWeek}</div>
                        <div className="text-xs text-gray-600">This week</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    This Month
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Total Hours</span>
                        <span className="font-semibold text-gray-900">65h</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Lessons Completed</span>
                        <span className="font-semibold text-gray-900">47</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Quizzes Passed</span>
                        <span className="font-semibold text-gray-900">23</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Projects Submitted</span>
                        <span className="font-semibold text-gray-900">8</span>
                    </div>
                </div>
            </div>
        </div>
    );
}