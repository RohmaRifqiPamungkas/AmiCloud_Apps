'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import NavbarDashboard from '@/components/Navbar/NavbarDashboard';
import FooterDashboard from '@/components/Footer/FooterDashboard';

export default function DashboardLayout({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

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
