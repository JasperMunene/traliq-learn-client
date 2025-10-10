'use client'
import { Search, Menu } from "lucide-react";
import { useState } from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";
import Link from "next/link";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <nav className="bg-gray-50 px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center">
                    <Image src="/logo.png" alt="Logo" width={160} height={160} />
                </div>

                {/* Navigation Links - Desktop */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#" className="text-gray-700 hover:text-blue-400 transition-all duration-200 font-medium">
                        Home
                    </a>
                    <Link href="/courses" className="text-gray-700 hover:text-blue-400 transition-all duration-200 font-medium">
                        Courses
                    </Link>
                    <a href="#" className="text-gray-700 hover:text-blue-400 transition-all duration-200 font-medium">
                        Mentors
                    </a>
                    <a href="#" className="text-gray-700 hover:text-blue-400 transition-all duration-200 font-medium">
                        About
                    </a>
                </div>

                {/* Right Side - Search, Login, Sign up */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Search Icon - Opens top sheet */}
                    <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
                        <SheetTrigger asChild>
                            <button className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200">
                                <Search className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="top" className="bg-gray-50 border-b border-gray-200">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Search</SheetTitle>
                            </SheetHeader>
                            <div className="py-6 sm:py-8 px-4 sm:px-6 max-w-4xl mx-auto">
                                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search for courses, mentors, or topics..."
                                            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm sm:text-base text-gray-700 placeholder-gray-400 transition-all"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex-1 sm:flex-none px-6 py-3.5 sm:py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-200 font-medium whitespace-nowrap shadow-sm">
                                            Search
                                        </button>
                                        <SheetClose asChild>
                                            <button className="px-6 py-3.5 sm:py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-all duration-200 font-medium whitespace-nowrap shadow-sm">
                                                Cancel
                                            </button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Hamburger Menu - Mobile Only */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <button className="md:hidden p-2 hover:bg-gray-200 rounded-full transition-all duration-200">
                                <Menu className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="left" className="bg-gray-50 w-[280px] sm:w-[320px]">
                            <SheetHeader>
                                <SheetTitle className="text-xl font-bold text-black font-poppins text-left">
                                    Traliq AI
                                </SheetTitle>
                            </SheetHeader>
                            <SheetClose className="absolute right-4 top-4 rounded-full p-2 hover:bg-gray-200 transition-all duration-200 opacity-100">
                            </SheetClose>
                            <div className="flex flex-col gap-6 mt-8">
                                {/* Navigation Links */}
                                <div className="flex flex-col gap-2">
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-blue-400 hover:bg-gray-100 transition-all duration-200 font-medium text-lg py-3 px-4 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Home
                                    </a>
                                    <Link
                                        href="/courses"
                                        className="text-gray-700 hover:text-blue-400 hover:bg-gray-100 transition-all duration-200 font-medium text-lg py-3 px-4 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Courses
                                    </Link>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-blue-400 hover:bg-gray-100 transition-all duration-200 font-medium text-lg py-3 px-4 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Mentors
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-700 hover:text-blue-400 hover:bg-gray-100 transition-all duration-200 font-medium text-lg py-3 px-4 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        About
                                    </a>
                                </div>

                                {/* Auth Buttons */}
                                <div className="flex flex-col gap-3 mt-4 pt-6 border-t border-gray-200">
                                    <a
                                        href="/auth/login"
                                        className="text-center px-6 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Log in
                                    </a>
                                    <a
                                        href="/auth/signup"
                                        className="text-center px-6 py-3 bg-black border border-black rounded-full text-white hover:bg-gray-800 hover:border-gray-800 transition-all duration-200 font-medium"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign up
                                    </a>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Login Link - Desktop Only */}
                    <a href="/auth/login" className="hidden md:block text-gray-700 hover:text-blue-400 transition-all duration-200 font-medium">
                        Log in
                    </a>

                    {/* Sign up Button - Desktop Only */}
                    <a href="/auth/signup" className="hidden md:block px-8 py-3 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200">
                        Sign up
                    </a>
                </div>
            </div>
        </nav>
    );
}