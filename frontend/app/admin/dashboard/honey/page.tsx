'use client';

import { useState, useEffect } from 'react';
import { useToast } from '../../../components/Toast';
import ImageUploader from '../../../components/ImageUploader';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { API_URL, BACKEND_URL } from '../../../lib/config';

interface HoneyProduct {
    _id: string;
    title: string;
    origin: string;
    weight: string;
    price: number;
    imagePath: string;
    stock: number;
    healthBenefits: string;
    rating: number;
}

export default function HoneyManagement() {
    const { addToast } = useToast();
    const [products, setProducts] = useState<HoneyProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', origin: '', weight: '', price: 0, imagePath: '', stock: 0, healthBenefits: '', rating: 5,
    });

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products/honey/admin`);
            setProducts(await res.json());
        } catch { addToast('error', 'فشل في تحميل المنتجات'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const resetForm = () => {
        setFormData({ title: '', origin: '', weight: '', price: 0, imagePath: '', stock: 0, healthBenefits: '', rating: 5 });
        setEditingId(null); setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.imagePath) {
            addToast('error', 'يرجى إدخال الاسم ورفع الصورة'); return;
        }
        try {
            const url = editingId ? `${API_URL}/products/honey/${editingId}` : `${API_URL}/products/honey`;
            const res = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
            if (!res.ok) throw new Error((await res.json()).message);
            addToast('success', editingId ? 'تم التحديث' : 'تم الإضافة');
            resetForm(); fetchProducts();
        } catch (err: any) { addToast('error', err.message || 'فشل'); }
    };

    const handleEdit = (p: HoneyProduct) => {
        setFormData({ title: p.title, origin: p.origin, weight: p.weight, price: p.price, imagePath: p.imagePath, stock: p.stock, healthBenefits: p.healthBenefits, rating: p.rating });
        setEditingId(p._id); setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('حذف؟')) return;
        try { await fetch(`${API_URL}/products/honey/${id}`, { method: 'DELETE' }); addToast('success', 'تم الحذف'); fetchProducts(); }
        catch { addToast('error', 'فشل'); }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">إدارة العسل</h1>
                <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"><Plus size={20} />إضافة</button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between mb-4"><h2 className="text-xl font-bold">{editingId ? 'تعديل' : 'إضافة'}</h2><button onClick={resetForm}><X /></button></div>
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج *</label>
                                <ImageUploader
                                    category="honey"
                                    currentImage={formData.imagePath}
                                    onImageUploaded={(path) => setFormData({ ...formData, imagePath: path })}
                                    onError={(msg) => addToast('error', msg)}
                                />
                            </div>

                            <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="اسم المنتج *" className="w-full p-3 border rounded-lg" required />

                            <div className="grid grid-cols-2 gap-3">
                                <input value={formData.origin} onChange={e => setFormData({ ...formData, origin: e.target.value })} placeholder="المصدر (اليمن)" className="p-3 border rounded-lg" />
                                <input value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} placeholder="الوزن (500g)" className="p-3 border rounded-lg" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: +e.target.value })} placeholder="السعر" className="p-3 border rounded-lg" />
                                <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: +e.target.value })} placeholder="المخزون" className="p-3 border rounded-lg" />
                            </div>

                            <textarea value={formData.healthBenefits} onChange={e => setFormData({ ...formData, healthBenefits: e.target.value })} placeholder="الفوائد الصحية" className="w-full p-3 border rounded-lg" rows={3} />

                            <button type="submit" className="w-full bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-2">
                                <Save size={18} />{editingId ? 'تحديث' : 'حفظ'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50"><tr>
                        <th className="px-4 py-3 text-right">الصورة</th>
                        <th className="px-4 py-3 text-right">المنتج</th>
                        <th className="px-4 py-3 text-right">المصدر</th>
                        <th className="px-4 py-3 text-right">السعر</th>
                        <th className="px-4 py-3 text-right">إجراءات</th>
                    </tr></thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                        {p.imagePath && <img src={p.imagePath.startsWith('http') ? p.imagePath : `${BACKEND_URL}${p.imagePath}`} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium">{p.title}</td>
                                <td className="px-4 py-3">{p.origin}</td>
                                <td className="px-4 py-3">{p.price} ر.س</td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="text-blue-600 p-2 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(p._id)} className="text-red-600 p-2 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                        {!products.length && <tr><td colSpan={5} className="text-center py-12 text-gray-500">لا منتجات</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
