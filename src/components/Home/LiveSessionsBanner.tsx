'use client'
import { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { API_ENDPOINTS } from "@/lib/config";

export default function LiveSessionsBanner({ onLoaded }: { onLoaded?: () => void }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 15,
        seconds: 0
    });

    // Recommended static courses (fetched from API once)
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
    const [featured, setFeatured] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    // Countdown timer
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
                const res = await fetch(API_ENDPOINTS.courses.list);
                if (res.ok) {
                    const data = await res.json();
                    const list: Course[] = data.courses || [];
                    if (!mounted) return;
                    // Pick a static featured course (first one) and two recommendations
                    setFeatured(list[0] || null);
                    setRecommended(list.slice(1, 3));
                }
            } catch (e) {
                // fail silently on homepage
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
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
            "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400",
            "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400"
        ];
        return thumbnails[index % thumbnails.length];
    };

    const upcomingSessions = [
        {
            title: "GPT-4 Prompt Engineering Masterclass",
            time: "Today, 3:00 PM EST",
            seatsLeft: 23,
            totalSeats: 100,
            isLive: false
        },
        {
            title: "Machine Learning Fundamentals",
            time: "Tomorrow, 6:00 PM EST",
            seatsLeft: 87,
            totalSeats: 100,
            isLive: false
        },
        {
            title: "Computer Vision Bootcamp",
            time: "Wed, 8:00 PM EST",
            seatsLeft: 12,
            totalSeats: 100,
            isLive: false
        }
    ];

    return (
        <section id="live-sessions" className="bg-blue-600 text-white py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Left: Urgency Message */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm sm:text-base font-bold">UPCOMING LIVE SESSION</span>
                        </div>
                    </div>

                    {/* Center: Session Info */}
                    <div className="flex-1 text-center lg:text-left">
                        {loading ? (
                            <div>
                                <div className="h-6 bg-white/40 rounded w-3/4 mx-auto lg:mx-0 mb-2 animate-pulse" />
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    <div className="h-4 bg-white/30 rounded w-40 animate-pulse" />
                                    <div className="h-4 bg-white/30 rounded w-32 animate-pulse" />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-lg sm:text-xl font-bold mb-1">
                                    {featured ? featured.title : upcomingSessions[0].title}
                                </p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Starts in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>
                                            {featured ? `${featured.attendee_count || 0} students` : `${upcomingSessions[0].seatsLeft} seats left`}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right: CTA Button */}
                    {loading ? (
                        <div className="h-10 w-40 bg-white/70 rounded-full animate-pulse" />
                    ) : (
                        <a 
                            href={featured ? `/dashboard/courses/${featured.id}` : "/dashboard/courses"}
                            className="bg-white text-blue-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                        >
                            View Course
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    )}
                </div>

                <div className="mt-6">
                    {loading ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Array.from({ length: 2 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-lg p-3 flex items-center gap-3">
                                    <div className="w-16 h-16 bg-gray-200 rounded-md animate-pulse" />
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
                                        <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recommended.length > 0 ? (
                        <div className="grid sm:grid-cols-2 gap-4">
                            {recommended.map((course, index) => (
                                <Link
                                    key={course.id}
                                    href={`/dashboard/courses/${course.id}`}
                                    className="bg-white rounded-lg p-3 flex items-center gap-3 hover:bg-white/90 transition-colors"
                                >
                                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
                                        <Image
                                            src={course.thumbnail_url || getDefaultThumbnail(index)}
                                            alt={course.title}
                                            fill
                                            sizes="64px"
                                            className="object-cover"
                                        />
                                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            {course.level}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{course.title}</p>
                                        <p className="text-xs text-gray-600 truncate">
                                            by {course.tutor.first_name} {course.tutor.last_name}
                                        </p>
                                        <div className="flex items-center justify-between mt-2 text-[11px]">
                                            <span className="text-gray-500">
                                                {course.attendee_count || 0} students • {course.category}
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
