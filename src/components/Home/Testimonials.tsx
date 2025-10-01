export default function TestimonialsSection() {
    const testimonials = [
        {
            name: "Wanjiku Kamau",
            role: "Data Analyst at Safaricom",
            content: "The Machine Learning course helped me transition from Excel reports to building predictive models. The live Q&A sessions were invaluable. I got promoted within 6 months and now lead our data science initiatives.",
            course: "Machine Learning Fundamentals"
        },
        {
            name: "Brian Ochieng",
            role: "Software Engineer at Twiga Foods",
            content: "Learning AI through live sessions made complex concepts accessible. The practical projects directly applied to our logistics optimization. Our delivery efficiency improved by 40% after implementing what I learned.",
            course: "Deep Learning Essentials"
        },
        {
            name: "Amina Hassan",
            role: "Product Manager at MPESA",
            content: "As a non-technical PM, I was hesitant about AI courses. The instructors made everything clear and answered my questions patiently. Now I confidently lead our AI-powered fraud detection projects.",
            course: "AI for Product Managers"
        }
    ];

    return (
        <section className="bg-white px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-20">
                    <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
                        Trusted by Professionals
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Real stories from learners who transformed their careers
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                            {/* Content */}
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                &quot;{testimonial.content}&quot;
                            </p>

                            {/* Author */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="font-semibold text-gray-900">
                                    {testimonial.name}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}