'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import { Save, Plus, Edit2, Trash2, X, Truck, MapPin } from 'lucide-react';
import { API_URL } from '../../../lib/config';

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
    isActive: boolean;
}

export default function ShippingManagement() {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<'content' | 'zones'>('content');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Content State
    const [content, setContent] = useState<ShippingContent>({
        pageTitle: '', introText: '', freeShippingEnabled: true, freeShippingMinimum: 300,
        freeShippingText: '', shippingCompanies: '', returnPolicy: '', exchangePolicy: '',
        packagingInfo: '', shippingSupport: '',
    });

    // Zones State
    const [zones, setZones] = useState<ShippingZone[]>([]);
    const [showZoneForm, setShowZoneForm] = useState(false);
    const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
    const [zoneForm, setZoneForm] = useState({
        zoneName: '', cities: '', deliveryTime: '2-3 أيام عمل', shippingCost: 0, freeShippingMinimum: 0,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [contentRes, zonesRes] = await Promise.all([
                fetch(`${API_URL}/shipping/content`),
                fetch(`${API_URL}/shipping/zones/admin`),
            ]);
            if (contentRes.ok) setContent(await contentRes.json());
            if (zonesRes.ok) setZones(await zonesRes.json());
        } catch { addToast('error', 'فشل في تحميل البيانات'); }
        finally { setLoading(false); }
    };

    // Content handlers
    const handleContentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/shipping/content`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content),
            });
            if (!res.ok) throw new Error();
            addToast('success', 'تم حفظ التغييرات');
        } catch { addToast('error', 'فشل في الحفظ'); }
        finally { setSaving(false); }
    };

    // Zone handlers
    const resetZoneForm = () => {
        setZoneForm({ zoneName: '', cities: '', deliveryTime: '2-3 أيام عمل', shippingCost: 0, freeShippingMinimum: 0 });
        setEditingZoneId(null); setShowZoneForm(false);
    };

    const handleZoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!zoneForm.zoneName) { addToast('error', 'يرجى إدخال اسم المنطقة'); return; }
        try {
            const url = editingZoneId ? `${API_URL}/shipping/zones/${editingZoneId}` : `${API_URL}/shipping/zones`;
            const res = await fetch(url, {
                method: editingZoneId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(zoneForm),
            });
            if (!res.ok) throw new Error();
            addToast('success', editingZoneId ? 'تم التحديث' : 'تم الإضافة');
            resetZoneForm(); fetchData();
        } catch { addToast('error', 'فشل'); }
    };

    const handleEditZone = (zone: ShippingZone) => {
        setZoneForm({ zoneName: zone.zoneName, cities: zone.cities, deliveryTime: zone.deliveryTime, shippingCost: zone.shippingCost, freeShippingMinimum: zone.freeShippingMinimum });
        setEditingZoneId(zone._id); setShowZoneForm(true);
    };

    const handleDeleteZone = async (id: string) => {
        if (!confirm('حذف؟')) return;
        try { await fetch(`${API_URL}/shipping/zones/${id}`, { method: 'DELETE' }); addToast('success', 'تم الحذف'); fetchData(); }
        catch { addToast('error', 'فشل'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" /></div>;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">إدارة الشحن والتوصيل</h1>
                <p className="text-gray-600 mt-1">إعدادات صفحة الشحن ومناطق التوصيل</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button onClick={() => setActiveTab('content')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'content' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <Truck size={18} className="inline ml-2" />محتوى الصفحة
                </button>
                <button onClick={() => setActiveTab('zones')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'zones' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    <MapPin size={18} className="inline ml-2" />مناطق التوصيل
                </button>
            </div>

            {/* Content Tab */}
            {activeTab === 'content' && (
                <form onSubmit={handleContentSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">معلومات عامة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">عنوان الصفحة</label>
                                <input value={content.pageTitle} onChange={e => setContent({ ...content, pageTitle: e.target.value })} className="w-full p-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">شركات الشحن (مفصولة بفاصلة)</label>
                                <input value={content.shippingCompanies} onChange={e => setContent({ ...content, shippingCompanies: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="SMSA, أرامكس, DHL" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">نص تعريفي</label>
                                <textarea value={content.introText} onChange={e => setContent({ ...content, introText: e.target.value })} className="w-full p-3 border rounded-lg" rows={2} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">الشحن المجاني</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={content.freeShippingEnabled} onChange={e => setContent({ ...content, freeShippingEnabled: e.target.checked })} className="w-5 h-5" />
                                <label>تفعيل الشحن المجاني</label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">الحد الأدنى (ر.س)</label>
                                <input type="number" value={content.freeShippingMinimum} onChange={e => setContent({ ...content, freeShippingMinimum: +e.target.value })} className="w-full p-3 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">نص الشحن المجاني</label>
                                <input value={content.freeShippingText} onChange={e => setContent({ ...content, freeShippingText: e.target.value })} className="w-full p-3 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">السياسات</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">سياسة الاسترجاع</label>
                                <textarea value={content.returnPolicy} onChange={e => setContent({ ...content, returnPolicy: e.target.value })} className="w-full p-3 border rounded-lg" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">سياسة الاستبدال</label>
                                <textarea value={content.exchangePolicy} onChange={e => setContent({ ...content, exchangePolicy: e.target.value })} className="w-full p-3 border rounded-lg" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">معلومات التغليف</label>
                                <textarea value={content.packagingInfo} onChange={e => setContent({ ...content, packagingInfo: e.target.value })} className="w-full p-3 border rounded-lg" rows={2} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">رقم دعم الشحن</label>
                                <input value={content.shippingSupport} onChange={e => setContent({ ...content, shippingSupport: e.target.value })} className="w-full p-3 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className="flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 disabled:opacity-50">
                        {saving ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : <Save size={20} />}
                        حفظ التغييرات
                    </button>
                </form>
            )}

            {/* Zones Tab */}
            {activeTab === 'zones' && (
                <div>
                    <div className="flex justify-end mb-4">
                        <button onClick={() => setShowZoneForm(true)} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
                            <Plus size={20} />إضافة منطقة
                        </button>
                    </div>

                    {/* Zone Form Modal */}
                    {showZoneForm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editingZoneId ? 'تعديل' : 'إضافة'} منطقة</h2><button onClick={resetZoneForm}><X /></button></div>
                                <form onSubmit={handleZoneSubmit} className="space-y-4">
                                    <input value={zoneForm.zoneName} onChange={e => setZoneForm({ ...zoneForm, zoneName: e.target.value })} placeholder="اسم المنطقة *" className="w-full p-3 border rounded-lg" required />
                                    <input value={zoneForm.cities} onChange={e => setZoneForm({ ...zoneForm, cities: e.target.value })} placeholder="المدن (مفصولة بفاصلة)" className="w-full p-3 border rounded-lg" />
                                    <input value={zoneForm.deliveryTime} onChange={e => setZoneForm({ ...zoneForm, deliveryTime: e.target.value })} placeholder="وقت التوصيل" className="w-full p-3 border rounded-lg" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="number" value={zoneForm.shippingCost} onChange={e => setZoneForm({ ...zoneForm, shippingCost: +e.target.value })} placeholder="تكلفة الشحن" className="p-3 border rounded-lg" />
                                        <input type="number" value={zoneForm.freeShippingMinimum} onChange={e => setZoneForm({ ...zoneForm, freeShippingMinimum: +e.target.value })} placeholder="حد الشحن المجاني" className="p-3 border rounded-lg" />
                                    </div>
                                    <button type="submit" className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700"><Save size={18} className="inline ml-2" />{editingZoneId ? 'تحديث' : 'حفظ'}</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Zones Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50"><tr>
                                <th className="px-4 py-3 text-right">المنطقة</th>
                                <th className="px-4 py-3 text-right">المدن</th>
                                <th className="px-4 py-3 text-right">وقت التوصيل</th>
                                <th className="px-4 py-3 text-right">التكلفة</th>
                                <th className="px-4 py-3 text-right">إجراءات</th>
                            </tr></thead>
                            <tbody>
                                {zones.map(zone => (
                                    <tr key={zone._id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{zone.zoneName}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{zone.cities || '-'}</td>
                                        <td className="px-4 py-3">{zone.deliveryTime}</td>
                                        <td className="px-4 py-3">{zone.shippingCost === 0 ? 'مجاني' : `${zone.shippingCost} ر.س`}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button onClick={() => handleEditZone(zone)} className="text-blue-600 p-2 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDeleteZone(zone._id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {!zones.length && <tr><td colSpan={5} className="text-center py-8 text-gray-500">لا توجد مناطق</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
