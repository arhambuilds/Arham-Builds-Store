import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Check, 
  Lock, 
  ShieldCheck, 
  ArrowRight,
  User,
  Tag,
  Zap
} from 'lucide-react';
import { PRODUCTS, Product } from '../data';
import { cn } from '../lib/utils';

// --- Types ---

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const COUNTRIES: Country[] = [
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
];

const AVAILABLE_COUPONS = [
  { code: 'MOMENT10', discount: 0.1 },
  { code: 'ARHAMBUILD10', discount: 0.1 },
  { code: 'TRYARHAM', discount: 0.05 },
];

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof AVAILABLE_COUPONS[0] | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_k4CqxRUYByW2SZXhkby2AxlfiQFsW6jm-KFzlA__1go2Lmu1AxA8hgyXDpEHwxyeBCRbpelQeIJnBfwPCzEhOeXxEUmoCiogiJxr-MwMahQymXwnoy5peuHdUGNlPAXXFzgtx4R3udF4oV20QdEFrfki71UE59XvuI5RDeGk26MkdNlRFMiz6nzqTw/s320/ArhamBuildsLogo.png";

  useEffect(() => {
    // Find product from data
    if (productId) {
      const foundProduct = PRODUCTS.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      }
    }
    setLoading(false);
  }, [productId]);

  // Determine Checkout Version
  const isEditingAssets = product?.section === 'Editing Assets';

  // Price Calculations
  const pricing = useMemo(() => {
    if (!product) return null;
    
    const originalValue = product.originalPrice;
    const inventorySaleDiscount = originalValue - product.currentPrice;
    const hasInventoryDiscount = inventorySaleDiscount > 0;
    const subtotal = product.currentPrice;
    
    let promoDiscount = 0;
    if (appliedCoupon) {
      promoDiscount = Math.round(subtotal * appliedCoupon.discount);
    }
    
    const grandTotal = subtotal - promoDiscount;
    
    return {
      originalValue,
      inventorySaleDiscount,
      hasInventoryDiscount,
      subtotal,
      promoDiscount,
      appliedCoupon,
      grandTotal
    };
  }, [product, appliedCoupon]);

  const validateStep1 = () => {
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      return false;
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return false;
    return true;
  };

  const isFormValid = useMemo(() => {
    return validateStep1() && isTermsAccepted;
  }, [formData, isTermsAccepted]);

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === code);
    if (found) {
      setAppliedCoupon(found);
      setCouponCode(found.code);
    } else if (couponCode.trim() !== '' || codeToApply) {
      alert('Invalid coupon code.');
    }
  };

  const handlePayment = async () => {
    if (!validateStep1()) {
      alert('Please complete all fields with valid information.');
      return;
    }

    if (!isTermsAccepted) {
      alert('Please agree to the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }
    
    if (!window.Razorpay) {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);

    const razorpayKey = (import.meta as any).env.VITE_RAZORPAY_KEY_ID;
    
    if (!razorpayKey || razorpayKey.includes('YOUR_KEY_HERE')) {
      // Fallback for demo if key isn't provided yet
      console.log("Demo Mode: No Razorpay Key found in environment variables.");
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const options = {
      key: razorpayKey,
      amount: (pricing?.grandTotal || 0) * 100, // Amount in paise
      currency: "INR",
      name: "Arham Builds",
      description: `Purchase: ${product?.title}`,
      image: LOGO_URL,
      handler: function (response: any) {
        console.log("Payment Success:", response);
        setIsProcessing(false);
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: selectedCountry.dialCode + formData.phone,
      },
      notes: {
        product_id: product?.id,
        section: product?.section,
      },
      theme: {
        color: "#ff0044", // Primary brand color
      },
      modal: {
        ondismiss: function() {
          setIsProcessing(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay fail:", error);
      setIsProcessing(false);
      alert("Failed to initialize payment. Please check your internet connection.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-secondary">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
      <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Product Not Found</h2>
      <button onClick={() => navigate('/')} className="btn-primary">Go Back Home</button>
    </div>
  );

  return (
    <div className={cn(
      "min-h-screen lg:h-screen lg:overflow-hidden transition-colors duration-500 font-sans flex flex-col",
      isEditingAssets ? "bg-[#0f1115]" : "bg-[#f4f5f8]"
    )}>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center max-w-6xl mx-auto w-full px-4 py-2 md:py-4">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto"
            >
              <div className={cn(
                "p-10 md:p-16 rounded-[3rem] text-center space-y-8 overflow-hidden relative",
                isEditingAssets ? "bg-[#16181b] border border-gray-800" : "bg-white card-shadow"
              )}>
                {/* Decorative background elements if light mode */}
                {!isEditingAssets && <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>}
                
                <div className="flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                    >
                      <Check size={48} strokeWidth={3} />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-emerald-500/20"
                    ></motion.div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className={cn(
                    "text-3xl md:text-4xl font-black uppercase tracking-tighter",
                    isEditingAssets ? "text-white" : "text-heading"
                  )}>Access Guaranteed!</h2>
                  <p className={cn(
                    "text-xs md:text-sm font-bold uppercase tracking-widest opacity-60",
                    isEditingAssets ? "text-white" : "text-heading"
                  )}>Your order was processed successfully</p>
                </div>

                <div className={cn(
                  "p-8 rounded-[2rem] space-y-4",
                  isEditingAssets ? "bg-white/5" : "bg-gray-50"
                )}>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                    <span>Order Profile</span>
                    <span>#{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}</span>
                  </div>
                  <div className="h-[1px] bg-gray-200 dark:bg-gray-800 border-dashed border-t"></div>
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Customer</div>
                      <div className={cn("text-xs font-black truncate", isEditingAssets ? "text-white" : "text-heading")}>{formData.fullName}</div>
                    </div>
                    <div>
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-1">Email</div>
                      <div className={cn("text-xs font-black truncate", isEditingAssets ? "text-white" : "text-heading")}>{formData.email}</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => navigate('/')}
                    className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                  >
                    Go to Dashboard
                  </button>
                  <p className={cn(
                    "text-[9px] font-bold uppercase tracking-widest opacity-40",
                    isEditingAssets ? "text-white" : "text-heading"
                  )}>A confirmation email has been sent to your inbox</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Integrated Header */}
              <div className="flex items-center justify-between mb-3 md:mb-5 px-2">
                <button 
                  onClick={() => navigate(-1)}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:opacity-70 group",
                    isEditingAssets ? "text-white/60" : "text-gray-400"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isEditingAssets ? "bg-white/5 border border-white/10" : "bg-white border border-gray-100 shadow-sm"
                  )}>
                    <ChevronLeft size={14} strokeWidth={3} className="text-current" />
                  </div>
                  <span>Back</span>
                </button>

                <Link to="/" className="flex items-center gap-4 group">
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em]",
                      isEditingAssets ? "text-white" : "text-heading"
                    )}>Arham Builds</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <ShieldCheck size={10} className="text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Checkout</span>
                    </div>
                  </div>
                  <div className={cn(
                    "w-10 h-10 rounded-2xl overflow-hidden p-1.5 group-hover:scale-105 transition-transform",
                    isEditingAssets ? "bg-white/10 border border-white/10" : "bg-white border border-gray-100 shadow-lg shadow-black/5"
                  )}>
                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "p-4 md:p-5 rounded-[2rem] transition-all duration-500",
                    isEditingAssets 
                      ? "bg-[#16181b] border border-gray-800 shadow-[20px_20px_40px_rgba(0,0,0,0.4)]" 
                      : "bg-white card-shadow"
                  )}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <User size={16} />
                    </div>
                    <div>
                      <h2 className={cn(
                        "text-sm md:text-base font-black uppercase tracking-tighter",
                        isEditingAssets ? "text-white" : "text-heading"
                      )}>Contact Information</h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className={cn(
                          "block text-[10px] font-black uppercase tracking-[0.2em]",
                          isEditingAssets ? "text-gray-400" : "text-gray-500"
                        )}>Full Name</label>
                      </div>
                      <input 
                        type="text"
                        placeholder="e.g. John Doe"
                        className={cn(
                          "w-full px-5 py-3.5 rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4",
                          isEditingAssets 
                            ? "bg-[#0f1115] border-gray-800 text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-primary/5" 
                            : "bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                        )}
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className={cn(
                          "block text-[10px] font-black uppercase tracking-[0.2em]",
                          isEditingAssets ? "text-gray-400" : "text-gray-500"
                        )}>Email Address</label>
                        <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">For delivery</span>
                      </div>
                      <input 
                        type="email"
                        placeholder="name@email.com"
                        className={cn(
                          "w-full px-5 py-3 rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4",
                          isEditingAssets 
                            ? "bg-[#0f1115] border-gray-800 text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-primary/5" 
                            : "bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                        )}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center px-1">
                        <label className={cn(
                          "block text-[10px] font-black uppercase tracking-[0.2em]",
                          isEditingAssets ? "text-gray-400" : "text-gray-500"
                        )}>Phone Number</label>
                      </div>
                      <div className="flex gap-3">
                        <div className="relative">
                          <button 
                            onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                            className={cn(
                              "h-[46px] px-4 rounded-2xl border transition-all duration-300 flex items-center gap-2",
                              isEditingAssets 
                                ? "bg-[#0f1115] border-gray-800 text-white" 
                                : "bg-gray-100 border-gray-100 text-gray-900"
                            )}
                          >
                            <span className="text-lg leading-none">{selectedCountry.flag}</span>
                            <ChevronDown size={12} className="opacity-40" />
                          </button>
                          
                          <AnimatePresence>
                            {isCountryDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsCountryDropdownOpen(false)}></div>
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className={cn(
                                    "absolute top-[calc(100%+10px)] left-0 w-64 z-50 rounded-2xl shadow-2xl p-2 animate-glass overflow-hidden",
                                    isEditingAssets ? "bg-[#16181b] border border-gray-800" : "bg-white border border-gray-100"
                                  )}
                                >
                                  {COUNTRIES.map((country) => (
                                    <button
                                      key={country.code}
                                      onClick={() => {
                                        setSelectedCountry(country);
                                        setIsCountryDropdownOpen(false);
                                      }}
                                      className={cn(
                                        "w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 text-left",
                                        isEditingAssets ? "hover:bg-white/5" : "hover:bg-primary/5",
                                        selectedCountry.code === country.code && (isEditingAssets ? "bg-white/10" : "bg-primary/5 text-primary")
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span className="text-lg">{country.flag}</span>
                                        <span className="text-xs font-black uppercase tracking-widest">{country.name}</span>
                                      </div>
                                      <span className="text-[9px] opacity-40 font-black">{country.dialCode}</span>
                                    </button>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="relative flex-1">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[13px] font-black opacity-30 pointer-events-none select-none">
                            {selectedCountry.dialCode}
                          </div>
                          <input 
                            type="tel"
                            placeholder="000 000 0000"
                            className={cn(
                              "w-full pl-14 pr-5 h-[46px] rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4",
                              isEditingAssets 
                                ? "bg-[#0f1115] border-gray-800 text-white placeholder:text-white/10 focus:border-primary/50 focus:ring-primary/5" 
                                : "bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                            )}
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-800">
                      <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative">
                          <input 
                            type="checkbox"
                            className="peer sr-only"
                            checked={isTermsAccepted}
                            onChange={(e) => setIsTermsAccepted(e.target.checked)}
                          />
                          <div className={cn(
                            "w-6 h-6 rounded-lg border transition-all duration-300 flex items-center justify-center",
                            isEditingAssets 
                              ? "border-gray-800 bg-gray-900 peer-checked:bg-primary peer-checked:border-primary" 
                              : "border-gray-200 bg-white peer-checked:bg-primary peer-checked:border-primary"
                          )}>
                            <Check size={14} strokeWidth={4} className="text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-transform" />
                          </div>
                        </div>
                        <span className={cn(
                          "text-[11px] font-bold uppercase tracking-tight select-none",
                          isEditingAssets ? "text-gray-500" : "text-gray-400"
                        )}>
                          I agree to the <a href="/terms-conditions" className="text-primary hover:underline underline-offset-4">Terms & Conditions</a> & <a href="/privacy" className="text-primary hover:underline underline-offset-4">Privacy Policy</a>
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
                
                <div className={cn(
                  "p-4 rounded-[1.5rem] border transition-all duration-300",
                  isEditingAssets ? "bg-white/5 border-white/10 text-white/40" : "bg-gray-100/50 border-gray-100 text-gray-400"
                )}>
                  <div className="flex items-center gap-3 mb-1">
                    <ShieldCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Payment Gateway</span>
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-tight leading-relaxed">
                    Payments are handled securely via Razorpay. Arham Builds does not store your card or UPI details.
                  </p>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-5 space-y-3 animate-slide-up delay-300">
                <div className={cn(
                  "p-5 md:p-6 rounded-[2rem] transition-all duration-500 overflow-hidden relative",
                  isEditingAssets 
                    ? "bg-[#16181b] border border-gray-800 shadow-[20px_20px_40px_rgba(0,0,0,0.4)]" 
                    : "bg-white card-shadow"
                )}>
                  {/* Product Info */}
                  <div className="flex gap-4 mb-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-2xl shadow-black/10 border border-white/10">
                      <img 
                        src={product.thumbnailUrl} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="text-[7px] font-black uppercase tracking-[0.3em] mb-0.5 text-primary">
                        {product.categories[0] || 'Digital'} • {product.section}
                      </div>
                      <h3 className={cn(
                        "text-[13px] font-black uppercase tracking-tighter leading-tight line-clamp-1",
                        isEditingAssets ? "text-white" : "text-heading"
                      )}>{product.title}</h3>
                      <div className={cn(
                        "mt-0.5 text-sm font-black",
                        isEditingAssets ? "text-white" : "text-heading"
                      )}>
                        ₹{product.currentPrice}
                      </div>
                    </div>
                  </div>

                  <div className={cn("h-[1px] my-4 transition-colors", isEditingAssets ? "bg-gray-800" : "bg-gray-100")}></div>

                  {/* Coupon Section */}
                  <div className="space-y-2 mb-4">
                    {product?.section === 'Templates' && (
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 px-1">
                          <Tag size={10} className="text-gray-400" />
                          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Coupons</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {AVAILABLE_COUPONS.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => handleApplyCoupon(c.code)}
                              className={cn(
                                "px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300",
                                appliedCoupon?.code === c.code 
                                  ? "bg-primary text-white scale-95 shadow-lg shadow-primary/20" 
                                  : isEditingAssets 
                                    ? "bg-white/5 text-primary border border-primary/20 hover:bg-white/10" 
                                    : "bg-primary/5 text-primary hover:bg-primary/10"
                              )}
                            >
                              {c.code}
                              <Zap size={8} strokeWidth={4} className="text-primary/60" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">Have a coupon code?</span>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          placeholder="PASTE CODE HERE..."
                          className={cn(
                            "flex-1 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 outline-none border",
                            isEditingAssets 
                              ? "bg-white/5 border-white/5 text-white placeholder:text-white/20 focus:border-primary/50" 
                              : "bg-[#f8f9fb] border-transparent text-heading focus:bg-white focus:border-primary/20 placeholder:text-gray-400"
                          )}
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={!!appliedCoupon}
                        />
                        <button 
                          onClick={() => handleApplyCoupon()}
                          disabled={!!appliedCoupon || !couponCode}
                          className={cn(
                            "px-4 rounded-2xl text-[8px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                            appliedCoupon 
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                              : "bg-primary text-white hover:shadow-xl hover:shadow-primary/30 active:scale-95 disabled:opacity-30 disabled:grayscale"
                          )}
                        >
                          {appliedCoupon ? 'Applied' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="space-y-3">
                    <div className={cn(
                      "p-5 rounded-[2rem] space-y-3",
                      isEditingAssets ? "bg-white/5 border border-white/5" : "bg-[#f8f9fb]"
                    )}>
                      <div className="flex justify-between items-center text-[11px] font-bold tracking-tight text-gray-500">
                        <span className="uppercase tracking-[0.1em]">Value</span>
                        <span className={isEditingAssets ? "text-white/60" : "text-heading"}>₹{pricing?.originalValue}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-[11px] font-bold tracking-tight text-gray-500">
                        <span className="uppercase tracking-[0.1em]">Discount</span>
                        <span className="text-emerald-500">-₹{pricing?.inventorySaleDiscount}</span>
                      </div>

                      {pricing && pricing.promoDiscount > 0 && (
                        <div className="flex justify-between items-center text-[11px] font-black tracking-tight text-emerald-500">
                          <span className="uppercase tracking-[0.1em]">Promo ({pricing.appliedCoupon?.code})</span>
                          <span>-₹{pricing.promoDiscount}</span>
                        </div>
                      )}

                      <div className="h-[1px] border-t border-dashed border-gray-200 dark:border-gray-800 my-2"></div>

                      <div className="flex justify-between items-center text-[12px] font-black uppercase tracking-widest">
                        <span className={isEditingAssets ? "text-white" : "text-heading"}>Subtotal</span>
                        <span className={isEditingAssets ? "text-white" : "text-heading"}>₹{pricing?.grandTotal}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <div className="flex flex-col">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.2em]",
                            isEditingAssets ? "text-white/60" : "text-gray-500"
                          )}>Final Amount</span>
                          <span className="text-[8px] font-medium text-primary uppercase tracking-widest mt-0.5">Inclusive of taxes</span>
                        </div>
                        <span className={cn(
                          "text-2xl font-black tracking-tighter",
                          isEditingAssets ? "text-white" : "text-heading"
                        )}>₹{pricing?.grandTotal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Combined Button */}
                  <button
                    onClick={handlePayment}
                    disabled={!isFormValid || isProcessing}
                    className={cn(
                      "hidden lg:flex w-full mt-4 h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-primary/30",
                      (!isFormValid || isProcessing) 
                        ? "opacity-50 cursor-not-allowed scale-100 grayscale" 
                        : "hover:scale-105 hover:bg-primary/95 active:scale-95"
                    )}
                  >
                    {isProcessing ? (
                      <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Lock size={16} strokeWidth={3} />
                        <span>PAY ₹{pricing?.grandTotal} NOW</span>
                        <ArrowRight size={16} strokeWidth={3} className="opacity-40" />
                      </>
                    )}
                  </button>
                </div>
                
                {/* Badges */}
                <div className="flex items-center justify-center gap-6 py-2 opacity-20 grayscale transition-all hover:opacity-50 hover:grayscale-0">
                  {['Visa', 'Mastercard', 'UPI', 'Stripe'].map(method => (
                    <span key={method} className={cn(
                      "text-[8px] font-black uppercase tracking-[0.3em]",
                      isEditingAssets ? "text-white" : "text-heading"
                    )}>{method}</span>
                  ))}
                </div>
              </div>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bar */}
      {!isSuccess && (
        <div className="lg:hidden sticky bottom-0 z-50">
          <div className={cn(
            "p-5 flex items-center gap-6 border-t shadow-[0_-20px_40px_rgba(0,0,0,0.1)]",
            isEditingAssets ? "bg-[#16181b] border-gray-800" : "bg-white border-gray-200"
          )}>
            <div className="flex-shrink-0">
              <div className={cn(
                "text-[9px] font-bold uppercase tracking-[0.2em] opacity-40 mb-1",
                isEditingAssets ? "text-white" : "text-heading"
              )}>Grand Total</div>
              <div className="text-2xl font-black text-primary tracking-tighter leading-none">₹{pricing?.grandTotal}</div>
            </div>
            <button
              onClick={handlePayment}
              disabled={!isFormValid || isProcessing}
              className={cn(
                "flex-1 h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95",
                (!isFormValid || isProcessing) && "opacity-50 grayscale"
              )}
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock size={16} strokeWidth={3} />
                  <span>PAY ₹{pricing?.grandTotal} NOW</span>
                  <ArrowRight size={16} strokeWidth={3} className="opacity-40" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
