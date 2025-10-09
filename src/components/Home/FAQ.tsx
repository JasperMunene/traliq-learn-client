"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
    const [openItems, setOpenItems] = useState<number[]>([0]);

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const faqs = [
        {
            question: "What makes Traliq AI different from other AI learning platforms?",
            answer: "Traliq AI focuses specifically on practical, industry-relevant AI skills with hands-on projects, 1-on-1 mentorship from industry experts, and a curriculum designed by professionals working at top tech companies. Our courses are updated regularly to reflect the latest developments in AI."
        },
        {
            question: "Do I need prior programming experience to start learning AI?",
            answer: "Not necessarily. Our Starter plan includes beginner-friendly courses that teach you programming fundamentals alongside AI concepts. However, having basic Python knowledge can help accelerate your learning journey."
        },
        {
            question: "How long does it take to complete a course?",
            answer: "Course duration varies from 6-16 weeks depending on the topic complexity. Most students spend 5-10 hours per week on coursework. Our self-paced learning approach allows you to progress faster or slower based on your schedule."
        },
        {
            question: "What kind of support do you provide?",
            answer: "We offer comprehensive support including community forums, 1-on-1 mentor sessions (Professional plan), email support, and career guidance. Our mentors are industry professionals who provide personalized feedback on your projects."
        },
        {
            question: "Are the certificates recognized by employers?",
            answer: "Yes, our certificates are industry-recognized and valued by employers. Many of our graduates have successfully transitioned to AI roles at companies like Google, Microsoft, Tesla, and startups. We also provide LinkedIn skill verification."
        },
        {
            question: "Can I access courses offline?",
            answer: "Professional and Enterprise plan subscribers can download video content for offline viewing. Course materials, assignments, and community features require internet access."
        },
        {
            question: "What is your refund policy?",
            answer: "We offer a 30-day money-back guarantee. If you're not satisfied with your course within the first 30 days, you can request a full refund, no questions asked."
        },
        {
            question: "Do you offer team or corporate training?",
            answer: "Yes, our Enterprise plan is designed for teams and organizations. We offer custom learning paths, team analytics, dedicated support, and can create bespoke training programs for your specific needs."
        }
    ];

    return (
        <section className="bg-gray-50 px-4 sm:px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Everything you need to know about learning AI with Traliq AI
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg">
                            <button
                                onClick={() => toggleItem(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors rounded-lg"
                            >
                                <span className="text-lg font-semibold text-gray-900 pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                                        openItems.includes(index) ? 'transform rotate-180' : ''
                                    }`}
                                />
                            </button>

                            <div className={`overflow-hidden transition-all duration-200 ${
                                openItems.includes(index) ? 'max-h-96 pb-6' : 'max-h-0'
                            }`}>
                                <div className="px-6">
                                    <p className="text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Support */}
                <div className="text-center mt-12">
                    <p className="text-gray-600 mb-4">
                        Still have questions? Our team is here to help.
                    </p>
                    <button className="bg-[#1447E6] text-white px-6 py-3 rounded-lg hover:bg-[#1039C4] transition-colors font-medium">
                        Contact Support
                    </button>
                </div>
            </div>
        </section>
    );
}