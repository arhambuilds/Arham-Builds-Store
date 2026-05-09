import { motion } from 'motion/react';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../lib/data-manager';

export default function TermsConditionsPage() {
  const { TERMS_CONDITIONS } = useData();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-secondary min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-body/60 hover:text-primary transition-colors mb-8 font-bold uppercase tracking-widest text-[10px]"
          >
            <ArrowLeft size={14} />
            BACK TO HOME
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 text-center"
          >
            <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">
              Legal Information
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-heading tracking-tighter leading-tight mb-4 uppercase">
              TERMS & CONDITIONS
            </h1>
            <p className="text-body/40 font-bold uppercase tracking-widest text-[10px]">
              Last Updated: {TERMS_CONDITIONS.lastUpdated}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-primary/5 shadow-xl shadow-primary/5"
          >
            <div className="space-y-6 text-body/70 text-sm md:text-base leading-relaxed font-medium">
              {TERMS_CONDITIONS.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="mb-4">{paragraph.trim()}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
