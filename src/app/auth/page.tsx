'use client'
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Shield, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authService, type User } from '@/lib/auth';

interface AuthState {
    loading: boolean;
    success: boolean;
    error: string | null;
    user: User | null;
    progress: number;
}

const AuthCallback = () => {
    const router = useRouter();
    const [authState, setAuthState] = useState<AuthState>({
        loading: true,
        success: false,
        error: null,
        user: null,
        progress: 0
    });

    useEffect(() => {
        const processAuthCallback = async () => {
            try {
                // Simulate loading progress for better UX
                const updateProgress = (progress: number) => {
                    setAuthState(prev => ({ ...prev, progress }));
                };

                updateProgress(20);
                await new Promise(resolve => setTimeout(resolve, 300));

                updateProgress(40);
                await new Promise(resolve => setTimeout(resolve, 300));

                updateProgress(60);
                const urlParams = new URLSearchParams(window.location.search);
                
                updateProgress(80);
                await new Promise(resolve => setTimeout(resolve, 300));

                // Use professional auth service to process OAuth callback
                const result = await authService.processOAuthCallback(urlParams);

                updateProgress(100);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (result.success && result.user) {
                    setAuthState({
                        loading: false,
                        success: true,
                        error: null,
                        user: result.user,
                        progress: 100
                    });

                    // Redirect to onboarding after showing success
                    setTimeout(() => {
                        router.push('/onboarding');
                    }, 2000);
                } else {
                    setAuthState({
                        loading: false,
                        success: false,
                        error: result.error || 'Authentication failed',
                        user: null,
                        progress: 0
                    });
                }

            } catch (error) {
                console.error('Auth callback processing error:', error);
                setAuthState({
                    loading: false,
                    success: false,
                    error: 'Failed to process authentication. Please try again.',
                    user: null,
                    progress: 0
                });
            }
        };

        processAuthCallback();
    }, [router]);

    const handleRetryAuth = () => {
        window.location.href = '/auth/login';
    };

    // Error state
    if (!authState.loading && !authState.success && authState.error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authentication Failed</h2>
                    <p className="text-gray-600 mb-6">{authState.error}</p>
                    <button
                        onClick={handleRetryAuth}
                        className="w-full bg-[#1447E6] hover:bg-[#1039C4] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Success state (briefly shown before redirect)
    if (!authState.loading && authState.success && authState.user) {
        const { user } = authState;

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome!</h2>
                    <p className="text-gray-600 mb-6">Authentication successful</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center space-x-3">
                            {user.avatar_url && (
                                <Image
                                    src={(user.avatar_url || '').trim()}
                                    width={48}
                                    height={48}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            )}
                            <div>
                                <p className="font-medium text-gray-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-[#1447E6] mb-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Redirecting to onboarding...</span>
                    </div>

                    <button
                        onClick={() => router.push('/onboarding')}
                        className="w-full bg-[#1447E6] hover:bg-[#1039C4] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Continue to Onboarding
                    </button>
                </div>
            </div>
        );
    }

    // Main loading state
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">

                {/* Animated loader */}
                <div className="mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        {/* Outer ring */}
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        {/* Animated progress ring */}
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 24 24">
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                className="text-[#1447E6]"
                                strokeDasharray={`${authState.progress * 0.628} 62.8`}
                                strokeLinecap="round"
                                style={{
                                    transition: 'stroke-dasharray 0.3s ease-in-out',
                                }}
                            />
                        </svg>
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-[#1447E6]" />
                        </div>
                    </div>
                </div>

                {/* Progress text */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Authenticating</h2>
                    <div className="space-y-2">
                        {authState.progress >= 20 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Processing OAuth callback</span>
                            </div>
                        )}
                        {authState.progress >= 40 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Validating credentials</span>
                            </div>
                        )}
                        {authState.progress >= 60 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Extracting user data</span>
                            </div>
                        )}
                        {authState.progress >= 80 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-gray-600">Securing session</span>
                            </div>
                        )}
                        {authState.progress >= 90 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <Loader2 className="h-4 w-4 text-[#1447E6] animate-spin" />
                                <span className="text-gray-600">Finalizing authentication</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                        className="bg-[#1447E6] h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${authState.progress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-500">
                    {authState.progress < 100
                        ? "Please wait while we process your login..."
                        : "Almost ready!"
                    }
                </p>
            </div>
        </div>
    );
};

export default AuthCallback;