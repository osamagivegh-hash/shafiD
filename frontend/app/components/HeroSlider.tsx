'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { API_URL, BACKEND_URL } from '../lib/config';

interface HeroSlide {
    _id?: string;
    titleArabic: string;
    subtitleArabic?: string;
    imagePath: string;
    link?: string;
    order: number;
}

const defaultSlides: HeroSlide[] = [
    { _id: '1', titleArabic: 'تمور الإخلاص.. ذهب الأحساء في بيتك', subtitleArabic: 'أجود أنواع التمور السعودية', imagePath: '', link: '/dates', order: 1 },
    { _id: '2', titleArabic: 'عجوة المدينة.. بركة من أرض طيبة', subtitleArabic: 'تمور مباركة من المدينة المنورة', imagePath: '', link: '/dates', order: 2 },
    { _id: '3', titleArabic: 'العود الملكي.. عبق التراث السعودي', subtitleArabic: 'عود فاخر يليق بمقامكم', imagePath: '', link: '/oud', order: 3 },
];

export default function HeroSlider() {
    const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

    useEffect(() => {
        async function fetchSlides() {
            try {
                const res = await fetch(`${API_URL}/hero`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) setSlides(data);
                }
            } catch { console.log('Using default slides'); }
        }
        fetchSlides();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const handleImgError = (index: number) => {
        setImgErrors((prev) => new Set(prev).add(index));
    };

    const currentImagePath = slides[currentSlide]?.imagePath || '';
    const imageUrl = currentImagePath ? (currentImagePath.startsWith('http') ? currentImagePath : `${BACKEND_URL}${currentImagePath}`) : '';
    const showFallback = !imageUrl || imgErrors.has(currentSlide);

    return (
        <section className="relative h-[80vh] w-full overflow-hidden bg-stone-50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 w-full h-full"
                >
                    <div className="relative w-full h-full">
                        {showFallback ? (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3] to-[#E6C9A8] flex items-center justify-center">
                                <span className="text-stone-400 text-lg opacity-50">Loading Heritage...</span>
                            </div>
                        ) : (
                            <img
                                src={imageUrl}
                                alt={slides[currentSlide].titleArabic}
                                className="w-full h-full object-cover"
                                onError={() => handleImgError(currentSlide)}
                            />
                        )}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                        <div>
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                                className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg mb-4"
                            >
                                {slides[currentSlide].titleArabic}
                            </motion.h1>
                            {slides[currentSlide].subtitleArabic && (
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                    className="text-xl md:text-2xl text-white/90 drop-shadow mb-8"
                                >
                                    {slides[currentSlide].subtitleArabic}
                                </motion.p>
                            )}
                            {slides[currentSlide].link && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7, duration: 0.8 }}
                                >
                                    <Link
                                        href={slides[currentSlide].link}
                                        className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        تسوق الآن
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-3 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
