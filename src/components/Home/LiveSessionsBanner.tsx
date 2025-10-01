'use client'
import { useState, useEffect } from 'react';
import { Clock, Users, ArrowRight } from "lucide-react";

export default function LiveSessionsBanner() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 15,
        seconds: 0
    });

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return prev;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const upcomingSessions = [
        {
            title: "GPT-4 Prompt Engineering Masterclass",
            time: "Today, 3:00 PM EST",
            seatsLeft: 23,
            totalSeats: 100,
            isLive: false
        },
        {
            title: "Machine Learning Fundamentals",
            time: "Tomorrow, 6:00 PM EST",
            seatsLeft: 87,
            totalSeats: 100,
            isLive: false
        },
        {
            title: "Computer Vision Bootcamp",
            time: "Wed, 8:00 PM EST",
            seatsLeft: 12,
            totalSeats: 100,
            isLive: false
        }
    ];

    return (
        <section id="live-sessions" className="bg-red-500 text-white py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* Left: Urgency Message */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            <span className="text-sm sm:text-base font-bold">UPCOMING LIVE SESSIONS</span>
                        </div>
                    </div>

                    {/* Center: Session Info */}
                    <div className="flex-1 text-center lg:text-left">
                        <p className="text-lg sm:text-xl font-bold mb-1">
                            {upcomingSessions[0].title}
                        </p>
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Starts in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                <span>{upcomingSessions[0].seatsLeft} seats left</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA Button */}
                    <a 
                        href="/auth/signup"
                        className="bg-white text-red-600 px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
                    >
                        Reserve My Seat
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>

                {/* Additional Upcoming Sessions */}
                <div className="mt-6 pt-6 border-t border-white/20">
                    <p className="text-sm font-semibold mb-3">More Sessions This Week:</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {upcomingSessions.slice(1).map((session, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 hover:bg-white/20 transition-all">
                                <p className="font-semibold text-sm mb-1">{session.title}</p>
                                <div className="flex items-center justify-between text-xs">
                                    <span>{session.time}</span>
                                    <span className={`font-bold ${session.seatsLeft < 20 ? 'text-yellow-300' : ''}`}>
                                        {session.seatsLeft} seats left
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
