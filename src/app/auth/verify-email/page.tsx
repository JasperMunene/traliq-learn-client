"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthLayout } from '../AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Mail, ArrowLeft } from 'lucide-react';
import { API_ENDPOINTS } from '@/lib/config';

// Interface for the API response
interface VerifyResponse {
    message: string;
    email_verified: boolean;
}

interface ResendResponse {
    message: string;
    email_sent: boolean;
}

interface ErrorResponse {
    error: string;
}

function VerifyEmailContent() {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get user_id, email, and redirect from query parameters
    useEffect(() => {
        const userIdParam = searchParams.get('user_id');
        const emailParam = searchParams.get('email');
        const redirectParam = searchParams.get('redirect');

        if (userIdParam) {
            setUserId(userIdParam);
        } else {
            setError('Invalid verification link. Please try signing up again.');
        }

        if (emailParam) {
            setEmail(decodeURIComponent(emailParam));
        }

        if (redirectParam) {
            setRedirectUrl(redirectParam);
        }
    }, [searchParams]);

    const handleInputChange = (index: number, value: string) => {
        // Only allow numeric input
        if (value && !/^[0-9]$/.test(value)) return;
        if (value.length > 1) return; // Prevent multiple characters

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);
        setError('');
        setSuccess('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits are entered
        if (value && index === 5) {
            const fullCode = newCode.join('');
            if (fullCode.length === 6) {
                // Pass the new code directly to avoid async state issues
                handleSubmit(undefined, fullCode);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === 'ArrowRight' && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
        const newCode = [...code];

        for (let i = 0; i < pastedData.length && i < 6; i++) {
            newCode[i] = pastedData[i];
        }

        setCode(newCode);
        setError('');
        setSuccess('');

        // Focus the next empty input or the last one
        const nextIndex = Math.min(pastedData.length, 5);
        inputRefs.current[nextIndex]?.focus();

        // Auto-submit if all 6 digits are pasted
        if (pastedData.length === 6) {
            handleSubmit(undefined, pastedData);
        }
    };

    const handleSubmit = async (e?: React.FormEvent, providedCode?: string) => {
        if (e) e.preventDefault();

        // Use provided code if available (from auto-submit), otherwise use state
        const verificationCode = providedCode || code.join('');

        if (verificationCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        if (!userId) {
            setError('Invalid verification session. Please try signing up again.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(API_ENDPOINTS.auth.verifyEmail, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    code: verificationCode
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const verifyData = data as VerifyResponse;
                setSuccess(verifyData.message || 'Email verified successfully!');

                // Redirect to login page with redirect URL preserved after a short delay
                setTimeout(() => {
                    const dest = redirectUrl || '/dashboard';
                    router.push(`/auth/login?verified=true&redirect=${encodeURIComponent(dest)}`);
                }, 2000);

            } else {
                const errorData = data as ErrorResponse;
                setError(errorData.error || 'Verification failed. Please try again.');

                // Clear code on error
                if (errorData.error.includes('Invalid') || errorData.error.includes('expired')) {
                    setCode(['', '', '', '', '', '']);
                    inputRefs.current[0]?.focus();
                }
            }

        } catch (error) {
            console.error('Verification failed:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!userId) {
            setError('Invalid verification session. Please try signing up again.');
            return;
        }

        setIsResending(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(API_ENDPOINTS.auth.resendVerification, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const resendData = data as ResendResponse;
                setSuccess(resendData.message || 'Verification code sent successfully!');

                // Clear the code and refocus first input
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();

            } else {
                const errorData = data as ErrorResponse;
                setError(errorData.error || 'Failed to resend verification code.');
            }

        } catch (error) {
            console.error('Resend failed:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsResending(false);
        }
    };

    const handleBackToSignup = () => {
        if (redirectUrl) {
            router.push(`/auth/signup?redirect=${encodeURIComponent(redirectUrl)}`);
        } else {
            router.push('/auth/signup');
        }
    };

    // If no user_id is provided, show error state
    if (!userId) {
        return (
            <AuthLayout
                title="Verification Error"
                subtitle="Unable to verify your email address"
                showBackToLogin={true}
            >
                <div className="text-center space-y-4">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
                    <p className="text-red-600 font-medium">{error}</p>
                    <Button onClick={handleBackToSignup} className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Sign Up
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Verify your email"
            subtitle={
                email ?
                    `We've sent a 6-digit verification code to ${email}` :
                    "We've sent a 6-digit verification code to your email address"
            }
            showBackToLogin={true}
        >
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Step 2 of 2</span>
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#2CA7A3] rounded-full"></div>
                        <div className="w-2 h-2 bg-[#2CA7A3] rounded-full"></div>
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="w-full bg-[#2CA7A3] h-1 rounded-full transition-all duration-300"></div>
                </div>
            </div>

            {/* Success Message */}
            {success && (
                <div className="p-4 rounded-md bg-green-50 border border-green-200 animate-fade-in mb-4">
                    <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 animate-fade-in mb-4">
                    <div className="flex items-center space-x-2 text-red-800">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="verification-code" className="text-center block text-sm font-medium text-gray-700">
                        Enter verification code
                    </Label>

                    <div className="flex justify-center space-x-3">
                        {code.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                disabled={isLoading || !!success}
                                className={`w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 transition-all duration-200 ${
                                    error
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : success
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                }`}
                            />
                        ))}
                    </div>

                    <p className="text-xs text-gray-500 text-center">
                        Can&apos;t find the code? Check your spam folder
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !!success}
                    size="lg"
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Verifying...</span>
                        </div>
                    ) : success ? (
                        <div className="flex items-center justify-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified! Redirecting...</span>
                        </div>
                    ) : (
                        'Verify Email'
                    )}
                </Button>

                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Didn&apos;t receive the code?
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResendCode}
                        disabled={isResending || !!success}
                        className="text-blue-500 hover:text-blue-500/70 hover:bg-blue-500/5 font-medium"
                    >
                        {isResending ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-[#2CA7A3]/30 border-t-[#2CA7A3] rounded-full animate-spin"></div>
                                <span>Sending...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>Resend code</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>

            {/* Support link */}
            <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                    Having trouble?{' '}
                    <a
                        href="mailto:support@traliq.ai"
                        className="font-semibold text-blue-500 hover:text-blue-500/70 transition-colors hover:underline"
                    >
                        Contact support
                    </a>
                </p>
            </div>
        </AuthLayout>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}