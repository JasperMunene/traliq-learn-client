'use client'
import { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight, Star, Award, Zap } from "lucide-react";

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

    interface Course {
        id: string;
        title: string;
        category: string;
        level: string;
        price: number;
        currency: string;
        is_free: boolean;
        thumbnail_url: string | null;
        tutor: { first_name: string; last_name: string };
        attendee_count: number;
    }

    const [recommended, setRecommended] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        let mounted = true;
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses');
                if (res.ok) {
                    const data = await res.json();
                    const list: Course[] = data.courses || [];
                    if (!mounted) return;
                    setRecommended(list.slice(0, 2));
                }
            } catch (e) {
                // fail silently
            } finally {
                if (!mounted) return;
                setLoading(false);
                onLoaded?.();
            }
        };
        fetchCourses();
        return () => { mounted = false };
    }, [onLoaded]);

    const getDefaultThumbnail = (index: number) => {
        const thumbnails = [
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"
        ];
        return thumbnails[index % thumbnails.length];
    };

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
                                
                                <a 
                                    href={`/dashboard/courses/${featuredCourse.id}`}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2 group"
                                >
                                    Enroll Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* More Courses */}
                {!loading && recommended.length > 0 && (
                    <div className="mt-20">
                        <h3 className="text-gray-900 text-xl font-semibold mb-6">
                            More Popular Courses
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {recommended.map((course, index) => (
                                <a
                                    key={course.id}
                                    href={`/dashboard/courses/${course.id}`}
                                    className="bg-white border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                            <img
                                                src={course.thumbnail_url || getDefaultThumbnail(index)}
                                                alt={course.title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-base mb-1 group-hover:text-blue-600 transition-colors">
                                                {course.title}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-3">
                                                by {course.tutor.first_name} {course.tutor.last_name}
                                            </p>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-500">
                                                    {course.attendee_count || 0} students
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}