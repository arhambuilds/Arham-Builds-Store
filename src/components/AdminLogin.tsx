import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, User, Key, ShieldCheck, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Credentials, 2: Verification

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('adminToken');
    if (isAdmin) navigate('/admin/dashboard');
  }, [navigate]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'arhamadib@admin.in' && password === 'admin@2728') {
      setStep(2);
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification
    setTimeout(() => {
      if (verificationCode === '271211') {
        sessionStorage.setItem('adminToken', 'verified-' + Date.now());
        navigate('/admin/dashboard');
      } else {
        setError('Invalid verification code.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] card-shadow border border-primary/5 p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-heading uppercase tracking-widest">Admin Access</h1>
          <p className="text-xs text-body/40 font-bold mt-2 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleNext} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-body/40 ml-4">Username</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-body/30 group-focus-within:text-primary transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-secondary border border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-heading transition-all outline-none card-shadow-inset"
                    placeholder="Enter admin email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-body/40 ml-4">Password</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-body/30 group-focus-within:text-primary transition-colors">
                    <Key size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-secondary border border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-14 pr-14 text-sm font-bold text-heading transition-all outline-none card-shadow-inset"
                    placeholder="Enter password"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-body/30 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[10px] font-black text-primary text-center uppercase tracking-widest pt-2"
                >
                  {error}
                </motion.p>
              )}

              <button 
                type="submit"
                className="w-full bg-heading text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-heading/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8"
              >
                Continue <ArrowRight size={16} />
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerify} 
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-body/40 ml-4">6-Digit Code</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-body/30 group-focus-within:text-primary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input 
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-secondary border border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-2xl font-black tracking-[0.4em] text-heading text-center transition-all outline-none card-shadow-inset"
                    placeholder="000000"
                    required
                  />
                </div>
                <p className="text-[10px] text-body/40 text-center font-bold uppercase tracking-widest mt-4">Verification code required for security</p>
              </div>

              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[10px] font-black text-primary text-center uppercase tracking-widest pt-2"
                >
                  {error}
                </motion.p>
              )}

              <button 
                disabled={isLoading}
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Verify & Login <ArrowRight size={16} /></>}
              </button>

              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-[10px] font-black text-body/40 uppercase tracking-widest hover:text-primary transition-colors"
              >
                Go Back
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
