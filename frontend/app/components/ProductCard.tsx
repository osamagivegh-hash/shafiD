'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { BACKEND_URL } from '../lib/config';

interface ProductCardProps {
    title: string;
    price: number;
    imagePath: string;
    rating?: number;
    weight?: string;
    type?: string;
}

export default function ProductCard({ title, price, imagePath, rating = 5, weight, type }: ProductCardProps) {
    const [imgError, setImgError] = useState(false);

    // Construct full image URL
    const imageUrl = imagePath ? (imagePath.startsWith('http') ? imagePath : `${BACKEND_URL}${imagePath}`) : '';

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            {/* Image Container */}
            <div className="relative h-56 bg-gradient-to-br from-[#F5E6D3] to-[#E6C9A8] overflow-hidden">
                {imageUrl && !imgError ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-400 text-sm">
                        Loading Heritage...
                    </div>
                )}
                {type && (
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 px-2 py-1 rounded-full">
                        {type}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{title}</h3>

                {weight && (
                    <p className="text-sm text-gray-500 mb-2">{weight}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={14}
                            className={i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                        />
                    ))}
                    <span className="text-xs text-gray-500 mr-1">({rating.toFixed(1)})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{price} <span className="text-sm font-normal">ر.س</span></span>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white text-sm px-4 py-2 rounded-lg transition-colors">
                        أضف للسلة
                    </button>
                </div>
            </div>
        </div>
    );
}
