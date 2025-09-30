'use client'
import { useState } from "react";
import {
    Play,
    Volume2,
    Maximize,
    CheckCircle,
    Circle,
    Download,
    FileText,
    MessageSquare,
    Share2,
    BookOpen,
    Clock,
    Users,
    Star,
    ChevronDown,
    Send
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function SingleCoursePage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedModule, setExpandedModule] = useState(0);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [question, setQuestion] = useState("");
    const [user] = useState(null);

    const courseData = {
        title: "Complete AI & Machine Learning Bootcamp",
        instructor: "Dr. Sarah Johnson",
        rating: 4.8,
        students: 12453,
        duration: "24 hours",
        level: "Intermediate",
        progress: 45,
        currentVideo: "Introduction to Neural Networks"
    };

    const modules = [
        {
            title: "Getting Started with AI",
            duration: "2h 30m",
            lessons: [
                { title: "Introduction to AI", duration: "15:30", completed: true },
                { title: "Setting up your environment", duration: "20:15", completed: true },
                { title: "Your first AI model", duration: "25:45", completed: false }
            ]
        },
        {
            title: "Neural Networks Fundamentals",
            duration: "3h 45m",
            lessons: [
                { title: "What are Neural Networks?", duration: "18:20", completed: false },
                { title: "Activation Functions", duration: "22:10", completed: false },
                { title: "Backpropagation Explained", duration: "30:15", completed: false }
            ]
        },
        {
            title: "Deep Learning Advanced",
            duration: "4h 15m",
            lessons: [
                { title: "CNN Architecture", duration: "25:30", completed: false },
                { title: "RNN and LSTM", duration: "28:45", completed: false },
                { title: "Transfer Learning", duration: "32:20", completed: false }
            ]
        }
    ];

    const resources = [
        { name: "Course Slides - Module 1.pdf", size: "2.4 MB", type: "PDF" },
        { name: "Code Examples.zip", size: "15.8 MB", type: "ZIP" },
        { name: "Dataset - Training Data.csv", size: "45.2 MB", type: "CSV" },
        { name: "Cheat Sheet.pdf", size: "1.2 MB", type: "PDF" }
    ];

    const discussions = [
        {
            user: "John Doe",
            avatar: "JD",
            question: "How do I implement dropout in PyTorch?",
            replies: 3,
            time: "2 hours ago"
        },
        {
            user: "Emma Smith",
            avatar: "ES",
            question: "Can someone explain the difference between CNN and RNN?",
            replies: 5,
            time: "5 hours ago"
        },
        {
            user: "Michael Chen",
            avatar: "MC",
            question: "Getting error in lesson 3 code",
            replies: 1,
            time: "1 day ago"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex">
                <DashboardSidebar
                    activeTab={''}
                    setActiveTab={() => {}}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 lg:ml-64">
                    {/* Video Player Section */}
                    <div className="bg-black">
                        <div className="max-w-7xl mx-auto">
                            <div className="relative aspect-video bg-gray-900">
                                {/* Video Player Placeholder */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        </div>
                                        <p className="text-white text-lg font-medium">{courseData.currentVideo}</p>
                                    </div>
                                </div>

                                {/* Video Controls */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                                    <div className="flex items-center gap-4">
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Play className="w-6 h-6" />
                                        </button>
                                        <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-white w-1/3"></div>
                                        </div>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Volume2 className="w-5 h-5" />
                                        </button>
                                        <button className="text-white hover:text-gray-300 transition-colors">
                                            <Maximize className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Left Column - Course Info & Tabs */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Course Header */}
                                <div className="bg-white rounded-xl border border-gray-200 p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{courseData.title}</h1>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="font-semibold text-gray-900">{courseData.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{courseData.students.toLocaleString()} students</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{courseData.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-4 h-4" />
                                            <span>{courseData.level}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            SJ
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{courseData.instructor}</p>
                                            <p className="text-xs text-gray-500">AI Researcher & Educator</p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">Your Progress</span>
                                            <span className="text-sm font-bold text-gray-900">{courseData.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gray-900 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${courseData.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="border-b border-gray-200">
                                        <div className="flex">
                                            {["overview", "resources", "discussion"].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`flex-1 px-6 py-4 text-sm font-semibold capitalize transition-colors ${
                                                        activeTab === tab
                                                            ? "text-gray-900 border-b-2 border-gray-900"
                                                            : "text-gray-600 hover:text-gray-900"
                                                    }`}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Overview Tab */}
                                        {activeTab === "overview" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-3">About This Course</h3>
                                                    <p className="text-gray-600 leading-relaxed mb-4">
                                                        Master the fundamentals and advanced concepts of Artificial Intelligence and Machine Learning.
                                                        This comprehensive bootcamp covers everything from basic neural networks to advanced deep learning architectures.
                                                    </p>
                                                    <p className="text-gray-600 leading-relaxed">
                                                        You&apos;ll work on real-world projects, understand the mathematics behind AI, and build production-ready models
                                                        using industry-standard frameworks like TensorFlow and PyTorch.
                                                    </p>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-3">What You&apos;ll Learn</h3>
                                                    <ul className="space-y-2">
                                                        {[
                                                            "Build and train neural networks from scratch",
                                                            "Implement CNN and RNN architectures",
                                                            "Work with real-world datasets",
                                                            "Deploy AI models to production",
                                                            "Understand deep learning mathematics"
                                                        ].map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                                                                <span className="text-gray-600">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Resources Tab */}
                                        {activeTab === "resources" && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Materials</h3>
                                                {resources.map((resource, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-gray-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{resource.name}</p>
                                                                <p className="text-xs text-gray-500">{resource.size}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                            <Download className="w-5 h-5 text-gray-600" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Discussion Tab */}
                                        {activeTab === "discussion" && (
                                            <div className="space-y-6">
                                                {/* Ask Question */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ask a Question</h3>
                                                    <div className="flex gap-3">
                                                        <textarea
                                                            value={question}
                                                            onChange={(e) => setQuestion(e.target.value)}
                                                            placeholder="Type your question here..."
                                                            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <button className="mt-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                                                        <Send className="w-4 h-4" />
                                                        Post Question
                                                    </button>
                                                </div>

                                                {/* Questions List */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Discussions</h3>
                                                    <div className="space-y-4">
                                                        {discussions.map((discussion, i) => (
                                                            <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                                        {discussion.avatar}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="font-semibold text-gray-900">{discussion.user}</p>
                                                                            <span className="text-xs text-gray-500">{discussion.time}</span>
                                                                        </div>
                                                                        <p className="text-gray-700 mb-2">{discussion.question}</p>
                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                            <MessageSquare className="w-4 h-4" />
                                                                            <span>{discussion.replies} replies</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Course Content */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900">Course Content</h3>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Share2 className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                        {modules.map((module, moduleIndex) => (
                                            <div key={moduleIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                                                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-900 text-sm">{module.title}</p>
                                                        <p className="text-xs text-gray-500">{module.duration}</p>
                                                    </div>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-600 transition-transform ${
                                                            expandedModule === moduleIndex ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {expandedModule === moduleIndex && (
                                                    <div className="border-t border-gray-200">
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <button
                                                                key={lessonIndex}
                                                                onClick={() => setCurrentLesson(lessonIndex)}
                                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${currentLesson === lessonIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                                            >
                                                                {lesson.completed ? (
                                                                    <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                                                                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}