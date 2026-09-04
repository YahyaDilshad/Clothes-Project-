import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Lock, Save, RotateCcw, 
    ChevronRight, Info, Loader2 
} from 'lucide-react';
import { useProductStore } from '../../store/usePermissionstore.js';
import { cn } from '../../utils/cn';

const Permissions = () => {
    // Zustand Store se functions aur state nikalna
    const { 
        roles = [], 
        activeRolePermissions = {}, 
        fetchPermissionsByRole, 
        togglePermission, 
        saveRolePermissions,
        isLoading 
    } = useProductStore();

    // Local state for selected role
    const [activeRole, setActiveRole] = useState("Manager");

    // Safety: ensure permissions is always an object
    const permissions = activeRolePermissions || {};

    // 1. Role change hone par data fetch karein
    useEffect(() => {
        if (fetchPermissionsByRole) {
            fetchPermissionsByRole(activeRole);
        }
    }, [activeRole, fetchPermissionsByRole]);

    // 2. Logic: Toggle individual permission
    const handleToggle = (module, action) => {
        // Administrator role is system-locked (Security logic)
        if (activeRole === "Administrator") return; 
        
        if (togglePermission) {
            togglePermission(module, action);
        }
    };

    // 3. Logic: Save Permissions
    const handleSave = async () => {
        if (saveRolePermissions) {
            await saveRolePermissions(activeRole);
        }
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12 px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#B08D57]"/> 
                        Role Permissions
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                        Define what each user role can see and do within the Faisal Kamir management system.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => fetchPermissionsByRole(activeRole)} 
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-all disabled:opacity-50"
                    >
                        <RotateCcw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}/> Reset
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={activeRole === "Administrator" || isLoading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Save className="w-3.5 h-3.5"/>}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Side: Role Selector */}
                <div className="lg:col-span-1 space-y-3">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-2">Select Role</p>
                    <div className="space-y-1">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border",
                                    activeRole === role 
                                    ? "bg-neutral-900 border-neutral-900 text-white shadow-lg" 
                                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-900"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className={cn("w-4 h-4", activeRole === role ? "text-[#B08D57]" : "text-neutral-300")}/>
                                    {role}
                                </div>
                                <ChevronRight className={cn("w-3.5 h-3.5 transition-transform", activeRole === role ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0")}/>
                            </button>
                        ))}
                    </div>

                    {/* Security Notice */}
                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl">
                        <div className="flex gap-3 text-amber-800">
                            <Info className="w-5 h-5 shrink-0 mt-0.5"/>
                            <p className="text-[10px] leading-relaxed font-bold uppercase tracking-tight">
                                Administrator permissions are system-locked for security and cannot be modified via this panel.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Permissions Matrix */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[2rem] border border-neutral-200 shadow-2xs overflow-hidden relative min-h-[400px]">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[#B08D57]" />
                            </div>
                        )}
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-black uppercase text-[10px] tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-5">Module / Feature</th>
                                        <th className="px-4 py-5 text-center">View</th>
                                        <th className="px-4 py-5 text-center">Create</th>
                                        <th className="px-4 py-5 text-center">Edit</th>
                                        <th className="px-4 py-5 text-center">Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {Object.keys(permissions).length > 0 ? (
                                        Object.keys(permissions).map((module) => (
                                            <tr key={module} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-black text-neutral-900 uppercase tracking-tighter">{module}</span>
                                                        <span className="text-[10px] text-neutral-400 font-medium">Full access to {module.toLowerCase()}</span>
                                                    </div>
                                                </td>
                                                
                                                {['view', 'create', 'edit', 'delete'].map((action) => (
                                                    <td key={action} className="px-4 py-5 text-center">
                                                        <PermissionToggle 
                                                            active={permissions[module]?.[action] || false} 
                                                            disabled={activeRole === "Administrator"}
                                                            onClick={() => handleToggle(module, action)} 
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-20 text-center text-neutral-400 font-bold uppercase tracking-widest">
                                                No modules found for this role.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="p-5 bg-neutral-50 border-t border-neutral-100 flex justify-end items-center gap-4">
                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest italic">
                                * System Audit: All permission changes are logged.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Custom Toggle Switch Component
 */
const PermissionToggle = ({ active, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-300 outline-none",
                active ? "bg-[#B08D57]" : "bg-neutral-200",
                disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-105 active:scale-95"
            )}
        >
            <span
                className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 shadow-sm",
                    active ? "translate-x-5.5" : "translate-x-1"
                )}
            />
        </button>
    );
};

export default Permissions;