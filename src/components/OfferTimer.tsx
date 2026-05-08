import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Check, Copy } from 'lucide-react';

const OfferTimer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
    isExpired: false
  });

  useEffect(() => {
    // Target: February 28, 2026
    const targetDate = new Date('February 28, 2026 23:59:59').getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs, isExpired: false });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('MOMENT10');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-primary to-[#ff512f] p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-primary/20 text-center relative overflow-hidden text-white"
    >
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />

      <div className="inline-flex items-center gap-2 bg-white/10 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-sm">
        <Zap size={10} fill="currentColor" /> Offer Ends Feb 28
      </div>
      
      <h2 className="text-xl md:text-2xl font-black text-white mb-6 tracking-tight">
        Unlock Premium Templates
      </h2>

      <div className="flex justify-center gap-2 md:gap-4 mb-8">
        {[
          { label: 'Days', val: timeLeft.days },
          { label: 'Hours', val: timeLeft.hours },
          { label: 'Mins', val: timeLeft.mins },
          { label: 'Secs', val: timeLeft.secs }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 text-white rounded-xl flex items-center justify-center text-lg md:text-xl font-black mb-2 transition-transform hover:scale-105 border border-white/20 backdrop-blur-sm">
              {String(item.val).padStart(2, '0')}
            </div>
            <span className="text-[7px] md:text-[9px] font-bold text-white/60 uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="max-w-xs mx-auto space-y-4">
        <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between border border-white/20 gap-4 group transition-all">
          <div className="flex flex-col items-start min-w-0">
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Promo Code</span>
            <span className="text-sm font-black text-white tracking-widest uppercase block truncate">MOMENT10</span>
          </div>
          <button 
            onClick={handleCopy}
            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              copied ? 'bg-emerald-500 text-white' : 'bg-white text-primary hover:scale-110 active:scale-95'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        
        <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Flash Sale Live!</p>
        <p className="text-white/40 text-[8px] font-medium uppercase tracking-widest">Valid until Feb 28, 2026 • 11:59 PM</p>
      </div>
    </motion.div>
  );
};

export default OfferTimer;
