'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const API_URL = 'http://localhost:4000/api/v1';

interface HoneyProduct {
    _id: string;
    title: string;
    origin: string;
    weight: string;
    price: number;
    imagePath: string;
    rating: number;
}

export default function HoneyPage() {
    const [products, setProducts] = useState<HoneyProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch(`${API_URL}/products/honey`);
                if (res.ok) setProducts(await res.json());
            } catch { console.log('Failed to fetch honey'); }
            finally { setLoading(false); }
        }
        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">العسل</h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            أنقى أنواع العسل الطبيعي من أفضل المناحل، غني بالفوائد الصحية
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600" />
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    title={product.title}
                                    price={product.price}
                                    imagePath={product.imagePath}
                                    rating={product.rating}
                                    weight={product.weight}
                                    type={product.origin}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-xl">لا توجد منتجات حالياً</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
