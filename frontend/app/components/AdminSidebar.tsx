'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, Calendar, Droplet, Flame, ChevronRight, Menu, X, FileText, Truck, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

const menuItems = [
    { name: 'لوحة التحكم', href: '/admin/dashboard', icon: Home },
    { name: 'السلايدر', href: '/admin/dashboard/hero', icon: Image },
    { name: 'المنتجات المميزة', href: '/admin/dashboard/featured', icon: Star },
    { name: 'التمور', href: '/admin/dashboard/dates', icon: Calendar },
    { name: 'العسل', href: '/admin/dashboard/honey', icon: Droplet },
    { name: 'العود', href: '/admin/dashboard/oud', icon: Flame },
    { name: 'البهارات', href: '/admin/dashboard/spices', icon: Sparkles },
    { name: 'الشحن', href: '/admin/dashboard/shipping', icon: Truck },
    { name: 'الفوتر', href: '/admin/dashboard/footer', icon: FileText },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="lg:hidden fixed top-4 right-4 z-50 bg-white p-2 rounded-lg shadow-md"
            >
                {isCollapsed ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 right-0 h-full bg-white border-l border-gray-100 shadow-sm z-40 transition-all duration-300 ${isCollapsed ? 'w-64' : 'w-0 lg:w-64'
                    } overflow-hidden`}
            >
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">
                        <span className="text-amber-600">شـ</span>افي - الإدارة
                    </h1>
                </div>

                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsCollapsed(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-amber-50 text-amber-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                                {isActive && <ChevronRight size={16} className="mr-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-4 left-4 right-4">
                    <Link
                        href="/"
                        className="block text-center py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← العودة للموقع
                    </Link>
                </div>
            </aside>
        </>
    );
}
