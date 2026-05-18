import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronDown, 
  Check, 
  Lock, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  User,
  Tag,
  Zap,
  X,
  FileText,
  Info,
  Calendar,
  Package,
  Truck,
  Download,
  Gavel
} from 'lucide-react';
import DeliveryProcess from './DeliveryProcess';
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
  phoneLength: number;
}

const COUNTRIES: Country[] = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93', phoneLength: 9 },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355', phoneLength: 9 },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213', phoneLength: 9 },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', dialCode: '+376', phoneLength: 6 },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244', phoneLength: 9 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54', phoneLength: 10 },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374', phoneLength: 8 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61', phoneLength: 9 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43', phoneLength: 10 },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994', phoneLength: 9 },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973', phoneLength: 8 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880', phoneLength: 10 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32', phoneLength: 9 },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975', phoneLength: 8 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55', phoneLength: 11 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1', phoneLength: 10 },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56', phoneLength: 9 },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86', phoneLength: 11 },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57', phoneLength: 10 },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385', phoneLength: 9 },
  { code: 'CZ', name: 'Czechia', flag: '🇨🇿', dialCode: '+420', phoneLength: 9 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45', phoneLength: 8 },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20', phoneLength: 10 },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358', phoneLength: 9 },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33', phoneLength: 9 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49', phoneLength: 11 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30', phoneLength: 10 },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '+852', phoneLength: 8 },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36', phoneLength: 9 },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354', phoneLength: 7 },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91', phoneLength: 10 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62', phoneLength: 11 },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98', phoneLength: 10 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353', phoneLength: 9 },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972', phoneLength: 9 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39', phoneLength: 10 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81', phoneLength: 10 },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962', phoneLength: 9 },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7', phoneLength: 10 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254', phoneLength: 9 },
  { code: 'KR', name: 'Korea (South)', flag: '🇰🇷', dialCode: '+82', phoneLength: 10 },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965', phoneLength: 8 },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961', phoneLength: 8 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60', phoneLength: 9 },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960', phoneLength: 7 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52', phoneLength: 10 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212', phoneLength: 9 },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977', phoneLength: 10 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31', phoneLength: 9 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64', phoneLength: 9 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234', phoneLength: 10 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47', phoneLength: 8 },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968', phoneLength: 8 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92', phoneLength: 10 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63', phoneLength: 10 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48', phoneLength: 9 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351', phoneLength: 9 },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974', phoneLength: 8 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40', phoneLength: 10 },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7', phoneLength: 10 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966', phoneLength: 9 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65', phoneLength: 8 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27', phoneLength: 9 },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34', phoneLength: 9 },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94', phoneLength: 9 },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46', phoneLength: 10 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41', phoneLength: 9 },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886', phoneLength: 9 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66', phoneLength: 9 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90', phoneLength: 10 },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380', phoneLength: 9 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971', phoneLength: 9 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44', phoneLength: 10 },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1', phoneLength: 10 },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998', phoneLength: 9 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84', phoneLength: 9 },
];

interface Coupon {
  code: string;
  discount: number;
}

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);
  const [hasSeenTermsAuto, setHasSeenTermsAuto] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  
  const [mobileStep, setMobileStep] = useState<'summary' | 'details'>('summary');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const india = COUNTRIES.find(c => c.code === 'IN') || COUNTRIES[0];
  const [selectedCountry, setSelectedCountry] = useState<Country>(india);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgV4_PzmTUKmZfLipz0IZOO5cMvwqNvfX1zIQrv19tqdMzCd3qNRmbcqgLzeY-nfdCl-Y_3KbaToX3lLgamK1wbKH9We_0RdavOm4Ci24K6cVz0RorQK95k8aGSdh2lRMz0pyCdoVzKYFgN0cQQwerenIipHrNAYHDa2h61HIejBn07XpGX3SxOHnj9JA/s320/Arham-Adib-Logo.jpg";

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
      promoDiscount = Math.round(subtotal * (appliedCoupon.discount / 100));
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
    const trimmedName = formData.fullName.trim();
    if (trimmedName.length < 3) return false;

    // Strict email regex: requires at least 3 characters after the final dot (e.g., .com, .org)
    // This will prevent .co or .in from being marked as valid if the user wants at least 3 chars.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{3,}$/;
    if (!emailRegex.test(formData.email)) return false;

    // Check for full digit phone number based on selected country
    if (formData.phone.length !== selectedCountry.phoneLength) return false;

    return true;
  };

  const isContactInfoValid = useMemo(() => {
    return validateStep1();
  }, [formData, selectedCountry]);

  const isFormValid = useMemo(() => {
    return isContactInfoValid && isTermsAccepted;
  }, [isContactInfoValid, isTermsAccepted]);

  useEffect(() => {
    if (isContactInfoValid && !isTermsAccepted && !hasSeenTermsAuto && !showFullTerms) {
      setShowFullTerms(true);
      setHasSeenTermsAuto(true);
    }
  }, [isContactInfoValid, isTermsAccepted, hasSeenTermsAuto, showFullTerms]);

  useEffect(() => {
    if (showFullTerms) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showFullTerms]);

  const handleApplyCoupon = (codeToApply?: string) => {
    if (!product || !product.coupons) {
      alert('Invalid coupon code.');
      return;
    }
    
    const code = (codeToApply || couponCode).toUpperCase();
    const found = product.coupons.find(c => c.code.toUpperCase() === code);
    
    if (found) {
      setAppliedCoupon(found);
      setCouponCode(found.code);
    } else if (couponCode.trim() !== '' || codeToApply) {
      alert('Invalid coupon code.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
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
        setRazorpayPaymentId(response.razorpay_payment_id);
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
        color: "#ff014f", // Primary brand color (#ff014f)
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
      "min-h-screen transition-colors duration-500 font-sans flex flex-col no-scrollbar bg-[#f4f5f8]"
    )}>
      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col items-center max-w-7xl mx-auto w-full px-6",
        isSuccess ? "py-4 md:py-8" : "py-6 md:py-12"
      )}>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full"
            >
              <DeliveryProcess 
                onBack={() => navigate('/')}
                items={product ? [product] : []}
                customerName={formData.fullName}
                customerEmail={formData.email}
                customerPhone={selectedCountry.dialCode + " " + formData.phone}
                orderId={razorpayPaymentId || undefined}
                coupon={appliedCoupon ? { code: appliedCoupon.code, discount: appliedCoupon.discount } : undefined}
              />
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
              <div className="flex items-center justify-between mb-6 md:mb-8 px-2">
                <Link to="/" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full overflow-hidden p-0.5 group-hover:scale-105 transition-all duration-500 border-2 bg-white border-pink-200 shadow-[0_8px_20px_-4px_rgba(236,72,153,0.3)]">
                    <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover scale-125" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none flex items-center text-slate-800" style={{ 
                      textShadow: '2px 2px 0px rgba(236,72,153,0.2), 4px 4px 0px rgba(59,130,246,0.1)' 
                    }}>
                      ARHAM BUILDS
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <ShieldCheck size={10} className="text-primary" />
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Payment Checkout</span>
                    </div>
                  </div>
                </Link>

                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 bg-white border border-gray-100 text-gray-400 shadow-sm hover:bg-gray-50"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>
 
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start w-full">
                {/* Vertical Progress Stepper - Hidden on Mobile */}
                <div className="hidden lg:flex flex-col gap-12 pt-10 w-32 shrink-0">
                  {/* Step 1 */}
                  <div className="flex items-center gap-4 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 shrink-0",
                      isContactInfoValid 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-500"
                        : "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                    )}>
                      {isContactInfoValid ? <Check size={14} strokeWidth={4} /> : <span className="text-[10px] font-black">01</span>}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate text-primary/100">Details</span>
                    <div className={cn(
                      "absolute top-8 left-4 w-[1px] h-12 transition-colors duration-500", 
                      isContactInfoValid ? "bg-emerald-500/20" : "bg-gray-100"
                    )}></div>
                  </div>
 
                  {/* Step 2 */}
                  <div className="flex items-center gap-4 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 shrink-0",
                      isTermsAccepted 
                        ? "bg-emerald-50 border-emerald-500 text-emerald-500"
                        : (isContactInfoValid 
                            ? "bg-primary border-primary text-white"
                            : "bg-white border-gray-200 text-gray-300")
                    )}>
                      {isTermsAccepted ? <Check size={14} strokeWidth={4} /> : <span className="text-[10px] font-black">02</span>}
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate",
                      isTermsAccepted || isContactInfoValid ? "text-primary/100" : "text-primary/40"
                    )}>Review</span>
                    <div className={cn(
                      "absolute top-8 left-4 w-[1px] h-12 transition-colors duration-500",
                      isTermsAccepted ? "bg-emerald-500/20" : "bg-gray-100"
                    )}></div>
                  </div>
 
                  {/* Step 3 */}
                  <div className="flex items-center gap-4 relative">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 shadow-lg shrink-0 transition-all duration-500",
                      isFormValid 
                        ? "bg-primary border-primary text-white shadow-primary/30" 
                        : "bg-white border-gray-200 text-gray-300"
                    )}>
                      <span className="text-[10px] font-black">03</span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate",
                      isFormValid ? "text-primary" : "text-primary/40"
                    )}>Checkout</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full relative">
                  <AnimatePresence mode="wait">
                    {(isDesktop || mobileStep === 'details') && (
                      <motion.div 
                        key="details-column"
                        initial={!isDesktop ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={!isDesktop ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        ref={contactRef} 
                        className="lg:col-span-7 space-y-6 order-2 lg:order-1 w-full mt-6 lg:mt-0"
                      >
                        {/* Back to Summary (Mobile Only) */}
                        <div className="lg:hidden">
                          <button 
                            onClick={() => {
                              setMobileStep('summary');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary"
                          >
                            <ChevronLeft size={14} strokeWidth={3} />
                            <span>Back to order summary</span>
                          </button>
                        </div>
 
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 md:p-5 rounded-[2rem] transition-all duration-500 bg-white card-shadow"
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                              <User size={14} />
                            </div>
                            <div>
                              <h2 className="text-xs md:text-sm font-black uppercase tracking-tighter text-heading">
                                {isEditingAssets ? "Project Information" : "Contact Information"}
                              </h2>
                            </div>
                          </div>
 
                          <div className="space-y-3">
                            {/* Full Name */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Full Name</label>
                              </div>
                              <input 
                                type="text"
                                placeholder="e.g. John Doe"
                                className="w-full px-5 py-3.5 rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                              />
                            </div>
 
                            {/* Email */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Email Address</label>
                                <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">
                                  {isEditingAssets ? "For file delivery" : "For delivery"}
                                </span>
                              </div>
                              <input 
                                type="email"
                                placeholder="name@email.com"
                                className="w-full px-5 py-3 rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                              />
                            </div>
 
                            {/* Phone Number */}
                            <div className="space-y-1">
                              <div className="flex justify-between items-center px-1">
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Phone Number</label>
                              </div>
                              <div className="flex gap-3">
                                <div className="relative">
                                  <button 
                                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                                    className="h-[46px] px-3.5 rounded-2xl border transition-all duration-300 flex items-center gap-2 bg-gray-100 border-gray-100 text-gray-900 shadow-sm"
                                  >
                                    <span className={cn("fi", `fi-${selectedCountry.code.toLowerCase()}`, "text-lg shadow-sm")}></span>
                                    <ChevronDown size={10} className="opacity-40" />
                                  </button>
                                  
                                  <AnimatePresence>
                                    {isCountryDropdownOpen && (
                                      <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsCountryDropdownOpen(false)}></div>
                                        <motion.div 
                                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                          animate={{ opacity: 1, y: 0, scale: 1 }}
                                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                          className="absolute top-[calc(100%+10px)] left-0 w-64 z-50 rounded-2xl shadow-2xl p-2 animate-glass overflow-y-auto max-h-72 bg-white border border-gray-100"
                                        >
                                          {COUNTRIES.map((country) => (
                                            <button
                                              key={country.code}
                                              onClick={() => {
                                                setSelectedCountry(country);
                                                setIsCountryDropdownOpen(false);
                                              }}
                                              className={cn(
                                                "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 text-left mb-1 last:mb-0 hover:bg-primary/5",
                                                selectedCountry.code === country.code && "bg-primary/5 text-primary"
                                              )}
                                            >
                                              <div className="flex items-center gap-3">
                                                <span className={cn("fi", `fi-${country.code.toLowerCase()}`, "text-xl shadow-sm min-w-[1.5rem] h-4")}></span>
                                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">{country.name}</span>
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
                                    className="w-full pl-14 pr-5 h-[46px] rounded-2xl text-[12px] font-bold transition-all duration-300 outline-none border focus:ring-4 bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-300 focus:border-primary/30 focus:ring-primary/5"
                                    value={formData.phone}
                                    onChange={(e) => {
                                      const val = e.target.value.replace(/\D/g, '');
                                      if (val.length <= selectedCountry.phoneLength) {
                                        setFormData({...formData, phone: val});
                                      }
                                    }}
                                    maxLength={selectedCountry.phoneLength}
                                  />
                                </div>
                              </div>
                            </div>
 
                            <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                              <label className={cn(
                                "flex items-center gap-4 group transition-all duration-300",
                                !isContactInfoValid ? "opacity-30 cursor-not-allowed grayscale" : "cursor-pointer"
                              )}>
                                <div className="relative">
                                  <input 
                                    type="checkbox"
                                    className="peer sr-only"
                                    checked={isTermsAccepted}
                                    onChange={(e) => {
                                      if (isContactInfoValid) {
                                        setIsTermsAccepted(e.target.checked);
                                      }
                                    }}
                                    disabled={!isContactInfoValid}
                                  />
                                  <div className="w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center border-gray-200 bg-white peer-checked:border-primary peer-checked:bg-primary/5 shadow-sm">
                                    <Check 
                                      size={14} 
                                      strokeWidth={5} 
                                      className={cn(
                                        "text-black transition-all duration-300",
                                        isTermsAccepted ? "opacity-100 scale-110" : "opacity-0 scale-50"
                                      )} 
                                    />
                                  </div>
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-tight select-none text-gray-400">
                                  I agree to the <button type="button" onClick={() => {
                                    if (isContactInfoValid) {
                                      setShowFullTerms(true);
                                    } else {
                                      alert("Please fill in your full name, email, and valid phone number first.");
                                    }
                                  }} className="text-primary hover:underline underline-offset-4 font-black">Terms & Conditions</button>
                                </span>
                              </label>
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Mobile Pay Button - Only visible on mobile after details */}
                        <div className="lg:hidden animate-slide-up delay-200">
                          <button
                            onClick={handlePayment}
                            disabled={!isFormValid || isProcessing}
                            className={cn(
                              "w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary/20",
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
                        
                        <div className={cn(
                          "p-3 rounded-[1.2rem] border transition-all duration-300 bg-gray-100/50 border-gray-100 text-gray-400"
                        )}>
                          <div className="flex items-center gap-3 mb-1">
                            <ShieldCheck size={14} />
                            <span className="text-[9px] font-black uppercase tracking-widest text-primary">Secure Payment Gateway</span>
                          </div>
                          <p className="text-[8px] font-bold uppercase tracking-tight leading-relaxed">
                            Payments are handled securely via Razorpay. Arham Builds does not store your card or UPI details.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {(isDesktop || mobileStep === 'summary') && (
                      <motion.div 
                        key="summary-column"
                        initial={!isDesktop ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={!isDesktop ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:col-span-5 space-y-3 order-1 lg:order-2 w-full mt-6 lg:mt-0"
                      >
                        <div className="p-4 md:p-5 rounded-[1.5rem] transition-all duration-500 overflow-hidden relative bg-white card-shadow">
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
                              <h3 className="text-[13px] font-black uppercase tracking-tighter leading-tight line-clamp-1 text-heading">{product.title}</h3>
                              <div className="mt-0.5 text-sm font-black text-heading">
                                ₹{product.currentPrice}
                              </div>
                            </div>
                          </div>

                          <div className="h-[1px] my-3 transition-colors bg-gray-100"></div>

                          {/* Coupon Section */}
                          <div className="space-y-2 mb-3">
                            {product?.coupons && product.coupons.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 mb-1.5 px-1">
                                  <Tag size={10} className="text-gray-400" />
                                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Coupons</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {product.coupons.map((c) => (
                                    <button
                                      key={c.code}
                                      onClick={() => handleApplyCoupon(c.code)}
                                      className={cn(
                                        "px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300",
                                        appliedCoupon?.code === c.code 
                                          ? "bg-primary text-white scale-95 shadow-lg shadow-primary/20" 
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
                              <div className="flex items-center justify-between mb-1 px-1">
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Coupon</span>
                                {appliedCoupon && (
                                  <button 
                                    onClick={handleRemoveCoupon}
                                    className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.1em] text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <div className="w-3.5 h-3.5 rounded-full border border-red-500/30 flex items-center justify-center">
                                      <div className="w-1.5 h-[1.5px] bg-red-500" />
                                    </div>
                                    Remove Applied
                                  </button>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <input 
                                  type="text"
                                  placeholder="PASTE CODE HERE..."
                                  className="flex-1 px-4 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 outline-none border bg-[#f8f9fb] border-transparent text-heading focus:bg-white focus:border-primary/20 placeholder:text-gray-400"
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
                            <div className="p-4 rounded-[1.5rem] space-y-2 bg-[#f8f9fb]">
                              <div className="flex justify-between items-center text-[11px] font-bold tracking-tight text-gray-500">
                                <span className="uppercase tracking-[0.1em]">Value</span>
                                <span className="text-heading">₹{pricing?.originalValue}</span>
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
                                <span className="text-heading">Subtotal</span>
                                <span className="text-heading">₹{pricing?.grandTotal}</span>
                              </div>
 
                              <div className="flex justify-between items-center pt-2">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Final Amount</span>
                                  <span className="text-[8px] font-medium text-primary uppercase tracking-widest mt-0.5">Inclusive of taxes</span>
                                </div>
                                <span className="text-2xl font-black tracking-tighter text-heading">₹{pricing?.grandTotal}</span>
                              </div>
                            </div>
                          </div>

                          {/* Mobile Continue Button */}
                          <button
                            onClick={() => {
                              setMobileStep('details');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className={cn(
                              "lg:hidden w-full mt-4 h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-4 transition-all duration-300 shadow-2xl shadow-primary/30",
                              "hover:scale-105 hover:bg-primary/95 active:scale-95"
                            )}
                          >
                            <span>CONTINUE TO DETAILS</span>
                            <ArrowRight size={16} strokeWidth={3} className="opacity-40" />
                          </button>

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
                        <div className="hidden lg:flex items-center justify-center gap-6 py-2 opacity-20 grayscale transition-all hover:opacity-50 hover:grayscale-0">
                          {['Visa', 'Mastercard', 'UPI', 'Stripe'].map(method => (
                            <span key={method} className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400">{method}</span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Policies Modal */}
      {showFullTerms && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-white/60 dark:bg-black/80 backdrop-blur-xl animate-fade-in">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-lg rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border overflow-hidden flex flex-col max-h-[90dvh] bg-white border-gray-100"
          >
             
             {/* Modal Header */}
             <div className="p-6 border-b flex justify-between items-center flex-shrink-0 bg-gray-50/50 border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm transition-all group-hover:scale-105">
                    <FileText size={20} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-black tracking-tight leading-none text-gray-900">
                      Store Policies
                    </h3>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFullTerms(false)} 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all active:scale-90 hover:bg-gray-100 text-gray-400"
                >
                  <X size={20} strokeWidth={3} />
                </button>
             </div>
             
             {/* Modal Content - Scrollable */}
             <div className="flex-1 overflow-y-auto p-6 space-y-6 touch-auto no-scrollbar pb-12">
                
                {/* How It Works Section */}
                <section className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Info size={16} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">HOW IT WORKS</h4>
                  </div>
                  <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                    {isEditingAssets 
                      ? "Our process is designed for speed, simplicity, and secure delivery. Once your payment is completed successfully, your files are prepared instantly and delivered digitally. Instead of direct download access, you will receive a secure PDF containing your private Google Drive download link along with your payment receipt PDF for verification and records."
                      : "Our process is streamlined for speed. Once purchased, you will receive a PDF containing your customization form link along with your payment receipt PDF for verification and records. Complete the customization form with your details (photos, text, preferences). Our team will then manually create and deploy your personalized website."
                    }
                  </p>
                </section>
 
                {/* Privacy & Data Section */}
                <section className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <ShieldCheck size={16} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">PRIVACY & DATA</h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                      {isEditingAssets 
                        ? "Your privacy and payment security are important to us. We only collect limited information such as your name, email address, and phone number for payment verification, order delivery, customer support, and purchase records. We do NOT store your UPI PIN, bank credentials, or sensitive payment info. All transactions are securely processed through Razorpay's encrypted system."
                        : "Your privacy matters to us. We use your photos and text only for the purpose of creating your requested website. Once the validity period ends and the site is taken down, all personal assets associated with that project are securely deleted from our active deployment servers. We only collect basic information such as your name, email address, and phone number for payment verification, delivery access, customer support, and order management purposes. We do not store your UPI PIN, bank details, card information, or sensitive payment credentials. All payments are securely processed and protected through Razorpay’s encrypted payment system. Your personal information is never sold or shared with third parties."
                      }
                    </p>
                    {isEditingAssets && (
                      <div className="mt-1 p-3 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
                        <Lock className="text-blue-500 shrink-0" size={14} />
                        <p className="text-[10px] font-black uppercase tracking-tight text-blue-600 leading-tight">
                          SAFE PURCHASE: ALL PAYMENTS ARE VERIFIED AND PROTECTED THROUGH RAZORPAY TO ENSURE A SECURE CHECKOUT EXPERIENCE.
                        </p>
                      </div>
                    )}
                  </div>
                </section>

                {/* Instant Delivery Process Section */}
                <section className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      {isEditingAssets ? <Zap size={16} strokeWidth={2.5} /> : <Truck size={16} strokeWidth={2.5} />}
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">
                      {isEditingAssets ? "INSTANT DELIVERY PROCESS" : "DELIVERY PROCESS"}
                    </h4>
                  </div>
                  <div className="space-y-2 px-1">
                    <div className="flex gap-4 items-start">
                      <div className="text-[12px] font-black text-blue-500 mt-0.5 shrink-0">01</div>
                      <p className="text-[12px] tracking-wide leading-normal text-gray-600">
                        {isEditingAssets 
                          ? "Complete your payment securely through Razorpay." 
                          : "You will receive a PDF containing your customization form link along with your payment receipt PDF for verification and records."
                        }
                      </p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-[12px] font-black text-blue-500 mt-0.5 shrink-0">02</div>
                      <p className="text-[12px] tracking-wide leading-normal text-gray-600">
                        {isEditingAssets 
                          ? "Receive a payment confirmation receipt along with a secure PDF containing your private Google Drive download link instantly after successful payment." 
                          : "Complete the customization form. The 24-hour delivery timer starts after the form is submitted."
                        }
                      </p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="text-[12px] font-black text-blue-500 mt-0.5 shrink-0">03</div>
                      <p className="text-[12px] tracking-wide leading-normal text-gray-600">
                        {isEditingAssets 
                          ? "Download the ZIP file, extract it, and access all included assets, templates, presets, overlays, fonts, or project files instantly." 
                          : "Receive your live URL and QR code directly through your email or chat."
                        }
                      </p>
                    </div>
                  </div>
                </section>

                {/* Download & Access (Editing Assets Only) */}
                {isEditingAssets && (
                  <section className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <Download size={16} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">DOWNLOAD & ACCESS</h4>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                        All products are delivered digitally through secure Google Drive links provided inside a PDF document. Files are generally delivered in ZIP or RAR format. Please extract the archive using WinRAR or 7-Zip to access the files properly.
                      </p>
                      <ul className="space-y-1 text-[11px] font-bold text-gray-500 px-1 list-disc list-inside opacity-70">
                        <li>Links may be hidden inside a secure PDF file</li>
                        <li>Payment confirmation is provided separately</li>
                        <li>Save both PDFs for future access and verification</li>
                      </ul>
                    </div>
                  </section>
                )}

                {/* Usage & Resale Policies (Editing Assets Only) */}
                {isEditingAssets && (
                  <>
                    <section className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                          <FileText size={16} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">USAGE & ATTRIBUTION</h4>
                      </div>
                      <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                        These assets are collected, created, customized, or curated for creative and professional use. You may use them in personal or client projects. Redistribution rights are NOT included.
                      </p>
                    </section>

                    <section className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                          <Gavel size={16} strokeWidth={2.5} />
                        </div>
                        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">RESALE POLICY</h4>
                      </div>
                      <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                        Reselling, redistributing, leaking, or sharing purchased files is strictly prohibited. unauthorized activity will result in strict legal action immediately without prior notice.
                      </p>
                    </section>
                  </>
                )}
 
                {/* Refund & Cancellation Section */}
                <section className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <ShieldAlert size={16} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">REFUND & CANCELLATION</h4>
                  </div>
                  <div className="space-y-2 px-1">
                    <p className="text-[12px] leading-normal tracking-wide text-gray-500">
                      {isEditingAssets 
                        ? "Because these are digital products, all sales are final. Refunds or cancellations will not be issued once the delivery PDFs or download access have been generated successfully."
                        : "As these are digital products, all sales are final. No refunds will be issued once the process has started."
                      }
                    </p>
                    {!isEditingAssets && (
                      <ul className="space-y-2 text-[12px] tracking-wide text-gray-600">
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 shrink-0" />
                          <span>Orders cannot be cancelled once the payment is confirmed.</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2.5 shrink-0" />
                          <span>We offer a 100% money-back guarantee only if we fail to deliver within 24 hours after form submission.</span>
                        </li>
                      </ul>
                    )}
                    {isEditingAssets && (
                      <p className="text-[11px] font-bold text-red-500 leading-tight">
                        * IF YOU FACE TECHNICAL ISSUES (CORRUPTED FILES/INVALID LINKS), SUPPORT WILL BE PROVIDED TO RESOLVE IT.
                      </p>
                    )}
                  </div>
                </section>
 
                {/* Validity Section */}
                <section className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                      <Calendar size={16} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-black">
                      {isEditingAssets ? "ASSET VALIDITY" : "WEBSITE VALIDITY"}
                    </h4>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[12px] leading-normal tracking-wide px-1 text-gray-500">
                      {isEditingAssets 
                        ? "Your purchased assets come with LIFETIME ACCESS. Once purchased, the files are yours to keep and use according to the license terms. We strongly recommend downloading and backing up your assets after purchase for permanent access and safety."
                        : "Your website will remain active and hosted for 2 months. For extensions or permanent hosting, please contact us at arhamadib31@gmail.com before your link expires."
                      }
                    </p>
                  </div>
                </section>
 
                <div className="p-4 rounded-xl border flex gap-3 bg-gray-50 border-gray-100">
                  <ShieldAlert className="text-amber-500 flex-shrink-0" size={16} />
                  <p className="text-[10px] leading-normal font-bold text-gray-500">
                    By clicking 'I Agree', you confirm that you have read and understood our delivery timelines and non-refundable policy.
                  </p>
                </div>
             </div>
 
             {/* Modal Footer */}
             <div className="p-8 border-t flex-shrink-0 bg-white border-gray-100">
                <button 
                  onClick={() => { setShowFullTerms(false); setIsTermsAccepted(true); }} 
                  className="group relative overflow-hidden w-full bg-primary text-white py-5 rounded-[1.5rem] font-black text-[12px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(255,51,102,0.4)]"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" style={{ animationDuration: '2s' }}></div>
                  I UNDERSTAND & AGREE
                </button>
             </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
