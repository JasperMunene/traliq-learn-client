import { Star, Quote } from "lucide-react";
import Image from "next/image";

export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Data Scientist at Microsoft",
            image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "Traliq AI transformed my career. The live ML fundamentals course gave me the confidence to transition into data science. I asked 50+ questions during live Q&A sessions and got personalized guidance. Within 4 months, I landed my dream role with a $45K salary increase. The lifetime replay access means I still reference lessons today.",
            rating: 5,
            course: "Machine Learning Fundamentals"
        },
        {
            name: "Marcus Chen",
            role: "AI Engineer at Tesla",
            image: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "The live deep learning course exceeded all expectations. Being able to ask questions in real-time during sessions accelerated my learning 10x. The instructor shared insider tips from Tesla's AI team. I landed my current role 2 weeks after completing the course. Best investment I've ever made—ROI was 3,000%.",
            rating: 5,
            course: "Deep Learning with PyTorch"
        },
        {
            name: "Emily Rodriguez",
            role: "Product Manager at OpenAI",
            image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
            content: "As a non-technical PM entering AI, I was terrified. But the live Q&A sessions saved me—I could ask 'dumb' questions without judgment. The instructor explained complex concepts in plain English. Within 3 months, I'm now leading OpenAI product strategy. The lifetime replays let me revisit concepts whenever needed. Worth every penny.",
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
                    <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        ⭐ 4.9/5 Average Rating from 50,000+ Students
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Join Professionals from Google, Microsoft & Tesla
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        Real stories from AI professionals who transformed their careers with live courses and on-demand replays. See specific salary increases and role changes.
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