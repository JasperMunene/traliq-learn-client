import { Clock, Users, Star, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function RecommendedCourses() {
    const recommendations = [
        {
            title: "Advanced Neural Networks",
            instructor: "Dr. Emily Watson",
            duration: "10 weeks",
            students: "1,234",
            rating: "4.8",
            image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
            reason: "Based on your ML progress"
        },
        {
            title: "AI Ethics & Governance",
            instructor: "Prof. David Kim",
            duration: "6 weeks",
            students: "2,156",
            rating: "4.9",
            image: "https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=400",
            reason: "Trending in your field"
        },
        {
            title: "Reinforcement Learning",
            instructor: "Alex Chen",
            duration: "12 weeks",
            students: "987",
            rating: "4.7",
            image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=400",
            reason: "Next step in your journey"
        }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                <button className="text-blue-400 hover:text-blue-500 font-medium flex items-center gap-1">
                    View All
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {recommendations.map((course, index) => (
                    <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group">
                        <div className="relative h-40">
                            <Image
                                src={course.image}
                                alt={course.title}
                                width={500}
                                height={500}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  {course.reason}
                </span>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-1 leading-tight">{course.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">by {course.instructor}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span>{course.students}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                    <span>{course.rating}</span>
                                </div>
                            </div>

                            <button className="w-full bg-gray-900 text-white py-2 rounded-full hover:bg-gray-800 transition-colors duration-200 text-sm font-medium">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}