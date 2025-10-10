'use client'
import { useState, useEffect, useRef } from 'react';
import { Clock, Users, ArrowRight, Star, Award, Zap } from "lucide-react";
import Link from 'next/link';
import { API_ENDPOINTS } from "@/lib/config";

export default function FeaturedCourseBanner({ onLoaded }: { onLoaded?: () => void }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 15,
        seconds: 0
    });

    const featuredCourse = {
        id: "1a735428-387b-4d59-831e-52518cf016c1",
        title: "The No-Code AI Developer",
        category: "Artificial Intelligence",
        level: "Intermediate",
        price: 150,
        currency: "KES",
        is_free: false,
        thumbnail_url: "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/5LELBX2Na6yiCXujFH04jB/2f1bad59326a3dd236906d1ef46cf885/Learner-Yvonne-J-USA.png?auto=format%2Ccompress&dpr=1&w=612&h=375&q=40&fit=crop",
        tutor: { first_name: "Dr. Sarah", last_name: "Kimani" },
        attendee_count: 124,
        description: "Empower non-programmers to build simple AI-driven apps.",
        highlights: ["Lifetime Access", "Certificate of Completion", "Real-world Projects", "Expert Instruction"],
        originalPrice: 2999,
        seatsLeft: 23,
        totalSeats: 100
    };

    const onLoadedRef = useRef(onLoaded);

    // Keep stable reference to onLoaded
    useEffect(() => {
        onLoadedRef.current = onLoaded;
    }, [onLoaded]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return prev;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Call onLoaded when component mounts
    useEffect(() => {
        onLoadedRef.current?.();
    }, []);

    return (
        <section className="bg-gray-50 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Main Featured Course */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-0">
                        {/* Left: Image */}
                        <div className="relative h-64 lg:h-full min-h-[400px]">
                            <img
                                src={featuredCourse.thumbnail_url}
                                alt={featuredCourse.title}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                            
                            {/* Floating badges */}
                            <div className="absolute top-3 left-3">
                                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded text-sm font-medium">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    Featured
                                </span>
                            </div>
                            
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                                        {featuredCourse.level}
                                    </span>
                                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                                        {featuredCourse.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Content */}
                        <div className="p-8 sm:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 mb-3 leading-tight">
                                    {featuredCourse.title}
                                </h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {featuredCourse.description}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">{featuredCourse.attendee_count} students</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Award className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium">Certificate included</span>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">Limited offer ends in</span>
                                    </div>
                                    <div className="flex items-center gap-2 font-mono font-semibold text-lg text-gray-900">
                                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-gray-400">:</span>
                                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-gray-400">:</span>
                                        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    </div>
                                </div>
                                
                                <div className="mt-3 flex items-center gap-2 text-sm">
                                    <Zap className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-600">Only <span className="font-semibold text-gray-900">{featuredCourse.seatsLeft} spots</span> remaining</span>
                                </div>
                            </div>

                            {/* Price and CTA */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-baseline gap-3 mb-1">
                                        <span className="text-4xl font-semibold text-gray-900">
                                            KES {featuredCourse.price.toLocaleString()}
                                        </span>
                                        <span className="text-xl text-gray-400 line-through">
                                            KES {featuredCourse.originalPrice.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium">
                                        Save 95%
                                    </div>
                                </div>
                                
                                <Link 
                                    href={`/courses/${featuredCourse.id}`}
                                    className="bg-[#1447E6] text-white px-6 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium text-lg flex items-center gap-2 group"
                                >
                                    Enroll Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}