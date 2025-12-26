'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import ImageUploader from '../../../components/ImageUploader';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';
import { API_URL, BACKEND_URL } from '../../../lib/config';

interface HeroSlide {
    _id: string;
    imagePath: string;
    titleArabic: string;
    subtitleArabic: string;
    link: string;
    order: number;
    isActive: boolean;
}

export default function HeroManagement() {
    const { addToast } = useToast();
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        imagePath: '',
        titleArabic: '',
        subtitleArabic: '',
        link: '/',
        order: 0,
        isActive: true,
    });

    const fetchSlides = async () => {
        try {
            const res = await fetch(`${API_URL}/hero/admin`);
            const data = await res.json();
            setSlides(data);
        } catch (error) {
            addToast('error', 'فشل في تحميل السلايدات');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const resetForm = () => {
        setFormData({ imagePath: '', titleArabic: '', subtitleArabic: '', link: '/', order: 0, isActive: true });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.imagePath || !formData.titleArabic) {
            addToast('error', 'يرجى رفع صورة وإدخال العنوان العربي');
            return;
        }

        try {
            const url = editingId ? `${API_URL}/hero/admin/${editingId}` : `${API_URL}/hero/admin`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'حدث خطأ');

            addToast('success', editingId ? 'تم تحديث السلايد بنجاح' : 'تم إضافة السلايد بنجاح');
            resetForm();
            fetchSlides();
        } catch (error: any) {
            addToast('error', error.message || 'فشل في حفظ السلايد');
        }
    };

    const handleEdit = (slide: HeroSlide) => {
        setFormData({
            imagePath: slide.imagePath,
            titleArabic: slide.titleArabic,
            subtitleArabic: slide.subtitleArabic,
            link: slide.link,
            order: slide.order,
            isActive: slide.isActive,
        });
        setEditingId(slide._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('هل أنت متأكد من حذف هذا السلايد؟')) return;
        try {
            const res = await fetch(`${API_URL}/hero/admin/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('فشل في الحذف');
            addToast('success', 'تم حذف السلايد بنجاح');
            fetchSlides();
        } catch (error) {
            addToast('error', 'فشل في حذف السلايد');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة السلايدر</h1>
                    <p className="text-gray-600 mt-1">إضافة وتعديل صور السلايدر الرئيسي</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                    <Plus size={20} />
                    إضافة سلايد
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">{editingId ? 'تعديل السلايد' : 'إضافة سلايد جديد'}</h2>
                            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">صورة السلايد *</label>
                                <ImageUploader
                                    category="hero"
                                    currentImage={formData.imagePath}
                                    onImageUploaded={(path) => setFormData({ ...formData, imagePath: path })}
                                    onError={(msg) => addToast('error', msg)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان بالعربية *</label>
                                <input
                                    type="text"
                                    value={formData.titleArabic}
                                    onChange={(e) => setFormData({ ...formData, titleArabic: e.target.value })}
                                    placeholder="أدخل العنوان العربي"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">العنوان الفرعي</label>
                                <input
                                    type="text"
                                    value={formData.subtitleArabic}
                                    onChange={(e) => setFormData({ ...formData, subtitleArabic: e.target.value })}
                                    placeholder="أدخل العنوان الفرعي"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الرابط</label>
                                    <input
                                        type="text"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        placeholder="/dates"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">الترتيب</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                                />
                                <label htmlFor="isActive" className="text-sm text-gray-700">مفعّل</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                                >
                                    <Save size={18} />
                                    {editingId ? 'تحديث' : 'حفظ'}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Slides Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الصورة</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">العنوان</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الرابط</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الترتيب</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الحالة</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {slides.map((slide) => (
                                <tr key={slide._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-24 h-14 bg-gradient-to-br from-amber-100 to-orange-50 rounded-lg overflow-hidden">
                                            {slide.imagePath ? (
                                                <img
                                                    src={slide.imagePath.startsWith('http') ? slide.imagePath : `${BACKEND_URL}${slide.imagePath}`}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            ) : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">لا صورة</div>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{slide.titleArabic}</p>
                                        {slide.subtitleArabic && <p className="text-sm text-gray-500">{slide.subtitleArabic}</p>}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{slide.link}</td>
                                    <td className="px-6 py-4 text-gray-600">{slide.order}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${slide.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {slide.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {slide.isActive ? 'مفعّل' : 'معطّل'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(slide)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(slide._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {slides.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">لا توجد سلايدات. أضف سلايد جديد للبدء.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
