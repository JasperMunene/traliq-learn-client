import { useState, useEffect } from "react";
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const loaderVariants = cva('animate-spin rounded-full border-4 border-t-transparent',
    {
        variants: {
            size: {
                small: 'w-5 h-5 border-2',
                large: 'w-16 h-16',
                page: 'w-16 h-16', // Same as large for the spinner itself
            },
            color: {
                primary: 'border-gray-900',
                secondary: 'border-gray-500',
                white: 'border-white',
            },
        },
        defaultVariants: {
            size: 'large',
            color: 'primary',
        },
    });

export interface LoaderProps extends VariantProps<typeof loaderVariants> {
    className?: string;
    text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size, color, className, text }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 0;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    if (size === 'page') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center space-y-8">
                    {/* Logo/Brand */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-900">traliq ai</h1>

                        {/* Simple Spinner */}
                        <div className={loaderVariants({ size, color, className })}></div>
                    </div>

                    {/* Loading Text */}
                    <div className="space-y-2">
                        {text && <p className="text-sm text-gray-600">{text}</p>}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-64 mx-auto">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gray-900 rounded-full transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={loaderVariants({ size, color, className })}></div>
    );
};

export default Loader;