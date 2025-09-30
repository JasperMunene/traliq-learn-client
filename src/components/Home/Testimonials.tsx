import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Data Scientist at Microsoft",
            image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "Traliq AI transformed my career. The ML fundamentals course gave me the confidence to transition into data science. The hands-on approach and expert mentorship made all the difference.",
            rating: 5,
            course: "Machine Learning Fundamentals"
        },
        {
            name: "Marcus Chen",
            role: "AI Engineer at Tesla",
            image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "The deep learning course exceeded my expectations. Real-world projects and industry insights helped me land my dream job. The community support is incredible.",
            rating: 5,
            course: "Deep Learning with PyTorch"
        },
        {
            name: "Emily Rodriguez",
            role: "Product Manager at OpenAI",
            image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "As a non-technical person entering AI, I was intimidated. Traliq AI's beginner-friendly approach and supportive community made learning accessible and enjoyable.",
            rating: 5,
            course: "AI for Business Strategy"
        }
    ];

    const stats = [
        { number: "50K+", label: "Students Enrolled" },
        { number: "95%", label: "Course Completion Rate" },
        { number: "4.9/5", label: "Average Rating" },
        { number: "80%", label: "Career Advancement" }
    ];

    return (
        <section className="bg-gray-50 px-6 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Stats Section */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Trusted by Professionals Worldwide
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Join thousands of professionals who have transformed their careers with our AI courses
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                            {/* Quote Icon */}
                            <div className="mb-6">
                                <Quote className="w-8 h-8 text-blue-400" />
                            </div>

                            {/* Content */}
                            <blockquote className="text-gray-700 leading-relaxed mb-6">
                                &apos;{testimonial.content}&apos;
                            </blockquote>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <Image
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    width={50}
                                    height={50}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {testimonial.role}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">
                                        Completed: {testimonial.course}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}