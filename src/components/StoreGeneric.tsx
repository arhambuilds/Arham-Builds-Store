import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, ArrowLeft, X, Check, RefreshCcw, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PRODUCTS, Product } from '../data';
import Navbar from './Navbar';
import Footer from './Footer';
import { ProductCard } from './Store';
import { cn } from '../lib/utils';
import { fetchProductsFromFirestore } from '../services/productService';

const StoreDecoration = () => {
  const storeHearts = [
    { size: 44, top: '12%', left: '10%', color: 'text-primary/20', delay: '0s' },
    { size: 32, top: '55%', left: '8%', color: 'text-primary/10', delay: '1s' },
    { size: 38, top: '30%', right: '5%', color: 'text-primary/15', delay: '2s' },
  ];

  const storeSparkles = [
    { size: 38, top: '25%', right: '12%', color: 'text-primary/20', delay: '0.5s' },
    { size: 28, top: '65%', right: '15%', color: 'text-primary/10', delay: '1.5s' },
    { size: 24, top: '45%', left: '25%', color: 'text-primary/15', delay: '2.5s' },
  ];

  return (
    <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none overflow-hidden z-0 select-none">
      {storeHearts.map((h, i) => (
        <div 
          key={`store-heart-${i}`}
          className="absolute animate-float-slow hidden lg:block"
          style={{ top: h.top, left: h.left || 'auto', right: h.right || 'auto', animationDelay: h.delay }}
        >
          <Heart size={h.size} className={`${h.color} fill-current/5`} strokeWidth={0.5} />
        </div>
      ))}
      {storeSparkles.map((s, i) => (
        <div 
          key={`store-sparkle-${i}`}
          className="absolute animate-float-medium hidden lg:block"
          style={{ top: s.top, right: s.right || 'auto', left: s.left || 'auto', animationDelay: s.delay }}
        >
          <Sparkles size={s.size} className={s.color} strokeWidth={0.5} />
        </div>
      ))}
    </div>
  );
};

interface StoreGenericProps {
  title: string;
  subtitle: string;
  description: string;
  allowedSections?: ('Templates' | 'Freebies' | 'Editing Assets')[];
  excludeSections?: ('Templates' | 'Freebies' | 'Editing Assets')[];
}

export default function StoreGeneric({ 
  title, 
  subtitle, 
  description, 
  allowedSections, 
  excludeSections 
}: StoreGenericProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setIsVisible(true), 50);
    
    const load = async () => {
      const data = await fetchProductsFromFirestore();
      if (data.length > 0) {
        setLiveProducts(data);
      }
    };
    load();
    
    return () => clearTimeout(timer);
  }, []);

  const baseProducts = useMemo(() => {
    let list = liveProducts.length > 0 ? liveProducts : PRODUCTS;
    if (allowedSections) {
      list = list.filter(p => allowedSections.includes(p.section));
    }
    if (excludeSections) {
      list = list.filter(p => !excludeSections.includes(p.section));
    }
    return list;
  }, [liveProducts, allowedSections, excludeSections]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      'All Products': baseProducts.length
    };
    baseProducts.forEach(p => {
      p.categories.forEach(cat => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });
    return counts;
  }, [baseProducts]);

  const categories = useMemo(() => Object.keys(categoryCounts), [categoryCounts]);

  // Handle URL category param
  useEffect(() => {
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam, categories]);

  const filteredProducts = useMemo(() => {
    return baseProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All Products' || product.categories.includes(activeCategory);
      return matchesSearch && matchesCategory;
    });
  }, [baseProducts, searchQuery, activeCategory]);

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-secondary min-h-screen relative overflow-x-hidden">
      <Navbar />
      <StoreDecoration />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-20 relative z-10"
      >
        <div className="flex justify-start mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="group flex items-center gap-2 text-body/40 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </div>

        <div className="mb-10 text-center">
          <motion.span className="text-[10px] md:text-sm font-black uppercase tracking-[0.3em] text-primary mb-4 block">
            {subtitle}
          </motion.span>
          <h1 className="text-4xl md:text-7xl font-black text-heading mb-6 tracking-tighter leading-[0.9]">
            {(title || '').split(' ').map((word, i) => (
              <span key={i}>{word} {i === 0 && <br className="md:hidden" />}</span>
            ))}
          </h1>
          <p className="text-body/60 max-w-lg mx-auto leading-relaxed font-bold uppercase text-[10px] md:text-xs tracking-widest">
            {description}
          </p>
        </div>

        <div className="relative z-[60]" ref={filterRef}>
          <div className="flex gap-3 mb-4 h-[54px] md:h-[64px]">
            <div className="relative flex-1 group h-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-body/30 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-14 pr-12 bg-white border border-primary/5 rounded-[1.25rem] focus:outline-none focus:ring-4 focus:ring-primary/10 text-heading transition-all shadow-xl shadow-primary/5 font-bold text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-body/30 hover:text-primary">
                  <X size={16} />
                </button>
              )}
            </div>
            
            {categories.length > 1 && (
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={cn(
                  "relative w-[54px] md:w-[64px] h-[54px] md:h-[64px] rounded-[1.25rem] border transition-all flex items-center justify-center overflow-hidden flex-shrink-0",
                  isFilterOpen || activeCategory !== 'All Products'
                  ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 active:scale-90 scale-105' 
                  : 'bg-white border-primary/5 text-body/40 hover:bg-white hover:scale-105 active:scale-95 shadow-xl shadow-primary/5'
                )}
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <SlidersHorizontal size={20} className={cn("absolute transition-all duration-500", isFilterOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100')} />
                  <X size={20} className={cn("absolute transition-all duration-500", isFilterOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50')} />
                </div>
              </button>
            )}
          </div>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-4 z-50 origin-top"
              >
                <div className="bg-white border border-primary/5 rounded-[2.5rem] shadow-2xl p-6 md:p-8 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-8 px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-body/30">Collections</span>
                    <button onClick={() => handleCategorySelect('All Products')} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1.5">
                      <RefreshCcw size={10} /> Reset
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={cn(
                          "flex justify-between items-center px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-tighter text-sm",
                          activeCategory === cat ? 'bg-primary text-white shadow-xl' : 'text-body hover:bg-primary/5'
                        )}
                      >
                        <span>{cat}</span>
                        <span className={cn("px-3 py-1 rounded-full text-[9px]", activeCategory === cat ? 'bg-white/20' : 'bg-primary/5 text-primary/40')}>
                          {categoryCounts[cat]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-b border-primary/5 pb-8 mb-10 mt-12">
          <div className="flex items-center gap-4">
            <div className={cn("w-2.5 h-2.5 rounded-full bg-primary", (isFilterOpen || activeCategory !== 'All Products') && 'animate-ping')} />
            <span className="text-body/30 text-[10px] font-black uppercase tracking-[0.3em]">
              {filteredProducts.length} Results
            </span>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 relative z-10">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-primary/10 shadow-xl shadow-primary/5">
            <h3 className="text-2xl font-black text-heading mb-4 tracking-tighter uppercase">No items found</h3>
            <button onClick={() => { setSearchQuery(''); setActiveCategory('All Products'); }} className="px-12 py-5 bg-heading text-white rounded-full font-black uppercase tracking-widest text-[10px]">
              Clear all filters
            </button>
          </div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
}
