import { Check, Infinity } from "lucide-react";
import Link from "next/link";

export default function PricingSection() {
    const options = [
        {
            name: "Live Sessions",
            priceRange: "KES 3,000 - 15,000",
            description: "Join live AI webinars with expert instructors",
            features: [
                "Interactive Q&A with experts",
                "Network with peers",
                "Certificate of completion",
                "Lifetime replay access",
                "Course materials included"
            ],
            cta: "Browse Live Sessions",
            href: "/dashboard/courses"
        },
        {
            name: "On-Demand Courses",
            priceRange: "KES 2,500 - 12,000",
            description: "Learn at your own pace with recorded content",
            features: [
                "Start learning immediately",
                "Learn on your schedule",
                "Certificate of completion",
                "Lifetime course access",
                "Download course materials"
            ],
            cta: "Browse Courses",
            href: "/dashboard/courses"
        }
    ];

    return (
        <section id="pricing" className="bg-white px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Simple Pricing
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Pay per course. No subscriptions. Own your learning forever.
                    </p>
                </div>

                {/* Pricing Options */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {options.map((option, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors">
                            {/* Option Header */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                    {option.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    {option.description}
                                </p>
                                <div className="text-3xl font-semibold text-gray-900">
                                    {option.priceRange}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">per course</p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {option.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-600">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link
                                href={option.href}
                                className="w-full block text-center bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                {option.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Value Prop Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <Infinity className="w-12 h-12 text-gray-900 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Own Your Learning, Forever
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Every course you purchase includes lifetime access. Watch anytime, anywhere, as many times as you want. No subscriptions, no recurring fees—just pay once and learn forever.
                    </p>
                </div>
            </div>
        </section>
    );
}