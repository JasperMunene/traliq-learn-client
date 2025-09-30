'use client'
import { useState, useRef, useEffect, ChangeEvent } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { X, Upload, FileText, Archive, Calendar, Clock, DollarSign, ArrowRight, ArrowLeft, Check, Sparkles, BookOpen, Tag, BarChart3, Image as ImageIcon } from "lucide-react";
import { fetchWithAuth } from '@/lib/api';
import Image from 'next/image';

interface CourseFormData {
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced' | '';
    price: string;
    isFree: boolean;
    startDate: string;
    startTime: string;
    thumbnailUrl: string;
    thumbnailPreview: string;
}

interface CourseAsset {
    id: string;
    file: File;
    type: 'pdf' | 'zip' | 'other';
}


export default function PublishCourse() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [formData, setFormData] = useState<CourseFormData>({
        title: '',
        description: '',
        category: '',
        level: '',
        price: '',
        isFree: false,
        startDate: '',
        startTime: '',
                thumbnailUrl: '',
        thumbnailPreview: ''
    });
    const [assets, setAssets] = useState<CourseAsset[]>([]);
    const [dragActive, setDragActive] = useState<boolean>(false);
            const [assetDragActive, setAssetDragActive] = useState<boolean>(false);
    const thumbnailUploadPromiseRef = useRef<Promise<string> | null>(null);
    const [isUploadingThumbnail, setIsUploadingThumbnail] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
        const assetInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetchWithAuth('http://16.171.54.227:5000/api/users/me');
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser();
    }, []);

    const categories = [
        "Machine Learning",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Reinforcement Learning",
        "AI Ethics",
        "Neural Networks",
        "Data Science"
    ];

    // Step 1 validation
    const isStep1Valid = formData.title.trim() && 
                         formData.description.trim() && 
                         formData.category && 
                         formData.level &&
                         formData.startDate &&
                         formData.startTime &&
                                                                           formData.thumbnailPreview &&
                         (formData.isFree || formData.price);

    // Thumbnail drag and drop handlers
    const handleThumbnailDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleThumbnailDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleThumbnailFile(e.dataTransfer.files[0]);
        }
    };

            const handleThumbnailFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        setIsUploadingThumbnail(true);
        setError('');

        // Set preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            setFormData(prev => ({ ...prev, thumbnailPreview: e.target?.result as string }));
        };
        reader.readAsDataURL(file);

        // Create a promise for the upload process and store it in a ref
        const uploadPromise = new Promise<string>(async (resolve, reject) => {
            try {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch("/api/upload", { method: "POST", body: form });
                if (!res.ok) throw new Error("Failed to upload thumbnail.");
                const data = await res.json();
                setFormData(prev => ({ ...prev, thumbnailUrl: data.imgUrl }));
                resolve(data.imgUrl);
            } catch (error) {
                console.error("Error uploading thumbnail:", error);
                setError('Failed to upload thumbnail. Please try again.');
                setFormData(prev => ({ ...prev, thumbnailPreview: '', thumbnailUrl: '' }));
                reject(error);
            } finally {
                setIsUploadingThumbnail(false);
            }
        });
        thumbnailUploadPromiseRef.current = uploadPromise;
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleThumbnailFile(e.target.files[0]);
        }
    };

    // Asset drag and drop handlers
    const handleAssetDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setAssetDragActive(true);
        } else if (e.type === "dragleave") {
            setAssetDragActive(false);
        }
    };

    const handleAssetDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setAssetDragActive(false);

        if (e.dataTransfer.files) {
            handleAssetFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleAssetFiles = (files: File[]) => {
        const newAssets: CourseAsset[] = files.map(file => {
            let type: 'pdf' | 'zip' | 'other' = 'other';
            if (file.type === 'application/pdf') type = 'pdf';
            else if (file.type === 'application/zip' || file.name.endsWith('.zip')) type = 'zip';

            return {
                id: Math.random().toString(36).substr(2, 9),
                file,
                type
            };
        });

        setAssets([...assets, ...newAssets]);
    };

    const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleAssetFiles(Array.from(e.target.files));
        }
    };

    const removeAsset = (id: string) => {
        setAssets(assets.filter(asset => asset.id !== id));
    };


    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        try {
            let finalThumbnailUrl = formData.thumbnailUrl;

            // If an upload was started, wait for it to complete to get the URL
            if (thumbnailUploadPromiseRef.current) {
                finalThumbnailUrl = await thumbnailUploadPromiseRef.current;
            }

            // If a preview exists but the final URL is missing, the upload failed.
            if (formData.thumbnailPreview && !finalThumbnailUrl) {
                setError("Thumbnail failed to upload. Please re-upload the image before publishing.");
                setIsLoading(false);
                return;
            }

            // Calculate end date by adding 3 hours to start date
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
            const endDateTime = new Date(startDateTime.getTime() + 3 * 60 * 60 * 1000); // Add 3 hours in milliseconds

            const courseData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                level: formData.level,
                price: formData.isFree ? 0 : parseFloat(formData.price),
                is_free: formData.isFree,
                scheduled_start: startDateTime.toISOString(),
                scheduled_end: endDateTime.toISOString(),
                thumbnail_url: finalThumbnailUrl,
            };

            const response = await fetchWithAuth('http://16.171.54.227:5000/courses', {
                method: 'POST',
                body: JSON.stringify(courseData),
            });

            const responseData = await response.json();
            const courseId = responseData.course_id;

            if (assets.length > 0 && courseId) {
                await uploadCourseAssets(courseId, assets);
            }

            setIsLoading(false);
            setCurrentStep(3);

        } catch (error) {
            console.error('Error creating course:', error);
            setError('Failed to create course. Please ensure all fields are correct and the thumbnail uploaded successfully.');
            setIsLoading(false);
        }
    };

    const uploadCourseAssets = async (courseId: string, assets: CourseAsset[]) => {
        const formData = new FormData();
        
        console.log('Uploading assets:', assets);
        
        assets.forEach((asset, index) => {
            formData.append(`asset_${index}`, asset.file);
            // Add metadata for each asset
            formData.append(`asset_${index}_description`, `Course material: ${asset.file.name}`);
            formData.append(`asset_${index}_is_public`, 'true');
            formData.append(`asset_${index}_category`, 'course_material');
            
            console.log(`Added asset_${index}:`, asset.file.name, asset.file.type, asset.file.size);
        });
    
        try {
            console.log('Sending request to:', `http://16.171.54.227:5000/courses/${courseId}/assets`);
            const response = await fetchWithAuth(`http://16.171.54.227:5000/courses/${courseId}/assets`, {
                method: 'POST',
                body: formData,
            });
    
            console.log('Asset upload response status:', response.status);
            console.log('Asset upload response:', response);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Asset upload failed:', errorText);
                throw new Error(`Asset upload failed: ${errorText}`);
            }
            
            return response;
        } catch (error) {
            console.error('Error uploading assets:', error);
            throw error;
        }
    };
    
    const renderStepIndicator = () => (
        <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
                {[1, 2].map((step) => (
                    <div key={step} className="flex items-center">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all duration-300 ${
                            currentStep >= step 
                                ? 'bg-gray-900 text-white' 
                                : 'bg-gray-200 text-gray-500'
                        }`}>
                            {step}
                        </div>
                        {step < 2 && (
                            <div className={`w-24 h-1 mx-2 transition-all duration-300 ${
                                currentStep > step ? 'bg-gray-900' : 'bg-gray-200'
                            }`} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Course Details
                </h2>
                <p className="text-gray-600">
                    Tell us about your course and help students discover it
                </p>
            </div>

            {/* Course Title */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <label className="block mb-3">
                    <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Course Title
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Advanced Machine Learning Techniques"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                />
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <label className="block mb-3">
                    <span className="text-gray-900 font-semibold text-lg">Description</span>
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                    What will students learn in this course?
                </p>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what students will learn, prerequisites, and course outcomes..."
                    className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors resize-none text-gray-900"
                />
                <p className="text-xs text-gray-500 mt-2">
                    {formData.description.length} characters
                </p>
            </div>

            {/* Category and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                    <label className="block mb-3">
                        <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                            <Tag className="w-5 h-5" />
                            Category
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 bg-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                    <label className="block mb-3">
                        <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                            <BarChart3 className="w-5 h-5" />
                            Level
                        </span>
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        value={formData.level}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setFormData({
                                ...formData,
                                level: e.target.value as 'beginner' | 'intermediate' | 'advanced' | ''
                            })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900 bg-white"
                    >
                        <option value="">Select a level</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <label className="block mb-4">
                    <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Pricing
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                </label>

                <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isFree}
                            onChange={(e) => setFormData({ 
                                ...formData, 
                                isFree: e.target.checked,
                                price: e.target.checked ? '' : formData.price
                            })}
                            className="w-5 h-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        />
                        <span className="text-gray-700 font-medium">This course is free</span>
                    </label>
                </div>

                {!formData.isFree && (
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                        />
                    </div>
                )}
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <h3 className="text-gray-900 font-semibold text-lg mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Course Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Start Time <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-900 transition-colors text-gray-900"
                        />
                    </div>
                </div>
            </div>

            {/* Thumbnail */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <label className="block mb-4">
                    <span className="text-gray-900 font-semibold text-lg flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Course Thumbnail
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-4">
                    Upload an eye-catching image that represents your course
                </p>

                {formData.thumbnailPreview ? (
                    <div className="relative">
                                                <Image
                            src={formData.thumbnailPreview} 
                            alt="Thumbnail preview"
                            width={500}
                            height={500}
                            className={`w-full h-64 object-cover rounded-xl border-2 border-gray-200 ${isUploadingThumbnail ? 'opacity-50' : ''}`}
                        />
                        {isUploadingThumbnail && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <button
                                                        onClick={() => {
                                thumbnailUploadPromiseRef.current = null;
                                setFormData({ ...formData, thumbnailUrl: '', thumbnailPreview: '' });
                            }}
                            disabled={isUploadingThumbnail}
                            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div
                        onDragEnter={handleThumbnailDrag}
                        onDragLeave={handleThumbnailDrag}
                        onDragOver={handleThumbnailDrag}
                        onDrop={handleThumbnailDrop}
                        onClick={() => thumbnailInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                            dragActive 
                                ? 'border-gray-900 bg-gray-50' 
                                : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-900 font-medium mb-2">
                            Drop your image here or click to browse
                        </p>
                        <p className="text-sm text-gray-500">
                            PNG, JPG or JPEG (max. 5MB)
                        </p>
                        <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailChange}
                            className="hidden"
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!isStep1Valid}
                    className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 inline-flex items-center gap-2 ${
                        isStep1Valid
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Next: Add Assets
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {!isStep1Valid && (
                <p className="text-sm text-gray-500 text-right">
                    Please fill in all required fields (*)
                </p>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                    Course Assets
                </h2>
                <p className="text-gray-600">
                    Upload materials like PDFs, slides, and resources for your students
                </p>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                <div
                    onDragEnter={handleAssetDrag}
                    onDragLeave={handleAssetDrag}
                    onDragOver={handleAssetDrag}
                    onDrop={handleAssetDrop}
                    onClick={() => assetInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
                        assetDragActive 
                            ? 'border-gray-900 bg-gray-50' 
                            : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-900 font-medium mb-2">
                        Drop your files here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                        PDF, ZIP files supported (max. 50MB per file)
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            PDFs
                        </span>
                        <span className="flex items-center gap-2">
                            <Archive className="w-4 h-4" />
                            ZIP Files
                        </span>
                    </div>
                    <input
                        ref={assetInputRef}
                        type="file"
                        accept=".pdf,.zip"
                        multiple
                        onChange={handleAssetChange}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Uploaded Assets */}
            {assets.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200">
                    <h3 className="text-gray-900 font-semibold text-lg mb-4">
                        Uploaded Assets ({assets.length})
                    </h3>
                    <div className="space-y-3">
                        {assets.map((asset) => (
                            <div 
                                key={asset.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200"
                            >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {asset.type === 'pdf' ? (
                                        <FileText className="w-8 h-8 text-red-500 flex-shrink-0" />
                                    ) : (
                                        <Archive className="w-8 h-8 text-blue-500 flex-shrink-0" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="text-gray-900 font-medium truncate">
                                            {asset.file.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatFileSize(asset.file.size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeAsset(asset.id)}
                                    className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Note about assets being optional */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm text-blue-900">
                    <strong>Note:</strong> Course assets are optional but highly recommended. You can always add more materials later from your course dashboard.
                </p>
            </div>

            {/* Error message */}
            {error && (
                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-red-900">
                        <strong>Error:</strong> {error}
                    </p>
                </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
                <button
                    onClick={() => setCurrentStep(1)}
                    className="px-8 py-4 rounded-full font-medium text-base text-gray-600 hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`px-8 py-4 rounded-full font-medium text-base transition-all duration-300 inline-flex items-center gap-2 ${
                        !isLoading
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Publishing...
                        </>
                    ) : (
                        <>
                            Publish Course
                            <Check className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                    Course Submitted Successfully!
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-full mb-6">
                    <Clock className="w-4 h-4 text-yellow-700" />
                    <span className="text-sm font-medium text-yellow-700">Waiting for Approval</span>
                </div>
                <p className="text-gray-600 text-lg mb-8">
                    Your course &quot;{formData.title}&quot; has been submitted for review. Our team will review it and notify you once it&apos;s approved.
                </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 mb-8">
                <h3 className="text-gray-900 font-semibold text-lg mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    What happens next?
                </h3>
                <div className="space-y-4 text-left">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                            1
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Review Process</p>
                            <p className="text-sm text-gray-600">Our team will review your course content and materials (typically 1-2 business days)</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                            2
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Approval Notification</p>
                            <p className="text-sm text-gray-600">You&apos;ll receive an email once your course is approved</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">
                            3
                        </div>
                        <div>
                            <p className="text-gray-900 font-medium">Go Live</p>
                            <p className="text-sm text-gray-600">Your course will be published and visible to students</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                    onClick={() => {
                        setCurrentStep(1);
                        setFormData({
                            title: '',
                            description: '',
                            category: '',
                            level: '',
                            price: '',
                            isFree: false,
                            startDate: '',
                            startTime: '',
                            thumbnailUrl: '',
                            thumbnailPreview: ''
                        });
                        setAssets([]);
                        setError('');
                    }}
                    className="px-8 py-4 rounded-full font-medium text-base bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
                >
                    Publish Another Course
                </button>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-8 py-4 rounded-full font-medium text-base border-2 border-gray-200 text-gray-900 hover:bg-gray-50 transition-all duration-300"
                >
                    Go to Dashboard
                </button>
            </div>
        </div>
    );

        return (
        <div className="min-h-screen bg-gray-50">
            <DashboardHeader user={user} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex">
                <DashboardSidebar
                    activeTab="create-course" // A unique key for this page
                    setActiveTab={() => {}} // Not needed for this page
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <main className="flex-1 lg:ml-64 p-6 lg:p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        {currentStep < 3 && (
                            <>
                                {renderStepIndicator()}
                            </>
                        )}

                        {/* Steps */}
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                    </div>
                </main>
            </div>
        </div>
    );
}