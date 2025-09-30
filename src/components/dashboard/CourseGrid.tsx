import { Clock, Users, Star, Play, CircleCheck as CheckCircle } from "lucide-react";
import Image from "next/image";

export default function CourseGrid() {
    const enrolledCourses = [
        {
            title: "Machine Learning Fundamentals",
            instructor: "Dr. Sarah Chen",
            progress: 75,
            duration: "12 weeks",
            students: "2,847",
            rating: "4.9",
            image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
            status: "in-progress",
            nextLesson: "Neural Networks Basics"
        },
        {
            title: "Deep Learning with PyTorch",
            instructor: "Alex Rodriguez",
            progress: 45,
            duration: "16 weeks",
            students: "1,934",
            rating: "4.8",
            image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
            status: "in-progress",
            nextLesson: "Convolutional Neural Networks"
        },
        {
            title: "Natural Language Processing",
            instructor: "Prof. Michael Kim",
            progress: 100,
            duration: "10 weeks",
            students: "3,156",
            rating: "4.9",
            image: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
            status: "completed",
            completedDate: "March 15, 2025"
        },
        {
            title: "Computer Vision Applications",
            instructor: "Lisa Zhang",
            progress: 20,
            duration: "14 weeks",
            students: "1,679",
            rating: "4.7",
            image: "https://images.pexels.com/photos/8386435/pexels-photo-8386435.jpeg?auto=compress&cs=tinysrgb&w=800",
            status: "in-progress",
            nextLesson: "Image Processing Fundamentals"
        }
    ];

    const availableCourses = [
        {
            title: "AI Ethics & Responsible AI",
            instructor: "Dr. James Wilson",
            duration: "6 weeks",
            students: "4,203",
            rating: "4.8",
            price: "KES 199",
            image: "https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "All Levels"
        },
        {
            title: "AI for Business Strategy",
            instructor: "Emma Thompson",
            duration: "8 weeks",
            students: "2,567",
            rating: "4.9",
            price: "$279",
            image: "https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=800",
            level: "Beginner"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Enrolled Courses */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrolledCourses.map((course, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                            <div className="relative h-40">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    {course.status === 'completed' ? (
                                        <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Completed
                    </span>
                                    ) : (
                                        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                                    )}
                                </div>
                                <div className="absolute top-3 right-3">
                                    <button className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
                                        <Play className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex-1">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>

                                {course.status === 'completed' ? (
                                    <div className="mb-4">
                                        <p className="text-sm text-green-600 font-medium">
                                            ✓ Completed on {course.completedDate}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>Progress</span>
                                            <span>{course.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${course.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Next: {course.nextLesson}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
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

                                <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm mt-auto">
                                    {course.status === 'completed' ? 'Review Course' : 'Continue Learning'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Available Courses */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {availableCourses.map((course, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                            <div className="relative h-40">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                  <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium">
                    {course.level}
                  </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex-1">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">by {course.instructor}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
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

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                                    <button className="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}