import { useEffect } from 'react';
import { HelpCircle, MessageCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FAQ from './FAQ';

export default function FAQPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          {/* Back Button */}
          <div className="w-full max-w-4xl mb-8">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-body/60 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px] group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO PREVIOUS
            </motion.button>
          </div>

          <div className="w-full max-w-4xl">
            <FAQ isFullPage={true} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


