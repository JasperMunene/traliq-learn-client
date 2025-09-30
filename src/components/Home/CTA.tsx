import { ArrowUpRight, Sparkles } from "lucide-react";

export default function CTASection() {
    return (
        <section className="bg-white px-6 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gray-900 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full -translate-x-16 -translate-y-16"></div>
                        <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-400 rounded-full translate-x-12 translate-y-12"></div>
                        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400 rounded-full -translate-y-8"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-blue-400 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
                            Ready to Transform Your Career with AI?
                        </h2>

                        {/* Description */}
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who have successfully upskilled with AI.
                            Start your journey today with our expert-led courses and hands-on projects.
                        </p>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 mb-8 text-center">
                            <div>
                                <div className="text-2xl font-bold text-white">50K+</div>
                                <div className="text-gray-400 text-sm">Students</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">95%</div>
                                <div className="text-gray-400 text-sm">Success Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">4.9/5</div>
                                <div className="text-gray-400 text-sm">Rating</div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-gray-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                                Start Your Free Trial
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                            <button className="text-white px-8 py-4 rounded-full border border-gray-600 hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 font-medium">
                                View Course Catalog
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex justify-center items-center gap-6 mt-8 pt-8 border-t border-gray-700">
                            <div className="text-gray-400 text-sm">Trusted by professionals at:</div>
                            <div className="flex gap-4 opacity-60">
                                <span className="text-white font-semibold">Google</span>
                                <span className="text-white font-semibold">Microsoft</span>
                                <span className="text-white font-semibold">Tesla</span>
                                <span className="text-white font-semibold">OpenAI</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}