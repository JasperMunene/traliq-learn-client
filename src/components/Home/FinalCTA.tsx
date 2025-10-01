import Link from "next/link";

export default function FinalCTA() {
    return (
        <section className="bg-gray-900 px-6 py-20 lg:py-28">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6">
                    Ready to Start Learning?
                </h2>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                    Join thousands of learners mastering AI. Pay per course, own it forever.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                    <Link 
                        href="/dashboard/courses"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Browse Courses
                    </Link>
                    <Link 
                        href="#pricing"
                        className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        View Pricing
                    </Link>
                </div>

                {/* Tutor Note */}
                <p className="text-sm text-gray-500">
                    Are you an AI expert? <Link href="/auth/signup?role=tutor" className="text-blue-400 hover:text-blue-300">Apply to teach</Link>
                </p>
            </div>
        </section>
    );
}
