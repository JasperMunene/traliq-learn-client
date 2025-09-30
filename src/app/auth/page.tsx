'use client'
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import Image from 'next/image';

interface UserData {
    token: string;
    refreshToken: string | null;
    email: string;
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    role: string | null;
    emailVerified: boolean;
}

const AuthCallback = () => {
    const [authState, setAuthState] = useState<{
        loading: boolean;
        success: boolean;
        error: string | null;
        userData: UserData | null;
        progress: number;
    }>({
        loading: true,
        success: false,
        error: null,
        userData: null,
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

                const urlParams = new URLSearchParams(window.location.search);
                const error = urlParams.get('error');

                updateProgress(40);

                // Handle OAuth errors
                if (error) {
                    let errorMessage = 'Authentication failed';
                    switch (error) {
                        case 'oauth_failed':
                            errorMessage = 'Failed to connect with Google. Please try again.';
                            break;
                        case 'authentication_failed':
                            errorMessage = 'Authentication process failed. Please try again.';
                            break;
                        default:
                            errorMessage = 'An unexpected error occurred during authentication.';
                    }

                    setAuthState({
                        loading: false,
                        success: false,
                        error: errorMessage,
                        userData: null,
                        progress: 0
                    });
                    return;
                }

                updateProgress(60);
                await new Promise(resolve => setTimeout(resolve, 300));

                // Extract authentication data
                const token = urlParams.get('token');
                const refreshToken = urlParams.get('refresh_token');
                const email = urlParams.get('email');
                const id = urlParams.get('id');
                const firstName = urlParams.get('first_name');
                const lastName = urlParams.get('last_name');
                const avatarUrl = urlParams.get('avatar_url');
                const role = urlParams.get('role');
                const emailVerified = urlParams.get('email_verified') === 'true';

                updateProgress(80);

                // Validate required authentication data
                if (!token || !email || !id) {
                    setAuthState({
                        loading: false,
                        success: false,
                        error: 'Invalid authentication data received. Please try logging in again.',
                        userData: null,
                        progress: 0
                    });
                    return;
                }

                // Prepare user data
                const userData = {
                    token,
                    refreshToken,
                    email: decodeURIComponent(email),
                    id,
                    firstName: decodeURIComponent(firstName || ''),
                    lastName: decodeURIComponent(lastName || ''),
                    avatarUrl: decodeURIComponent(avatarUrl || ''),
                    role,
                    emailVerified
                };

                updateProgress(90);
                await new Promise(resolve => setTimeout(resolve, 300));

                // Store authentication data in localStorage
                localStorage.setItem('auth_token', token);
                if (refreshToken) {
                    localStorage.setItem('refresh_token', refreshToken);
                }
                localStorage.setItem('user_data', JSON.stringify(userData));

                updateProgress(100);
                await new Promise(resolve => setTimeout(resolve, 500));

                // Set successful authentication state
                setAuthState({
                    loading: false,
                    success: true,
                    error: null,
                    userData,
                    progress: 100
                });

                // Redirect to dashboard after showing success
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);

            } catch (error) {
                console.error('Auth callback processing error:', error);
                setAuthState({
                    loading: false,
                    success: false,
                    error: 'Failed to process authentication. Please try again.',
                    userData: null,
                    progress: 0
                });
            }
        };

        processAuthCallback();
    }, []);

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
                        className="w-full bg-[#2CA7A3] hover:bg-[#238B87] text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Success state (briefly shown before redirect)
    if (!authState.loading && authState.success && authState.userData) {
        const { userData } = authState;

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
                            {userData.avatarUrl && (
                                <Image
                                    src={userData.avatarUrl}
                                    width={48}
                                    height={48}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                />
                            )}
                            <div>
                                <p className="font-medium text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">{userData.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-[#2CA7A3] mb-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Redirecting to dashboard...</span>
                    </div>

                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-[#2CA7A3] hover:bg-[#238B87] text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200"
                    >
                        Continue to Dashboard
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
                                className="text-[#2CA7A3]"
                                strokeDasharray={`${authState.progress * 0.628} 62.8`}
                                strokeLinecap="round"
                                style={{
                                    transition: 'stroke-dasharray 0.3s ease-in-out',
                                }}
                            />
                        </svg>
                        {/* Center icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-[#2CA7A3]" />
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
                                <Loader2 className="h-4 w-4 text-[#2CA7A3] animate-spin" />
                                <span className="text-gray-600">Finalizing authentication</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                        className="bg-[#2CA7A3] h-2 rounded-full transition-all duration-300 ease-out"
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