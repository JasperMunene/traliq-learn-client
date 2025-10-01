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
        <section className="bg-white px-6 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        How Traliq AI Works—Simple, Flexible Learning
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        From browsing to mastering AI skills, we&apos;ve made learning seamless and accessible for everyone
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-16 lg:space-y-24">
                    {steps.map((step, index) => (
                        <div 
                            key={index} 
                            className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                            }`}
                        >
                            {/* Content */}
                            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl lg:text-6xl font-bold text-gray-200">
                                        {step.number}
                                    </div>
                                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                                        <step.icon className="w-8 h-8 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                    {step.description}
                                </p>
                                {index === 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Machine Learning
                                        </span>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Deep Learning
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                                            NLP
                                        </span>
                                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Computer Vision
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Image */}
                            <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                                    <Image
                                        src={step.image}
                                        alt={step.title}
                                        width={600}
                                        height={400}
                                        className="w-full h-[300px] lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-16">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a 
                            href="/auth/signup"
                            className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
                        >
                            Start Learning Free
                            <Award className="w-5 h-5" />
                        </a>
                        <a 
                            href="#courses"
                            className="text-gray-700 px-8 py-4 rounded-full border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 font-semibold text-base inline-flex items-center justify-center"
                        >
                            See All AI Courses
                        </a>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                        ✓ No credit card required • ✓ 30-day money-back guarantee • ✓ Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}
