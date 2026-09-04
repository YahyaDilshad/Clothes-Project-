import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
    Sparkles, AlertCircle, KeyRound, 
    Package, TrendingUp 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js'; 
import Logo from '../../../assets/logo.png'; 

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isAuthenticated, isLoading, error: storeError } = useAuthStore();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState(null);

// Sirf isAuthenticated badalne par check karein
useEffect(() => {
    if (isAuthenticated) {
        // Sirf aik baar navigate karein
        const destination = location.state?.from?.pathname || '/';
        
        // Check karein ke kahin hum pehle se hi destination par to nahi?
        if (window.location.pathname === '/login') {
            navigate(destination, { replace: true });
        }
    }
}, [isAuthenticated, navigate]); // Yahan se 'location' nikal diya gaya hai

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError(null);
        if (!username.trim() || !password.trim()) {
            setLocalError('Please enter both username and password.');
            return;
        }
        const result = await login(username, password);
        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    };

    const handleQuickFill = () => {
        setUsername('Faisal Kamir');
        setPassword('Faisalkamir1212');
        setLocalError(null);
    };

    const displayError = localError || storeError;

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-neutral-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#B08D57]/10 rounded-full blur-3xl pointer-events-none"/>
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#B08D57]/5 rounded-full blur-3xl pointer-events-none"/>

            <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
                
                {/* LEFT SECTION */}
                <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-10 bg-[#050505] border-r border-neutral-800">
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-5">
                        <img src={Logo} alt="BG" className="w-full h-full object-contain scale-150 grayscale" />
                    </div>

                    {/* LARGE LOGO AREA - Desktop */}
                    <div className="relative z-10 flex flex-col items-start gap-6">
                        <div className="w-28 h-28 flex items-center justify-center shrink-0 bg-white/5 rounded-2xl p-2 border border-white/10 shadow-2xl">
                            <img src={Logo} alt="Faisal Kamir Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-[0.3em] uppercase font-serif">Faisal Kamir</h1>
                            <p className="text-[10px] text-[#B08D57] font-medium tracking-[0.4em] uppercase mt-1">Fabrics & Cloth House</p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-neutral-400 mb-4">
                            <Sparkles className="w-3 h-3 text-[#B08D57]"/>
                            <span>Enterprise Core v2.4</span>
                        </div>
                        <h2 className="text-3xl font-serif font-medium text-white leading-tight">Authentic Craft,<br/>Digital Precision.</h2>
                        <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-xs">
                            Access the central control unit for inventory, artisan management, and luxury retail operations.
                        </p>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-tighter"><TrendingUp className="w-3 h-3 text-emerald-500"/> Revenue</div>
                            <p className="text-sm font-bold text-white tracking-tight">Active</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-tighter"><Package className="w-3 h-3 text-[#B08D57]"/> Inventory</div>
                            <p className="text-sm font-bold text-white tracking-tight">Synced</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="lg:col-span-7 p-8 sm:p-12 xl:p-16 bg-[#0d0d0d] flex flex-col justify-center">
                    
                    {/* LARGE LOGO AREA - Mobile */}
                    <div className="flex lg:hidden flex-col items-center justify-center gap-4 mb-10">
                        <div className="w-20 h-20 p-2 bg-white/5 rounded-xl border border-white/10">
                             <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-lg font-bold text-white tracking-widest uppercase font-serif">Faisal Kamir</h1>
                            <p className="text-[10px] text-[#B08D57] uppercase tracking-[0.3em]">Admin Portal</p>
                        </div>
                    </div>

                    <div className="max-w-sm mx-auto w-full space-y-8">
                        <div className="text-center lg:text-left space-y-2">
                            <h2 className="text-2xl font-bold text-white tracking-tight font-serif italic">Administrator Login</h2>
                            <p className="text-xs text-neutral-500">Provide your credentials to manage the couture house.</p>
                        </div>

                        {/* Quick Fill Box */}
                        <div className="p-4 rounded-2xl bg-[#151515] border border-neutral-800 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#B08D57]/10 rounded-xl text-[#B08D57]"><KeyRound className="w-4 h-4"/></div>
                                <div className="text-[10px] text-neutral-400 font-mono">
                                    <span className="text-white font-bold uppercase">Faisal Kamir</span> / <span className="text-white font-bold uppercase tracking-widest">••••••••</span>
                                </div>
                            </div>
                            <button type="button" onClick={handleQuickFill} className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-lg text-[10px] font-black uppercase transition-all">Fill</button>
                        </div>

                        {displayError && (
                            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[11px] flex items-center gap-2 animate-pulse">
                                <AlertCircle className="w-4 h-4 shrink-0" /> {displayError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-700 outline-none focus:border-[#B08D57] transition-all" placeholder="Enter username" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 bg-[#050505] border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-700 outline-none focus:border-[#B08D57] transition-all" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white">
                                        {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                                    </button>
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white hover:bg-[#f0f0f0] text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50">
                                {isLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <>Access System <ArrowRight className="w-4 h-4"/></>}
                            </button>
                        </form>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-neutral-600 font-medium">
                            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Secure Session</div>
                            <div className="tracking-tighter uppercase">© 2026 Faisal Kamir</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};