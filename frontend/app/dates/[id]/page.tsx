'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Star, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { API_URL, BACKEND_URL } from '../../lib/config';

interface Product {
    _id: string;
    title: string;
    type: string;
    weight: string;
    price: number;
    imagePath: string;
    stock: number;
    luxuryDescription: string;
    rating: number;
}

export default function DateProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`${API_URL}/products/dates/${params.id}`);
                if (res.ok) {
                    setProduct(await res.json());
                }
            } catch {
                console.log('Failed to fetch product');
            } finally {
                setLoading(false);
            }
        }
        if (params.id) fetchProduct();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="h-28" />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <div className="h-28" />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1>
                        <Link href="/dates" className="text-amber-600 hover:underline">العودة للتمور</Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const imageUrl = product.imagePath
        ? (product.imagePath.startsWith('http') ? product.imagePath : `${BACKEND_URL}${product.imagePath}`)
        : '';

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="h-28" />
            <main className="flex-grow py-8">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-amber-600">الرئيسية</Link>
                        <ArrowRight size={14} />
                        <Link href="/dates" className="hover:text-amber-600">التمور</Link>
                        <ArrowRight size={14} />
                        <span className="text-gray-900">{product.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                            {imageUrl && !imgError ? (
                                <img
                                    src={imageUrl}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-amber-200">
                                    <ShoppingCart size={100} />
                                </div>
                            )}
                            <span className="absolute top-4 right-4 bg-amber-500 text-white px-4 py-2 rounded-full font-bold">
                                {product.type}
                            </span>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                <p className="text-gray-500">{product.weight}</p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={24}
                                        className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                                    />
                                ))}
                                <span className="text-gray-500 mr-2">({product.rating.toFixed(1)})</span>
                            </div>

                            {/* Price */}
                            <div className="text-4xl font-black text-amber-600">
                                {product.price} <span className="text-xl font-normal text-gray-500">ر.س</span>
                            </div>

                            {/* Description */}
                            {product.luxuryDescription && (
                                <p className="text-gray-600 leading-relaxed text-lg">{product.luxuryDescription}</p>
                            )}

                            {/* Stock */}
                            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'غير متوفر'}
                            </p>

                            {/* Quantity */}
                            <div className="flex items-center gap-4">
                                <span className="font-medium text-gray-700">الكمية:</span>
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="px-6 py-3 font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart */}
                            <button className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-lg hover:shadow-xl">
                                <ShoppingCart size={24} />
                                أضف للسلة - {product.price * quantity} ر.س
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
