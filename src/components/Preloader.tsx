import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if user has seen preloader in this browser
    const hasSeenPreloader = localStorage.getItem('arham_preloader_seen');
    
    if (!hasSeenPreloader) {
      setIsVisible(true);
      
      // Show for 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay setting finished to allow exit animation
        setTimeout(() => {
          setIsFinished(true);
          localStorage.setItem('arham_preloader_seen', 'true');
        }, 800);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
    }
  }, []);

  if (isFinished) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-secondary"
        >
          <div className="relative flex items-center justify-center">
            {/* Soft pulsing background glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 bg-primary/20 rounded-full blur-2xl"
            />
            
            {/* The Store Icon with rotation and pulse */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1, 0.8],
                opacity: 1
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              className="relative text-primary"
            >
              <ShoppingBag size={48} strokeWidth={1.5} />
            </motion.div>

            {/* Circular progress orbit */}
            <svg className="absolute w-32 h-32 -rotate-90">
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/10"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="377"
                initial={{ strokeDashoffset: 377 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="text-primary"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
