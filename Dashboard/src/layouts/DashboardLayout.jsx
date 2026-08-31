import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { ToastContainer } from '../components/common/Toast';
import { GlobalSearchModal } from '../components/layout/GlobalSearchModal';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
export const DashboardLayout = () => {
    const { sidebarCollapsed } = useApp();
    return (<div className="min-h-screen bg-[#F7F6F2] text-[#181818] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className={cn('flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out', sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals & Toasts */}
      <GlobalSearchModal />
      <ToastContainer />
    </div>);
};
