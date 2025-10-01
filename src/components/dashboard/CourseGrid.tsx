import { Clock, Users, Star, Play, CircleCheck as CheckCircle, BookOpen } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import Link from "next/link";

interface Course {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    price: number;
    currency: string;
    is_free: boolean;
    thumbnail_url: string | null;
    tutor: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
    };
    attendee_count: number;
}

export default function CourseGrid() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            
            // Fetch all courses
            const coursesResponse = await fetchWithAuth('http://16.171.54.227:5000/courses');
            
            if (coursesResponse.ok) {
                const coursesData = await coursesResponse.json();
                setCourses(coursesData.courses || []);
            } else {
                setError('Failed to load courses');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading courses...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={fetchCourses}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* All Courses */}
            {courses.length > 0 ? (
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
                            <div className="relative h-40">
                                <Image
                                    src={course.thumbnail_url || getDefaultThumbnail(index)}
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
                                {course.is_free && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold">
                                            FREE
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-5 flex flex-col flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 flex-1 line-clamp-2">{course.title}</h3>
                                <p className="text-gray-600 text-sm mb-4">by {course.tutor.first_name} {course.tutor.last_name}</p>

                                <div className="flex items-center justify-between text-xs text-gray-500 mb-6">
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.attendee_count || 0} students</span>
                                    </div>
                                    <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                        {course.category}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                    </span>
                                    <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                                        View Course
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            ) : (
            /* Empty State */
                <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                    <p className="text-gray-600 mb-6">Start your learning journey by exploring our courses</p>
                    <Link
                        href="/dashboard"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Explore Courses
                    </Link>
                </div>
            )}
        </div>
    );
}