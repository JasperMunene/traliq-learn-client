import { BookOpen, Users, Network } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
    return (
        <section className="bg-gray-50 px-6 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Header - Centered */}
                <div className="text-center mb-16 lg:mb-20">
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-4 max-w-7xl">
                        Learn AI Live—Keep the Replay Forever
                    </h2>
                    <p className="text-gray-600 text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
                        Join interactive, expert-led AI webinars in real time with Q&A sessions. Miss a class? No problem—every live session is recorded and yours to watch anytime, forever. Reserve your seat today.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Content - Image */}
                    <div className="relative">
                        <div className="rounded-3xl overflow-hidden bg-gray-100">
                            <Image
                                src="https://res.cloudinary.com/dwcvogqak/image/upload/v1759061014/agency-office-workers-cooperating-regarding-startu-2025-02-19-22-21-23-utc-min_vqwlnk.jpg?auto=compress&cs=tinysrgb&w=800"
                                alt="Two people collaborating at a desk with laptop and camera"
                                width={500}
                                height={500}
                                className="w-full h-[400px] lg:h-[500px] object-cover"
                            />
                        </div>
                    </div>

                    {/* Right Content - Features */}
                    <div className="space-y-6 lg:space-y-8">
                        {/* Feature 1 - Pioneering Education */}
                        <div className="bg-gray-100 rounded-2xl p-6 lg:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-gray-100" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                                        Lifetime Replay Access Included
                                    </h3>
                                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                                        Every live AI class automatically becomes yours forever. Watch replays anytime on any device. One payment, infinite access—no subscriptions, no expiration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Cultivating Engagement */}
                        <div className="bg-gray-100 rounded-2xl p-6 lg:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 lg:w-6 lg:h-6 text-gray-100" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                                        Real-Time Q&A with Experts
                                    </h3>
                                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                                        Ask questions directly during live sessions. Get instant answers from industry practitioners. No more waiting days for email responses—clarify doubts immediately and accelerate your learning.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Building Connections */}
                        <div className="bg-gray-100 rounded-2xl p-6 lg:p-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-400 rounded-xl flex items-center justify-center">
                                        <Network className="w-5 h-5 lg:w-6 lg:h-6 text-gray-100" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                                        Network with 50,000+ AI Professionals
                                    </h3>
                                    <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                                        Connect with peers during live sessions, join our global community forums, and build relationships that advance your AI career. Learn from others&apos; questions and experiences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}