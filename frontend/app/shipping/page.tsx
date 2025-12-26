'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Truck, Clock, MapPin, Package, RefreshCw, Shield, Phone } from 'lucide-react';
import { API_URL } from '../lib/config';

interface ShippingContent {
    pageTitle: string;
    introText: string;
    freeShippingEnabled: boolean;
    freeShippingMinimum: number;
    freeShippingText: string;
    shippingCompanies: string;
    returnPolicy: string;
    exchangePolicy: string;
    packagingInfo: string;
    shippingSupport: string;
}

interface ShippingZone {
    _id: string;
    zoneName: string;
    cities: string;
    deliveryTime: string;
    shippingCost: number;
    freeShippingMinimum: number;
}

export default function ShippingPage() {
    const [content, setContent] = useState<ShippingContent | null>(null);
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [contentRes, zonesRes] = await Promise.all([
                    fetch(`${API_URL}/shipping/content`),
                    fetch(`${API_URL}/shipping/zones`),
                ]);
                if (contentRes.ok) setContent(await contentRes.json());
                if (zonesRes.ok) setZones(await zonesRes.json());
            } catch (error) {
                console.log('Error fetching shipping data');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="h-28" />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16">
                    <div className="container mx-auto px-4 md:px-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-6">
                            <Truck size={32} className="text-amber-600" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {content?.pageTitle || 'الشحن والتوصيل'}
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            {content?.introText || 'نوفر خدمة توصيل سريعة وآمنة لجميع مناطق المملكة'}
                        </p>
                    </div>
                </section>

                {/* Free Shipping Banner */}
                {content?.freeShippingEnabled && (
                    <section className="bg-amber-500 py-4">
                        <div className="container mx-auto px-4 text-center text-white">
                            <p className="text-lg font-medium flex items-center justify-center gap-2">
                                <Package size={20} />
                                {content.freeShippingText} {content.freeShippingMinimum} ر.س
                            </p>
                        </div>
                    </section>
                )}

                {/* Shipping Zones */}
                <section className="py-16">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">مناطق التوصيل</h2>

                        {zones.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {zones.map((zone) => (
                                    <div key={zone._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-amber-50 rounded-lg">
                                                <MapPin size={24} className="text-amber-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{zone.zoneName}</h3>
                                                {zone.cities && (
                                                    <p className="text-gray-500 text-sm mb-3">{zone.cities}</p>
                                                )}
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <Clock size={16} className="text-amber-500" />
                                                        {zone.deliveryTime}
                                                    </span>
                                                    <span className="font-bold text-amber-600">
                                                        {zone.shippingCost === 0 ? 'مجاني' : `${zone.shippingCost} ر.س`}
                                                    </span>
                                                </div>
                                                {zone.freeShippingMinimum > 0 && (
                                                    <p className="text-xs text-green-600 mt-2">
                                                        شحن مجاني للطلبات فوق {zone.freeShippingMinimum} ر.س
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <p>سيتم إضافة مناطق التوصيل قريباً</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Shipping Companies */}
                {content?.shippingCompanies && (
                    <section className="py-12 bg-gray-50">
                        <div className="container mx-auto px-4 md:px-8 text-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">شركات الشحن المعتمدة</h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                {content.shippingCompanies.split(',').map((company, index) => (
                                    <div key={index} className="bg-white px-8 py-4 rounded-lg shadow-sm border border-gray-100">
                                        <span className="font-semibold text-gray-700">{company.trim()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Policies */}
                <section className="py-16">
                    <div className="container mx-auto px-4 md:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">سياسات الشحن</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Return Policy */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-red-50 rounded-full mb-4">
                                    <RefreshCw size={24} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">سياسة الاسترجاع</h3>
                                <p className="text-gray-600">{content?.returnPolicy}</p>
                            </div>

                            {/* Exchange Policy */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-4">
                                    <Package size={24} className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">سياسة الاستبدال</h3>
                                <p className="text-gray-600">{content?.exchangePolicy}</p>
                            </div>

                            {/* Packaging */}
                            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 rounded-full mb-4">
                                    <Shield size={24} className="text-green-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">التغليف والحماية</h3>
                                <p className="text-gray-600">{content?.packagingInfo}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Support */}
                {content?.shippingSupport && (
                    <section className="py-12 bg-amber-50">
                        <div className="container mx-auto px-4 md:px-8 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                                <Phone size={20} className="text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">للاستفسار عن الشحن</h3>
                            <p className="text-gray-600">{content.shippingSupport}</p>
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}
