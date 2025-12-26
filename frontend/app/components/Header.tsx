'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, X, Truck } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled
                ? 'bg-white shadow-lg'
                : 'bg-white shadow-md'
                }`}
        >
            {/* Top Bar - Shipping Info */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white text-center py-2 text-sm">
                <div className="container mx-auto px-4 flex items-center justify-center gap-2">
                    <Truck size={16} />
                    <span>شحن مجاني للطلبات فوق 300 ر.س | توصيل سريع لجميع مناطق المملكة</span>
                </div>
            </div>

            {/* Main Header */}
            <div className="container mx-auto px-4 md:px-8">
                <div className="h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                            <span className="text-white text-3xl font-black">ش</span>
                        </div>
                        <div className="hidden sm:flex flex-col">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent">شافي</span>
                                <span className="text-2xl font-bold text-gray-800">تمور</span>
                                <span className="text-2xl font-bold text-gray-600">وأكثر</span>
                            </div>
                            <p className="text-xs text-gray-500 font-medium tracking-wide">SHAFI DATES & MORE</p>
                        </div>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="/"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200"
                        >
                            الرئيسية
                        </Link>
                        <Link
                            href="/dates"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200"
                        >
                            التمور
                        </Link>
                        <Link
                            href="/oud"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200"
                        >
                            العود
                        </Link>
                        <Link
                            href="/honey"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200"
                        >
                            العسل
                        </Link>
                        <Link
                            href="/spices"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200"
                        >
                            البهارات
                        </Link>
                        <Link
                            href="/shipping"
                            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium transition-all duration-200 flex items-center gap-1"
                        >
                            <Truck size={16} />
                            الشحن والتوصيل
                        </Link>
                    </nav>

                    {/* Icons & Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Search */}
                        <button className="p-2.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-600 transition-all" aria-label="Search">
                            <Search size={22} />
                        </button>

                        {/* Cart */}
                        <button className="relative p-2.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-600 transition-all" aria-label="Cart">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                0
                            </span>
                        </button>

                        {/* User Account */}
                        <button className="hidden md:flex p-2.5 rounded-full hover:bg-gray-100 text-gray-600 hover:text-amber-600 transition-all" aria-label="User Account">
                            <User size={22} />
                        </button>

                        {/* Admin Link (for development) */}
                        <Link
                            href="/admin/dashboard"
                            className="hidden md:flex items-center gap-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                            لوحة التحكم
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 text-gray-600 transition-all"
                            aria-label="Menu"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <nav className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
                        <Link href="/" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            الرئيسية
                        </Link>
                        <Link href="/dates" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            التمور
                        </Link>
                        <Link href="/oud" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            العود
                        </Link>
                        <Link href="/honey" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            العسل
                        </Link>
                        <Link href="/spices" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            البهارات
                        </Link>
                        <Link href="/shipping" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            <Truck size={18} />
                            الشحن والتوصيل
                        </Link>
                        <hr className="my-2 border-gray-100" />
                        <Link href="/admin/dashboard" className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 py-3 px-4 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                            لوحة التحكم
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
}
