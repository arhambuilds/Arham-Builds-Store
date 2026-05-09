import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, Zap, Check, Copy, Sparkles, Box, Heart, Music, 
  Layout, Users, PlayCircle, CalendarHeart, Cake, ArrowRight, X 
} from 'lucide-react';
import { HERO_DATA, PRODUCTS } from '../data';

interface HeroProps {
  onExplore?: () => void;
  onCategorySelect?: (category: string) => void;
  onShowHowItWorks?: () => void;
}

const PremiumDecoration = () => {
  const hearts = [
    { size: 24, top: '12%', left: '18%', color: 'text-primary/30', delay: '0s', rotate: 'rotate-12' },
    { size: 32, top: '40%', left: '8%', color: 'text-primary/20', delay: '1s', rotate: '-rotate-12' },
    { size: 20, top: '65%', left: '15%', color: 'text-primary/25', delay: '2s', rotate: 'rotate-45' },
    { size: 28, top: '15%', left: '80%', color: 'text-primary/30', delay: '0.5s', rotate: '-rotate-12' },
    { size: 18, top: '55%', left: '88%', color: 'text-primary/20', delay: '1.5s', rotate: 'rotate-12' },
  ];

  const sparkles = [
    { size: 28, top: '35%', right: '10%', color: 'text-yellow-500/30', delay: '0s' },
    { size: 20, top: '15%', right: '25%', color: 'text-blue-500/30', delay: '1.2s' },
    { size: 24, top: '75%', right: '20%', color: 'text-indigo-500/30', delay: '0.7s' },
    { size: 16, top: '25%', left: '35%', color: 'text-yellow-400/25', delay: '2.5s' },
    { size: 22, top: '80%', left: '40%', color: 'text-blue-400/25', delay: '3s' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {hearts.map((h, i) => (
        <motion.div 
          key={`heart-${i}`}
          className={`absolute animate-float-medium ${h.rotate}`}
          style={{ top: h.top, left: h.left }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: parseFloat(h.delay) }}
        >
          <Heart size={h.size} className={`${h.color} fill-current/10`} strokeWidth={1.5} />
        </motion.div>
      ))}

      {sparkles.map((s, i) => (
        <motion.div 
          key={`sparkle-${i}`}
          className="absolute animate-float-fast"
          style={{ top: s.top, right: s.right || 'auto', left: s.left || 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: parseFloat(s.delay) }}
        >
          <Sparkles size={s.size} className={s.color} strokeWidth={1.5} />
        </motion.div>
      ))}
      
      <div className="absolute top-[40%] left-[10%] opacity-10 animate-spin-slow">
        <Box size={40} className="text-primary" strokeWidth={1} />
      </div>

      <style>{`
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(25px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(15px, -15px) rotate(15deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-medium { animation: float-medium 10s infinite ease-in-out; }
        .animate-float-fast { animation: float-fast 8s infinite ease-in-out; }
        .animate-spin-slow { animation: spin-slow 40s infinite linear; }
      `}</style>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onExplore, onCategorySelect }) => {
  const [copied, setCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('TRYARHAM');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categories = [
    { name: 'Birthday', icon: <Cake size={28} />, color: 'from-[#3b82f6] to-[#2563eb]' },
    { name: 'Editing Assets', icon: <Zap size={28} />, color: 'from-[#f59e0b] to-[#ea580c]' },
    { name: 'Special', icon: <CalendarHeart size={28} />, color: 'from-[#fb7185] to-[#f43f5e]' },
    { name: 'Valentine', icon: <Heart size={28} />, color: 'from-[#a855f7] to-[#8b5cf6]' },
    { name: 'Freebies', icon: <Sparkles size={28} />, color: 'from-[#10b981] to-[#059669]' },
    { name: 'View All', icon: <Layout size={28} />, color: 'from-[#334155] to-[#1e293b]' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-secondary transition-colors">
      <div className="absolute inset-0 opacity-[0.2] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.15) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      <PremiumDecoration />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full card-shadow backdrop-blur-sm border border-white">
                <span className="bg-gradient-to-r from-primary to-[#ff512f] text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">India&apos;s #1</span>
                <span className="text-[10px] font-bold text-body/60 uppercase tracking-widest">Premium Store</span>
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-heading mb-6 leading-[1.1] tracking-tight"
            >
              <span className="block whitespace-nowrap">Special Moments.</span>
              <span className="block whitespace-nowrap text-primary">Lifetime Magic.</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-body/70 text-base md:text-lg max-w-2xl leading-relaxed mb-8 font-medium"
            >
              Gift a digital experience that lasts forever. High-performance <br className="hidden lg:block" /> templates for birthdays, anniversaries & more, starting at just <span className="text-primary font-black">₹28</span>.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col items-center lg:items-start gap-8 mb-12 w-full">
              <div className="flex flex-col w-full lg:w-fit items-center gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={onExplore}
                    className="w-full sm:w-auto px-10 py-5 bg-[#0a0a0b] text-white rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10"
                  >
                    <Zap size={18} fill="currentColor" />
                    EXPLORE TEMPLATES
                  </button>
                  <a 
                    href="https://t.me/arhambuilds"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-10 py-5 bg-[#00d084] text-white rounded-[2rem] flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#00d084]/20"
                  >
                    <Users size={18} />
                    JOIN COMMUNITY
                  </a>
                </div>
                
                <div className="flex flex-col items-center gap-8">
                  <button 
                    onClick={() => setShowHowItWorks(true)}
                    className="flex items-center gap-3 px-8 py-3 bg-[#f0f2f5] rounded-full text-[10px] font-black text-heading hover:bg-white transition-all shadow-sm uppercase tracking-widest group"
                  >
                    HOW IT WORKS
                    <div className="w-5 h-5 rounded-full border border-heading flex items-center justify-center">
                       <PlayCircle size={12} className="text-heading" />
                    </div>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className="w-10 h-10 rounded-full border-2 border-white bg-secondary overflow-hidden shadow-sm"
                        >
                          <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-dark flex items-center justify-center text-[10px] font-black text-white shadow-sm">10+</div>
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                       <div className="flex gap-0.5 mb-1">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />)}
                       </div>
                       <span className="text-[10px] font-black text-body/50 uppercase tracking-widest">Verified Customers</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Promo */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-5 w-full flex flex-col gap-6"
          >
            <div className="relative p-1 group -mt-24 lg:-mt-48 xl:-mt-56">
              {/* Marching Ants Border */}
              <div className="absolute inset-0 rounded-[2.2rem] pointer-events-none overflow-hidden">
                <svg className="absolute inset-0 w-full h-full">
                  <rect
                    x="2"
                    y="2"
                    width="calc(100% - 4px)"
                    height="calc(100% - 4px)"
                    rx="32"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    className="opacity-40"
                  >
                    <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
                  </rect>
                </svg>
              </div>
              
              <div className="bg-gradient-to-br from-primary to-[#ff512f] p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-primary/20 text-white relative flex flex-col items-center text-center break-inside-avoid aspect-square justify-center max-w-[300px] sm:max-w-[340px] mx-auto lg:max-w-none lg:w-[380px]">
                 {/* Decorative Blur */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />

                 <div className="bg-white/10 text-white border border-white/20 text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                   Welcome Discount
                 </div>
                 
                 <div className="text-6xl font-extrabold text-white mb-1 leading-none uppercase tracking-tighter">5% OFF</div>
                 <div className="text-sm font-bold text-white/90 mb-8 whitespace-nowrap">On Your Any Order</div>
                 
                 <div 
                   onClick={handleCopy}
                   className="w-full bg-white/20 p-4 rounded-xl flex items-center justify-between cursor-pointer group/code transition-all hover:bg-white/30 border border-white/30 backdrop-blur-md mb-6"
                 >
                    <div className="flex flex-col items-start text-left">
                       <span className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-0.5">Promo Code</span>
                       <span className="text-xl font-black text-white tracking-widest uppercase">TRYARHAM</span>
                    </div>
                    
                    <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg group-hover/code:bg-white/20 transition-all text-white">
                       <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Check size={18} strokeWidth={3} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Copy size={18} />
                          </motion.div>
                        )}
                       </AnimatePresence>
                    </div>
                 </div>

                 <div className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">
                    Auto-applied at checkout
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-body/40 flex items-center justify-center gap-4">
              <div className="h-px w-10 md:w-20 bg-body/10"></div>
              Browse Categories
              <div className="h-px w-10 md:w-20 bg-body/10"></div>
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-10 lg:gap-14">
            {categories.map((cat, i) => (
              <motion.button 
                key={i} 
                whileHover={{ y: -8 }}
                onClick={() => onCategorySelect?.(cat.name === 'View All' ? 'All Products' : cat.name)}
                className="flex flex-col items-center gap-4 group"
              >
                <div className={`size-16 sm:size-20 md:size-24 rounded-[2rem] bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-xl shadow-black/5 transition-all group-hover:scale-110 relative`}>
                  {cat.icon}
                  {cat.name !== 'View All' && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-[9px] md:text-[11px] font-black px-2 py-0.5 rounded-full border border-primary/10 shadow-lg text-primary min-w-[22px] flex items-center justify-center">
                      {PRODUCTS.filter(p => p.category === cat.name).length}
                    </div>
                  )}
                  {cat.name === 'View All' && (
                    <div className="absolute -top-1.5 -right-1.5 bg-white text-[9px] md:text-[11px] font-black px-2 py-0.5 rounded-full border border-primary/10 shadow-lg text-primary min-w-[22px] flex items-center justify-center">
                      3+
                    </div>
                  )}
                </div>
                <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.15em] text-body/60 group-hover:text-primary transition-colors">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowItWorks(false)}
              className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-8 md:p-10"
            >
              <button 
                onClick={() => setShowHowItWorks(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-8">
                <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-2">How It Works</h3>
                <h4 className="text-2xl font-black text-heading">Start Your Journey in 3 Steps</h4>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-primary">01</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-heading uppercase tracking-wide text-sm mb-1">Procurement</h5>
                    <p className="text-xs text-body/70 leading-relaxed">Pick your template and complete checkout safely. Your Order ID is registered instantly.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-primary">02</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-heading uppercase tracking-wide text-sm mb-1">Customization</h5>
                    <p className="text-xs text-body/70 leading-relaxed">Message us on WhatsApp. We provide a secure dashboard link to upload your photos and text assets.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-lg font-black text-primary">03</span>
                  </div>
                  <div>
                    <h5 className="font-bold text-heading uppercase tracking-wide text-sm mb-1">Live Deploy</h5>
                    <p className="text-xs text-body/70 leading-relaxed">Our team architecturally builds and deploys your site within 12-24 hours with a unique URL.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Check size={12} strokeWidth={4} />
                </div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider leading-tight">
                  Delivery guarantee starts instantly after form submission. Priority support is active 24/7.
                </p>
              </div>

              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-full mt-8 btn-primary"
              >
                Take Experience
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
