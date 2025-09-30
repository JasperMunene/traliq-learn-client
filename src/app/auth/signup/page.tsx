"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '../AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { Mail, User, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Interface for the API response
interface SignupResponse {
    message: string;
    user_id: string;
    email_sent: boolean;
}

interface SignupError {
    error: string;
}

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validation
        const newErrors: {[key: string]: string} = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            // Make API call to your Flask backend
            const response = await fetch('http://127.0.0.1:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,
                    first_name: formData.firstName.trim(),
                    last_name: formData.lastName.trim(),
                    role: 'learner' // Default role, you can make this dynamic if needed
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Signup successful
                const signupData = data as SignupResponse;

                console.log('Signup successful', signupData);

                // Redirect to verification page with user ID
                router.push(`/auth/verify-email?user_id=${signupData.user_id}&email=${encodeURIComponent(formData.email)}`);

            } else {
                // Handle error cases from backend
                const errorData = data as SignupError;
                setErrors({ general: errorData.error || 'Signup failed. Please try again.' });
            }

        } catch (error) {
            console.error('Signup failed:', error);
            setErrors({ general: 'Network error. Please check your connection and try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        try {
            // Redirect to your backend Google OAuth endpoint
            window.location.href = 'http://127.0.0.1:5000/auth/google';
        } catch (error) {
            console.error('Google login failed:', error);
            setErrors({ general: 'Google login failed. Please try again.' });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const getPasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;
        return strength;
    };

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Start your AI learning journey today"
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
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="flex items-center text-gray-900 font-medium">
                                First Name
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    className={`pl-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                        errors.firstName
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                            : formData.firstName && !errors.firstName
                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                    }`}
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {formData.firstName && !errors.firstName && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.firstName && (
                                <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm font-medium">{errors.firstName}</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="flex items-center text-gray-900 font-medium">
                                Last Name
                            </Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    autoComplete="family-name"
                                    required
                                    className={`pl-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                        errors.lastName
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                            : formData.lastName && !errors.lastName
                                                ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                                : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                    }`}
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                />
                                {formData.lastName && !errors.lastName && (
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.lastName && (
                                <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm font-medium">{errors.lastName}</p>
                                </div>
                            )}
                        </div>
                    </div>

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
                                        : formData.email && !errors.email
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 hover:border-gray-300 bg-gray-50'
                                }`}
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                            />
                            {formData.email && !errors.email && (
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
                    <div className="space-y-2">
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
                                autoComplete="new-password"
                                required
                                className={`pl-12 pr-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                    errors.password
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : formData.password && !errors.password
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 ver:border-gray-300'
                                }`}
                                placeholder="Create a password"
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
                        {formData.password && (
                            <div className="space-y-2">
                                <PasswordStrengthIndicator password={formData.password} />
                                <div className="flex items-center space-x-2 text-xs">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    getPasswordStrength(formData.password) >= i ? 'bg-green-500' : 'bg-gray-200'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <span className="text-gray-500">Password strength</span>
                                </div>
                            </div>
                        )}
                        {errors.password && (
                            <div className="flex items-center space-x-2 text-red-600 animate-fade-in">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <p className="text-sm font-medium">{errors.password}</p>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-900 font-medium">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                autoComplete="new-password"
                                required
                                className={`pl-12 pr-12 h-12 rounded-xl border-2 text-gray-900 placeholder:text-gray-500 transition-all duration-200 ${
                                    errors.confirmPassword
                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50'
                                        : formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword
                                            ? 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 ver:border-gray-300'
                                }`}
                                placeholder="Confirm your password"
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

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            checked={agreedToTerms}
                            onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                            className={`mt-1 ${errors.terms ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        <div className="flex-1">
                            <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                                I agree to the{' '}
                                <Link href="/terms" className="text-blue-500 hover:text-blue-500/70 font-medium">
                                    Terms of Service
                                </Link>
                                {' '}and{' '}
                                <Link href="/privacy" className="text-blue-500 hover:text-blue-500/70 font-medium">
                                    Privacy Policy
                                </Link>
                            </Label>
                            {errors.terms && (
                                <div className="flex items-center space-x-2 text-red-600 animate-fade-in mt-1">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <p className="text-sm font-medium">{errors.terms}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isLoading}
                        size="lg"
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Creating account...</span>
                            </div>
                        ) : (
                            'Create Account'
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
                        size="lg"
                        className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100"
                    >
                        {isGoogleLoading ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-[#2CA7A3] rounded-full animate-spin"></div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                </svg>
                                <span className="font-semibold text-gray-700">Continue with Google</span>
                            </div>
                        )}
                    </Button>

                    {/* Sign in link */}
                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href="/auth/login"
                                className="font-semibold text-blue-500 hover:text-blue-500/70 transition-colors hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}