import { Clock, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
        <section id="courses" className="bg-white px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Featured Courses
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Learn AI from industry experts. Join live or access on-demand.
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {courses.map((course, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
                            {/* Course Image */}
                            <div className="relative h-48">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                                {course.isLive && (
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-medium">
                                            Live
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4">
                                    {course.instructor}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.students}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-xl font-semibold text-gray-900">{course.price}</span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        {course.isLive ? 'Join Live' : 'Enroll'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link href="/dashboard/courses" className="inline-block bg-gray-100 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                        View All Courses
                    </Link>
                </div>
            </div>
        </section>
    );
}