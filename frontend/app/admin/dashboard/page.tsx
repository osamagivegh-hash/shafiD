'use client';

import { Package, Image, Calendar, Droplet, Flame } from 'lucide-react';
import Link from 'next/link';

const stats = [
    { name: 'السلايدر', count: 3, icon: Image, href: '/admin/dashboard/hero', color: 'bg-purple-500' },
    { name: 'التمور', count: 0, icon: Calendar, href: '/admin/dashboard/dates', color: 'bg-amber-500' },
    { name: 'العسل', count: 0, icon: Droplet, href: '/admin/dashboard/honey', color: 'bg-yellow-500' },
    { name: 'العود', count: 0, icon: Flame, href: '/admin/dashboard/oud', color: 'bg-rose-500' },
];

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
                <p className="text-gray-600 mt-1">مرحباً بك في لوحة إدارة متجر شافي</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} p-3 rounded-lg text-white`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                                <p className="text-gray-600">{stat.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link
                        href="/admin/dashboard/hero"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Image size={20} className="text-purple-500" />
                        <span>إدارة السلايدر</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/dates"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Calendar size={20} className="text-amber-500" />
                        <span>إضافة تمور</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/honey"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Droplet size={20} className="text-yellow-500" />
                        <span>إضافة عسل</span>
                    </Link>
                    <Link
                        href="/admin/dashboard/oud"
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Flame size={20} className="text-rose-500" />
                        <span>إضافة عود</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
