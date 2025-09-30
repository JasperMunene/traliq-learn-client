import { Home, BookOpen, BarChart3, Star, Settings, Users, Award, Calendar, PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function DashboardSidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: DashboardSidebarProps) {
    const router = useRouter();
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Home },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
        { id: 'create-course', label: 'Create Course', icon: PlusSquare },
        { id: 'progress', label: 'Progress', icon: BarChart3 },
        { id: 'achievements', label: 'Achievements', icon: Award },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'community', label: 'Community', icon: Users },
        { id: 'favorites', label: 'Favorites', icon: Star },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

        const handleNavigation = (tab: string) => {
        setActiveTab(tab);
        if (tab === 'create-course') {
            router.push('/dashboard/course/create');
        } else {
            router.push(`/dashboard?tab=${tab}`);
        }
        setSidebarOpen(false);
    };

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
                <div className="h-16 px-6 flex items-center border-b border-gray-200 flex-shrink-0">
                    <h1 className="text-xl font-bold text-gray-900">traliq ai</h1>
                </div>

                {/* Navigation Container - Fixed Height, No Scroll */}
                <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
                    {/* Navigation - Scrollable if needed */}
                    <nav className="flex-1 p-4 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                        activeTab === item.id
                                            ? 'bg-gray-900 text-white'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Progress Card - Fixed at bottom, Never Scrolls */}
                    <div className="p-4 border-t border-gray-200 flex-shrink-0">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-3">Learning Streak</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-lg">
                                    🔥
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-gray-900">28 days</p>
                                    <p className="text-xs text-gray-500">Keep it up!</p>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                <div className="bg-gray-900 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-gray-600">3 days to next milestone</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}