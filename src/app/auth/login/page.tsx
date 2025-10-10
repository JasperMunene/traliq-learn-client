'use client'
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthLayout } from '../AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { setTokens } from '@/lib/cookies';
import { initializeTokenRefresh } from '@/lib/api';
import { authService } from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/config';

// Interface for the API response
interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        role: string;
        email_verified: boolean;
        avatar_url: string | null;
    };
}

interface LoginError {
    error: string;
    needs_verification?: boolean;
    user_id?: string;
}

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

    // Get redirect URL from query params on mount
    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (redirect) {
            setRedirectUrl(redirect);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Client-side validation
        const newErrors: {email?: string; password?: string} = {};

        if (!email) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Make API call to your Flask backend
            const response = await fetch(API_ENDPOINTS.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: email.toLowerCase().trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                const loginData = data as LoginResponse;

                                setTokens(loginData.access_token, loginData.refresh_token, rememberMe);
                localStorage.setItem('user', JSON.stringify(loginData.user)); // Keep for immediate client-side access

                console.log('Login successful', loginData.user);

                // Initialize token refresh scheduler
                initializeTokenRefresh();

                // Redirect to intended page or onboarding (with redirect preserved)
                if (redirectUrl) {
                    // Pass redirect URL to onboarding in case user needs to select role
                    router.push(`/onboarding?redirect=${encodeURIComponent(redirectUrl)}`);
                } else {
                    router.push('/onboarding');
                }

            } else {
                // Handle different error cases from backend
                const errorData = data as LoginError;

                if (errorData.needs_verification && errorData.user_id) {
                    // Redirect to verification page
                    router.push(`/auth/verify-email?user_id=${errorData.user_id}`);
                    return;
                }

                setErrors({ general: errorData.error || 'Login failed. Please try again.' });
            }

        } catch (error) {
            console.error('Login failed:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        setIsGoogleLoading(true);
        try {
            // Use professional auth service for OAuth
            authService.initiateGoogleOAuth();
        } catch (error) {
            console.error('Google OAuth initiation failed:', error);
            setErrors({ general: 'Failed to initialize Google authentication. Please try again.' });
            setIsGoogleLoading(false);
        }
    };

    
    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Sign in to your account to continue your learning journey and unlock your potential"
        >
            <div className="space-y-6">
                {/* General Error Message */}
                {errors.general && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-in">
                        <div className="flex items-center space-x-3 text-red-800">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{errors.general}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-gray-900 font-medium">
                            Email address
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className={`pl-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                    errors.email
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : email && !errors.email
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                }`}
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            {email && !errors.email && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                            )}
                        </div>
                        {errors.email && (
                            <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium">{errors.email}</p>
                            </div>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-3">
                        <Label htmlFor="password" className="text-gray-900 font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                className={`pl-12 pr-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                    errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : password && !errors.password
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                }`}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium">{errors.password}</p>
                            </div>
                        )}
                    </div>

                    {/* Remember me and Forgot password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember-me"
                                checked={rememberMe}
                                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                disabled={isLoading}
                                className="rounded-md"
                            />
                            <Label htmlFor="remember-me" className="cursor-pointer select-none text-gray-700">
                                Keep me signed in
                            </Label>
                        </div>

                        <a
                            href="/auth/forgot-password"
                            className="text-sm text-gray-900 hover:text-gray-700 font-medium transition-colors hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit button */}
                    <div className="space-y-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <span>Sign in to continue</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
                            </div>
                        </div>

                        {/* Google login button */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleGoogleLogin}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
                        >
                            {isGoogleLoading ? (
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span className="font-medium text-gray-700">Continue with Google</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Sign up link */}
                <div className="text-center pt-6 border-t border-gray-100">
                    <p className="text-gray-600">
                        New to Traliq AI?{' '}
                        <a
                            href={redirectUrl ? `/auth/signup?redirect=${encodeURIComponent(redirectUrl)}` : '/auth/signup'}
                            className="font-medium text-gray-900 hover:text-gray-700 transition-colors hover:underline"
                        >
                            Create your account
                        </a>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}