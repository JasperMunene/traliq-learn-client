"use client";
import React, { useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "@/components/context/SidebarContext";
import {
  Home,
  BookOpen,
  BarChart3,
  Star,
  Settings,
  Users,
  Award,
  Calendar,
  PlusSquare,
  Video,
  DollarSign,
  MessageSquare,
  MoreHorizontal,
  GraduationCap,
  Search,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// Learner menu items
const learnerNavItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    name: "Overview",
    path: "/dashboard?tab=overview",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    name: "My Courses",
    path: "/dashboard/my-courses",
  },
  {
    icon: <Search className="w-5 h-5" />,
    name: "Browse Courses",
    path: "/dashboard/courses",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    name: "Progress",
    path: "/dashboard?tab=progress",
  },
  {
    icon: <Award className="w-5 h-5" />,
    name: "Achievements",
    path: "/dashboard?tab=achievements",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    name: "Schedule",
    path: "/dashboard?tab=schedule",
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Community",
    path: "/dashboard?tab=community",
  },
  {
    icon: <Star className="w-5 h-5" />,
    name: "Favorites",
    path: "/dashboard?tab=favorites",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Settings",
    path: "/dashboard?tab=settings",
  },
];

// Tutor menu items
const tutorNavItems: NavItem[] = [
  {
    icon: <Home className="w-5 h-5" />,
    name: "Overview",
    path: "/dashboard?tab=overview",
  },
  {
    icon: <BookOpen className="w-5 h-5" />,
    name: "Courses",
    path: "/dashboard/courses",
  },
  {
    icon: <PlusSquare className="w-5 h-5" />,
    name: "Create Course",
    path: "/dashboard/course/create",
  },
  {
    icon: <Video className="w-5 h-5" />,
    name: "Live Sessions",
    path: "/dashboard?tab=sessions",
  },
  {
    icon: <Users className="w-5 h-5" />,
    name: "Students",
    path: "/dashboard?tab=students",
  },
  {
    icon: <DollarSign className="w-5 h-5" />,
    name: "Earnings",
    path: "/dashboard?tab=earnings",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    name: "Reviews",
    path: "/dashboard?tab=reviews",
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    name: "Schedule",
    path: "/dashboard?tab=schedule",
  },
  {
    icon: <Settings className="w-5 h-5" />,
    name: "Settings",
    path: "/dashboard?tab=settings",
  },
];

interface User {
  first_name: string;
  last_name: string;
  email: string;
  role?: 'tutor' | 'learner';
}

interface AppSidebarProps {
  user?: User | null;
}

// Inner component that uses useSearchParams - must be wrapped in Suspense
const SidebarContent: React.FC<AppSidebarProps> = ({ user }) => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Select menu items based on user role
  const navItems = user?.role === 'tutor' ? tutorNavItems : learnerNavItems;

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav) => (
        <li key={nav.name}>
          {nav.path && (
            <Link
              href={nav.path}
              className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
            >
              <span
                className={`${isActive(nav.path)
                  ? "menu-item-icon-active"
                  : "menu-item-icon-inactive"
                  }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );


  const isActive = useCallback((path: string) => {
    // Handle query parameter paths safely without window
    if (path.includes('?')) {
      const [basePath, query] = path.split('?');
      if (pathname !== basePath) return false;
      const expected = new URLSearchParams(query);
      for (const [key, value] of expected.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }
    return path === pathname;
  }, [pathname, searchParams]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/logo3.png"
                alt="Logo"
                width={120}
                height={32}
              />
              <Image
                className="hidden dark:block"
                src="/logo2.png"
                alt="Logo"
                width={120}
                height={32}
              />
            </>
          ) : (
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-black dark:bg-transparent text-white font-bold text-lg font-sans">
              T
            </div>
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
                  }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <MoreHorizontal className="w-5 h-5" />
                )}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

// Main component with Suspense wrapper
const AppSidebar: React.FC<AppSidebarProps> = ({ user }) => {
  return (
    <Suspense fallback={
      <aside className="fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 w-[90px] -translate-x-full lg:translate-x-0">
        <div className="py-8 flex lg:justify-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-black dark:bg-transparent text-white font-bold text-lg font-sans">
            T
          </div>
        </div>
      </aside>
    }>
      <SidebarContent user={user} />
    </Suspense>
  );
};

export default AppSidebar;
