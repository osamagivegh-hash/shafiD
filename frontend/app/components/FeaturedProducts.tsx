'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';

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
    weight?: string;
    type?: string;
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${API_URL}/products/featured?limit=8`);
                if (res.ok) {
                    setProducts(await res.json());
                }
            } catch (error) {
                console.log('Failed to fetch featured products');
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-b from-white to-amber-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
                    </div>
                </div>
            </section>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-amber-50">
            <div className="container mx-auto px-4 md:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">أفضل المنتجات</h2>
                    <p className="text-gray-600 text-lg">اكتشف مجموعتنا المختارة من أجود المنتجات</p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => {
                        const imageUrl = product.imagePath
                            ? (product.imagePath.startsWith('http') ? product.imagePath : `${BACKEND_URL}${product.imagePath}`)
                            : '';

                        return (
                            <Link
                                key={product._id}
                                href={`/${product.category}/${product._id}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Image */}
                                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-amber-300">
                                            <ShoppingCart size={48} />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-amber-700 px-3 py-1 rounded-full shadow-sm">
                                        {product.categoryArabic}
                                    </span>

                                    {/* Quick View Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            عرض التفاصيل
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-amber-600 transition-colors">
                                        {product.title}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                            />
                                        ))}
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-black text-amber-600">
                                            {product.price} <span className="text-sm font-normal text-gray-500">ر.س</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/dates"
                        className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        تصفح جميع المنتجات
                    </Link>
                </div>
            </div>
        </section>
    );
}
