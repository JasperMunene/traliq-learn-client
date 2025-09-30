import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="bg-gray-50 px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                Master AI with Industry-Leading Experts
                                <span className="inline-block ml-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-200 to-purple-200 rounded-xl"></div>
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed">
                                Transform your career with <span className="text-blue-500">practical AI skills</span>.
                                Learn from world-class practitioners and build real-world projects that matter.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 sm:gap-4">
                            <button className="bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-gray-800 transition-all duration-200 font-medium text-sm sm:text-base">
                                Browse Courses
                            </button>
                            <button className="text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium text-sm sm:text-base">
                                Become a Tutor
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-gray-300"></div>

                        {/* Popular AI Topics */}
                        <div className="space-y-4">
                            <h3 className="text-gray-700 font-medium">Popular AI Topics</h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <span className="bg-green-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                    Machine Learning
                                </span>
                                <span className="bg-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                    Deep Learning
                                </span>
                                <span className="bg-blue-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                    Computer Vision
                                </span>
                                <span className="bg-yellow-200 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                                    Natural Language Processing
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Cards */}
                    <div className="space-y-4 order-1 lg:order-2">
                        {/* Top Card - AI Course */}
                        <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-64 sm:h-72 lg:h-80 group">
                            <div className="absolute top-3 left-3 z-10">
                                <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded-full text-xs font-medium shadow-sm">
                                    Bestseller
                                </span>
                            </div>
                            <div className="absolute top-3 right-3 z-10">
                                <button className="w-7 h-7 sm:w-8 sm:h-8 bg-white/95 backdrop-blur-sm rounded-full shadow-sm flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300">
                                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                                </button>
                            </div>

                            {/* Course Image */}
                            <div className="relative w-full h-full">
                                <Image
                                    src="https://res.cloudinary.com/dwcvogqak/image/upload/v1758887167/just-start-young-businessman-with-headphones-sitt-2025-03-24-12-53-50-utc-min_d8xxov.jpg?auto=compress&cs=tinysrgb&w=800"
                                    alt="AI and machine learning workspace"
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                                <div className="absolute bottom-3 left-3 right-12">
                                    <h3 className="text-white text-sm sm:text-base lg:text-lg font-semibold mb-0.5 leading-tight">
                                        Machine Learning Fundamentals
                                    </h3>
                                    <p className="text-white/80 text-xs sm:text-sm">
                                        Course by Dr. Sarah Chen
                                    </p>
                                </div>
                                {/* AI Badge */}
                                <div className="absolute bottom-3 right-3">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
                                        AI
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Bottom Left Card - Community Video */}
                            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-square">
                                <video
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                >
                                    <source
                                        src="https://cdn.prod.website-files.com/667f8fd8b0d0df360cabad8d%2F66bae7f4cf5ced4e81109f66_home-hero-video-media-transcode.webm"
                                        type="video/webm"
                                    />
                                </video>
                            </div>


                            {/* Bottom Right Card - Learning Progress */}
                            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div>
                                        <p className="text-gray-600 text-xs sm:text-sm">Learning streak</p>
                                        <p className="text-xl sm:text-2xl font-bold text-gray-900">28 days</p>
                                        <p className="text-gray-500 text-xs">AI concepts mastered</p>
                                    </div>
                                    <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                                        <span className="text-xs text-gray-600 font-medium">Active</span>
                                    </div>
                                </div>

                                {/* Progress Bars */}
                                <div className="flex items-end justify-between h-12 sm:h-16 gap-1">
                                    <div className="bg-blue-200 h-1/4 w-full rounded-t"></div>
                                    <div className="bg-blue-300 h-2/5 w-full rounded-t"></div>
                                    <div className="bg-blue-400 h-3/4 w-full rounded-t"></div>
                                    <div className="bg-blue-300 h-3/5 w-full rounded-t"></div>
                                    <div className="bg-blue-400 h-full w-full rounded-t"></div>
                                    <div className="bg-blue-200 h-2/5 w-full rounded-t"></div>
                                    <div className="bg-blue-100 h-1/4 w-full rounded-t"></div>
                                </div>

                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>S</span>
                                    <span>M</span>
                                    <span>T</span>
                                    <span>W</span>
                                    <span>T</span>
                                    <span>F</span>
                                    <span>S</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}