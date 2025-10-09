import { Search, Video, Award } from "lucide-react";
import Image from "next/image";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: Search,
            title: "Choose Your Learning Style",
            description: "Browse live AI webinars or on-demand courses. Filter by topic: Machine Learning, Deep Learning, NLP, Computer Vision & more.",
            image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            number: "02",
            icon: Video,
            title: "Join Live or Learn Anytime",
            description: "Attend interactive live sessions with real-time Q&A and networking. Or watch pre-recorded courses at your own pace, anytime, anywhere.",
            image: "https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=600"
        },
        {
            number: "03",
            icon: Award,
            title: "Own It Forever",
            description: "Every live class you attend becomes a lifetime replay in your library. Earn verified certificates and build your AI portfolio.",
            image: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=600"
        }
    ];

    return (
        <section className="bg-white px-4 sm:px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        How Traliq AI Works—Simple, Flexible Learning
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        From browsing to mastering AI skills, we&apos;ve made learning seamless and accessible for everyone
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-20">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Content */}
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-4xl font-semibold text-gray-300">
                                        {step.number}
                                    </div>
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <step.icon className="w-6 h-6 text-gray-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {step.description}
                                </p>
                                {index === 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-[#EBF2FE] text-[#1447E6] px-3 py-1.5 rounded-full text-sm font-medium">
                                            Machine Learning
                                        </span>
                                        <span className="bg-[#F0FDF4] text-[#10B981] px-3 py-1.5 rounded-full text-sm font-medium">
                                            Deep Learning
                                        </span>
                                        <span className="bg-[#FEF3C7] text-[#F59E0B] px-3 py-1.5 rounded-full text-sm font-medium">
                                            NLP
                                        </span>
                                        <span className="bg-[#F3E8FF] text-[#9333EA] px-3 py-1.5 rounded-full text-sm font-medium">
                                            Computer Vision
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                <div className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-[300px] lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/5"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-20">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a 
                            href="/auth/signup"
                            className="bg-[#1447E6] text-white px-6 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium inline-flex items-center gap-2"
                        >
                            Start Learning Free
                            <Award className="w-4 h-4" />
                        </a>
                        <a 
                            href="#courses"
                            className="bg-[#EBF2FE] text-[#1447E6] px-6 py-3 rounded-lg hover:bg-[#D6E4FD] transition-colors font-medium"
                        >
                            See All AI Courses
                        </a>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                        ✓ Lifetime access • ✓ Pay once, own forever
                    </p>
                </div>
            </div>
        </section>
    );
}
