import { Check } from "lucide-react";
import Link from "next/link";

export default function DualValueProp() {
    const benefits = [
        {
            title: "Learn Live",
            description: "Join interactive sessions with industry experts and ask questions in real-time"
        },
        {
            title: "Lifetime Access",
            description: "Get permanent access to all course materials and recordings"
        },
        {
            title: "Expert Instructors",
            description: "Learn from professionals working at leading tech companies"
        },
        {
            title: "Certificates",
            description: "Earn verified certificates to showcase on your resume and LinkedIn"
        }
    ];

    return (
        <section className="bg-gray-50 px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Why Learn with Traliq
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Join thousands of professionals advancing their AI careers
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mb-12">
                    <Link 
                        href="/dashboard/courses"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Start Learning
                    </Link>
                </div>

                {/* Tutor Note */}
                <div className="text-center pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        Are you an AI expert? <Link href="/auth/signup?role=tutor" className="text-blue-600 hover:text-blue-700 font-medium">Become a tutor</Link> and earn 70% revenue share
                    </p>
                </div>
            </div>
        </section>
    );
}
