"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Mail, ArrowLeft, Loader } from 'lucide-react';

// Interface for the API response
interface ForgotPasswordResponse {
    message: string;
    reset_token?: string;
}

interface ErrorResponse {
    error: string;
}

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!email) {
            setError('Email is required');
            setIsLoading(false);
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.toLowerCase().trim()
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const successData = data as ForgotPasswordResponse;
                setSuccess(successData.message || 'Password reset link sent successfully!');
                setIsSubmitted(true);
            } else {
                const errorData = data as ErrorResponse;
                setError(errorData.error || 'Failed to send reset link. Please try again.');
            }

        } catch (error) {
            console.error('Password reset request failed:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTryAnotherEmail = () => {
        setIsSubmitted(false);
        setEmail('');
        setError('');
        setSuccess('');
    };

    const handleBackToLogin = () => {
        router.push('/auth/login');
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle="We've sent a password reset link to your email address"
                showBackToLogin={true}
            >
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="space-y-3">
                        <p className="text-gray-600">
                            We&apos;ve sent a password reset link to:
                        </p>
                        <p className="text-lg font-semibold text-gray-900">{email}</p>
                        <p className="text-sm text-gray-500">
                            The link will expire in 1 hour for security reasons.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800 text-left">
                                <strong>Can&apos;t find the email?</strong> Check your spam folder or try requesting a new link.
                            </p>
                        </div>

                        <Button
                            onClick={handleTryAnotherEmail}
                            variant="outline"
                            className="w-full border-[#2CA7A3] text-[#2CA7A3] hover:bg-[#2CA7A3] hover:text-white"
                        >
                            <Mail className="w-4 h-4 mr-2" />
                            Try another email
                        </Button>

                        <Button
                            onClick={handleBackToLogin}
                            variant="ghost"
                            className="w-full text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to login
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Need help?{' '}
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
            title="Forgot your password?"
            subtitle="Enter your email address and we'll send you a link to reset your password"
            showBackToLogin={true}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-md bg-red-50 border border-red-200 animate-fade-in">
                        <div className="flex items-center space-x-2 text-red-800">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {/* Success Message (if any) */}
                {success && (
                    <div className="p-4 rounded-md bg-green-50 border border-green-200 animate-fade-in">
                        <div className="flex items-center space-x-2 text-green-800">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <p className="text-sm font-medium">{success}</p>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email address
                    </Label>
                    <div className="relative">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={`transition-all duration-200 ${
                                error
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                    : email && !error
                                        ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                        : 'border-gray-300 focus:border-[#2CA7A3] focus:ring-[#2CA7A3]/20 hover:border-gray-400'
                            }`}
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError('');
                            }}
                            disabled={isLoading}
                        />
                        {email && !error && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    size="lg"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Sending reset link...</span>
                        </div>
                    ) : (
                        'Send reset link'
                    )}
                </Button>

                {/* Additional Help */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600 text-center">
                        <strong>Tip:</strong> Enter the email address you used when creating your account.
                    </p>
                </div>
            </form>
        </AuthLayout>
    );
}