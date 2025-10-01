import { Clock, Users, Star, ArrowUpRight, PlayCircle, Award } from "lucide-react";
import Image from "next/image";

export default function CoursesSection() {
    const courses = [
        {
            title: "Machine Learning Fundamentals",
            instructor: "Dr. Sarah Chen",
            duration: "12 weeks",
            students: "2,847",
            rating: "4.9",
            price: "KES 2990",
            category: "Machine Learning",
            image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Beginner",
            isLive: true,
            nextSession: "Today, 6:00 PM EST",
            seatsLeft: 87,
            totalSeats: 100
        },
        {
            title: "Deep Learning with PyTorch",
            instructor: "Alex Rodriguez",
            duration: "16 weeks",
            students: "1,934",
            rating: "4.8",
            price: "KES 3990",
            category: "Deep Learning",
            image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Advanced",
            isLive: true,
            nextSession: "Tomorrow, 8:00 PM EST",
            seatsLeft: 23,
            totalSeats: 100
        },
        {
            title: "Natural Language Processing",
            instructor: "Prof. Michael Kim",
            duration: "10 weeks",
            students: "3,156",
            rating: "4.9",
            price: "KES 3490",
            category: "NLP",
            image: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Intermediate"
        },
        {
            title: "Computer Vision Applications",
            instructor: "Lisa Zhang",
            duration: "14 weeks",
            students: "1,679",
            rating: "4.7",
            price: "KES 4290",
            category: "Computer Vision",
            image: "https://images.pexels.com/photos/8386435/pexels-photo-8386435.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Advanced"
        },
        {
            title: "AI Ethics & Responsible AI",
            instructor: "Dr. James Wilson",
            duration: "6 weeks",
            students: "4,203",
            rating: "4.8",
            price: "KES 1990",
            category: "AI Ethics",
            image: "https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "All Levels"
        },
        {
            title: "AI for Business Strategy",
            instructor: "Emma Thompson",
            duration: "8 weeks",
            students: "2,567",
            rating: "4.9",
            price: "KES 2790",
            category: "Business AI",
            image: "https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Beginner"
        }
    ];

    return (
        <section className="bg-gray-50 px-6 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Live AI Courses & On-Demand Classes—Learn Your Way
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        Join interactive AI webinars with real-time Q&A, then access lifetime replays. Learn Machine Learning, Deep Learning, NLP & Computer Vision from industry experts at Google, Microsoft & Tesla.
                    </p>
                    
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        <button className="px-6 py-2.5 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-all">
                            All Courses
                        </button>
                        <button className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:border-gray-300 transition-all">
                            🔴 Upcoming Live
                        </button>
                        <button className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:border-gray-300 transition-all">
                            On-Demand
                        </button>
                        <button className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:border-gray-300 transition-all">
                            Beginner-Friendly
                        </button>
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            {/* Course Image */}
                            <div className="relative h-48 overflow-hidden">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 flex gap-2">
                                    {course.isLive && (
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                            LIVE
                                        </span>
                                    )}
                                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                        {course.level}
                                    </span>
                                </div>
                                <div className="absolute top-3 right-3">
                                    <button className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
                                        {course.isLive ? <PlayCircle className="w-4 h-4 text-red-600" /> : <ArrowUpRight className="w-4 h-4 text-gray-600" />}
                                    </button>
                                </div>
                                {course.seatsLeft && course.seatsLeft < 30 && (
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <div className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold text-center">
                                            ⚡ Only {course.seatsLeft} seats left - Almost Full!
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                        {course.category}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 text-sm mb-4">
                                    by {course.instructor}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span>{course.rating}</span>
                                    </div>
                                </div>

                                {course.isLive && course.nextSession && (
                                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-blue-900 font-semibold">Next session: {course.nextSession}</span>
                                        </div>
                                        {course.seatsLeft && (
                                            <div className="mt-2">
                                                <div className="flex justify-between text-xs text-blue-700 mb-1">
                                                    <span>{course.seatsLeft}/{course.totalSeats} seats available</span>
                                                    <span>{Math.round((course.seatsLeft / course.totalSeats) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-blue-200 rounded-full h-1.5">
                                                    <div 
                                                        className="bg-blue-600 h-1.5 rounded-full transition-all" 
                                                        style={{ width: `${(course.seatsLeft / course.totalSeats) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                                        <p className="text-xs text-gray-500 mt-1">+ Lifetime replay access</p>
                                    </div>
                                    <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-bold shadow-md hover:shadow-lg flex items-center gap-2">
                                        {course.isLive ? 'Reserve Seat' : 'Enroll Now'}
                                        <Award className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors duration-200 font-medium">
                        View All Courses
                    </button>
                </div>
            </div>
        </section>
    );
}