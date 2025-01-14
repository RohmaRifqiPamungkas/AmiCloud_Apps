'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import NavbarDashboard from '@/components/Navbar/NavbarDashboard';
import FooterDashboard from '@/components/Footer/FooterDashboard';
import { useAuth } from '@/hooks/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, loading, error } = useAuth();  
    const router = useRouter();
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    useEffect(() => {
        if (!user) {
            router.push('/login');  
        }
    }, [user]);

    return (
        <div className="flex h-screen">
            <Sidebar isCollapsed={isCollapsed} />
            <div className={`flex flex-col flex-1 ${isCollapsed ? 'w-20' : 'w-64'}`}>
                <NavbarDashboard toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
                <main className="flex-1 p-6 overflow-auto">{children}</main>
                <FooterDashboard />
            </div>
        </div>
    );
}
