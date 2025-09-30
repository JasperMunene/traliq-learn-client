'use client'
import { useState, useEffect } from "react";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from '@/lib/api';

interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'tutor' | 'learner' | null;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export default function OnboardingPage() {
    const [selected, setSelected] = useState<'tutor' | 'learner' | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetchWithAuth('http://16.171.54.227:5000/api/users/me');
                
                if (!response.ok) {
                    if (response.status === 401) {
                        setError('Authentication failed. Please log in again.');
                        // Redirect to login after a short delay
                        setTimeout(() => router.push('/auth/login'), 2000);
                    } else if (response.status === 404) {
                        setError('User not found');
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        setError(errorData.error || 'Failed to fetch user data');
                    }
                    setLoading(false);
                    return;
                }

                const userData: User = await response.json();
                setUser(userData);

                if (userData.role) {
                    router.push('/dashboard');
                    return;
                }
                setLoading(false);
            } catch (err) {
                console.error('Error checking user role:', err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to connect to server';
                setError(errorMessage);
                setLoading(false);
            }
        };

        fetchUserRole();
    }, [router]);

    const updateUserRole = async (role: 'tutor' | 'learner') => {
        try {
            setUpdating(true);
            setError(null);
            const response = await fetchWithAuth('http://16.171.54.227:5000/api/users/me/role', {
                method: 'POST',
                body: JSON.stringify({ role }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to update role' }));
                throw new Error(errorData.message || errorData.error || 'Failed to update role');
            }

            return true;
        } catch (err) {
            console.error('Error updating user role:', err);
            setError(err instanceof Error ? err.message : 'Failed to update role');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const handleContinue = async () => {
        if (!selected || !user) return;

        const success = await updateUserRole(selected);

        if (success) {
            if (selected === 'tutor') {
                // Redirect to tutor onboarding with user ID
                router.push(`/onboarding/tutor?userId=${user.id}`);
            } else {
                // Redirect to learner dashboard
                router.push('/dashboard');
            }
        }
    };

    // Show loader while checking user role
    if (loading) {
        return <Loader size="page" text="Checking your account..." />;
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
                        <p className="text-red-600 mb-4">{error}</p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => {
                                    setError(null);
                                    setLoading(true);
                                    window.location.reload();
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 py-12">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-2xl font-bold text-gray-900">traliq ai</h1>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                        Welcome to Traliq AI
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Choose your path to get started with AI education
                    </p>
                </div>

                {/* Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Learn Card */}
                    <button
                        onClick={() => setSelected('learner')}
                        disabled={updating}
                        className={`relative bg-white rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-lg ${
                            selected === 'learner'
                                ? 'ring-4 ring-gray-900 shadow-lg'
                                : 'border-2 border-gray-200 hover:border-gray-300'
                        } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {/* Selection Indicator */}
                        {selected === 'learner' && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        )}

                        {/* Icon */}
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-7 h-7 text-gray-900" />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            I want to learn
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Master AI skills with expert guidance. Access courses, build projects, and transform your career.
                        </p>

                        {/* Features */}
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Learn from industry experts
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Build real-world projects
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Track your progress
                            </li>
                        </ul>
                    </button>

                    {/* Tutor Card */}
                    <button
                        onClick={() => setSelected('tutor')}
                        disabled={updating}
                        className={`relative bg-white rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-lg ${
                            selected === 'tutor'
                                ? 'ring-4 ring-gray-900 shadow-lg'
                                : 'border-2 border-gray-200 hover:border-gray-300'
                        } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {/* Selection Indicator */}
                        {selected === 'tutor' && (
                            <div className="absolute top-4 right-4 w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        )}

                        {/* Icon */}
                        <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-7 h-7 text-gray-900" />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            I want to tutor
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Share your AI expertise with learners worldwide. Create courses and build your teaching career.
                        </p>

                        {/* Features */}
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Share your expertise
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Create and publish courses
                            </li>
                            <li className="flex items-start">
                                <span className="text-gray-900 mr-2">•</span>
                                Earn from teaching
                            </li>
                        </ul>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Continue Button */}
                <div className="text-center">
                    <button
                        onClick={handleContinue}
                        disabled={!selected || updating}
                        className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 inline-flex items-center gap-2 ${
                            selected && !updating
                                ? 'bg-gray-900 text-white hover:bg-gray-800'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                    >
                        {updating ? (
                            <>
                                <Loader size="small" color="white" />
                                Updating...
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    {!selected && !updating && (
                        <p className="text-sm text-gray-500 mt-4">
                            Please select an option to continue
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}