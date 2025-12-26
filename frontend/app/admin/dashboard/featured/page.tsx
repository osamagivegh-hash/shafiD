'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import { Star, Check, X } from 'lucide-react';

const API_URL = 'http://localhost:4000/api/v1';
const BACKEND_URL = 'http://localhost:4000';

interface Product {
    _id: string;
    title: string;
    price: number;
    imagePath: string;
    rating: number;
    category: string;
    categoryArabic: string;
}

export default function FeaturedManagement() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dates' | 'honey' | 'oud' | 'spices'>('dates');

    const categoryLabels = {
        dates: 'التمور',
        honey: 'العسل',
        oud: 'العود',
        spices: 'البهارات',
    };

    useEffect(() => {
        fetchProducts();
    }, [activeTab]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products/${activeTab}/admin`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.map((p: any) => ({
                    ...p,
                    category: activeTab,
                    categoryArabic: categoryLabels[activeTab],
                })));
            }
        } catch {
            addToast('error', 'فشل في تحميل المنتجات');
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        return imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}${imagePath}`;
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">المنتجات المميزة</h1>
                <p className="text-gray-600 mt-1">المنتجات ذات التقييم الأعلى تظهر تلقائياً في الصفحة الرئيسية</p>
            </div>

            {/* Info Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-amber-800 mb-2">كيف تعمل المنتجات المميزة؟</h3>
                <ul className="text-amber-700 space-y-1 text-sm">
                    <li>• يتم عرض المنتجات ذات التقييم الأعلى (5 نجوم) في الصفحة الرئيسية تلقائياً</li>
                    <li>• لإضافة منتج للمميزة، قم برفع تقييمه إلى 5 نجوم</li>
                    <li>• يتم عرض 8 منتجات كحد أقصى (2 من كل فئة)</li>
                    <li>• تأكد من إضافة صور جذابة للمنتجات</li>
                </ul>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {(Object.keys(categoryLabels) as Array<keyof typeof categoryLabels>).map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === cat
                                ? 'bg-amber-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {categoryLabels[cat]}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
                    <p>لا توجد منتجات في هذه الفئة</p>
                    <p className="text-sm mt-2">قم بإضافة منتجات من صفحة إدارة {categoryLabels[activeTab]}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map((product) => {
                        const isFeatured = product.rating >= 4.5;
                        return (
                            <div
                                key={product._id}
                                className={`bg-white rounded-xl overflow-hidden shadow-sm border-2 transition-all ${isFeatured ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-100'
                                    }`}
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-100">
                                    {product.imagePath ? (
                                        <img
                                            src={getImageUrl(product.imagePath)}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            No Image
                                        </div>
                                    )}

                                    {/* Featured Badge */}
                                    {isFeatured && (
                                        <div className="absolute top-2 right-2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star size={12} className="fill-white" />
                                            مميز
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{product.title}</h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                            />
                                        ))}
                                        <span className="text-sm text-gray-500 mr-1">({product.rating})</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-amber-600">{product.price} ر.س</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${isFeatured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {isFeatured ? 'يظهر في الرئيسية' : 'غير مميز'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Legend */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                    <strong>ملاحظة:</strong> لتعديل تقييم منتج، اذهب إلى صفحة إدارة الفئة المعنية (التمور، العسل، العود، أو البهارات) وقم بتعديل المنتج.
                </p>
            </div>
        </div>
    );
}
