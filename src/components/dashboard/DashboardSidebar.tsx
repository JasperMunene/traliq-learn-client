import { Home, BookOpen, BarChart3, Star, Settings, Users, Award, Calendar, PlusSquare, Video, DollarSign, MessageSquare, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { removeTokens } from "@/lib/cookies";
import { cleanupTokenRefresh } from "@/lib/api";

interface DashboardSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    userRole?: 'tutor' | 'learner' | null;
    user?: UserData | null;
}

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
}

export default function DashboardSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, userRole, user }: DashboardSidebarProps) {
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Learner menu items
    const learnerMenuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'progress', label: 'Progress', icon: BarChart3 },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Tutor menu items
    const tutorMenuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'create-course', label: 'Create Course', icon: PlusSquare },
        { id: 'sessions', label: 'Live Sessions', icon: Video },
        { id: 'students', label: 'Students', icon: Users },
        { id: 'earnings', label: 'Earnings', icon: DollarSign },
        { id: 'reviews', label: 'Reviews', icon: MessageSquare },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Select menu items based on role
    const menuItems = userRole === 'tutor' ? tutorMenuItems : learnerMenuItems;

    const handleNavigation = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'create-course') {
            router.push('/dashboard/course/create');
        } else if (tab === 'courses') {
            router.push('/dashboard/courses');
        } else {
            router.push(`/dashboard?tab=${tab}`);
        }
        setSidebarOpen(false);
    };

    const handleLogout = () => {
        cleanupTokenRefresh();
        removeTokens();
        localStorage.removeItem('user');
        router.push('/auth/login');
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="h-16 px-6 flex items-center border-b border-gray-100 flex-shrink-0">
                    <h1 className="text-xl text-gray-900 font-mono tracking-tight">Traliq.<span className="font-bold">ai</span></h1>
                </div>

                {/* Navigation Container - Fixed Height, No Scroll */}
                <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
                    {/* Navigation - Scrollable if needed */}
                    <nav className="flex-1 p-3 pt-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${
                                        isActive
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                                        isActive ? '' : 'group-hover:scale-110'
                                    }`} />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Stats Card - Fixed at bottom, Never Scrolls */}
                    {userRole === 'learner' && (
                        <div className="p-3 border-t border-gray-100 flex-shrink-0">
                            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-900 text-sm">Learning Streak</h3>
                                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-base shadow-sm">
                                        🔥
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="text-3xl font-bold text-gray-900 mb-0.5">28</p>
                                    <p className="text-xs text-gray-600">days in a row</p>
                                </div>
                                <div className="w-full bg-orange-200 rounded-full h-1.5 mb-2">
                                    <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-gray-600">3 more days to reach 31 days!</p>
                            </div>
                        </div>
                    )}
                    {userRole === 'tutor' && (
                        <div className="p-3 border-t border-gray-100 flex-shrink-0">
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                                <h3 className="font-semibold text-gray-900 text-sm mb-4">This Month</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Students</p>
                                            <p className="text-2xl font-bold text-gray-900">124</p>
                                        </div>
                                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                    <div className="h-px bg-blue-200"></div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Revenue</p>
                                            <p className="text-2xl font-bold text-gray-900">$2,450</p>
                                        </div>
                                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                                            <DollarSign className="w-5 h-5 text-white" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* User Profile & Logout Section */}
                    <div className="border-t border-gray-100 flex-shrink-0">
                        <div className="p-3 relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                            >
                                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                    {user ? getInitials(user.first_name, user.last_name) : '...'}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                                        {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate leading-tight mt-0.5">
                                        {user ? user.email : ''}
                                    </p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 flex-shrink-0 group-hover:text-gray-600 ${
                                    dropdownOpen ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute bottom-full left-3 right-3 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleNavigation('settings');
                                        }}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <Settings className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium">Settings</span>
                                    </button>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}