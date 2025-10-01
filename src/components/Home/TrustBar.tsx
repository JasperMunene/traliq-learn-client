export default function TrustBar() {
    return (
        <section className="bg-gray-50 border-y border-gray-200 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                    <div>
                        <span className="font-semibold text-gray-900">50K+</span> learners
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div>
                        <span className="font-semibold text-gray-900">12.5K+</span> live classes
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div>
                        <span className="font-semibold text-gray-900">4.9/5</span> rating
                    </div>
                    <div className="w-px h-4 bg-gray-300" />
                    <div>
                        <span className="font-semibold text-gray-900">95%</span> completion rate
                    </div>
                </div>
            </div>
        </section>
    );
}
