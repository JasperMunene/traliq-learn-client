import { Check, ArrowUpRight } from "lucide-react";

export default function PricingSection() {
    const plans = [
        {
            name: "Starter",
            price: "KES 2900",
            period: "/month",
            description: "Perfect for beginners exploring AI fundamentals",
            features: [
                "Access to 5 beginner courses",
                "Community forum access",
                "Basic progress tracking",
                "Certificate of completion",
                "Email support"
            ],
            popular: false,
            buttonText: "Start Learning"
        },
        {
            name: "Professional",
            price: "KES 7900",
            period: "/month",
            description: "Ideal for professionals advancing their AI skills",
            features: [
                "Access to all 50+ courses",
                "1-on-1 mentor sessions (2/month)",
                "Advanced project portfolio",
                "Priority community support",
                "Industry certification",
                "Career placement assistance",
                "Offline video downloads"
            ],
            popular: true,
            buttonText: "Go Professional"
        },
        {
            name: "Enterprise",
            price: "KES 19900",
            period: "/month",
            description: "Comprehensive solution for teams and organizations",
            features: [
                "Everything in Professional",
                "Custom learning paths",
                "Team analytics dashboard",
                "Dedicated account manager",
                "Custom workshops",
                "API integration",
                "24/7 priority support"
            ],
            popular: false,
            buttonText: "Contact Sales"
        }
    ];

    return (
        <section className="bg-white px-6 py-16 lg:py-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        Choose Your Learning Journey
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
                        Flexible pricing plans designed to scale with your AI learning goals and career ambitions
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <div key={index} className={`rounded-2xl p-8 relative ${
                            plan.popular
                                ? 'bg-gray-900 text-white shadow-xl scale-105'
                                : 'bg-gray-50 hover:shadow-lg transition-shadow duration-300'
                        }`}>
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Header */}
                            <div className="text-center mb-8">
                                <h3 className={`text-2xl font-bold mb-2 ${
                                    plan.popular ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {plan.name}
                                </h3>
                                <p className={`text-sm mb-4 ${
                                    plan.popular ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                    {plan.description}
                                </p>
                                <div className="flex items-baseline justify-center">
                                    <span className={`text-5xl font-bold ${
                                        plan.popular ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {plan.price}
                                    </span>
                                    <span className={`text-lg ml-1 ${
                                        plan.popular ? 'text-gray-300' : 'text-gray-600'
                                    }`}>
                                        {plan.period}
                                    </span>
                                </div>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                            plan.popular ? 'text-blue-400' : 'text-blue-400'
                                        }`} />
                                        <span className={`text-sm ${
                                            plan.popular ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button className={`w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                                plan.popular
                                    ? 'bg-white text-gray-900 hover:bg-gray-100'
                                    : 'bg-gray-900 text-white hover:bg-gray-800'
                            }`}>
                                {plan.buttonText}
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Money Back Guarantee */}
                <div className="text-center">
                    <p className="text-gray-600">
                        <span className="font-medium">30-day money-back guarantee</span> •
                        No setup fees • Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
}