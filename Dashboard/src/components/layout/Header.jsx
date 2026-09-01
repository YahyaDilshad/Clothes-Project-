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

        {/* Notifications dropdown */}
        <NotificationDropdown />

        
        </div>
    </header>);
};
