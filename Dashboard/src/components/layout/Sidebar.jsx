import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Boxes, Users, Grid, Layers, Tag, RotateCcw, BarChart3, Globe, ShieldCheck, Settings, LogOut, ChevronLeft, ChevronRight, Sparkles, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { cn } from '../../utils/cn';
export const Sidebar = () => {
    const { sidebarCollapsed, setSidebarCollapsed, mobileMenuOpen, setMobileMenuOpen, currentUser, orders, inventory, returns, logout, } = useApp();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    const navigate = useNavigate();
    // Badges calculation
    const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
    const lowStockCount = inventory.filter((i) => i.status === 'Low Stock' || i.status === 'Out of Stock').length;
    const pendingReturnsCount = returns.filter((r) => r.status === 'Requested').length;
    const navItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Orders', path: '/orders', icon: ShoppingBag, badge: pendingOrdersCount ? pendingOrdersCount : undefined, badgeColor: 'bg-[#B8863B]/20 text-[#B8863B]' },
        { label: 'Products', path: '/products', icon: Package },
        { label: 'Inventory', path: '/inventory', icon: Boxes, badge: lowStockCount ? lowStockCount : undefined, badgeColor: 'bg-[#B94A48]/20 text-[#B94A48]' },
        { label: 'Customers', path: '/customers', icon: Users },
        { label: 'Categories', path: '/categories', icon: Grid },
        { label: 'Collections', path: '/collections', icon: Layers },
        { label: 'Discounts', path: '/discounts', icon: Tag },
        { label: 'Returns & Exchanges', path: '/returns', icon: RotateCcw, badge: pendingReturnsCount ? pendingReturnsCount : undefined, badgeColor: 'bg-[#64748B]/20 text-[#64748B]' },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Users & Roles', path: '/users', icon: ShieldCheck },
        { label: 'Settings', path: '/settings', icon: Settings },
    ];
    const handleLogout = () => {
        logout();
        setLogoutDialogOpen(false);
        navigate('/login');
    };
    return (<>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (<div className="fixed inset-0 bg-[#181818]/60 backdrop-blur-xs z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}/>)}

      <aside className={cn('fixed top-0 left-0 bottom-0 z-40 bg-[#181818] text-[#9A9A9A] flex flex-col border-r border-[#282828] transition-all duration-300 ease-in-out', sidebarCollapsed ? 'w-20' : 'w-64', mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4.5 border-b border-[#282828]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white text-[#181818] flex items-center justify-center font-serif font-bold text-base tracking-wider shrink-0 shadow-xs">
              A
            </div>
            {!sidebarCollapsed && (<div className="min-w-0">
                <h1 className="text-xs font-bold text-white tracking-widest uppercase font-serif truncate">
                  APEXIUMS
                </h1>
                <p className="text-[10px] text-[#9A9A9A] tracking-wider uppercase truncate">
                  Admin Panel
                </p>
              </div>)}
          </div>

          {/* Desktop collapse toggle */}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex items-center justify-center w-6 h-6 rounded-md text-[#9A9A9A] hover:text-white hover:bg-[#242424] transition-colors cursor-pointer" title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}>
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4"/> : <ChevronLeft className="w-4 h-4"/>}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {!sidebarCollapsed && (<div className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] px-3 pb-1.5">
              Store Management
            </div>)}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (<NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative', isActive
                    ? 'bg-[#242424] text-white font-semibold'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-[#242424]/60')} title={sidebarCollapsed ? item.label : undefined}>
                {({ isActive }) => (<>
                    {/* Gold indicator on the left for active menu */}
                    {isActive && (<span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#B08D57] rounded-r-sm"/>)}

                    <Icon className={cn('w-4 h-4 shrink-0 transition-colors', isActive ? 'text-[#B08D57]' : 'text-[#9A9A9A] group-hover:text-white')}/>
                    {!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
                    {!sidebarCollapsed && item.badge !== undefined && (<span className={cn('px-1.5 py-0.2 text-[10px] font-bold rounded-md ml-auto shrink-0', item.badgeColor || 'bg-[#242424] text-[#9A9A9A]')}>
                        {item.badge}
                      </span>)}
                    {sidebarCollapsed && item.badge !== undefined && (<span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B08D57]"/>)}
                  </>)}
              </NavLink>);
        })}
        </div>

        {/* Live Storefront Status Pill */}
        {!sidebarCollapsed && (<div className="p-3 mx-3 mb-2 rounded-xl bg-[#222222]/80 border border-[#2e2e2e]">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-200">
              <Sparkles className="w-3.5 h-3.5 text-[#B08D57] shrink-0"/>
              <span className="font-semibold text-xs text-white">Apexiums Online Store</span>
            </div>
            <p className="text-[10px] text-[#9A9A9A] mt-0.5">
              Storefront live &bull; PKR Currency
            </p>
          </div>)}

        {/* User Profile Footer */}
        <div className="p-3 border-t border-[#282828] bg-[#141414]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-lg object-cover border border-[#2e2e2e] shrink-0"/>
              {!sidebarCollapsed && (<div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-[#9A9A9A] truncate">{currentUser.role}</div>
                </div>)}
            </div>

            <button type="button" onClick={() => setLogoutDialogOpen(true)} className="p-1.5 rounded-lg text-[#9A9A9A] hover:text-[#B94A48] hover:bg-[#242424] transition-colors shrink-0 cursor-pointer" title="Logout">
              <LogOut className="w-4 h-4"/>
            </button>
          </div>
        </div>
      </aside>

      <ConfirmDialog isOpen={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} onConfirm={handleLogout} title="Log Out of Admin Panel" message={`Are you sure you want to end your active session as ${currentUser.name}?`} confirmText="Log Out" cancelText="Stay Signed In" type="warning"/>
    </>);
};
