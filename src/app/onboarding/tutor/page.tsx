'use client'
import { useState } from "react";
import { X, Plus, Github, Linkedin, Globe, ArrowRight, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from '@/lib/api';

interface TutorFormData {
    about: string;
    subjects: string[];
    portfolioUrl: string;
    githubUrl: string;
    linkedinUrl: string;
}

export default function TutorOnboarding() {
    const router = useRouter();
    const [formData, setFormData] = useState<TutorFormData>({
        about: '',
        subjects: [],
        portfolioUrl: '',
        githubUrl: '',
        linkedinUrl: ''
    });
    const [currentSubject, setCurrentSubject] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleAddSubject = () => {
        if (currentSubject.trim() && !formData.subjects.includes(currentSubject.trim())) {
            setFormData({
                ...formData,
                subjects: [...formData.subjects, currentSubject.trim()]
            });
            setCurrentSubject('');
        }
    };

    const handleRemoveSubject = (subjectToRemove: string) => {
        setFormData({
            ...formData,
            subjects: formData.subjects.filter(subject => subject !== subjectToRemove)
        });
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsLoading(true);
        setError('');

                try {
            const headline = formData.about.split(/[.!?]/)[0] + '.';

            const payload = {
                headline: headline,
                bio: formData.about,
                subjects: formData.subjects,
                portfolio_url: formData.portfolioUrl || null,
                github_url: formData.githubUrl || null,
                linkedin_url: formData.linkedinUrl || null
            };

            const response = await fetchWithAuth('https://api.traliq.com/tutors', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create tutor profile');
            }

            // Redirect to dashboard on success
            router.push('/dashboard');

        } catch (err) {
            console.error('Error creating tutor profile:', err);
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        router.push('/onboarding');
    };

    const isFormValid = formData.about.trim() && formData.subjects.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-12">
            <div className="max-w-3xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Onboarding
                    </button>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">traliq ai</h1>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                        Tell us about yourself
                    </h2>
                    <p className="text-gray-600">
                        Help us create your tutor profile so students can learn more about you
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Form */}
                <div className="space-y-8">
                    {/* About Section - Will be used as headline */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                        <label className="block mb-3">
                            <span className="text-gray-900 font-semibold text-lg">About you</span>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-600 mb-4">
                            Share your background, experience, and what makes you passionate about teaching AI.
                            This will be your profile headline.
                        </p>
                        <textarea
                            value={formData.about}
                            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                            placeholder="Tell us about your experience and teaching philosophy. This will be your profile headline..."
                            className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-none text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            {formData.about.length} characters
                        </p>
                    </div>

                    {/* Subjects Section */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                        <label className="block mb-3">
                            <span className="text-gray-900 font-semibold text-lg">Subjects you teach</span>
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <p className="text-sm text-gray-600 mb-4">
                            Add the AI topics and subjects you&apos;re qualified to teach
                        </p>

                        {/* Subject Input */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={currentSubject}
                                onChange={(e) => setCurrentSubject(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddSubject();
                                    }
                                }}
                                placeholder="e.g., Machine Learning, Deep Learning..."
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={handleAddSubject}
                                className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Add
                            </button>
                        </div>

                        {/* Subject Tags */}
                        {formData.subjects.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.subjects.map((subject, index) => (
                                    <span
                                        key={index}
                                        className="bg-gray-100 text-gray-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                                    >
                                        {subject}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSubject(subject)}
                                            className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {formData.subjects.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                No subjects added yet
                            </p>
                        )}
                    </div>

                    {/* URLs Section */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                        <h3 className="text-gray-900 font-semibold text-lg mb-3">
                            Professional links
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Share your professional profiles to build credibility (optional)
                        </p>

                        <div className="space-y-4">
                            {/* Portfolio URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    Portfolio URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.portfolioUrl}
                                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                    placeholder="https://yourportfolio.com"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                                />
                            </div>

                            {/* GitHub URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Github className="w-4 h-4" />
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    placeholder="https://github.com/username"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                                />
                            </div>

                            {/* LinkedIn URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.linkedinUrl}
                                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="px-8 py-4 rounded-full font-medium text-base text-gray-600 hover:bg-gray-100 transition-all duration-300"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 inline-flex items-center gap-2 ${
                                isFormValid && !isLoading
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating Profile...
                                </>
                            ) : (
                                <>
                                    Complete Profile
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                    {!isFormValid && (
                        <p className="text-sm text-gray-500 text-right">
                            Please fill in all required fields (*)
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}