"use client";

import { SidebarProvider, useSidebar } from "@/components/context/SidebarContext";
import { ThemeProvider } from "@/components/context/ThemeContext";
import AppSidebar from "@/components/dashboard/layout/AppSidebar";
import Backdrop from "@/components/dashboard/layout/Backdrop";
import AppHeader from "@/components/dashboard/layout/AppHeader";
import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/config";

interface User {
    first_name: string;
    last_name: string;
    email: string;
    role?: 'tutor' | 'learner';
}

// Shell that consumes Sidebar context. This MUST be rendered inside SidebarProvider
function DashboardShell({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
        ? "lg:ml-[290px]"
        : "lg:ml-[90px]";

    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar user={user} />
            <Backdrop />
            <div
                className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
                <AppHeader user={user} />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchWithAuth(API_ENDPOINTS.users.me);
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    return (
        <ThemeProvider>
            <SidebarProvider>
                <DashboardShell user={user}>{children}</DashboardShell>
            </SidebarProvider>
        </ThemeProvider>
    )
}