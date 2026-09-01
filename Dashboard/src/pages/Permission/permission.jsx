import React, { useState } from 'react';
import { 
    ShieldCheck, 
    Lock, 
    Save, 
    RotateCcw, 
    CheckCircle2, 
    AlertCircle,
    Info,
    ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';

const Permissions = () => {
    // 1. Roles Definition
    const roles = ["Administrator", "Manager", "Support", "Inventory Staff"];
    const [activeRole, setActiveRole] = useState("Manager");

    // 2. Modules & Permissions State
    // Default data structure for permissions
    const [permissions, setPermissions] = useState({
        Dashboard: { view: true, create: false, edit: false, delete: false },
        Products: { view: true, create: true, edit: true, delete: false },
        Orders: { view: true, create: true, edit: true, delete: true },
        Billing: { view: true, create: false, edit: false, delete: false },
        Staff: { view: false, create: false, edit: false, delete: false },
        Expenses: { view: true, create: true, edit: false, delete: false },
        Stocks: { view: true, create: true, edit: true, delete: false },
    });

    // 3. Logic: Toggle individual permission
    const handleToggle = (module, action) => {
        if (activeRole === "Administrator") return; // Admin permissions are locked

        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module],
                [action]: !prev[module][action]
            }
        }));
    };

    // 4. Logic: Save Permissions
    const handleSave = () => {
        alert(`Permissions for ${activeRole} have been updated successfully!`);
    };

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-serif">
                    <h2 className="text-xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
                        <Lock className="w-5 h-5 text-[#B08D57]"/> Role Permissions
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">Define what each user role can see and do within the system.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => window.location.reload()} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-200 text-neutral-600 rounded-xl text-xs font-semibold hover:bg-neutral-50 transition-all">
                        <RotateCcw className="w-3.5 h-3.5"/> Reset
                    </button>
                    <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all shadow-sm shadow-neutral-900/10">
                        <Save className="w-3.5 h-3.5"/> Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Side: Role Selector */}
                <div className="lg:col-span-1 space-y-3">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2">Select Role</p>
                    <div className="space-y-1">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => setActiveRole(role)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border",
                                    activeRole === role 
                                    ? "bg-neutral-900 border-neutral-900 text-white shadow-md shadow-neutral-900/10" 
                                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className={cn("w-4 h-4", activeRole === role ? "text-[#B08D57]" : "text-neutral-300")}/>
                                    {role}
                                </div>
                                <ChevronRight className={cn("w-3.5 h-3.5", activeRole === role ? "opacity-100" : "opacity-0")}/>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="flex gap-2 text-amber-800">
                            <Info className="w-4 h-4 shrink-0 mt-0.5"/>
                            <p className="text-[10px] leading-relaxed font-medium">
                                <strong>Note:</strong> Administrator permissions are system-locked and cannot be modified.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Permissions Matrix */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 border-b border-neutral-100 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Module / Feature</th>
                                    <th className="px-4 py-4 text-center">View</th>
                                    <th className="px-4 py-4 text-center">Create</th>
                                    <th className="px-4 py-4 text-center">Edit</th>
                                    <th className="px-4 py-4 text-center">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {Object.keys(permissions).map((module) => (
                                    <tr key={module} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-neutral-900">{module}</span>
                                                <span className="text-[10px] text-neutral-400">Access to {module.toLowerCase()} management</span>
                                            </div>
                                        </td>
                                        
                                        {/* View Toggle */}
                                        <td className="px-4 py-4 text-center">
                                            <PermissionToggle 
                                                active={permissions[module].view} 
                                                disabled={activeRole === "Administrator"}
                                                onClick={() => handleToggle(module, 'view')} 
                                            />
                                        </td>

                                        {/* Create Toggle */}
                                        <td className="px-4 py-4 text-center">
                                            <PermissionToggle 
                                                active={permissions[module].create} 
                                                disabled={activeRole === "Administrator"}
                                                onClick={() => handleToggle(module, 'create')} 
                                            />
                                        </td>

                                        {/* Edit Toggle */}
                                        <td className="px-4 py-4 text-center">
                                            <PermissionToggle 
                                                active={permissions[module].edit} 
                                                disabled={activeRole === "Administrator"}
                                                onClick={() => handleToggle(module, 'edit')} 
                                            />
                                        </td>

                                        {/* Delete Toggle */}
                                        <td className="px-4 py-4 text-center">
                                            <PermissionToggle 
                                                active={permissions[module].delete} 
                                                disabled={activeRole === "Administrator"}
                                                onClick={() => handleToggle(module, 'delete')} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-end items-center gap-4">
                            <span className="text-[10px] text-neutral-400 font-medium italic">
                                * All changes are logged for security audits
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Internal Helper Component for Custom Toggle Switch
const PermissionToggle = ({ active, onClick, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition-colors outline-none",
                active ? "bg-[#B08D57]" : "bg-neutral-200",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
        >
            <span
                className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm",
                    active ? "translate-x-4.5" : "translate-x-1"
                )}
            />
        </button>
    );
};

export default Permissions;