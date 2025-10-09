import { BookOpen, Users, Network } from "lucide-react";
import Image from "next/image";

export default function FeaturesSection() {
    return (
        <section className="bg-gray-50 px-4 sm:px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header - Centered */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Learn AI Live—Keep the Replay Forever
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Join interactive, expert-led AI webinars in real time with Q&A sessions. Miss a class? No problem—every live session is recorded and yours to watch anytime, forever. Reserve your seat today.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                    {/* Left Content - Image */}
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden bg-gray-100">
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
                    <div className="space-y-6">
                        {/* Feature 1 - Pioneering Education */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Lifetime Replay Access Included
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Every live AI class automatically becomes yours forever. Watch replays anytime on any device. One payment, infinite access—no subscriptions, no expiration.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2 - Cultivating Engagement */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Real-Time Q&A with Experts
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Ask questions directly during live sessions. Get instant answers from industry practitioners. No more waiting days for email responses—clarify doubts immediately and accelerate your learning.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3 - Building Connections */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <Network className="w-5 h-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        Network with 50,000+ AI Professionals
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
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