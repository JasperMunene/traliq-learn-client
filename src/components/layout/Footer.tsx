import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    const navigation = {
        courses: [
            { name: 'Machine Learning', href: '#' },
            { name: 'Deep Learning', href: '#' },
            { name: 'Natural Language Processing', href: '#' },
            { name: 'Computer Vision', href: '#' },
            { name: 'AI Ethics', href: '#' },
            { name: 'Business AI', href: '#' },
        ],
        company: [
            { name: 'About Us', href: '#' },
            { name: 'Our Team', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press', href: '#' },
            { name: 'Contact', href: '#' },
        ],
        support: [
            { name: 'Help Center', href: '#' },
            { name: 'Community Forum', href: '#' },
            { name: 'Course Catalog', href: '#' },
            { name: 'Student Resources', href: '#' },
            { name: 'Technical Support', href: '#' },
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'Refund Policy', href: '#' },
        ],
    };

    const socialLinks = [
        { name: 'Facebook', href: '#', icon: Facebook },
        { name: 'Twitter', href: '#', icon: Twitter },
        { name: 'LinkedIn', href: '#', icon: Linkedin },
        { name: 'Instagram', href: '#', icon: Instagram },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                {/* Main Footer Content */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="mb-6">
                            <Image src="/logo2.png" alt="Logo" width={160} height={160} />
                        </div>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Empowering professionals with cutting-edge AI education.
                            Learn from industry experts and transform your career with practical,
                            hands-on AI courses.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">hello@traliqai.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">+254 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-blue-400" />
                                <span className="text-gray-400">Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>

                    {/* Courses */}
                    <div>
                        <h3 className="font-semibold mb-4">Courses</h3>
                        <ul className="space-y-3">
                            {navigation.courses.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {navigation.company.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-3">
                            {navigation.support.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {navigation.legal.map((item) => (
                                <li key={item.name}>
                                    <a href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 mb-12">
                    <div className="max-w-md mx-auto text-center">
                        <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
                        <p className="text-gray-400 mb-6">
                            Get the latest AI insights, course updates, and industry news delivered to your inbox.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button className="bg-blue-400 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition-colors duration-200 font-medium">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © 2025 Traliq AI. All rights reserved.
                    </div>

                    {/* Social Links */}
                    <div className="flex gap-4">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200"
                            >
                                <item.icon className="w-4 h-4 text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}