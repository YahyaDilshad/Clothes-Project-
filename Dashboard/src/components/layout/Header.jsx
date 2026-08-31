import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Plus, ExternalLink, ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Link, useNavigate } from 'react-router-dom';
export const Header = ({ title, breadcrumbs }) => {
    const { setMobileMenuOpen, setSearchModalOpen, currentUser, logout } = useApp();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const navigate = useNavigate();
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleLogout = () => {
        setUserMenuOpen(false);
        logout();
        navigate('/login');
    };
    return (<header className="sticky top-0 z-30 h-16 bg-white border-b border-[#E7E5E0] px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left section: mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button type="button" onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg text-[#6B6B6B] hover:bg-[#F7F6F2] hover:text-[#181818] transition-colors cursor-pointer" aria-label="Open menu">
          <Menu className="w-5 h-5"/>
        </button>

        <div className="min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 ? (<nav className="flex items-center gap-1.5 text-xs text-[#6B6B6B] font-medium">
              {breadcrumbs.map((b, idx) => (<React.Fragment key={idx}>
                  {idx > 0 && <span className="text-[#9A9A9A]">/</span>}
                  {b.path ? (<Link to={b.path} className="hover:text-[#181818] transition-colors truncate">
                      {b.label}
                    </Link>) : (<span className="text-[#181818] font-semibold truncate">{b.label}</span>)}
                </React.Fragment>))}
            </nav>) : (<h1 className="text-base sm:text-lg font-semibold text-[#181818] tracking-tight truncate">
              {title || 'Dashboard'}
            </h1>)}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Search button */}
        <button type="button" onClick={() => setSearchModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F6F2] hover:bg-[#EAE8E3] border border-[#E7E5E0] text-xs text-[#6B6B6B] font-medium transition-colors cursor-pointer">
          <Search className="w-4 h-4 text-[#6B6B6B]"/>
          <span className="hidden sm:inline">Search catalog & orders...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#6B6B6B] bg-white rounded border border-[#E7E5E0]">
            ⌘K
          </kbd>
        </button>

        {/* Currency pill */}
        <div className="hidden md:flex items-center px-2.5 py-1 rounded-md bg-[#F7F6F2] text-[11px] font-medium text-[#181818] border border-[#E7E5E0]">
          PKR ₨
        </div>

        {/* Quick Add Product action */}
        <button onClick={() => navigate('/products/new')} className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] hover:bg-[#2A2A2A] text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer">
          <Plus className="w-3.5 h-3.5"/>
          <span>Add Product</span>
        </button>

        {/* Storefront preview link */}
        <a href="#storefront" onClick={(e) => {
            e.preventDefault();
            window.open('/', '_blank');
        }} className="hidden xl:inline-flex items-center gap-1 text-xs font-medium text-[#6B6B6B] hover:text-[#181818] px-2.5 py-1.5 rounded-lg hover:bg-[#F7F6F2] transition-colors" title="Visit Public Storefront">
          <ExternalLink className="w-3.5 h-3.5 text-[#B08D57]"/>
          <span>Storefront</span>
        </a>

        {/* Notifications dropdown */}
        <NotificationDropdown />

        {/* User avatar pill & dropdown */}
        <div className="relative pl-2 border-l border-[#E7E5E0]" ref={userMenuRef}>
          <button type="button" onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#F7F6F2] transition-colors focus:outline-hidden cursor-pointer" aria-expanded={userMenuOpen}>
            <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-lg object-cover border border-[#E7E5E0]"/>
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-[#181818] leading-none">{currentUser.name}</div>
              <div className="text-[10px] text-[#9A9A9A] mt-0.5">{currentUser.role}</div>
            </div>
            <ChevronDown className="hidden md:block w-3.5 h-3.5 text-[#6B6B6B]"/>
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (<div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E7E5E0] rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
              <div className="px-3 py-2 border-b border-[#E7E5E0]">
                <p className="text-xs font-semibold text-[#181818]">{currentUser.name}</p>
                <p className="text-[11px] text-[#6B6B6B] font-mono truncate">{currentUser.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#181818] text-white">
                  <Shield className="w-2.5 h-2.5 text-[#B08D57]"/>
                  {currentUser.role}
                </span>
              </div>

              <div className="py-1">
                <Link to="/users" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#181818] hover:bg-[#F7F6F2] transition-colors">
                  <User className="w-4 h-4 text-[#6B6B6B]"/>
                  <span>Team & Permissions</span>
                </Link>
                <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#181818] hover:bg-[#F7F6F2] transition-colors">
                  <Settings className="w-4 h-4 text-[#6B6B6B]"/>
                  <span>Store Settings</span>
                </Link>
              </div>

              <div className="border-t border-[#E7E5E0] pt-1 mt-1">
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-[#B94A48] hover:bg-[#B94A48]/10 transition-colors text-left cursor-pointer">
                  <LogOut className="w-4 h-4 text-[#B94A48]"/>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>)}
        </div>
      </div>
    </header>);
};
