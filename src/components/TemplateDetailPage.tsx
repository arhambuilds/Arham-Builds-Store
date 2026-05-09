import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, CheckCircle2, ArrowLeft, Play, ShieldCheck, Truck, Globe, 
  Heart, Info, Lock, History, AlertCircle, ArrowRight, ExternalLink, 
  CreditCard, Flame, TrendingUp, Sparkles, Clock, Zap, Package, Calendar, 
  RefreshCcw, ChevronRight, MousePointer2, FileText, Send, Rocket, Pause, 
  Volume2, VolumeX 
} from 'lucide-react';
import React, { useEffect, useState, useRef, type MouseEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, type Product } from '../data';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../lib/utils';
import { ProductCard } from './Store';

interface InteractiveProps {
  feature: { name: string; description: string };
  key?: React.Key;
}

const InteractiveFeature = ({ feature }: InteractiveProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative group py-2 flex items-center gap-3 cursor-help"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div className="flex-shrink-0 bg-primary/10 p-1 rounded-md transition-transform group-hover:scale-110">
        <CheckCircle2 size={14} className="text-primary" />
      </div>
      <h4 className="font-bold text-heading text-xs border-b border-transparent group-hover:border-primary/30 transition-all uppercase tracking-tight">
        {feature.name}
      </h4>

      <AnimatePresence>
        {isVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-0 mb-3 w-64 z-50 pointer-events-none"
          >
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-primary/5 relative">
              <span className="block text-[9px] font-black uppercase tracking-widest text-primary mb-1">
                {feature.name}
              </span>
              <p className="text-[11px] text-body/70 leading-relaxed font-semibold">
                {feature.description}
              </p>
              <div className="absolute top-full left-6 -translate-y-1/2 rotate-45 w-2 h-2 bg-white border-r border-b border-primary/5"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundProduct = PRODUCTS.find(p => p.id === id || p.slug === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setTimeout(() => setIsRevealed(true), 100);
    } else {
      navigate('/premium-templates');
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isPlaying && !isPaused && videoRef.current) {
      const interval = setInterval(() => {
        if (videoRef.current) {
          const duration = videoRef.current.duration;
          if (duration && !isNaN(duration)) {
            const p = (videoRef.current.currentTime / duration) * 100;
            setProgress(p);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isPlaying, isPaused]);

  if (!product) return null;

  const isOutOfStock = product.stockCount === 0;
  const isLowStock = product.stockCount !== undefined && product.stockCount > 0 && product.stockCount <= 5;
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100) 
    : 0;

  const toggleVideoPlay = (e?: MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.error("Video play interrupted:", error);
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const recommendedTemplates = PRODUCTS.filter(p => p.category === 'Templates' && p.id !== product.id).slice(0, 2);

  return (
    <div className="bg-secondary min-h-screen selection:bg-primary/10 selection:text-primary">
      <Navbar />
      
      <main className="pt-28 md:pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/premium-templates')}
            className="group flex items-center gap-2 text-body/60 hover:text-primary transition-all mb-8 font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO TEMPLATES
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className={cn(
              "lg:w-7/12 space-y-6 lg:space-y-8 transition-all duration-1000 transform",
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}>
              <div className="relative aspect-video rounded-3xl overflow-hidden card-shadow group/video bg-black cursor-pointer"
                   onClick={() => !isOutOfStock && toggleVideoPlay()}>
                
                {product.videoUrl && (
                  <video 
                    ref={videoRef}
                    src={product.videoUrl}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                      isPlaying ? "opacity-100" : "opacity-0"
                    )}
                    muted={isMuted}
                    playsInline
                    onPlay={() => { setIsPlaying(true); setIsPaused(false); }}
                    onPause={() => { setIsPlaying(false); setIsPaused(true); }}
                    onEnded={() => { setIsPlaying(false); setIsPaused(false); setProgress(0); }}
                    onError={(e) => {
                      console.error("Video failed to load:", e);
                      setIsPlaying(false);
                    }}
                  />
                )}

                <motion.div 
                  initial={false}
                  animate={{ opacity: isPlaying ? 0 : 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  <img 
                    src={product.thumbnailUrl} 
                    alt={product.title} 
                    className={cn(
                      "w-full h-full object-cover transition-transform duration-700",
                      !isPlaying && "group-hover/video:scale-110",
                      isOutOfStock ? "grayscale opacity-50" : "opacity-80"
                    )} 
                  />
                  {!isOutOfStock && product.videoUrl && !isPlaying && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center group-hover/video:scale-110 transition-transform">
                        <Play size={32} className="text-white fill-white ml-1" />
                      </div>
                      <p className="mt-4 text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Watch Template Demo</p>
                    </div>
                  )}
                </motion.div>

                {/* Controls Overlay */}
                <div className={cn(
                  "absolute inset-0 z-30 transition-opacity flex flex-col justify-between p-6 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none",
                  isPlaying ? "opacity-0 group-hover/video:opacity-100" : "opacity-0"
                )}>
                  <div className="flex justify-between items-start pointer-events-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsPlaying(false); videoRef.current?.pause(); }}
                      className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:bg-black transition-all"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button 
                      onClick={toggleMute}
                      className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white/80 hover:bg-black transition-all"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 pointer-events-auto">
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={toggleVideoPlay} className="text-white hover:text-primary transition-colors">
                        {isPaused ? <Play size={24} fill="white" /> : <Pause size={24} fill="white" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* The Magic Process Section */}
              <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] card-shadow border border-primary/5">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-body/30 flex items-center gap-4 mb-10">
                  <Rocket size={18} className="text-primary" />
                  Deployment Workflow
                </h3>
                <div className="space-y-8 relative ml-4">
                  <div className="absolute left-[23px] top-6 bottom-6 w-[1.5px] bg-primary/10" />
                  
                  {[
                    { title: 'Step 1: Selection', desc: 'Secure the template that fits your project best.', icon: MousePointer2 },
                    { title: 'Step 2: Customization', desc: 'Provide us with your assets via our secure form.', icon: FileText },
                    { title: 'Step 3: Delivery', desc: 'Link goes live within 24 hours of submission.', icon: Send }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-6 group">
                      <div className="w-12 h-12 rounded-2xl bg-secondary border border-primary/10 flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:scale-110 group-hover:border-primary/30 transition-all">
                        <step.icon size={20} className="text-primary" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-sm font-black text-heading mb-1 group-hover:text-primary transition-colors uppercase tracking-tight">{step.title}</h4>
                        <p className="text-[11px] text-body/50 font-bold leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={cn(
              "lg:w-5/12 space-y-8 transition-all duration-1000 delay-300 transform",
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                    PREMIUM TEMPLATE
                  </span>
                  {isLowStock && !isOutOfStock && (
                    <span className="px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 text-[9px] font-black uppercase tracking-wider border border-orange-500/20 animate-pulse">
                      Only {product.stockCount} Slots Available
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-black text-heading leading-tight uppercase tracking-tighter">
                  {product.title}
                </h1>
                <p className="text-sm text-body/70 leading-relaxed font-bold">
                  {product.description}
                </p>
              </div>

              <div className="p-8 rounded-[2rem] bg-white card-shadow border border-primary/5 relative overflow-hidden group/pricing">
                <div className="flex items-baseline gap-4 mb-8">
                  <span className="text-3xl lg:text-4xl font-black text-heading tracking-tighter">₹{product.currentPrice}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-body/20 line-through font-bold">₹{product.originalPrice}</span>
                  )}
                </div>

                <div className="grid gap-4">
                  <button 
                    disabled={isOutOfStock}
                    className="w-full bg-primary text-white py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    {isOutOfStock ? 'Slots Filled' : 'Secure This Template'}
                  </button>
                  
                  {product.demoUrl && (
                    <a 
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-secondary text-heading border border-primary/10 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-heading hover:text-white transition-all"
                    >
                      <ExternalLink size={18} /> View Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4 bg-white p-8 rounded-[2rem] card-shadow border border-primary/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-body/30 flex items-center gap-3">
                  <Sparkles size={14} className="text-primary" />
                  Premium Features
                </h3>
                <div className="grid gap-2">
                  {product.features?.map((feature, idx) => (
                    <InteractiveFeature key={idx} feature={feature} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
