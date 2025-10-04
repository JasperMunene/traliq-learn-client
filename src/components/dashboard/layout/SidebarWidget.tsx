"use client";
import React, { useState, useRef, useEffect } from "react";
import { Users, DollarSign, Settings, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { removeTokens } from "@/lib/cookies";
import { cleanupTokenRefresh } from "@/lib/api";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  role?: 'tutor' | 'learner';
}

interface SidebarWidgetProps {
  user?: User | null;
}

export default function SidebarWidget({ user }: SidebarWidgetProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="mb-6 space-y-4">
      {/* Stats Card - Shows for learners and tutors */}
      {user?.role === 'learner' && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Learning Streak</h3>
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-base shadow-sm">
              🔥
            </div>
          </div>
          <div className="mb-3">
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-0.5">28</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">days in a row</p>
          </div>
          <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1.5 mb-2">
            <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">3 more days to reach 31 days!</p>
        </div>
      )}
      
      {user?.role === 'tutor' && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">This Month</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">124</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="h-px bg-blue-200 dark:bg-blue-800"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">$2,450</p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Logout Section */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
          >
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user ? getInitials(user.first_name, user.last_name) : '...'}
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                {user ? user.email : ''}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-all duration-200 flex-shrink-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 ${
              dropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1.5 z-50 overflow-hidden">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  router.push('/dashboard?tab=settings');
                }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium">Settings</span>
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
