"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '../AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { AlertCircle, CheckCircle, Eye, EyeOff, Lock, Loader } from 'lucide-react';


interface ErrorResponse {
    error: string;
}

export default function ResetPasswordPage() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get reset token from URL parameters
    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setResetToken(token);
            verifyResetToken(token);
        } else {
            setTokenValid(false);
            setErrors({ general: 'Invalid or missing reset token. Please request a new password reset link.' });
        }
    }, [searchParams]);

    const verifyResetToken = async (token: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/auth/verify-reset-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reset_token: token }),
            });

            const data = await response.json();

            if (response.ok) {
                setTokenValid(true);
            } else {
                setTokenValid(false);
                setErrors({ general: data.error || 'Invalid or expired reset token. Please request a new password reset link.' });
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            setTokenValid(false);
            setErrors({ general: 'Failed to verify reset token. Please try again.' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validation
        const newErrors: {[key: string]: string} = {};

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!resetToken) {
            newErrors.general = 'Reset token is missing';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reset_token: resetToken,
                    new_password: formData.password,
                    confirm_password: formData.confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
            } else {
                const errorData = data as ErrorResponse;
                setErrors({ general: errorData.error || 'Failed to reset password. Please try again.' });
            }

        } catch (error) {
            console.error('Password reset failed:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading state while verifying token
    if (tokenValid === null) {
        return (
            <AuthLayout
                title="Verifying reset link"
                subtitle="Please wait while we verify your password reset link"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Loader className="w-8 h-8 text-gray-600 animate-spin" />
                    </div>
                    <p className="text-gray-600">Checking reset link validity...</p>
                </div>
            </AuthLayout>
        );
    }

    // Show error if token is invalid
    if (tokenValid === false) {
        return (
            <AuthLayout
                title="Invalid reset link"
                subtitle="This password reset link is invalid or has expired"
                showBackToLogin={true}
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>

                    {errors.general && (
                        <div className="p-4 rounded-md bg-red-50 border border-red-200">
                            <p className="text-red-800 font-medium">{errors.general}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/auth/forgot-password')}
                            className="w-full bg-[#2CA7A3] hover:bg-[#238B87] text-white font-medium py-2.5"
                        >
                            Request new reset link
                        </Button>

                        <Button
                            onClick={() => router.push('/auth/login')}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Back to login
                        </Button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    if (isSuccess) {
        return (
            <AuthLayout
                title="Password reset successful"
                subtitle="Your password has been updated successfully"
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <div>
                        <p className="text-gray-600 mb-4">
                            Your password has been successfully updated. You can now sign in with your new password.
                        </p>
                    </div>

                    <Button
                        onClick={() => router.push('/auth/login')}
                        size="lg"
                        className="w-full transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Continue to login
                    </Button>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Having trouble?{' '}
                            <a
                                href="mailto:support@traliq.ai"
                                className="font-semibold text-[#2CA7A3] hover:text-[#2CA7A3] transition-colors hover:underline"
                            >
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Create new password"
            subtitle="Choose a strong password for your account"
            showBackToLogin={true}
        >
            <div className="space-y-6">
                {/* General Error Message */}
                {errors.general && (
                    <div className="p-4 rounded-md bg-red-50 border border-red-200 animate-fade-in">
                        <div className="flex items-center space-x-2 text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p className="text-sm font-medium">{errors.general}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-gray-500" />
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className={`pr-12 transition-all duration-200 ${
                                    errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : formData.password && !errors.password
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-300 focus:border-[#2CA7A3] focus:ring-[#2CA7A3]/20 hover:border-gray-400'
                                }`}
                                placeholder="Enter your new password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <PasswordStrengthIndicator password={formData.password} />
                        {errors.password && (
                            <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium">{errors.password}</p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="flex items-center">
                            <Lock className="w-4 h-4 mr-2 text-gray-500" />
                            Confirm New Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className={`pr-12 transition-all duration-200 ${
                                    errors.confirmPassword
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-300 focus:border-[#2CA7A3] focus:ring-[#2CA7A3]/20 hover:border-gray-400'
                                }`}
                                placeholder="Confirm your new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                disabled={isLoading}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium">{errors.confirmPassword}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="w-full transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>Updating password...</span>
                            </div>
                        ) : (
                            'Update password'
                        )}
                    </Button>
                </form>

                {/* Security Notice */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>Security tip:</strong> Choose a strong, unique password that you haven&apos;t used elsewhere.
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}