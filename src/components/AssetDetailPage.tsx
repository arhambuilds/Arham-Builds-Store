import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, CheckCircle2, ArrowLeft, Play, ShieldCheck, Truck, Globe, 
  Heart, Info, Lock, History, AlertCircle, ArrowRight, ExternalLink, 
  CreditCard, Flame, TrendingUp, Sparkles, Clock, Zap, Package, Calendar, 
  RefreshCcw, ChevronRight, MousePointer2, FileText, Send, Rocket, Pause, 
  Volume2, VolumeX, Users, Award, LayoutGrid, Gamepad2, Video, Smile, Download 
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

const IconMap: { [key: string]: React.ElementType } = {
  'users': Users,
  'award': Award,
  'layoutGrid': LayoutGrid,
  'gamepad2': Gamepad2,
  'video': Video,
  'smile': Smile,
  'zap': Zap,
  'trending-up': TrendingUp,
  'sparkles': Sparkles,
  'mouse-pointer-2': MousePointer2,
  'globe': Globe,
  'heart': Heart,
};

export default function ProductDetailPage() {
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
      navigate('/store');
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

  const getBadgeIcon = () => {
    switch (product.badge) {
      case 'Hot Sell': return <Flame size={14} className="fill-current" />;
      case 'Trending': return <TrendingUp size={14} />;
      case 'Latest': return <Sparkles size={14} />;
      default: return null;
    }
  };

  const getBadgeStyles = () => {
    switch (product.badge) {
      case 'Hot Sell': return 'bg-orange-500 text-white';
      case 'Trending': return 'bg-primary text-white';
      case 'Latest': return 'bg-purple-600 text-white';
      default: return 'bg-heading text-white';
    }
  };

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

  const recommendedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 2);

  return (
    <div className="bg-secondary min-h-screen">
      <Navbar />
      
      <main className="pt-28 md:pt-32 pb-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/store')}
            className="group flex items-center gap-2 text-body/60 hover:text-primary transition-all mb-8 font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            BACK TO PREVIOUS
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* LEFT COLUMN: Media & Process */}
            <div className={cn(
              "lg:w-7/12 space-y-6 lg:space-y-8 transition-all duration-1000 transform",
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}>
              <div className="relative aspect-video rounded-2xl overflow-hidden card-shadow group/video bg-black cursor-pointer"
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
                      <p className="mt-4 text-[10px] font-black text-white/70 uppercase tracking-[0.4em]">Watch Preview</p>
                    </div>
                  )}

                  {product.badge && (
                    <div className={cn(
                      "absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg",
                      getBadgeStyles()
                    )}>
                      {getBadgeIcon()}
                      {product.badge}
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

                {isOutOfStock && !isPlaying && (
                  <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                    <span className="bg-white/95 text-heading px-10 py-5 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white card-shadow border border-primary/5 flex flex-col items-center text-center group transition-all cursor-default">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100/50 text-emerald-600 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="font-bold text-heading text-[11px] sm:text-xs tracking-tight">Safe Purchase</h4>
                  <p className="text-[8px] sm:text-[9px] text-body/40 font-bold uppercase tracking-widest mt-0.5">Verified & Secure</p>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white card-shadow border border-primary/5 flex flex-col items-center text-center group transition-all cursor-default">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100/50 text-blue-600 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="font-bold text-heading text-[11px] sm:text-xs tracking-tight">Instant Download</h4>
                  <p className="text-[8px] sm:text-[9px] text-body/40 font-bold uppercase tracking-widest mt-0.5">Within Seconds</p>
                </div>
              </div>

              <div className="hidden lg:block pt-8">
                <h3 className="text-xs font-black uppercase tracking-[0.25em] text-body/30 flex items-center gap-4 mb-10">
                  <Rocket size={18} className="text-primary" />
                  The Magic Process
                </h3>
                <div className="space-y-6 relative ml-4">
                  <div className="absolute left-[23px] top-6 bottom-6 w-[1.5px] bg-primary/10" />
                  
                  {[
                    { title: 'Step 1: Pick Your Asset', desc: 'Secure the asset pack that fits your project best.', icon: MousePointer2 },
                    { title: 'Step 2: Get Access', desc: 'Get your digital download links instantly.', icon: FileText },
                    { title: 'Step 3: Start Creation', desc: 'Drag and drop into your favorite editing software.', icon: Send }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-5 group">
                      <div className="w-11 h-11 rounded-xl bg-secondary border border-primary/10 flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:scale-110 group-hover:border-primary/30 transition-all">
                        <step.icon size={18} className="text-primary" />
                      </div>
                      <div className="pt-0.5">
                        <h4 className="text-sm font-black text-heading mb-0.5 group-hover:text-primary transition-colors uppercase tracking-tight">{step.title}</h4>
                        <p className="text-[11px] text-body/50 font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Products */}
              <div className="hidden lg:block pt-12 border-t border-primary/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.25em] text-body/30 flex items-center gap-4">
                    <Sparkles size={16} className="text-primary" />
                    Recommended for You
                  </h3>
                  <Link 
                    to="/store"
                    className="group text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 flex items-center gap-1 transition-all hover:scale-105 active:scale-95"
                  >
                    View All <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {recommendedProducts.map((p, i) => (
                    <div key={p.id} className="scale-[0.85] origin-top-left -mr-8 -mb-10">
                      <ProductCard product={p} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Info & Conversion */}
            <div className={cn(
              "lg:w-5/12 space-y-8 transition-all duration-1000 delay-300 transform",
              isRevealed ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            )}>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                    {product.category}
                  </span>
                  {isLowStock && !isOutOfStock && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-500/10 text-orange-600 text-[9px] font-black uppercase tracking-wider border border-orange-500/20 animate-pulse">
                      <AlertCircle size={10} /> Only {product.stockCount} left
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-black text-heading leading-tight uppercase tracking-tighter">
                  {product.title}
                </h1>
                <p className="text-xs lg:text-sm text-body/70 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              <div className="p-6 lg:p-7 rounded-2xl bg-secondary card-shadow border border-primary/5 relative overflow-hidden group/pricing">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/pricing:opacity-[0.07] transition-opacity">
                  <ShoppingCart size={150} />
                </div>
                
                <div className="space-y-1 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl lg:text-3xl font-black text-heading tracking-tighter">₹{product.currentPrice}</span>
                    {product.originalPrice && (
                      <span className="text-sm lg:text-base text-body/30 line-through font-bold">₹{product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && !isOutOfStock && discountPercentage > 0 && (
                    <div className="inline-block px-3 py-1 rounded-lg bg-red-500 text-white text-[10px] font-black uppercase tracking-widest animate-shimmer-fast bg-gradient-to-r from-red-500 via-white/20 to-red-500 bg-[length:200%_100%]">
                      SAVE {discountPercentage}%
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => !isOutOfStock}
                    disabled={isOutOfStock}
                    className={cn(
                      "group relative overflow-hidden py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all text-[11px] uppercase tracking-[0.2em] w-full",
                      isOutOfStock 
                        ? "bg-body/5 text-body/30 cursor-not-allowed"
                        : "bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95"
                    )}
                  >
                    {!isOutOfStock && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    )}
                    {isOutOfStock ? <AlertCircle size={18} /> : <CreditCard size={18} />}
                    {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                  </button>
                  
                  {product.demoUrl && (
                    <a 
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden py-4 rounded-xl bg-white text-heading font-black flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 text-[11px] border border-primary/10 uppercase tracking-[0.2em] card-shadow-sm w-full"
                    >
                      <ExternalLink size={18} /> Live Demo
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-body/30 flex items-center gap-3">
                  <Sparkles size={14} className="text-primary" />
                  Key Features
                </h3>
                <div className="grid gap-2">
                  {product.features?.map((feature, idx) => (
                    <InteractiveFeature key={idx} feature={feature} />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-primary/5">
                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 group hover:bg-white transition-all duration-500">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-primary flex items-center gap-2.5 mb-3">
                    <Package size={14} /> What You’ll Receive
                  </h4>
                  <ul className="space-y-2 text-[11px] font-bold text-body/80 uppercase tracking-tight">
                    {product.whatYouReceive?.map((item, idx) => (
                      <li key={idx} className={cn(
                        "flex items-center gap-2",
                        item.includes('!') ? "text-red-500 animate-pulse" : ""
                      )}>
                        <div className={cn(
                          "w-4 h-4 rounded-md flex items-center justify-center shrink-0",
                          item.includes('!') ? "bg-red-500" : "bg-primary"
                        )}>
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {product.whyChooseThisPack && product.whyChooseThisPack.length > 0 && (
                  <div className="bg-emerald-500/[0.03] p-5 rounded-2xl border border-emerald-500/10 group hover:bg-white transition-all duration-500">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600 flex items-center gap-2.5 mb-3">
                      <Sparkles size={14} /> Why Choose This Pack?
                    </h4>
                    <ul className="space-y-3">
                      {product.whyChooseThisPack.map((item, idx) => {
                        const Icon = IconMap[item.icon] || Sparkles;
                        return (
                          <li key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <Icon size={14} className="text-emerald-600" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-heading uppercase tracking-tight">{item.title}</p>
                              <p className="text-[10px] text-body/50 font-bold leading-tight">{item.description}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {product.whereCanYouUseIt && product.whereCanYouUseIt.length > 0 && (
                  <div className="bg-indigo-500/[0.03] p-5 rounded-2xl border border-indigo-500/10 group hover:bg-white transition-all duration-500">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-indigo-600 flex items-center gap-2.5 mb-3">
                      <Globe size={14} /> Where Can You Use It?
                    </h4>
                    <ul className="space-y-3">
                      {product.whereCanYouUseIt.map((item, idx) => {
                        const Icon = IconMap[item.icon] || Globe;
                        return (
                          <li key={idx} className="flex gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                              <Icon size={14} className="text-indigo-600" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[11px] font-black text-heading uppercase tracking-tight">{item.title}</p>
                              <p className="text-[10px] text-body/50 font-bold leading-tight">{item.description}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 group hover:bg-white transition-all duration-500">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-primary flex items-center gap-2.5 mb-3">
                    <Info size={14} />
                    Usage & Attribution Note
                  </h4>
                  <p className="text-[11px] text-body/70 font-bold mb-3 uppercase tracking-tight">
                    I’ve collected this over the years as part of my creative journey. I do not own it, but it is free to use.

                  </p>
                  <div className="flex gap-3 items-start bg-secondary/80 p-3 rounded-xl border border-primary/5">
                    <Clock size={14} className="text-primary shrink-0" />
                    <p className="text-[9px] text-body/40 font-bold uppercase tracking-widest leading-relaxed">
                      Instant Download starts after payment securely.
                    </p>
                  </div>
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
