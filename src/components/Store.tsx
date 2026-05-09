import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Flame, TrendingUp, Sparkles, AlertCircle, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { type Product } from '../data';
import { cn } from '../lib/utils';
import { useData } from '../lib/data-manager';

interface ProductSectionProps {
  id: string;
  title: string;
  description: string;
  category: string;
  itemsToShow?: number;
  viewAllLink: string;
  viewAllText: string;
}

export default function ProductSection({ 
  id, 
  title, 
  description, 
  category, 
  itemsToShow = 5,
  viewAllLink,
  viewAllText
}: ProductSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(true);
  const { PRODUCTS } = useData();

  const filteredProducts = category === 'Templates'
    ? PRODUCTS.filter(p => p.category !== 'Freebies' && p.category !== 'Editing Assets')
    : category === 'All'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === category);

  const handleScroll = () => {
    if (scrollContainerRef.current && scrollContainerRef.current.scrollLeft > 20) {
      setShowScrollHint(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setShowScrollHint(false);
    }
  };

  return (
    <section id={id} className="bg-secondary overflow-hidden relative">
      <div className="section-container !pb-2 md:!pb-4 relative">
        <div className="relative mb-6 md:mb-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-heading">
              {title}
            </h2>
            <div className="w-44 md:w-64 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mt-1.5 mb-1" />
            <p className="text-body/60 text-sm md:text-base font-semibold tracking-wide max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          <div 
            className={cn(
              "hidden md:flex absolute right-0 bottom-0 items-center gap-2 transition-all duration-1000 cursor-pointer group",
              showScrollHint ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            )}
            onClick={() => scroll('right')}
          >
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-body/40 group-hover:text-primary transition-colors">
               Scroll
             </span>
             <div className="flex items-center text-body/20 group-hover:text-primary transition-colors">
                <ArrowRight size={14} className="animate-bounce-x-subtle" />
             </div>
          </div>
        </div>

        {/* Products Scroll Container */}
        <div className="relative group mb-8">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 bg-white shadow-xl p-3 rounded-full border border-primary/5 text-heading opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 bg-white shadow-xl p-3 rounded-full border border-primary/5 text-heading opacity-0 group-hover:opacity-100 transition-all hidden md:flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto no-scrollbar py-8 px-4 snap-x snap-mandatory scroll-smooth items-stretch -mx-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredProducts.slice(0, itemsToShow).map((product, i) => (
              <div key={product.id} className="flex-shrink-0 w-72 sm:w-[320px] snap-center">
                <ProductCard product={product} index={i} />
              </div>
            ))}
            <div className="flex-shrink-0 w-8" aria-hidden="true" />
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-3 px-10 py-5 bg-heading text-white rounded-full font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:scale-105 active:scale-95 group"
          >
            {viewAllText}
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
          </Link>
        </motion.div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-x-subtle {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }
        .animate-bounce-x-subtle {
          animation: bounce-x-subtle 1.2s ease-in-out infinite;
        }
      `}} />
    </section>
  );
}

export function ProductCard({ product, index }: { product: Product; index: number; key?: any }) {
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

  const getDetailRoute = (p: Product) => {
    switch (p.category) {
      case 'Templates': return `/premium-templates/${p.id}`;
      case 'Editing Assets': return `/editing-assets/${p.id}`;
      case 'Freebies': return `/freebies/${p.id}`;
      default: return `/store/${p.id}`;
    }
  };

  const detailRoute = getDetailRoute(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative bg-white rounded-2xl border border-primary/5 overflow-hidden card-shadow transition-all duration-500 flex flex-col h-full",
        isOutOfStock && "opacity-75 grayscale-[0.5]"
      )}
    >
      {/* Badge Overlay */}
      {product.badge && !isOutOfStock && (
        <div className={cn(
          "absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-xl",
          getBadgeStyles()
        )}>
          {getBadgeIcon()}
          {product.badge}
        </div>
      )}

      {/* Image / Thumbnail Container */}
      <Link to={detailRoute} className="relative h-56 overflow-hidden block">
        <img 
          src={product.thumbnailUrl} 
          alt={product.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {!isOutOfStock && (
          <div className="absolute bottom-5 right-5 z-20 flex items-center bg-heading/95 backdrop-blur-md border border-white/10 p-1 rounded-full shadow-2xl">
            <div className="flex items-center gap-2 px-3">
              {product.originalPrice && (
                <span className="text-white/40 line-through text-[11px] font-bold tracking-tight">₹{product.originalPrice}</span>
              )}
              <span className="text-white font-black text-sm tracking-tighter">₹{product.currentPrice}</span>
            </div>
            
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-inner">
                {discountPercentage}%
              </span>
            )}
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-heading/40 backdrop-blur-[2px]">
            <div className="bg-heading text-white text-[10px] font-black px-6 py-2.5 rounded-full shadow-2xl uppercase tracking-[0.2em] border border-white/20">
              Out of Stock
            </div>
          </div>
        )}
      </Link>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-3">
           <span className="inline-block px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-3">
             {product.category}
           </span>
           <Link to={detailRoute} className="block">
             <h3 className="text-lg font-black text-heading group-hover:text-primary transition-colors leading-tight mb-1 uppercase tracking-tighter">
               {product.title}
             </h3>
           </Link>
           
           {isLowStock && !isOutOfStock && (
             <div className="flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest animate-pulse">
               <AlertCircle size={12} className="stroke-[3]" />
               ONLY {product.stockCount} LEFT
             </div>
           )}
        </div>
        
        <p className="text-body/50 text-xs mb-6 flex-grow line-clamp-2 leading-relaxed font-semibold">
          {product.description}
        </p>
        
        <div className="mt-auto">
          {isOutOfStock ? (
            <button 
              disabled
              className="w-full bg-secondary text-body/30 py-3.5 rounded-xl font-black flex items-center justify-center gap-2 cursor-not-allowed border border-primary/5 text-[9px] uppercase tracking-widest"
            >
              <AlertCircle size={14} />
              SOLD OUT
            </button>
          ) : (
            <Link 
              to={detailRoute}
              className="group/btn relative overflow-hidden w-full bg-primary text-white py-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-[0.2em] text-[10px]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer pointer-events-none"></div>
              <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
              VIEW
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

