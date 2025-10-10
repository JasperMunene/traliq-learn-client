"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";
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
    File as FileIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    Headphones as AudioIcon,
    Archive as ZipIcon
} from "lucide-react";

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
    course_type?: 'public' | 'corporate';
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

interface CourseModule {
    id: string;
    course_id: string;
    title: string;
    description?: string | null;
    position: number;
    duration_minutes?: number | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

interface CourseAsset {
    id: string;
    name: string;
    description?: string | null;
    asset_type: string;
    file_extension?: string | null;
    file_url: string;
    thumbnail_url?: string | null;
    preview_url?: string | null;
    file_size?: number | null;
    mime_type?: string | null;
    duration?: number | null;
    is_public: boolean;
    requires_enrollment: boolean;
    tags?: string[];
    category?: string | null;
    sort_order?: number;
    module_id?: string | null;
    created_at: string;
    updated_at: string;
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
    const [expandedModule, setExpandedModule] = useState<string | null>(null);
    const [question, setQuestion] = useState("");
    const [isLive, setIsLive] = useState(false);
    const [modules, setModules] = useState<CourseModule[]>([]);
    const [assets, setAssets] = useState<CourseAsset[]>([]);

    useEffect(() => {
        fetchCurrentUser();
        if (courseId) {
            fetchCourseDetails();
            checkEnrollmentStatus();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    // Re-check enrollment when page becomes visible (e.g., after payment redirect)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && courseId) {
                checkEnrollmentStatus();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

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
            const response = await fetchWithAuth(API_ENDPOINTS.users.me);
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
            const response = await fetchWithAuth(API_ENDPOINTS.courses.detail(courseId));
            
            if (response.ok) {
                const data = await response.json();
                setCourse(data);
                // Fetch modules after course loads
                fetchModules();
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

    const fetchModules = async () => {
        try {
            const resp = await fetchWithAuth(API_ENDPOINTS.courses.modules(courseId));
            if (resp.ok) {
                const data = await resp.json();
                setModules(Array.isArray(data.modules) ? data.modules : []);
            }
        } catch (e) {
            console.error('Error fetching modules', e);
        }
    };

    const fetchAssets = async (onlyIfAuthorized = true) => {
        try {
            console.log('Fetching assets for course:', courseId);
            // Only fetch assets when user has access (tutor or enrolled)
            if (onlyIfAuthorized) {
                const resp = await fetchWithAuth(API_ENDPOINTS.courses.assets(courseId));
                console.log('Assets fetch response status:', resp.status);
                if (resp.ok) {
                    const data = await resp.json();
                    console.log('Assets fetched successfully:', data.assets?.length || 0, 'assets');
                    setAssets(Array.isArray(data.assets) ? data.assets : []);
                } else if (resp.status === 403) {
                    // No access, keep assets empty and UI will show locked state
                    console.log('Access denied (403) - user not authorized to view assets');
                    setAssets([]);
                } else {
                    console.log('Failed to fetch assets, status:', resp.status);
                    const errorData = await resp.json().catch(() => ({}));
                    console.log('Error data:', errorData);
                }
            }
        } catch (e) {
            console.error('Error fetching assets', e);
        }
    };

    const checkEnrollmentStatus = async () => {
        try {
            // Check if user is enrolled in this course
            const response = await fetchWithAuth(API_ENDPOINTS.enrollments.mine);
            if (response.ok) {
                const data = await response.json();
                const enrollments = data.enrollments || [];
                const enrolled = enrollments.some((enrollment: Enrollment) => enrollment.course_id === courseId);
                setIsEnrolled(enrolled);
                
                // If enrolled, fetch assets to unlock modules
                if (enrolled && !isEnrolled) {
                    console.log('User is now enrolled, fetching assets...');
                    fetchAssets(true);
                }
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
                    API_ENDPOINTS.courses.enroll(course.id),
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    }
                );

                if (response.ok) {
                    setEnrollmentSuccess(true);
                    setIsEnrolled(true);
                    // Fetch assets immediately after enrollment
                    fetchAssets(true);
                    setTimeout(() => {
                        // Refresh the page to show updated enrollment status
                        window.location.reload();
                    }, 2000);
                } else {
                    const errorData = await response.json();
                    setEnrollmentError(errorData.error || 'Failed to enroll in course');
                }
            } else {
                // Paid course - initialize payment
                const response = await fetchWithAuth(
                    API_ENDPOINTS.payments.initialize,
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

    // Static data for fields not available from API (rating/progress placeholder)
    const staticData = { rating: 4.8, progress: 0 };

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

    // Derive episodes-like cards from modules
    const episodes = modules.map((m, idx) => ({
        id: idx + 1,
        title: m.title,
        thumbnail: course?.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
        duration: m.duration_minutes ? `${m.duration_minutes} min` : '—',
        number: m.position + 1,
    }));

    const getAssetsForModule = (moduleId: string) => assets.filter(a => a.module_id === moduleId);
    const getCourseLevelAssets = () => assets.filter(a => !a.module_id);
    const canAccessAssets = !!(currentUser && (isEnrolled || (course && currentUser.id === course.tutor.id)));
    
    // Debug logging
    console.log('Course Page State:', {
        isEnrolled,
        canAccessAssets,
        assetsCount: assets.length,
        modulesCount: modules.length,
        currentUserId: currentUser?.id,
        tutorId: course?.tutor?.id
    });

    useEffect(() => {
        // Fetch assets when user gains access (enrolled or is tutor)
        const hasAccess = !!(currentUser && (isEnrolled || (course && currentUser.id === course.tutor.id)));
        if (course && hasAccess) {
            console.log('User has access to assets, fetching...');
            fetchAssets(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [course, isEnrolled, currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 text-brand-500 dark:text-brand-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
                </div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-800 dark:text-gray-200 mb-4">{error || 'Course not found'}</p>
                    <button 
                        onClick={fetchCourseDetails}
                        className="bg-brand-600 dark:bg-brand-500 text-white px-6 py-2 rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors"
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
        <div className="bg-gray-50 dark:bg-gray-950">
            <div className="flex-1">
                    {/* Back to Courses Link */}
                    <div className="bg-gray-900 dark:bg-gray-950">
                        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex items-center gap-1.5 sm:gap-2 text-white hover:text-gray-200 transition-colors font-medium text-sm sm:text-base"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Courses</span>
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
                    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
                        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8 lg:px-6">
                            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                                {/* Left Column - Course Info & Tabs */}
                                <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                                    {/* Course Header */}
                                    <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6 lg:p-8" style={{ boxShadow: 'var(--shadow-theme-lg)' }}>
                                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 lg:mb-6 leading-tight break-words">{course.title}</h1>

                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-5 text-xs sm:text-sm mb-4 lg:mb-6">
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300 fill-gray-700 dark:fill-gray-300" />
                                                <span className="font-bold text-gray-900 dark:text-white">{staticData.rating}</span>
                                                <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">rating</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                                                <span className="font-semibold text-gray-900 dark:text-white">{course.attendee_count || 0}</span>
                                                <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">students</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                                                <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{duration}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 dark:bg-gray-800 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 dark:border-gray-700">
                                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                                                <span className="font-semibold text-gray-900 dark:text-white">{course.level}</span>
                                            </div>
                                            <div className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                                                {course.category}
                                            </div>
                                            {course.course_type === 'corporate' && (
                                                <div className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-full text-xs font-bold shadow-md whitespace-nowrap">
                                                    Corporate
                                                </div>
                                            )}
                                        </div>

                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg flex-shrink-0">
                                            {course.tutor.first_name[0]}{course.tutor.last_name[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Instructor</p>
                                            <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">{course.tutor.first_name} {course.tutor.last_name}</p>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">{course.tutor.bio || 'Expert Course Instructor'}</p>
                                        </div>
                                    </div>

                                    {/* Enrollment Section */}
                                    <div className="space-y-3">
                                        {enrollmentSuccess && (
                                            <div className="p-4 bg-success-50 dark:bg-success-900/20 border border-success-300 dark:border-success-700 rounded-lg">
                                                <p className="text-success-900 dark:text-success-300 font-medium">✓ Successfully enrolled! Redirecting...</p>
                                            </div>
                                        )}
                                        
                                        {enrollmentError && (
                                            <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-300 dark:border-error-700 rounded-lg">
                                                <p className="text-error-900 dark:text-error-300 text-sm">{enrollmentError}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Course Price</p>
                                                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white break-words">
                                                    {course.is_free ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}
                                                </p>
                                            </div>
                                            {currentUser && course.tutor.id !== currentUser.id && !isEnrolled && (
                                                <button 
                                                    onClick={handleEnrollment}
                                                    disabled={enrolling || enrollmentSuccess}
                                                    className="w-full sm:w-auto bg-brand-600 dark:bg-brand-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-brand-700 dark:hover:bg-brand-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                                                >
                                                    {enrolling ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            <span>Processing...</span>
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
                                                    className="w-full sm:w-auto bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-900 transition-all font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse text-sm sm:text-base"
                                                >
                                                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                                                    <span className="truncate">{course.tutor.id === currentUser.id ? 'Start Live Session' : 'Join Live Session'}</span>
                                                </button>
                                            )}
                                            {/* Show enrollment status when not live */}
                                            {isEnrolled && !isLive && currentUser && course.tutor.id === currentUser.id && (
                                                <div className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-xs sm:text-sm font-medium text-center">
                                                    Your Course
                                                </div>
                                            )}
                                            {isEnrolled && !isLive && currentUser && course.tutor.id !== currentUser.id && (
                                                <div className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Already Enrolled</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden" style={{ boxShadow: 'var(--shadow-theme-lg)' }}>
                                    <div className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                                        <div className="flex">
                                            {["overview", "resources", "discussion"].map((tab) => (
                                                <button
                                                    key={tab}
                                                    onClick={() => setActiveTab(tab)}
                                                    className={`flex-1 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-bold capitalize transition-all relative ${
                                                        activeTab === tab
                                                            ? "text-gray-900 dark:text-white bg-white dark:bg-gray-900"
                                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-900/50"
                                                    }`}
                                                >
                                                    {tab}
                                                    {activeTab === tab && (
                                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-500 rounded-t-full"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6">
                                        {/* Overview Tab */}
                                        {activeTab === "overview" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">About This Course</h3>
                                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                                        {course.description}
                                                    </p>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Start Date</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
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
                                                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">End Date</p>
                                                        <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base break-words">
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
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3">What You&apos;ll Learn</h3>
                                                    <ul className="space-y-2">
                                                        {[
                                                            "Build and train neural networks from scratch",
                                                            "Implement CNN and RNN architectures",
                                                            "Work with real-world datasets",
                                                            "Deploy AI models to production",
                                                            "Understand deep learning mathematics"
                                                        ].map((item, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                                                                <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Resources Tab */}
                                        {activeTab === "resources" && (
                                            <div className="space-y-4">
                                                {!canAccessAssets && (
                                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-300">
                                                        Enroll to access downloadable materials and resources.
                                                    </div>
                                                )}
                                                {canAccessAssets && (
                                                    <>
                                                        {/* Course-level assets */}
                                                        {getCourseLevelAssets().length > 0 && (
                                                            <div>
                                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">General Resources</h4>
                                                                <div className="space-y-2">
                                                                    {getCourseLevelAssets().map((a) => (
                                                                        <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                    {a.asset_type === 'pdf' || a.asset_type === 'document' ? <FileIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                                        : a.asset_type === 'image' ? <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                                        : a.asset_type === 'video' ? <VideoIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                                        : a.asset_type === 'audio' ? <AudioIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                                        : a.asset_type === 'zip' ? <ZipIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                                        : <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                                                                                </div>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{a.name}</p>
                                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{a.asset_type.toUpperCase()}</p>
                                                                                </div>
                                                                            </div>
                                                                            <button onClick={() => window.open(a.file_url, '_blank')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                                                                                <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Module assets */}
                                                        {modules.map((m) => (
                                                            <div key={m.id}>
                                                                <h4 className="text-sm font-bold text-gray-900 mb-2">{m.title}</h4>
                                                                {getAssetsForModule(m.id).length === 0 ? (
                                                                    <p className="text-xs text-gray-500 mb-3">No resources in this module yet.</p>
                                                                ) : (
                                                                    <div className="space-y-2 mb-4">
                                                                        {getAssetsForModule(m.id).map((a) => (
                                                                            <div key={a.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                                                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                                    <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                                        {a.asset_type === 'pdf' || a.asset_type === 'document' ? <FileIcon className="w-4 h-4 text-gray-600" />
                                                                                            : a.asset_type === 'image' ? <ImageIcon className="w-4 h-4 text-gray-600" />
                                                                                            : a.asset_type === 'video' ? <VideoIcon className="w-4 h-4 text-gray-600" />
                                                                                            : a.asset_type === 'audio' ? <AudioIcon className="w-4 h-4 text-gray-600" />
                                                                                            : a.asset_type === 'zip' ? <ZipIcon className="w-4 h-4 text-gray-600" />
                                                                                            : <FileText className="w-4 h-4 text-gray-600" />}
                                                                                    </div>
                                                                                    <div className="min-w-0 flex-1">
                                                                                        <p className="font-medium text-gray-900 text-sm truncate">{a.name}</p>
                                                                                        <p className="text-xs text-gray-500">{a.asset_type.toUpperCase()}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <button onClick={() => window.open(a.file_url, '_blank')} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                                                                    <Download className="w-5 h-5 text-gray-600" />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>
                                        )}

                                        {/* Discussion Tab */}
                                        {activeTab === "discussion" && (
                                            <div className="space-y-4 sm:space-y-6">
                                                {/* Ask Question */}
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Ask a Question</h3>
                                                    <div className="flex gap-2 sm:gap-3">
                                                        <textarea
                                                            value={question}
                                                            onChange={(e) => setQuestion(e.target.value)}
                                                            placeholder="Type your question here..."
                                                            className="flex-1 p-2.5 sm:p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 resize-none text-sm sm:text-base"
                                                            rows={3}
                                                        />
                                                    </div>
                                                    <button className="mt-3 bg-brand-600 dark:bg-brand-500 hover:bg-brand-700 dark:hover:bg-brand-600 text-white px-4 sm:px-6 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 text-sm sm:text-base">
                                                        <Send className="w-4 h-4" />
                                                        <span>Post Question</span>
                                                    </button>
                                                </div>

                                                {/* Questions List */}
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Recent Discussions</h3>
                                                    <div className="space-y-3 sm:space-y-4">
                                                        {discussions.map((discussion, i) => (
                                                            <div key={i} className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                                                                <div className="flex items-start gap-2 sm:gap-3">
                                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-600 dark:bg-brand-500 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm flex-shrink-0">
                                                                        {discussion.avatar}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                                                                            <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{discussion.user}</p>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{discussion.time}</span>
                                                                        </div>
                                                                        <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm sm:text-base break-words">{discussion.question}</p>
                                                                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
                            <div className="lg:col-span-1 space-y-4 lg:space-y-6">
                                {/* Course Content */}
                                <div className="bg-white dark:bg-gray-900 rounded-xl lg:rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-6 lg:sticky lg:top-6" style={{ boxShadow: 'var(--shadow-theme-lg)' }}>
                                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 dark:text-white">Course Content</h3>
                                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group">
                                            <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                                        </button>
                                    </div>

                                    <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
                                        {modules.map((module) => (
                                            <div key={module.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                                                <button
                                                    onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="text-left min-w-0 flex-1 mr-2">
                                                        <p className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">{module.title}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{module.duration_minutes ? `${module.duration_minutes} min` : '—'}</p>
                                                    </div>
                                                    <ChevronDown
                                                        className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                                                            expandedModule === module.id ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>

                                                {expandedModule === module.id && (
                                                    <div className="border-t border-gray-200 dark:border-gray-800">
                                                        {canAccessAssets ? (
                                                            getAssetsForModule(module.id).length > 0 ? (
                                                                getAssetsForModule(module.id).map((a) => (
                                                                    <div key={a.id} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                                                                        <div className="w-5 h-5 flex items-center justify-center">
                                                                            {a.asset_type === 'video' ? <VideoIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : a.asset_type === 'pdf' || a.asset_type === 'document' ? <FileIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : a.asset_type === 'image' ? <ImageIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm truncate">{a.name}</p>
                                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{a.asset_type.toUpperCase()}</p>
                                                                        </div>
                                                                        <button onClick={() => window.open(a.file_url, '_blank')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                                            <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                                        </button>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">No assets in this module yet.</div>
                                                            )
                                                        ) : (
                                                            <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                                                <Lock className="w-4 h-4" /> Enroll to view module assets
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Episodes Section */}
                                <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">Course Episodes</h3>
                                        {!isEnrolled && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Lock className="w-3 h-3" />
                                                Enroll to Unlock
                                            </span>
                                        )}
                                        {isEnrolled && !course.published_at && (
                                            <span className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Scheduled
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {episodes.map((episode) => {
                                            const isPublished = course.published_at !== null;
                                            const canWatch = isEnrolled && isPublished;
                                            
                                            return (
                                                <div 
                                                    key={episode.id} 
                                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                                        canWatch 
                                                            ? 'border-gray-200 hover:border-gray-900 hover:shadow-md' 
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
                                        <div className="mt-4 p-3 bg-gray-100 border border-gray-200 rounded-lg">
                                            <p className="text-sm text-gray-900 text-center">
                                                <Lock className="w-4 h-4 inline mr-1" />
                                                Enroll to unlock all {episodes.length} episodes
                                            </p>
                                        </div>
                                    )}
                                    {isEnrolled && !course.published_at && course.scheduled_start && (
                                        <div className="mt-4 p-3 sm:p-4 bg-gray-100 border border-gray-200 rounded-lg">
                                            <div className="flex items-start gap-2 sm:gap-3">
                                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                                                        Live Session Scheduled
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-800 break-words">
                                                        This course will go live on 
                                                        <span className="font-bold break-words">
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
                                                    <p className="text-xs text-gray-700 mt-2">
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
            </div>
        </div>
    );
}