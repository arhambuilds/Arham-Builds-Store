import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Info, Zap, Calendar, RefreshCcw, ShieldCheck, HelpCircle, Minus, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useData } from '../lib/data-manager';

export default function FAQ({ isFullPage = false }: { isFullPage?: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { FAQ_DATA } = useData();

  const FAQ_ITEMS = FAQ_DATA.map(item => ({
    icon: <HelpCircle className="w-4 h-4" />,
    question: item.question,
    answer: item.answer
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faqs" 
      ref={sectionRef} 
      className="bg-secondary relative overflow-hidden"
    >
      <div className={cn("section-container !pb-2 md:!pb-4 relative z-10", isFullPage ? "pt-2 md:pt-4" : "!pt-8 md:!pt-12")}>
        <div className="relative mb-12 md:mb-16">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-heading uppercase">
              Frequently Asked Questions
            </h2>
            <div className="w-44 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1.5 mb-1" />
            <p className="text-body/60 text-sm md:text-base font-semibold tracking-wide max-w-2xl mx-auto flex items-center gap-2 justify-center">
              <HelpCircle size={16} className="text-primary" />
              Support Center • Instant Assistance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto mb-16">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={cn(
                  "group bg-white rounded-[1.5rem] border transition-all duration-500 transform",
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                  isOpen 
                    ? 'border-primary/40 shadow-xl shadow-primary/5 ring-1 ring-primary/10 scale-[1.01]' 
                    : 'border-primary/5 hover:border-primary/30 shadow-sm'
                )}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "w-10 h-10 rounded-2xl transition-all duration-500 flex items-center justify-center shrink-0",
                      isOpen 
                        ? 'bg-primary text-white shadow-lg rotate-[360deg]' 
                        : 'bg-primary/5 text-primary group-hover:bg-primary/10'
                    )}>
                      {React.cloneElement(item.icon as React.ReactElement<any>, { size: 16 })}
                    </div>
                    <span className={cn(
                      "text-sm md:text-base font-bold tracking-tight transition-colors leading-snug uppercase",
                      isOpen ? 'text-primary' : 'text-heading'
                    )}>
                      {item.question}
                    </span>
                  </div>
                  <div className={cn(
                    "ml-4 flex-shrink-0 transition-all duration-500",
                    isOpen ? 'rotate-180 text-primary scale-110' : 'rotate-0 text-body/40'
                  )}>
                    {isOpen ? <Minus size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-6 pl-[76px]">
                        <p className="text-body/70 leading-relaxed text-[13px] font-medium opacity-90">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] group relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-6 flex-1">
              {/* Icon with status dot */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[#2563EB] flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-transform group-hover:scale-110 duration-500">
                  <MessageCircle size={24} className="text-white" />
                </div>
                {/* Status Dot */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="space-y-1.5 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-heading tracking-tight">Need specific help?</h3>
                <p className="text-[13px] md:text-sm text-body/60 font-medium leading-relaxed max-w-sm tracking-tight">
                  Our technical support is active 24/7. Connect directly with the founder for priority assistance.
                </p>
              </div>
            </div>

            <Link 
              to="/contact" 
              className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-[#0F172A] text-white rounded-2xl md:rounded-[1.2rem] font-black text-[11px] uppercase tracking-widest hover:bg-primary active:scale-95 transition-all shadow-xl shrink-0 group/btn"
            >
              <HelpCircle size={18} className="transition-transform group-hover/btn:rotate-12" />
              SUPPORT CENTER
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

