import { motion } from 'motion/react';
import Navbar from './Navbar';
import Footer from './Footer';
import Contact from './Contact';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
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
          
          <Contact showFormOnMobile={true} isFullPage={true} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
