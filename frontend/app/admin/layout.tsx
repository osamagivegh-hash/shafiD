import { ReactNode } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { ToastProvider } from '../components/Toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50" dir="rtl">
                <AdminSidebar />
                <main className="lg:mr-64 min-h-screen p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
