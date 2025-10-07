"use client";

import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "@/lib/config";

interface Course {
    id: string;
    title: string;
    category: string;
    level: string;
    price: number;
    currency: string;
    is_free: boolean;
    thumbnail_url: string | null;
    tutor: {
        first_name: string;
        last_name: string;
    };
    attendee_count: number;
}

export default function CoursesSection() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(API_ENDPOINTS.courses.list)
            .then(res => res.json())
            .then(data => {
                setCourses((data.courses || []).slice(0, 6));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getDefaultThumbnail = (i: number) => {
        const imgs = [
            "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8386435/pexels-photo-8386435.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8386433/pexels-photo-8386433.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&w=800"
        ];
        return imgs[i % imgs.length];
    };

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
                    {loading ? <div className="col-span-3 text-center py-12"><div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div></div> : courses.map((course, index) => (
                        <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
                            {/* Course Image */}
                            <div className="relative h-48">
                                <Image
                                    src={course.thumbnail_url || getDefaultThumbnail(index)}
                                    alt={course.title}
                                    width={500}
                                    height={500}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="bg-white/95 backdrop-blur-sm text-gray-700 px-2.5 py-1 rounded text-xs font-medium">
                                        {course.level}
                                    </span>
                                </div>
                                {course.is_free && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-green-500 text-white px-2.5 py-1 rounded text-xs font-bold">FREE</span>
                                    </div>
                                )}
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {course.title}
                                </h3>

                                <p className="text-sm text-gray-600 mb-4">
                                    by {course.tutor.first_name} {course.tutor.last_name}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.attendee_count || 0} students</span>
                                    </div>
                                    <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                        {course.category}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <span className="text-xl font-semibold text-gray-900">
                                        {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                    </span>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                        View Course
                                    </button>
                                </div>
                            </div>
                        </Link>
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