import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginAdmin } from '../../lib/adminUtils';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'creds' | 'pin'>('creds');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setStep('pin');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;
    
    setIsVerifying(true);
    setError(false);
    
    setTimeout(() => {
      if (loginAdmin(username, password, pin)) {
        onLogin();
      } else {
        setError(true);
        setPin('');
        // If wrong creds + pin, maybe reset to step 1
        // For now just error on pin
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[40px] p-10 card-shadow border border-primary/5 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          
          <div className="relative z-10 text-center space-y-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-primary/10 text-primary mb-2 shadow-inner">
              <ShieldCheck size={48} />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-heading uppercase tracking-[0.2em]">Restricted</h1>
              <p className="text-xs text-body/40 font-bold uppercase tracking-widest">Authorized Personnel Only</p>
            </div>

            <AnimatePresence mode="wait">
              {step === 'creds' ? (
                <motion.form 
                  key="creds"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleNextStep} 
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-body/40 uppercase ml-4 tracking-widest">Username</label>
                      <input 
                        type="email"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-8 py-5 bg-secondary/80 rounded-3xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                        placeholder="admin@example.in"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-black text-body/40 uppercase ml-4 tracking-widest">Password</label>
                      <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-8 py-5 bg-secondary/80 rounded-3xl border border-primary/5 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-bold text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-primary text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    Next Step <ArrowRight size={18} />
                  </button>
                </motion.form>
              ) : (
                <motion.form 
                  key="pin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-black text-body/40 uppercase tracking-widest">Enter Verification Code</p>
                    {/* PIN Display */}
                    <div className="flex justify-center gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-10 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                            pin.length > i 
                              ? 'border-primary bg-primary/5' 
                              : error 
                                ? 'border-red-500 bg-red-50' 
                                : 'border-primary/10 bg-secondary/50'
                          }`}
                        >
                          {pin.length > i && (
                            <div className="w-3 h-3 rounded-full bg-primary animate-in zoom-in" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-wider"
                      >
                        <AlertCircle size={14} />
                        Authentication Failed
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Number Pad */}
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleDigitClick(num.toString())}
                        className="h-16 rounded-[24px] bg-secondary/50 hover:bg-primary hover:text-white text-heading font-black text-xl transition-all active:scale-95 border border-primary/5"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="h-16 rounded-[24px] bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center active:scale-95"
                    >
                      <X size={24} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDigitClick('0')}
                      className="h-16 rounded-[24px] bg-secondary/50 hover:bg-primary hover:text-white text-heading font-black text-xl transition-all active:scale-95 border border-primary/5"
                    >
                      0
                    </button>
                    <button
                      type="submit"
                      disabled={pin.length !== 6 || isVerifying}
                      className={`h-16 rounded-[24px] flex items-center justify-center transition-all active:scale-95 ${
                        pin.length === 6 && !isVerifying
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'bg-primary/20 text-white cursor-not-allowed'
                      }`}
                    >
                      {isVerifying ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Lock size={24} />
                      )}
                    </button>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setStep('creds')}
                    className="text-[10px] font-black text-body/30 hover:text-primary uppercase tracking-widest transition-colors"
                  >
                    Back to Credentials
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
