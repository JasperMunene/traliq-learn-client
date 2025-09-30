import React, { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image'

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
    showBackToLogin?: boolean;
}

export function AuthLayout({
                               children,
                               title,
                               subtitle,
                               showBackToLogin = false
                           }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex bg-gray-50 overflow-hidden">
            {/* Left side - Full Image with Overlay Content */}
            <div className="hidden lg:flex flex-[55%] relative">
                {/* Full Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="https://res.cloudinary.com/dwcvogqak/image/upload/v1759134172/contemporary-young-people-in-business-meeting-2025-03-07-09-29-24-utc-min_eaqcjq.jpg?w=1200&q=80"
                        alt="Students learning together"
                        width={1200}
                        height={800}
                        className="w-full h-full object-cover"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
                    {/* Subtle color gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    {/* Top Section - Logo */}
                    <div>
                        <div className="inline-flex items-center">
                            <span className="text-3xl font-bold text-white font-poppins drop-shadow-sm">Traliq AI</span>
                        </div>
                    </div>

                    {/* Middle Section - Hero Content */}
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold text-white leading-tight drop-shadow-lg">
                                Transform Your Future with AI
                            </h1>
                            <p className="text-xl text-white/90 leading-relaxed max-w-md drop-shadow-sm">
                                Join thousands of learners mastering cutting-edge skills with industry-leading experts
                            </p>
                        </div>

                        {/* Feature Highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
                                <span className="text-white/90 font-medium">Expert-led courses</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-blue-400 rounded-full shadow-sm"></div>
                                <span className="text-white/90 font-medium">Hands-on projects</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-2 h-2 bg-purple-400 rounded-full shadow-sm"></div>
                                <span className="text-white/90 font-medium">Industry recognition</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Stats */}
                    <div className="space-y-6">
                        <div className="h-px bg-white/20"></div>

                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-white drop-shadow-sm">50K+</p>
                                <p className="text-white/80 text-sm font-medium">Active Learners</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-white drop-shadow-sm">200+</p>
                                <p className="text-white/80 text-sm font-medium">AI Courses</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-white drop-shadow-sm">95%</p>
                                <p className="text-white/80 text-sm font-medium">Success Rate</p>
                            </div>
                        </div>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center space-x-6 pt-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                                <span className="text-white/80 text-sm">4.9★ Rating</span>
                            </div>
                            <div className="w-px h-4 bg-white/20"></div>
                            <div className="flex items-center space-x-2">
                                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                                <span className="text-white/80 text-sm">Trusted Worldwide</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 lg:flex-[45%] flex flex-col justify-center py-8 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white">
                <div className="mx-auto w-full max-w-sm">
                    {/* Header with logo */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-8 lg:hidden">
                            <div className="inline-flex items-center">
                                <span className="text-2xl font-bold text-black font-poppins">Traliq AI</span>
                            </div>
                        </div>

                        {showBackToLogin && (
                            <button className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-6">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to login
                            </button>
                        )}
                    </div>

                    {/* Welcome section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-gray-600 leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Form container */}
                    <div className="space-y-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}