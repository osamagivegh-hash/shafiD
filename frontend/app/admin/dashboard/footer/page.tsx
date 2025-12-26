'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import { Save, Phone, Mail, MapPin, Clock, Instagram, Twitter } from 'lucide-react';
import { API_URL } from '../../../lib/config';

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

export default function FooterManagement() {
    const { addToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<FooterContent>({
        email: '',
        phone: '',
        whatsapp: '',
        instagram: '',
        twitter: '',
        tiktok: '',
        snapchat: '',
        aboutText: '',
        address: '',
        workingHours: '',
    });

    useEffect(() => {
        async function fetchFooter() {
            try {
                const res = await fetch(`${API_URL}/footer`);
                if (res.ok) {
                    const data = await res.json();
                    setFormData(data);
                }
            } catch {
                addToast('error', 'فشل في تحميل البيانات');
            } finally {
                setLoading(false);
            }
        }
        fetchFooter();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/footer`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!res.ok) throw new Error('فشل في الحفظ');
            addToast('success', 'تم حفظ التغييرات بنجاح');
        } catch {
            addToast('error', 'فشل في حفظ التغييرات');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">إدارة الفوتر</h1>
                <p className="text-gray-600 mt-1">تعديل معلومات التواصل والروابط في أسفل الموقع</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Info Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Phone size={20} className="text-amber-500" />
                        معلومات التواصل
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+966 50 000 0000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">واتساب</label>
                            <input
                                type="text"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                placeholder="+966500000000"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="info@shafi-store.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="المملكة العربية السعودية"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل</label>
                            <input
                                type="text"
                                value={formData.workingHours}
                                onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                placeholder="السبت - الخميس: 9 صباحاً - 10 مساءً"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Instagram size={20} className="text-amber-500" />
                        روابط التواصل الاجتماعي
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">انستقرام</label>
                            <input
                                type="url"
                                value={formData.instagram}
                                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                placeholder="https://instagram.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تويتر (X)</label>
                            <input
                                type="url"
                                value={formData.twitter}
                                onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                placeholder="https://twitter.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">تيك توك</label>
                            <input
                                type="url"
                                value={formData.tiktok}
                                onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                                placeholder="https://tiktok.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">سناب شات</label>
                            <input
                                type="url"
                                value={formData.snapchat}
                                onChange={(e) => setFormData({ ...formData, snapchat: e.target.value })}
                                placeholder="https://snapchat.com/..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">نص تعريفي</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">عن المتجر</label>
                        <textarea
                            value={formData.aboutText}
                            onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                            placeholder="نبذة عن متجرك..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        ) : (
                            <Save size={20} />
                        )}
                        حفظ التغييرات
                    </button>
                </div>
            </form>
        </div>
    );
}
