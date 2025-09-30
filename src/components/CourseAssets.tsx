'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, Github, Link, Download } from 'lucide-react';

interface Asset {
    id: number;
    name: string;
    type: string;
    size: string;
    url: string;
}

interface CourseAssetsProps {
    assets: Asset[];
}

export default function CourseAssets({ assets }: CourseAssetsProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'pdf':
                return <FileText className="w-4 h-4 text-red-500" />;
            case 'github':
                return <Github className="w-4 h-4 text-gray-700" />;
            case 'links':
                return <Link className="w-4 h-4 text-blue-500" />;
            default:
                return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 text-left">Course Resources</h2>
                    <p className="text-sm text-gray-600 mt-1 text-left">{assets.length} files available</p>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>

            {isExpanded && (
                <div className="border-t border-gray-200">
                    {assets.map((asset) => (
                        <div key={asset.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    {getIcon(asset.type)}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">{asset.name}</h3>
                                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded">{asset.type}</span>
                                            {asset.size && <span>{asset.size}</span>}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="text-[#2CA7A3] hover:text-[#269996] transition-colors"
                                    onClick={() => window.open(asset.url, '_blank')}
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="p-4 bg-gray-50">
                        <button className="w-full text-sm text-[#2CA7A3] hover:text-[#269996] font-medium transition-colors">
                            Download All Resources
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}