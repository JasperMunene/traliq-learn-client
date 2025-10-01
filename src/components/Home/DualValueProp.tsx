import { GraduationCap, DollarSign, TrendingUp, Globe, CheckCircle } from "lucide-react";

export default function DualValueProp() {
    return (
        <section className="bg-gray-50 px-6 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Whether You&apos;re Learning or Teaching, We&apos;ve Got You Covered
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
                        Join thousands of professionals mastering AI skills, or become a tutor and turn your expertise into passive income
                    </p>
                </div>

                {/* Split Layout */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* FOR LEARNERS */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500 rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-blue-100 h-full">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap className="w-8 h-8 text-blue-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                For Learners: Master AI with Live Experts
                            </h3>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Accelerate your AI career with hands-on courses taught by industry practitioners from leading tech companies.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Join live AI webinars with industry practitioners</p>
                                        <p className="text-sm text-gray-600">Interactive sessions with experts from Google, Microsoft & Tesla</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Ask questions in real-time during Q&A sessions</p>
                                        <p className="text-sm text-gray-600">Get your specific doubts answered directly by instructors</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Network with 50,000+ AI enthusiasts globally</p>
                                        <p className="text-sm text-gray-600">Build connections that advance your career</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Earn verified certificates for your resume</p>
                                        <p className="text-sm text-gray-600">Share on LinkedIn and showcase your expertise</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Access lifetime replays of every live class</p>
                                        <p className="text-sm text-gray-600">Never miss out—watch anytime, anywhere, forever</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Proof */}
                            <div className="bg-blue-50 rounded-xl p-5 mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                    <p className="font-bold text-blue-900">95% Career Advancement Rate</p>
                                </div>
                                <p className="text-sm text-blue-700">
                                    &quot;95% of students report career advancement within 6 months of completing their first AI course&quot;
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3">
                                <a 
                                    href="#courses"
                                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-full hover:bg-blue-700 transition-all duration-200 font-bold text-center block shadow-lg hover:shadow-xl"
                                >
                                    Browse AI Courses
                                </a>
                                <a 
                                    href="#live-sessions"
                                    className="w-full bg-white border-2 border-blue-200 text-blue-700 px-6 py-4 rounded-full hover:bg-blue-50 transition-all duration-200 font-bold text-center block"
                                >
                                    See Live Schedule
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* FOR TUTORS */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-purple-500 rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity"></div>
                        <div className="relative bg-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 h-full">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                For Tutors: Teach AI, Earn Passive Income
                            </h3>

                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Transform your AI expertise into a thriving online business. Reach global audiences and earn while you sleep.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Host live webinars to engaged global audiences</p>
                                        <p className="text-sm text-gray-600">Teach from anywhere—no studio or equipment needed</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Earn 70% revenue share on every enrollment</p>
                                        <p className="text-sm text-gray-600">Industry-leading commission structure</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Build your brand as an AI thought leader</p>
                                        <p className="text-sm text-gray-600">Grow your reputation and professional network</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">Turn one live session into lifetime royalties</p>
                                        <p className="text-sm text-gray-600">Earn passive income long after the live session ends</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-900">We handle tech, marketing, and payments</p>
                                        <p className="text-sm text-gray-600">Focus on teaching—we take care of everything else</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Proof */}
                            <div className="bg-purple-50 rounded-xl p-5 mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <Globe className="w-6 h-6 text-purple-600" />
                                    <p className="font-bold text-purple-900">KES 500,000+/month</p>
                                </div>
                                <p className="text-sm text-purple-700">
                                    &quot;Top tutors earn KES 500,000+ per month through live sessions and on-demand course royalties&quot;
                                </p>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3">
                                <a 
                                    href="/auth/signup?role=tutor"
                                    className="w-full bg-purple-600 text-white px-6 py-4 rounded-full hover:bg-purple-700 transition-all duration-200 font-bold text-center block shadow-lg hover:shadow-xl"
                                >
                                    Apply to Teach AI
                                </a>
                                <a 
                                    href="#tutor-benefits"
                                    className="w-full bg-white border-2 border-purple-200 text-purple-700 px-6 py-4 rounded-full hover:bg-purple-50 transition-all duration-200 font-bold text-center block"
                                >
                                    See Tutor Benefits
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
