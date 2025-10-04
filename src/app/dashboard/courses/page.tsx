"use client";

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import CourseGrid from '@/components/dashboard/CourseGrid';
import { API_ENDPOINTS } from '@/lib/config';

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    role?: 'tutor' | 'learner';
}

export default function CoursesPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchWithAuth(API_ENDPOINTS.users.me);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader
                user={user}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex">
                <DashboardSidebar
                    activeTab="courses"
                    setActiveTab={() => {}}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    userRole={user?.role || 'learner'}
                    user={user}
                />

                <main className="flex-1 lg:ml-64 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <CourseGrid />
                    </div>
                </main>
            </div>
        </div>
    );
}
