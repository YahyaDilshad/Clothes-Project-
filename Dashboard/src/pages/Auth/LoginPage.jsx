import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, AlertCircle, KeyRound, CheckCircle2, Package, TrendingUp, } from 'lucide-react';
import { useApp } from '../../context/AppContext';
export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, login } = useApp();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (!username.trim()) {
            setError('Please enter your username.');
            return;
        }
        if (!password.trim()) {
            setError('Please enter your password.');
            return;
        }
        setIsLoading(true);
        // Subtle natural verification delay for security feel
        setTimeout(() => {
            const result = login(username, password);
            setIsLoading(false);
            if (result.success) {
                const from = location.state?.from?.pathname || '/';
                navigate(from, { replace: true });
            }
            else {
                setError(result.message || 'Invalid username or password.');
            }
        }, 400);
    };
    const handleQuickFill = () => {
        setUsername('apexiums');
        setPassword('apexiums1212');
        setError(null);
    };
    return (<div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none"/>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neutral-800/20 rounded-full blur-3xl pointer-events-none"/>

      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-neutral-900 border border-neutral-800/90 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        
        {/* Left Editorial Visual Section */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 xl:p-10 bg-neutral-950 overflow-hidden border-r border-neutral-800/80">
          {/* Background Fashion Imagery */}
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=85" alt="Haute Couture Apparel" className="w-full h-full object-cover opacity-35 filter grayscale contrast-125"/>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40"/>
          </div>

          {/* Top Brand Mark */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-serif font-black text-xl shadow-lg tracking-wider">
                A
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-widest uppercase font-serif">
                  APEXIUMS
                </h1>
                <p className="text-[10px] text-neutral-400 font-medium tracking-widest uppercase">
                  Haute Couture & Ready-to-Wear
                </p>
              </div>
            </div>
          </div>

          {/* Center Brand Philosophy */}
          <div className="relative z-10 my-auto py-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-neutral-300 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300"/>
              <span>Enterprise Admin Suite</span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-serif font-semibold text-white leading-tight">
              Sovereign craft meets modern commerce.
            </h2>
            <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
              Unified operational control for catalog curation, bespoke inventory, multi-city logistics, and customer VIP management.
            </p>
          </div>

          {/* Bottom Live Metrics Pill */}
          <div className="relative z-10 grid grid-cols-2 gap-3 pt-6 border-t border-neutral-800/80">
            <div className="bg-neutral-900/80 backdrop-blur-md p-3 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400"/>
                <span>Monthly Volume</span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">₨5,284,500</p>
            </div>
            <div className="bg-neutral-900/80 backdrop-blur-md p-3 rounded-2xl border border-neutral-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                <Package className="w-3.5 h-3.5 text-amber-400"/>
                <span>Catalog Units</span>
              </div>
              <p className="text-sm font-bold text-white mt-0.5">1,248 Garments</p>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-10 xl:p-12 flex flex-col justify-between bg-neutral-900">
          <div>
            {/* Mobile Header */}
            <div className="flex lg:hidden items-center gap-3 mb-6 pb-4 border-b border-neutral-800">
              <div className="w-9 h-9 rounded-xl bg-white text-neutral-950 flex items-center justify-center font-serif font-black text-lg">
                A
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-widest uppercase font-serif">
                  APEXIUMS
                </h1>
                <p className="text-[10px] text-neutral-400 uppercase">Management Portal</p>
              </div>
            </div>

            {/* Portal Title & Subtitle */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-serif">
                Sign In to Dashboard
              </h2>
              <p className="text-xs text-neutral-400">
                Enter your authorized credentials to access the central management console.
              </p>
            </div>

            {/* Quick Demo Credentials Autofill Banner */}
            <div className="mt-5 p-3.5 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-neutral-700/50 text-amber-400 shrink-0">
                  <KeyRound className="w-4 h-4"/>
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-200">Required Credentials:</div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    User: <span className="text-white font-bold">apexiums</span> &bull; Pass: <span className="text-white font-bold">apexiums1212</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={handleQuickFill} className="px-3 py-1.5 bg-neutral-100 hover:bg-white text-neutral-950 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900"/>
                <span>Auto-Fill</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (<div className="mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5"/>
                <div>
                  <p className="font-semibold text-rose-200">Access Denied</p>
                  <p className="text-[11px] text-rose-300/90 mt-0.5">{error}</p>
                </div>
              </div>)}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Username field */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <User className="w-4 h-4"/>
                  </div>
                  <input type="text" required autoFocus value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter apexiums" className="w-full pl-10 pr-4 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 font-medium focus:outline-hidden focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"/>
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Password
                  </label>
                  <span className="text-[11px] text-neutral-500">apexiums1212</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Lock className="w-4 h-4"/>
                  </div>
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter apexiums1212" className="w-full pl-10 pr-10 py-2.5 bg-neutral-950 border border-neutral-700/80 rounded-xl text-xs text-white placeholder-neutral-500 font-medium focus:outline-hidden focus:border-neutral-400 focus:ring-1 focus:ring-neutral-400 transition-all"/>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              {/* Remember Me & Help */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-400 hover:text-neutral-300">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-neutral-700 bg-neutral-950 text-neutral-100 focus:ring-neutral-400 focus:ring-offset-neutral-900"/>
                  <span>Remember this workstation</span>
                </label>
                <span className="text-[11px] text-neutral-500">Super Admin Clearance</span>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoading} className="w-full py-3 px-4 mt-2 bg-white hover:bg-neutral-100 disabled:bg-neutral-300 text-neutral-950 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 group cursor-pointer">
                {isLoading ? (<>
                    <div className="w-4 h-4 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"/>
                    <span>Verifying Credentials...</span>
                  </>) : (<>
                    <span>Enter Management Dashboard</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"/>
                  </>)}
              </button>
            </form>
          </div>

          {/* Footer Security Badging */}
          <div className="mt-8 pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400"/>
              <span>TLS 256-bit Encrypted Session</span>
            </div>
            <div>&copy; 2026 APEXIUMS COUTURE &bull; v2.4.0</div>
          </div>
        </div>
      </div>
    </div>);
};
