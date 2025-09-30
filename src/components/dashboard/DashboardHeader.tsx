import { Search, Bell, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { removeTokens } from "@/lib/cookies";
import { cleanupTokenRefresh } from "@/lib/api";

interface DashboardHeaderProps {
    user: UserData | null;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
}

export default function DashboardHeader({ user, sidebarOpen, setSidebarOpen }: DashboardHeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
        const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    const handleLogout = () => {
        // Clean up token refresh scheduler
        cleanupTokenRefresh();
        
        // Remove tokens from cookies
        removeTokens();
        
        // Remove user data from storage
        localStorage.removeItem('user');
        
        // Redirect to login
        router.push('/auth/login');
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Left Side - Logo and Mobile Menu */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600" />
                        )}
                    </button>

                    <div className="flex items-center lg:hidden">
                        <span className="text-xl font-bold text-gray-900">traliq ai</span>
                    </div>
                </div>

                {/* Center - Search */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses, topics, or mentors..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Right Side - Notifications and Profile */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-gray-900 rounded-full"></span>
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 cursor-pointer">
                            <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user ? getInitials(user.first_name, user.last_name) : '...'}
                            </div>
                            <div className="hidden sm:block text-left">
                                <p className="text-sm font-semibold text-gray-900">{user ? `${user.first_name} ${user.last_name}` : 'Loading...'}</p>
                                <p className="text-xs text-gray-500">{user ? user.email : ''}</p>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <User className="w-4 h-4" />
                                    Profile
                                </a>
                                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}