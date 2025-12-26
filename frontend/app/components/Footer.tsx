'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Phone, Mail, MapPin, Clock } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/v1';

interface FooterContent {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    twitter: string;
    tiktok: string;
    snapchat: string;
    aboutText: string;
    address: string;
    workingHours: string;
}

const defaultFooter: FooterContent = {
    email: 'info@shafi-store.com',
    phone: '+966 50 000 0000',
    whatsapp: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    snapchat: '',
    aboutText: 'شافي تمور وأكثر - أجود التمور والعود والعسل والبهارات',
    address: 'المملكة العربية السعودية',
    workingHours: 'السبت - الخميس: 9 صباحاً - 10 مساءً',
};

export default function Footer() {
    const [content, setContent] = useState<FooterContent>(defaultFooter);

    useEffect(() => {
        async function fetchFooter() {
            try {
                const res = await fetch(`${API_URL}/footer`);
                if (res.ok) {
                    const data = await res.json();
                    setContent(data);
                }
            } catch {
                console.log('Using default footer content');
            }
        }
        fetchFooter();
    }, []);

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Column 1: About */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white text-2xl font-black">ش</span>
                            </div>
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-black text-amber-500">شافي</span>
                                    <span className="text-xl font-bold text-white">تمور</span>
                                    <span className="text-lg font-bold text-gray-400">وأكثر</span>
                                </div>
                                <p className="text-xs text-gray-500 font-medium">SHAFI DATES & MORE</p>
                            </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{content.aboutText}</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-amber-500 mb-4">روابط سريعة</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">الرئيسية</Link>
                            </li>
                            <li>
                                <Link href="/dates" className="text-gray-400 hover:text-white transition-colors">التمور</Link>
                            </li>
                            <li>
                                <Link href="/oud" className="text-gray-400 hover:text-white transition-colors">العود</Link>
                            </li>
                            <li>
                                <Link href="/honey" className="text-gray-400 hover:text-white transition-colors">العسل</Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">الشحن والتوصيل</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Contact */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-amber-500 mb-4">تواصل معنا</h3>
                        <ul className="space-y-3">
                            {content.phone && (
                                <li className="flex items-center gap-3 text-gray-400">
                                    <Phone size={18} className="text-amber-500" />
                                    <a href={`tel:${content.phone}`} className="hover:text-white transition-colors" dir="ltr">
                                        {content.phone}
                                    </a>
                                </li>
                            )}
                            {content.email && (
                                <li className="flex items-center gap-3 text-gray-400">
                                    <Mail size={18} className="text-amber-500" />
                                    <a href={`mailto:${content.email}`} className="hover:text-white transition-colors">
                                        {content.email}
                                    </a>
                                </li>
                            )}
                            {content.address && (
                                <li className="flex items-center gap-3 text-gray-400">
                                    <MapPin size={18} className="text-amber-500" />
                                    <span>{content.address}</span>
                                </li>
                            )}
                            {content.workingHours && (
                                <li className="flex items-center gap-3 text-gray-400">
                                    <Clock size={18} className="text-amber-500" />
                                    <span>{content.workingHours}</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: Social */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-amber-500 mb-4">تابعنا</h3>
                        <div className="flex flex-wrap gap-3">
                            {content.instagram && (
                                <a
                                    href={content.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all"
                                >
                                    <Instagram size={20} />
                                </a>
                            )}
                            {content.twitter && (
                                <a
                                    href={content.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all"
                                >
                                    <Twitter size={20} />
                                </a>
                            )}
                            {content.tiktok && (
                                <a
                                    href={content.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all"
                                >
                                    <span className="text-sm font-bold">TT</span>
                                </a>
                            )}
                            {content.snapchat && (
                                <a
                                    href={content.snapchat}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-amber-500 hover:text-white transition-all"
                                >
                                    <span className="text-sm font-bold">SC</span>
                                </a>
                            )}
                            {content.whatsapp && (
                                <a
                                    href={`https://wa.me/${content.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-500 hover:text-white transition-all"
                                >
                                    <span className="text-sm font-bold">WA</span>
                                </a>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-4">تابعنا على وسائل التواصل الاجتماعي</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} متجر شافي. جميع الحقوق محفوظة.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">الشروط والأحكام</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
