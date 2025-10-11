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

                    // Redirect to intended destination or dashboard after showing success
                    setTimeout(() => {
                        const redirect = urlParams.get('redirect') || urlParams.get('next');
                        router.push(redirect || '/dashboard');
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
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect') || params.get('next');
        window.location.href = redirect ? `/auth/login?redirect=${encodeURIComponent(redirect)}` : '/auth/login';
    };

    // Error state
    if (!authState.loading && !authState.success && authState.error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-4">Authentication Failed</h2>
                    <p className="text-gray-600 mb-8">{authState.error}</p>
                    <button
                        onClick={handleRetryAuth}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
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
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-6 h-6 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Welcome!</h2>
                    <p className="text-gray-600 mb-8">Authentication successful</p>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                        <div className="flex items-center justify-center space-x-3">
                            {user.avatar_url && (
                                <Image
                                    src={(user.avatar_url || '').trim()}
                                    width={48}
                                    height={48}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full border border-gray-200"
                                />
                            )}
                            <div>
                                <p className="font-semibold text-gray-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-blue-600 mb-6">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm font-medium">Redirecting to dashboard...</span>
                    </div>

                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Main loading state
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">

                {/* Simplified loader */}
                <div className="mb-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-6">
                        <Shield className="h-8 w-8 text-gray-600" />
                    </div>
                </div>

                {/* Progress text */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">Authenticating</h2>
                    <div className="space-y-3">
                        {authState.progress >= 20 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-600">Processing OAuth callback</span>
                            </div>
                        )}
                        {authState.progress >= 40 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-600">Validating credentials</span>
                            </div>
                        )}
                        {authState.progress >= 60 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-600">Extracting user data</span>
                            </div>
                        )}
                        {authState.progress >= 80 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-gray-600" />
                                <span className="text-gray-600">Securing session</span>
                            </div>
                        )}
                        {authState.progress >= 90 && (
                            <div className="flex items-center justify-center space-x-2 text-sm">
                                <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
                                <span className="text-gray-600">Finalizing authentication</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-lg h-2 mb-6">
                    <div
                        className="bg-blue-600 h-2 rounded-lg transition-all duration-300 ease-out"
                        style={{ width: `${authState.progress}%` }}
                    ></div>
                </div>

                <p className="text-sm text-gray-600">
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