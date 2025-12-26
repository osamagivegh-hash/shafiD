'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Cloud, HardDrive } from 'lucide-react';
import { API_URL, BACKEND_URL } from '../lib/config';

interface ImageUploaderProps {
    category: 'hero' | 'dates' | 'honey' | 'oud' | 'spices';
    currentImage?: string;
    onImageUploaded: (imagePath: string) => void;
    onError?: (message: string) => void;
}

export default function ImageUploader({ category, currentImage, onImageUploaded, onError }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Set initial preview from currentImage
    useEffect(() => {
        if (currentImage) {
            setPreview(getImageUrl(currentImage));
        }
    }, [currentImage]);

    // Helper to get proper image URL
    const getImageUrl = (imagePath: string) => {
        if (!imagePath) return '';
        // If it's already a full URL (Cloudinary), use as is
        if (imagePath.startsWith('http')) return imagePath;
        // If it's a data URL (preview), use as is
        if (imagePath.startsWith('data:')) return imagePath;
        // Otherwise, prepend backend URL
        return `${BACKEND_URL}${imagePath}`;
    };

    const handleFileSelect = async (file: File) => {
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            onError?.('يرجى اختيار صورة صالحة (jpg, png, gif, webp, svg)');
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            onError?.('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
            return;
        }

        // Show preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const res = await fetch(`${API_URL}/upload/${category}`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'فشل في رفع الصورة');
            }

            // Update preview with actual uploaded URL
            setPreview(getImageUrl(data.imagePath));
            onImageUploaded(data.imagePath);
        } catch (error: any) {
            onError?.(error.message || 'فشل في رفع الصورة');
            setPreview(currentImage ? getImageUrl(currentImage) : null);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const clearImage = () => {
        setPreview(null);
        onImageUploaded('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
            />

            {preview ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />
                    <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                                <span className="text-white text-sm">جاري الرفع...</span>
                            </div>
                        </div>
                    )}
                    {/* Show cloud icon if it's a Cloudinary URL */}
                    {preview.includes('cloudinary') && (
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Cloud size={12} />
                            Cloud
                        </div>
                    )}
                </div>
            ) : (
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${dragOver
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                        }`}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
                            <p className="text-gray-500">جاري الرفع...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <Upload size={24} className="text-gray-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-700">اضغط لرفع صورة</p>
                                <p className="text-sm text-gray-500">أو اسحب الصورة وأفلتها هنا</p>
                            </div>
                            <p className="text-xs text-gray-400">PNG, JPG, GIF, WEBP (أقصى حجم: 5MB)</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
