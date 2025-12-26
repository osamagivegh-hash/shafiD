'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Star, ShoppingCart, Minus, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const API_URL = 'http://localhost:4000/api/v1';
const BACKEND_URL = 'http://localhost:4000';

interface Product {
    _id: string;
    title: string;
    type: string;
    weight: string;
    price: number;
    imagePath: string;
    stock: number;
    ingredients: string;
    usageDescription: string;
    rating: number;
}

export default function SpiceProductDetail() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const res = await fetch(`${API_URL}/products/spices/${params.id}`);
                if (res.ok) setProduct(await res.json());
            } catch { console.log('Failed'); }
            finally { setLoading(false); }
        }
        if (params.id) fetchProduct();
    }, [params.id]);

    if (loading) return <div className="flex flex-col min-h-screen"><Header /><div className="h-28" /><main className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600" /></main><Footer /></div>;
    if (!product) return <div className="flex flex-col min-h-screen"><Header /><div className="h-28" /><main className="flex-grow flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-gray-900 mb-4">المنتج غير موجود</h1><Link href="/spices" className="text-orange-600 hover:underline">العودة للبهارات</Link></div></main><Footer /></div>;

    const imageUrl = product.imagePath ? (product.imagePath.startsWith('http') ? product.imagePath : `${BACKEND_URL}${product.imagePath}`) : '';

    return (
        <div className="flex flex-col min-h-screen">
            <Header /><div className="h-28" />
            <main className="flex-grow py-8">
                <div className="container mx-auto px-4 md:px-8">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-orange-600">الرئيسية</Link><ArrowRight size={14} />
                        <Link href="/spices" className="hover:text-orange-600">البهارات</Link><ArrowRight size={14} />
                        <span className="text-gray-900">{product.title}</span>
                    </nav>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
                            {imageUrl && !imgError ? <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" onError={() => setImgError(true)} /> : <div className="w-full h-full flex items-center justify-center text-orange-200"><ShoppingCart size={100} /></div>}
                            <span className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold">{product.type}</span>
                        </div>
                        <div className="space-y-6">
                            <div><h1 className="text-4xl font-bold text-gray-900 mb-2">{product.title}</h1><p className="text-gray-500">{product.weight}</p></div>
                            <div className="flex items-center gap-2">{[...Array(5)].map((_, i) => <Star key={i} size={24} className={i < Math.round(product.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-200'} />)}<span className="text-gray-500 mr-2">({product.rating.toFixed(1)})</span></div>
                            <div className="text-4xl font-black text-orange-600">{product.price} <span className="text-xl font-normal text-gray-500">ر.س</span></div>
                            {product.ingredients && <div><h3 className="font-bold text-gray-900 mb-2">المكونات:</h3><p className="text-gray-600">{product.ingredients}</p></div>}
                            {product.usageDescription && <div><h3 className="font-bold text-gray-900 mb-2">طريقة الاستخدام:</h3><p className="text-gray-600">{product.usageDescription}</p></div>}
                            <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock > 0 ? `متوفر (${product.stock} قطعة)` : 'غير متوفر'}</p>
                            <div className="flex items-center gap-4"><span className="font-medium text-gray-700">الكمية:</span><div className="flex items-center border border-gray-200 rounded-lg"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100"><Minus size={18} /></button><span className="px-6 py-3 font-bold text-lg">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100"><Plus size={18} /></button></div></div>
                            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"><ShoppingCart size={24} />أضف للسلة - {product.price * quantity} ر.س</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
