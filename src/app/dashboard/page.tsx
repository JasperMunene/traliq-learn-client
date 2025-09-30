"use client";

import { useState, useEffect, Suspense } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import CourseGrid from '@/components/dashboard/CourseGrid';
import ProgressSection from '@/components/dashboard/ProgressSection';
import RecommendedCourses from '@/components/dashboard/RecommendedCourses';
import LearningStats from '@/components/dashboard/LearningStats';

function DashboardContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');
        const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
        }, [searchParams]);

    useEffect(() => {
                const fetchUser = async () => {
            try {
                const response = await fetchWithAuth('http://16.171.54.227:5000/api/users/me');

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-8">
                        <DashboardOverview user={user} />
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <ProgressSection />
                            </div>
                            <div>
                                <LearningStats />
                            </div>
                        </div>
                        <RecommendedCourses />
                    </div>
                );
            case 'courses':
                return <CourseGrid />;
            case 'progress':
                return <ProgressSection detailed={true} />;
            default:
                return <DashboardOverview user={user} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
                        <DashboardHeader
                user={user}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex">
                <DashboardSidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="flex-1 lg:ml-64 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>}>
            <DashboardContent />
        </Suspense>
    );
}