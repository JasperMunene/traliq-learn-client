"use client";

import { useState, useEffect, Suspense } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProgressSection from '@/components/dashboard/ProgressSection';

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    role?: 'tutor' | 'learner';
}

function DashboardContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<UserData | null>(null);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
        }, [searchParams]);

    useEffect(() => {
                const fetchUser = async () => {
            try {
                const response = await fetchWithAuth('https://api.traliq.com/api/users/me');

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
                return <DashboardOverview user={user} />;
            case 'progress':
                return <ProgressSection detailed={true} />;
            default:
                return <DashboardOverview user={user} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            {renderContent()}
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