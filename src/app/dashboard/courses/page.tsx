"use client";

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import CourseGrid from '@/components/dashboard/CourseGrid';
import { API_ENDPOINTS } from '@/lib/config';

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    role?: 'tutor' | 'learner';
}

export default function CoursesPage() {
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
        <div className="max-w-7xl mx-auto">
            <CourseGrid />
        </div>
    );
}
