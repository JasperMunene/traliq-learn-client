'use client'
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import {
    Play,
    CheckCircle,
    Circle,
    Download,
    FileText,
    MessageSquare,
    Share2,
    Clock,
    Users,
    Star,
    ChevronDown,
    Send,
    Loader2,
    Lock,
    ArrowLeft,
    TrendingUp,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

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
    promo_video_url: string | null;
    published_at: string | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    tutor: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url: string | null;
        bio?: string;
    };
    attendee_count: number;
    created_at: string;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface Enrollment {
    id: string;
    course_id: string;
    user_id: string;
    enrolled_at: string;
}

export default function SingleCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [enrolling, setEnrolling] = useState(false);
    const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
    const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedModule, setExpandedModule] = useState(0);
    const [currentLesson, setCurrentLesson] = useState(0);
    const [question, setQuestion] = useState("");
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
        if (courseId) {
            fetchCourseDetails();
            checkEnrollmentStatus();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    // Check if course is currently live (on the same day as scheduled start)
    useEffect(() => {
        if (!course || !course.scheduled_start || !course.scheduled_end) return;

        const checkLiveStatus = () => {
            const now = new Date();
            const start = new Date(course.scheduled_start!);
            const end = new Date(course.scheduled_end!);
            
            // Check if it's the same day as the scheduled start
            const isSameDay = now.getFullYear() === start.getFullYear() &&
                             now.getMonth() === start.getMonth() &&
                             now.getDate() === start.getDate();
            
            // Check if we're within the scheduled time window
            const isWithinTimeWindow = now >= start && now <= end;
            
            // Show join button if it's the same day OR within the time window
            const isCurrentlyLive = isSameDay || isWithinTimeWindow;
            setIsLive(isCurrentlyLive);
        };

        // Check immediately
        checkLiveStatus();

        // Check every 30 seconds to update live status
        const interval = setInterval(checkLiveStatus, 30000);

        return () => clearInterval(interval);
    }, [course]);

    const fetchCurrentUser = async () => {
        try {
            const response = await fetchWithAuth('http://localhost:5000/api/users/me');
            if (response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await fetchWithAuth(`http://localhost:5000/courses/${courseId}`);
            
            if (response.ok) {
                const data = await response.json();
                setCourse(data);
            } else {
                setError('Failed to load course details');
            }
        } catch (err) {
            console.error('Error fetching course:', err);
            setError('Failed to load course details');
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            // Check if user is enrolled in this course
            const response = await fetchWithAuth('http://localhost:5000/users/me/enrollments');
            if (response.ok) {
                const data = await response.json();
                const enrollments = data.enrollments || [];
                const enrolled = enrollments.some((enrollment: Enrollment) => enrollment.course_id === courseId);
                setIsEnrolled(enrolled);
            }
        } catch (err) {
            console.error('Error checking enrollment:', err);
        }
    };

    const handleEnrollment = async () => {
        if (!course || !currentUser) return;

        // Check if user is the course tutor
        if (course.tutor.id === currentUser.id) {
            setEnrollmentError('You cannot enroll in your own course');
            return;
        }

        setEnrolling(true);
        setEnrollmentError(null);

        try {
            if (course.is_free) {
                // Free course - direct enrollment
                const response = await fetchWithAuth(
                    `http://localhost:5000/courses/${course.id}/enroll`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if (response.ok) {
                    setEnrollmentSuccess(true);
                    setTimeout(() => {
                        window.location.href = `/dashboard/courses/${course.id}`;
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    setEnrollmentError(errorData.error || 'Failed to enroll in course');
                }
            } else {
                // Paid course - initialize payment
                const response = await fetchWithAuth(
                    'http://localhost:5000/api/payments/initialize',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            course_id: course.id,
                            payment_method: 'card'
                        })
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    // Redirect to Paystack payment page
                    window.location.href = data.authorization_url;
                } else {
                    const errorData = await response.json();
                    setEnrollmentError(errorData.error || 'Failed to initialize payment');
                }
            }
        } catch (err) {
            console.error('Error enrolling:', err);
            setEnrollmentError('An error occurred. Please try again.');
        } finally {
            setEnrolling(false);
        }
    };

    // Static data for fields not available from API
    const staticData = {
        rating: 4.8,
        progress: 0,
        currentVideo: "Introduction to Course"
    };

    const modules = [
        {
            title: "Getting Started with AI",
            duration: "2h 30m",
            lessons: [
                { title: "Introduction to AI", duration: "15:30", completed: true },
                { title: "Setting up your environment", duration: "20:15", completed: true },
                { title: "Your first AI model", duration: "25:45", completed: false }
            ]
        },
        {
            title: "Neural Networks Fundamentals",
            duration: "3h 45m",
            lessons: [
                { title: "What are Neural Networks?", duration: "18:20", completed: false },
                { title: "Activation Functions", duration: "22:10", completed: false },
                { title: "Backpropagation Explained", duration: "30:15", completed: false }
            ]
        },
        {
            title: "Deep Learning Advanced",
            duration: "4h 15m",
            lessons: [
                { title: "CNN Architecture", duration: "25:30", completed: false },
                { title: "RNN and LSTM", duration: "28:45", completed: false },
                { title: "Transfer Learning", duration: "32:20", completed: false }
            ]
        }
    ];

    const resources = [
        { name: "Course Slides - Module 1.pdf", size: "2.4 MB", type: "PDF" },
        { name: "Code Examples.zip", size: "15.8 MB", type: "ZIP" },
        { name: "Dataset - Training Data.csv", size: "45.2 MB", type: "CSV" },
        { name: "Cheat Sheet.pdf", size: "1.2 MB", type: "PDF" }
    ];

    const discussions = [
        {
            user: "John Doe",
            avatar: "JD",
            question: "How do I implement dropout in PyTorch?",
            replies: 3,
            time: "2 hours ago"
        },
        {
            user: "Emma Smith",
            avatar: "ES",
            question: "Can someone explain the difference between CNN and RNN?",
            replies: 5,
            time: "5 hours ago"
        },
        {
            user: "Michael Chen",
            avatar: "MC",
            question: "Getting error in lesson 3 code",
            replies: 1,
            time: "1 day ago"
        }
    ];

    // Episode thumbnails - static data
    const episodes = [
        {
            id: 1,
            title: "Introduction & Setup",
            thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=225&fit=crop",
            duration: "15:30",
            number: 1
        },
        {
            id: 2,
            title: "Core Concepts",
            thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop",
            duration: "22:45",
            number: 2
        },
        {
            id: 3,
            title: "Practical Examples",
            thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
            duration: "18:20",
            number: 3
        },
        {
            id: 4,
            title: "Advanced Techniques",
            thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=225&fit=crop",
            duration: "25:10",
            number: 4
        },
        {
            id: 5,
            title: "Final Project",
            thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=225&fit=crop",
            duration: "30:15",
            number: 5
        },
        {
            id: 6,
            title: "Q&A Session",
            thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop",
            duration: "20:00",
            number: 6
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
                    <button 
                        onClick={fetchCourseDetails}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Calculate duration from scheduled times
    const scheduledStart = course.scheduled_start ? new Date(course.scheduled_start) : null;
    const scheduledEnd = course.scheduled_end ? new Date(course.scheduled_end) : null;
    const durationHours = scheduledStart && scheduledEnd ? Math.round((scheduledEnd.getTime() - scheduledStart.getTime()) / (1000 * 60 * 60)) : 0;
    const duration = durationHours > 0 ? `${durationHours} hours` : 'TBD';

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={currentUser} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex">
                <DashboardSidebar
                    activeTab={''}
                    setActiveTab={() => {}}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 lg:ml-64">
                    {/* Back to Courses Link */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600">
                        <div className="max-w-7xl mx-auto px-4 py-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center gap-2 text-white hover:text-purple-100 transition-colors font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Courses
                            </button>
                        </div>
                    </div>

                    {/* Video Player Section */}
                    <div className="bg-gradient-to-b from-gray-900 to-black">
                        <div className="max-w-7xl mx-auto">
                            <div className="relative aspect-video bg-black shadow-2xl">
                                {course.promo_video_url ? (
                                    /* Cloudinary Video Player - Use iframe for embed URLs */
                                    course.promo_video_url.includes('cloudinary.com/embed') ? (
                                        <iframe
                                            src={`${course.promo_video_url}&autoplay=true&loop=true&muted=true`}
                                            className="w-full h-full"
                                            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                            allowFullScreen
                                            frameBorder="0"
                                        />
                                    ) : (
                                        /* Regular Video Player for direct video URLs */
                                        <video
                                            className="w-full h-full"
                                            controls
                                            muted
                                            loop
                                            autoPlay
                                            poster={course.thumbnail_url || undefined}
                                        >
                                            <source src={course.promo_video_url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )
                                ) : (
                                    /* Video Placeholder */
                                    <>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {course.thumbnail_url ? (
                                                <img 
                                                    src={course.thumbnail_url} 
                                                    alt={course.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="text-center">
                                                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                                        <Play className="w-10 h-10 text-white ml-1" />
                                                    </div>
                                                    <p className="text-white text-lg font-medium">Course Preview</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                                    <Play className="w-10 h-10 text-white ml-1" />
                                                </div>
                                                <p className="text-white text-lg font-medium">No preview video available</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="bg-gradient-to-b from-gray-50 to-white">
                        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Left Column - Course Info & Tabs */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Course Header */}
                                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">{course.title}</h1>

                                        <div className="flex flex-wrap items-center gap-5 text-sm mb-6">
                                            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-full border border-yellow-200">
                                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                <span className="font-bold text-gray-900">{staticData.rating}</span>
                                                <span className="text-gray-600">rating</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
                                                <Users className="w-5 h-5 text-blue-600" />
                                                <span className="font-semibold text-gray-900">{course.attendee_count || 0}</span>
                                                <span className="text-gray-600">students</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                                                <Clock className="w-5 h-5 text-green-600" />
                                                <span className="font-semibold text-gray-900">{duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200">
                                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                                <span className="font-semibold text-gray-900">{course.level}</span>
                                            </div>
                                            <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full text-xs font-bold shadow-md">
                                                {course.category}
                                            </div>
                                        </div>

                                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                            {course.tutor.first_name[0]}{course.tutor.last_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium">Instructor</p>
                                            <p className="text-base font-bold text-gray-900">{course.tutor.first_name} {course.tutor.last_name}</p>
                                            <p className="text-sm text-gray-600">{course.tutor.bio || 'Expert Course Instructor'}</p>
                                        </div>
                                    </div>

                                    {/* Enrollment Section */}
                                    <div className="space-y-3">
                                        {enrollmentSuccess && (
                                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                <p className="text-green-800 font-medium">✓ Successfully enrolled! Redirecting...</p>
                                            </div>
                                        )}
                                        
                                        {enrollmentError && (
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-red-800 text-sm">{enrollmentError}</p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl border-2 border-blue-200 shadow-sm">
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium mb-1">Course Price</p>
                                                <p className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                    {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                                </p>
                                            </div>
                                            {currentUser && course.tutor.id !== currentUser.id && !isEnrolled && (
                                                <button 
                                                    onClick={handleEnrollment}
                                                    disabled={enrolling || enrollmentSuccess}
                                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    {enrolling ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        course.is_free ? 'Enroll Free' : 'Pay & Enroll'
                                                    )}
                                                </button>
                                            )}
                                            {/* Join Live Button - Shows for enrolled users (including tutors) when live */}
                                            {isEnrolled && isLive && currentUser && (
                                                <button
                                                    onClick={() => router.push(`/dashboard/join/${course.id}`)}
                                                    className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all font-bold flex items-center gap-2 shadow-lg animate-pulse"
                                                >
                                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                                    {course.tutor.id === currentUser.id ? 'Start Live Session' : 'Join Live Session'}
                                                </button>
                                            )}
                                            {/* Show enrollment status when not live */}
                                            {isEnrolled && !isLive && currentUser && course.tutor.id === currentUser.id && (
                                                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                                                    Your Course
                                                </div>
                                            )}
                                            {isEnrolled && !isLive && currentUser && course.tutor.id !== currentUser.id && (
                                                <div className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Already Enrolled
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                                        <div className="flex">
                                            {["overview", "resources", "discussion"].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`flex-1 px-6 py-4 text-sm font-bold capitalize transition-all relative ${
                                                        activeTab === tab
                                                            ? "text-blue-600 bg-white"
                                                            : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
                                                    }`}
                                                >
                                                    {tab}
                                                    {activeTab === tab && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-full"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {/* Overview Tab */}
                                        {activeTab === "overview" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-3">About This Course</h3>
                                                    <p className="text-gray-600 leading-relaxed mb-4">
                                                        {course.description}
                                                    </p>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">Start Date</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {course.scheduled_start ? new Date(course.scheduled_start).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'TBD'}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600 mb-1">End Date</p>
                                                        <p className="font-semibold text-gray-900">
                                                            {course.scheduled_end ? new Date(course.scheduled_end).toLocaleDateString('en-US', {
                                                                month: 'long',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'TBD'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-3">What You&apos;ll Learn</h3>
                                                    <ul className="space-y-2">
                                                        {[
                                                            "Build and train neural networks from scratch",
                                                            "Implement CNN and RNN architectures",
                                                            "Work with real-world datasets",
                                                            "Deploy AI models to production",
                                                            "Understand deep learning mathematics"
                                                        ].map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" />
                                                                <span className="text-gray-600">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Resources Tab */}
                                        {activeTab === "resources" && (
                                            <div className="space-y-3">
                                                <h3 className="text-lg font-bold text-gray-900 mb-4">Course Materials</h3>
                                                {resources.map((resource, i) => (
                                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                                <FileText className="w-5 h-5 text-gray-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{resource.name}</p>
                                                                <p className="text-xs text-gray-500">{resource.size}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                            <Download className="w-5 h-5 text-gray-600" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Discussion Tab */}
                                        {activeTab === "discussion" && (
                                            <div className="space-y-6">
                                                {/* Ask Question */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Ask a Question</h3>
                                                    <div className="flex gap-3">
                                                        <textarea
                                                            value={question}
                                                            onChange={(e) => setQuestion(e.target.value)}
                                                            placeholder="Type your question here..."
                                                            className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <button className="mt-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
                                                        <Send className="w-4 h-4" />
                                                        Post Question
                                                    </button>
                                                </div>

                                                {/* Questions List */}
                                                <div>
                                                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Discussions</h3>
                                                    <div className="space-y-4">
                                                        {discussions.map((discussion, i) => (
                                                            <div key={i} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                                                                <div className="flex items-start gap-3">
                                                                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                                        {discussion.avatar}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            <p className="font-semibold text-gray-900">{discussion.user}</p>
                                                                            <span className="text-xs text-gray-500">{discussion.time}</span>
                                                                        </div>
                                                                        <p className="text-gray-700 mb-2">{discussion.question}</p>
                                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                            <MessageSquare className="w-4 h-4" />
                                                                            <span>{discussion.replies} replies</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Course Content & Episodes */}
                            <div className="lg:col-span-1 space-y-6">
                                {/* Course Content */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Course Content</h3>
                                        <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                                            <Share2 className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                        {modules.map((module, moduleIndex) => (
                                            <div key={moduleIndex} className="border border-gray-200 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedModule(expandedModule === moduleIndex ? -1 : moduleIndex)}
                                                    className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="text-left">
                                                        <p className="font-semibold text-gray-900 text-sm">{module.title}</p>
                                                        <p className="text-xs text-gray-500">{module.duration}</p>
                                                    </div>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-600 transition-transform ${
                                                            expandedModule === moduleIndex ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {expandedModule === moduleIndex && (
                                                    <div className="border-t border-gray-200">
                                                        {module.lessons.map((lesson, lessonIndex) => (
                                                            <button
                                                                key={lessonIndex}
                                                                onClick={() => setCurrentLesson(lessonIndex)}
                                                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0 ${currentLesson === lessonIndex ? "bg-gray-100" : "hover:bg-gray-50"}`}
                                                            >
                                                                {lesson.completed ? (
                                                                    <CheckCircle className="w-5 h-5 text-gray-900 flex-shrink-0" />
                                                                ) : (
                                                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                                )}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                                                                    <p className="text-xs text-gray-500">{lesson.duration}</p>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Episodes Section */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Course Episodes</h3>
                                        {!isEnrolled && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Enroll to Unlock
                                            </span>
                                        )}
                                        {isEnrolled && !course.published_at && (
                                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Scheduled
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        {episodes.map((episode) => {
                                            const isPublished = course.published_at !== null;
                                            const canWatch = isEnrolled && isPublished;
                                            
                                            return (
                                                <div 
                                                    key={episode.id} 
                                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                        canWatch 
                                                            ? 'border-gray-200 hover:border-blue-500 hover:shadow-md' 
                                                            : 'border-gray-200 opacity-75'
                                                    }`}
                                                >
                                                    <div className="relative aspect-video">
                                                        <img 
                                                            src={episode.thumbnail}
                                                            alt={episode.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        
                                                        {/* Overlay */}
                                                        <div className={`absolute inset-0 flex items-center justify-center ${
                                                            canWatch 
                                                                ? 'bg-black/30 group-hover:bg-black/50' 
                                                                : 'bg-black/60'
                                                        } transition-all`}>
                                                            {canWatch ? (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                        <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                                                                    </div>
                                                                    <span className="text-xs text-white font-medium">{episode.duration}</span>
                                                                </div>
                                                            ) : isEnrolled && !isPublished ? (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Clock className="w-8 h-8 text-white" />
                                                                    <span className="text-xs text-white font-medium">Scheduled</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center gap-1">
                                                                    <Lock className="w-8 h-8 text-white" />
                                                                    <span className="text-xs text-white font-medium">Locked</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Episode Number Badge */}
                                                        <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                                            Ep {episode.number}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Episode Title */}
                                                    <div className="p-2 bg-gray-50">
                                                        <p className="text-xs font-semibold text-gray-900 line-clamp-1">
                                                            {episode.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Info Banners */}
                                    {!isEnrolled && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800 text-center">
                                                <Lock className="w-4 h-4 inline mr-1" />
                                                Enroll to unlock all {episodes.length} episodes
                                            </p>
                                        </div>
                                    )}
                                    {isEnrolled && !course.published_at && course.scheduled_start && (
                                        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-semibold text-orange-900 mb-1">
                                                        Live Session Scheduled
                                                    </p>
                                                    <p className="text-sm text-orange-800">
                                                        This course will go live on{' '}
                                                        <span className="font-bold">
                                                            {course.scheduled_start && new Date(course.scheduled_start).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-orange-700 mt-2">
                                                        You&apos;ll receive an email reminder before the session starts. Episodes will be available after the live session.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </main>
            </div>
        </div>
    );
}