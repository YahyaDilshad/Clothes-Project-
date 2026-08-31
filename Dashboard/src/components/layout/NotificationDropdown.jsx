import React, { useState, useRef, useEffect } from 'react';
import { Bell, ShoppingBag, AlertTriangle, RotateCcw, UserPlus, CheckCheck, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
export const NotificationDropdown = () => {
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const getIcon = (type) => {
        switch (type) {
            case 'order':
                return <ShoppingBag className="w-4 h-4 text-[#181818]"/>;
            case 'inventory':
                return <AlertTriangle className="w-4 h-4 text-[#B8863B]"/>;
            case 'return':
                return <RotateCcw className="w-4 h-4 text-[#B94A48]"/>;
            case 'customer':
                return <UserPlus className="w-4 h-4 text-[#64748B]"/>;
            default:
                return <Info className="w-4 h-4 text-[#6B6B6B]"/>;
        }
    };
    return (<div className="relative" ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} aria-label="Notifications" className="relative p-2 rounded-lg text-[#6B6B6B] hover:text-[#181818] hover:bg-[#F7F6F2] transition-colors cursor-pointer">
        <Bell className="w-5 h-5"/>
        {unreadCount > 0 && (<span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#B08D57] text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {unreadCount}
          </span>)}
      </button>

      {isOpen && (<div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-[#E7E5E0] z-50 overflow-hidden animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E7E5E0] bg-[#F7F6F2]/70">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#181818] uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (<span className="bg-[#181818] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {unreadCount} new
                </span>)}
            </div>
            {unreadCount > 0 && (<button onClick={markAllNotificationsAsRead} className="text-[11px] font-medium text-[#6B6B6B] hover:text-[#181818] flex items-center gap-1 transition-colors cursor-pointer">
                <CheckCheck className="w-3.5 h-3.5 text-[#B08D57]"/>
                Mark all read
              </button>)}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#E7E5E0]">
            {notifications.length === 0 ? (<div className="py-8 text-center text-xs text-[#9A9A9A]">No notifications</div>) : (notifications.map((n) => (<div key={n.id} onClick={() => {
                    markNotificationAsRead(n.id);
                    if (n.link) {
                        navigate(n.link);
                        setIsOpen(false);
                    }
                }} className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${n.isRead ? 'bg-white hover:bg-[#F7F6F2]' : 'bg-[#F7F6F2]/60 hover:bg-[#F7F6F2]'}`}>
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 mt-0.5 border border-[#E7E5E0]">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-semibold text-[#181818] truncate">{n.title}</p>
                      <span className="text-[10px] text-[#9A9A9A] whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#6B6B6B] mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                  {!n.isRead && (<span className="w-2 h-2 rounded-full bg-[#B08D57] shrink-0 mt-1.5"/>)}
                </div>)))}
          </div>

          <div className="p-2.5 border-t border-[#E7E5E0] bg-[#F7F6F2] text-center">
            <button onClick={() => {
                navigate('/orders');
                setIsOpen(false);
            }} className="text-[11px] font-medium text-[#181818] hover:text-[#B08D57] transition-colors cursor-pointer">
              View Order Feed →
            </button>
          </div>
        </div>)}
    </div>);
};
