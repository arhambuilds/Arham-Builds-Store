import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, CheckCircle2, ArrowLeft, Play, ShieldCheck, Truck, Globe, 
  Heart, Info, Lock, History, AlertCircle, ArrowRight, ExternalLink, 
  CreditCard, Flame, TrendingUp, Sparkles, Clock, Zap, Package, Calendar, 
  RefreshCcw, ChevronRight, MousePointer2, FileText, Send, Rocket, Pause, 
  Volume2, VolumeX, LayoutGrid, Gamepad2, Video, Smile, Download
} from 'lucide-react';
import React, { useEffect, useState, useRef, type MouseEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { type Product } from '../data';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '../lib/utils';
import { ProductCard } from './Store';
import { useProduct } from '../hooks/useProduct';
import { useProducts } from '../hooks/useProducts';
interface InteractiveProps {
  feature: {
    name: string;
    description: string;
    icon?: string;
  };
}

const InteractiveFeature: React.FC<InteractiveProps> = ({ feature }) => {
  const Icon = feature.icon && IconMap[feature.icon] ? IconMap[feature.icon] : Sparkles;
  
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className="p-4 rounded-2xl bg-white border border-primary/5 hover:border-primary/20 transition-all flex items-start gap-4"
    >
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="text-primary" size={20} />
      </div>
      <div>
        <h4 className="font-bold text-heading text-sm">{feature.name}</h4>
        <p className="text-[10px] text-body/60 leading-relaxed mt-1">{feature.description}</p>
      </div>
    </motion.div>
  );
};

const IconMap: { [key: string]: React.ElementType } = {
  Sparkles, Zap, ShieldCheck, Clock, Layers: LayoutGrid, Gamepad: Gamepad2, Video, Smile, Download
};

export default function TemplateDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useProduct(id || '');
  const { products: allProducts } = useProducts('Templates');
  const [isRevealed, setIsRevealed] = useState(false);
  
  // Video States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsPaused(true);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const p = (video.currentTime / video.duration) * 100;
      setProgress(p);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [isPlaying]);
  
  // Badge logic
  const getBadgeStyles = () => {
    switch (product?.badge) {
      case 'Latest': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Hot Sell': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Trending': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getBadgeIcon = () => {
    switch (product?.badge) {
      case 'Latest': return <Sparkles size={12} />;
      case 'Hot Sell': return <Flame size={12} />;
      case 'Trending': return <TrendingUp size={12} />;
      default: return <Zap size={12} />;
    }
  };

  const isOutOfStock = product?.stockCount === 0;
  const isLowStock = product && product.stockCount > 0 && product.stockCount <= 3;
  const discountPercentage = product ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100) : 0;
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!loading && product) {
      setTimeout(() => setIsRevealed(true), 100);
    } else if (!loading && !product) {
      navigate('/store');
    }
  }, [loading, product, navigate]);
// ...
  if (loading || !product) return null;
// ...
  const recommendedProducts = allProducts.filter(p => p.id !== product.id).slice(0, 2);

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
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="font-bold text-heading text-[11px] sm:text-xs tracking-tight">Fast Delivery</h4>
                  <p className="text-[8px] sm:text-[9px] text-body/40 font-bold uppercase tracking-widest mt-0.5">Within 12-24 Hours</p>
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
                    { title: 'Step 1: Pick Your Template', desc: 'Choose the perfect design and place your order securely.', icon: MousePointer2 },
                    { title: 'Step 2: Submit Your Details', desc: 'Fill out the customization form with your photos and text.', icon: FileText },
                    { title: 'Step 3: Live in 24 Hours', desc: 'Receive your ready-to-share live link directly to your email.', icon: Send }
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
                <div className="flex items-center gap-2 flex-wrap">
                  {product.categories.map((cat, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                      {cat}
                    </span>
                  ))}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      navigate(`/checkout?id=${product.id}`);
                    }}
                    disabled={isOutOfStock}
                    className={cn(
                      "group relative overflow-hidden py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all text-[11px] uppercase tracking-[0.2em]",
                      isOutOfStock 
                        ? "bg-body/5 text-body/30 cursor-not-allowed"
                        : "bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95"
                    )}
                  >
                    {!isOutOfStock && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    )}
                    {isOutOfStock ? <AlertCircle size={18} /> : <CreditCard size={18} />}
                    {isOutOfStock ? 'Out of Stock' : 'Order Now'}
                  </button>
                  
                  {product.demoUrl && (
                    <a 
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative overflow-hidden py-4 rounded-xl bg-white text-heading font-black flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all hover:scale-105 active:scale-95 text-[11px] border border-primary/10 uppercase tracking-[0.2em] card-shadow-sm"
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

                <div className="bg-emerald-500/[0.03] p-5 rounded-2xl border border-emerald-500/10 group hover:bg-white transition-all duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-emerald-500 p-1.5 rounded-lg text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Lock size={14} />
                    </div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600">
                      100% SECURE PRIVACY
                    </h4>
                  </div>
                  <p className="text-[11px] text-body/60 font-semibold leading-relaxed">
                    We use your assets only to create your product. All files are securely deleted after 2 months.
                  </p>
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10 group hover:bg-white transition-all duration-500">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.25em] text-primary flex items-center gap-2.5 mb-3">
                    <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-1000" />
                    Satisfaction Guarantee
                  </h4>
                  <p className="text-[11px] text-body/70 font-bold mb-3 uppercase tracking-tight">
                    100% money-back guarantee if we fail to deliver within 24 hours of form submission.
                  </p>
                  <div className="flex gap-3 items-start bg-secondary/80 p-3 rounded-xl border border-primary/5">
                    <Clock size={14} className="text-primary shrink-0" />
                    <p className="text-[9px] text-body/40 font-bold uppercase tracking-widest leading-relaxed">
                      Delivery timer starts after form submission.
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
