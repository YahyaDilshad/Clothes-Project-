import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    LayoutDashboard, 
    CreditCard, 
    Grid, 
    Layers, 
    Package, 
    Boxes, 
    RotateCcw, 
    RefreshCw, 
    Users, 
    ShieldCheck, 
    TrendingDown, 
    TrendingUp, 
    UserCircle,
    LogOut, 
    ChevronLeft, 
    ChevronRight, 
    LucideListOrdered,
    BadgePercent
} from 'lucide-react';

// STORES
import { useApp } from '../../context/AppContext';
import { useAuthStore } from '../../store/authStore.js'; // Auth Store Import karein

// COMPONENTS & UTILS
import { ConfirmDialog } from '../common/ConfirmDialog';
import { cn } from '../../utils/cn';
import Logo from '../../../assets/logo.png'; 

export const Sidebar = () => {
    // 1. UI context se lein
    const { 
        sidebarCollapsed, 
        setSidebarCollapsed, 
        mobileMenuOpen, 
        setMobileMenuOpen, 
        inventory, 
        returns 
    } = useApp();

    // 2. Auth Actions Zustand se lein
    const { logout } = useAuthStore();
    
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();

    // Badges calculation (Safety check ke sath)
    const lowStockCount = inventory?.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length || 0;
    const pendingReturnsCount = returns?.filter((r) => r.status === 'Requested').length || 0;

    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Orders', path: '/orders', icon: LucideListOrdered },
        { label: 'Billing', path: '/billing', icon: CreditCard },
        { label: 'Sales', path: '/sales', icon: BadgePercent },
        { label: 'Categories', path: '/categories', icon: Grid },
        { label: 'Collections', path: '/collections', icon: Layers },
        { label: 'Products', path: '/products', icon: Package },
        { label: 'Stocks', path: '/stocks', icon: Boxes, badge: lowStockCount || undefined, badgeColor: 'bg-[#B94A48]/20 text-[#B94A48]' },
        { label: 'Returns', path: '/returns', icon: RotateCcw, badge: pendingReturnsCount || undefined, badgeColor: 'bg-[#64748B]/20 text-[#64748B]' },
        { label: 'Exchange', path: '/exchange', icon: RefreshCw },
        { label: 'Staff', path: '/staff', icon: Users },
        { label: 'Permissions', path: '/permissions', icon: ShieldCheck },
        { label: 'Expense', path: '/expense', icon: TrendingDown },
        { label: 'Revenue', path: '/revenue', icon: TrendingUp },
        { label: 'Customers', path: '/customers', icon: UserCircle },
    ];

    const handleLogout = () => {
        logout(); // Zustand state clear karega + localStorage delete karega
        setLogoutDialogOpen(false);
        navigate('/login', { replace: true }); // Redirect to login
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-[#181818]/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
            )}

            <aside className={cn(
                'fixed top-0 left-0 bottom-0 z-40 bg-[#181818] text-[#9A9A9A] flex flex-col border-r border-[#282828] transition-all duration-300 ease-in-out', 
                sidebarCollapsed ? 'w-20' : 'w-64', 
                mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            )}>
                
                {/* Brand Header */}
                <div className="h-24 flex items-center justify-between px-4 border-b border-[#282828]">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("flex items-center justify-center shrink-0 overflow-hidden transition-all bg-white/5 rounded-xl p-1", sidebarCollapsed ? "w-12 h-12" : "w-16 h-16")}>
                            <img src={Logo} alt="Faisal Kamir Logo" className="w-full h-full object-contain" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="min-w-0">
                                <h1 className="text-[11px] font-bold text-white tracking-widest uppercase font-serif truncate">
                                    Faisal Kamir
                                </h1>
                                <p className="text-[9px] text-[#B08D57] tracking-tighter uppercase truncate font-medium">
                                    Fabrics & Cloth House
                                </p>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-[#9A9A9A] hover:text-white hover:bg-[#242424] transition-colors cursor-pointer">
                        {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                </div>

                {/* Navigation list */}
                <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar scrollbar-hide">
                    {!sidebarCollapsed && (
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] px-3 pb-1.5">
                            Management Menu
                        </div>
                    )}

                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={({ isActive }) => cn(
                                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative', 
                                    isActive ? 'bg-[#242424] text-white font-semibold' : 'text-[#9A9A9A] hover:text-white hover:bg-[#242424]/60'
                                )}
                                title={sidebarCollapsed ? item.label : undefined}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (<span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#B08D57] rounded-r-sm" />)}
                                        <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-[#B08D57]' : 'text-[#9A9A9A] group-hover:text-white')} />
                                        {!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
                                        {!sidebarCollapsed && item.badge !== undefined && (
                                            <span className={cn('px-1.5 py-0.2 text-[10px] font-bold rounded-md ml-auto shrink-0', item.badgeColor || 'bg-[#242424] text-[#9A9A9A]')}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {sidebarCollapsed && item.badge !== undefined && (<span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B08D57]" />)}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>

                {/* Logout Footer */}
                <div className="p-4 border-t border-[#282828] bg-[#141414]">
                    <button 
                        type="button" 
                        onClick={() => setLogoutDialogOpen(true)} 
                        className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all text-[#9A9A9A] hover:text-[#B94A48] hover:bg-[#B94A48]/10 cursor-pointer",
                            sidebarCollapsed && "justify-center px-0"
                        )}
                        title="Logout Session"
                    >
                        <LogOut className="w-4 h-4" />
                        {!sidebarCollapsed && <span className="text-xs font-semibold">Logout Session</span>}
                    </button>
                </div>
            </aside>

            <ConfirmDialog 
                isOpen={logoutDialogOpen} 
                onClose={() => setLogoutDialogOpen(false)} 
                onConfirm={handleLogout} 
                title="Log Out" 
                message="Are you sure you want to end your active session? Unsaved changes may be lost." 
                confirmText="Log Out" 
                cancelText="Cancel" 
                type="warning" 
            />
        </>
    );
};

// Error se bachne ke liye default export bhi add kar diya hai
export default Sidebar;