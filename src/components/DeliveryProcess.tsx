import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Download, 
  ClipboardEdit,
  ArrowLeft,
  Package,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TEMPLATE_STORE_POLICIES, EDITING_ASSETS_STORE_POLICIES } from '../data';
import { cn } from '../lib/utils';

interface DeliveryProcessProps {
  onBack?: () => void;
  items?: any[];
  orderId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  coupon?: { code: string; discount: number };
}

const DeliveryProcess: React.FC<DeliveryProcessProps> = ({ 
  onBack, 
  items = [], 
  orderId: propOrderId,
  customerName = "Valued Customer",
  customerEmail = "Not Provided",
  customerPhone = "Not Provided",
  coupon
}) => {
  const navigate = useNavigate();
  const [showCelebration, setShowCelebration] = useState(true);
  const [orderId] = useState(() => propOrderId || `pay_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`);
  const [isVisible, setIsVisible] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgV4_PzmTUKmZfLipz0IZOO5cMvwqNvfX1zIQrv19tqdMzCd3qNRmbcqgLzeY-nfdCl-Y_3KbaToX3lLgamK1wbKH9We_0RdavOm4Ci24K6cVz0RorQK95k8aGSdh2lRMz0pyCdoVzKYFgN0cQQwerenIipHrNAYHDa2h61HIejBn07XpGX3SxOHnj9JA/s320/Arham-Adib-Logo.jpg";

  const subtotal = items.reduce((sum, item) => sum + (item.currentPrice * (item.quantity || 1)), 0);
  const couponDiscountAmount = coupon ? Math.floor(subtotal * (coupon.discount / 100)) : 0;
  const totalPrice = subtotal - couponDiscountAmount;
  
  const firstItem = items.length > 0 ? items[0] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setShowCelebration(false), 4000);
    const revealTimer = setTimeout(() => setIsVisible(true), 50);
    
    // Auto-download unified PDF after a short delay
    const autoDownloadTimer = setTimeout(() => {
      handleDownloadFullOrder();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(revealTimer);
      clearTimeout(autoDownloadTimer);
    };
  }, []);

  const handleDownloadFullOrder = async () => {
    if (isGeneratingPDF || !firstItem) return;
    setIsGeneratingPDF(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Setup colors
      const pinkColor = [255, 1, 79];
      const accentColorGuide = [255, 64, 129]; // Pink for Page 2
      
      // Logo URLs
      const arhamLogoUrl = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGerWLzMB6sist_c1s9aQZ-18JCIOAuOzllZ0-Hx5gdjyJ4xiaoW4ItlvmDYzLmQaich3erS_p2rf3cmQCla-UZw0Gf2DGnzvFPUKVBj0njTizv5I9zqO6UK1db9tEQkx6pKil3umTOwqwZpmPf5R0dFXxqUxtUQ3I_pQ6om9DBuRhfhIKiMmu3aPcDNk/s820/cropped_circle_image%20(3)%20(1)%20(2)%20(1).png";
      const razorpayLogoUrl = "https://cdn.razorpay.com/static/assets/logo/razorpay.png";

      // Helper to load image as base64
      const loadImage = async (url: string): Promise<string | null> => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) throw new Error('Network response was not ok');
          const blob = await response.blob();
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn("Fetch failed, falling back to Image object:", e);
          return new Promise((resolve) => {
            const img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  ctx.drawImage(img, 0, 0);
                  resolve(canvas.toDataURL("image/png"));
                } else { resolve(null); }
              } catch { resolve(null); }
            };
            img.onerror = () => resolve(null);
            img.src = url + (url.includes('?') ? '&' : '?') + 't=' + new Date().getTime();
            setTimeout(() => resolve(null), 5000);
          });
        }
      };

      const [arhamLogo, razorpayLogo] = await Promise.all([
        loadImage(arhamLogoUrl),
        loadImage(razorpayLogoUrl)
      ]);

      // --- PAGE 1: RECEIPT ---
      // Top Banner
      doc.setFillColor(255, 251, 235);
      doc.rect(0, 0, pageWidth, 12, 'F');
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(180, 130, 50);
      doc.text("Thanks for your purchase! If you love it, please leave us a quick review.", pageWidth / 2, 8, { align: 'center' });

      // Arham Builds Logo
      if (arhamLogo) {
        doc.addImage(arhamLogo, 'PNG', 15, 18, 22, 22);
      } else {
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("ARHAM ", 15, 28);
        doc.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
        doc.text("BUILDS.", 15 + doc.getTextWidth("ARHAM "), 28);
      }

      // 3. Razorpay Logo & Branding (Only for paid orders)
      if (totalPrice > 0) {
        if (razorpayLogo) {
          doc.addImage(razorpayLogo, 'PNG', pageWidth - 45, 20, 30, 8);
        } else {
          // Stylized Razorpay logo fallback - Icon and Text together
          const text = "Razorpay";
          doc.setFontSize(15);
          doc.setFont("helvetica", "bolditalic");
          const textWidth = doc.getTextWidth(text);
          const iconWidth = 8;
          const gap = 1.5;
          const totalWidth = iconWidth + gap + textWidth;
          
          const startX = pageWidth - 15 - totalWidth;
          const iconY = 18;
          
          // Draw the slanted shapes (Icon)
          doc.setFillColor(15, 23, 42); // Dark Navy
          doc.triangle(startX, iconY + 8, startX + 4, iconY + 8, startX + 4, iconY + 4, 'F');
          
          doc.setFillColor(37, 99, 235); // Razorpay Blue
          doc.triangle(startX + 3, iconY + 8, startX + 7, iconY + 1, startX + 7, iconY + 8, 'F');
          
          // Razorpay Text - placed just beside the icon
          doc.setTextColor(15, 23, 42); // Dark Navy
          doc.setFont("helvetica", "bolditalic");
          doc.text(text, startX + iconWidth + gap, iconY + 7.5);
        }
        doc.setFontSize(7);
        doc.setTextColor(150);
        doc.setFont("helvetica", "normal");
        doc.text("Invoicing and payments", pageWidth - 15, 29.5, { align: 'right' });
        
        const poweredByText = "powered by ";
        const razorpayText = "Razorpay";
        const totalBrandingWidth = doc.getTextWidth(poweredByText + razorpayText);
        const brandingStartX = pageWidth - 15 - totalBrandingWidth;
        
        doc.text(poweredByText, brandingStartX, 32.5);
        doc.setTextColor(37, 99, 235); // Razorpay Blue
        doc.text(razorpayText, brandingStartX + doc.getTextWidth(poweredByText), 32.5);
      } else {
        doc.setFontSize(10);
        doc.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("ARHAM BUILDS", pageWidth - 15, 25, { align: 'right' });
        doc.setFontSize(7);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text("Free Template Confirmation", pageWidth - 15, 29, { align: 'right' });
        doc.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text("arhambuilds.in", pageWidth - 15, 33, { align: 'right' });
        doc.setFillColor(255, 245, 248);
        doc.roundedRect(pageWidth - 55, 38, 40, 8, 2, 2, 'F');
        doc.setFontSize(6);
        doc.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
        doc.text("CERTIFIED FREE ASSET", pageWidth - 35, 43.5, { align: 'center' });
      }

      // Title & Transaction
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Payment Receipt", 15, 60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Transaction Reference: ${orderId}`, 65, 60);

      const transactionText = `This is a payment receipt for your transaction on ${firstItem?.title || 'Template Asset'}`;
      doc.text(doc.splitTextToSize(transactionText, pageWidth - 30), 15, 68);

      // Amount Paid
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.setFont("helvetica", "bold");
      doc.text("AMOUNT PAID", 15, 85);
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`INR ${totalPrice.toFixed(2)}`, 45, 85);
      doc.setDrawColor(pinkColor[0], pinkColor[1], pinkColor[2]);
      doc.setLineWidth(0.8);
      doc.line(15, 88, 35, 88);

      // Issued Info
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.setFont("helvetica", "bold");
      doc.text("ISSUED TO", 15, 105);
      doc.text("PAID ON", 110, 105);

      doc.setTextColor(50);
      doc.setFont("helvetica", "normal");
      doc.text(`Name: ${customerName}`, 15, 112);
      doc.text(`Email: ${customerEmail === "Not Provided" ? "AAFIARHAM2728@GMAIL.COM" : customerEmail}`, 15, 118);
      if (customerPhone !== "Not Provided") doc.text(`Phone: ${customerPhone}`, 15, 124);
      
      const now = new Date();
      doc.text(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), 110, 112);
      doc.text(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true }), 110, 118);

      // Table
      const tableData = items.map(item => [
        item.title,
        `INR ${Number(item.currentPrice || 0).toFixed(2)}`,
        item.quantity || 1,
        `INR ${(Number(item.currentPrice || 0) * (item.quantity || 1)).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 140,
        head: [['DESCRIPTION', 'UNIT PRICE', 'QTY', 'AMOUNT']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: [243, 244, 246], 
          textColor: [100, 100, 100], 
          fontSize: 8, 
          fontStyle: 'bold',
        },
        bodyStyles: { 
          fontSize: 9, 
          textColor: [50, 50, 50] 
        },
        columnStyles: { 
          0: { halign: 'left' }, 
          1: { halign: 'right' }, 
          2: { halign: 'center' }, 
          3: { halign: 'right' } 
        },
        headStyles: { 
          fillColor: [243, 244, 246], 
          textColor: [100, 100, 100], 
          fontSize: 8, 
          fontStyle: 'bold',
          halign: 'right' // Default to right, will override for col 0
        },
        didParseCell: (data) => {
          if (data.section === 'head' && data.column.index === 0) {
            data.cell.styles.halign = 'left';
          }
          if (data.section === 'head' && data.column.index === 2) {
            data.cell.styles.halign = 'center';
          }
        },
        margin: { left: 15, right: 15 }
      });

      const finalY = ((doc as any).lastAutoTable?.finalY || 160) + 15;
      const originalTotal = items.reduce((acc, item) => acc + ((item.originalPrice || item.currentPrice) * (item.quantity || 1)), 0);
      const storeDiscount = originalTotal - items.reduce((acc, item) => acc + (item.currentPrice * (item.quantity || 1)), 0);
      const subtotalAfterStoreDiscount = originalTotal - storeDiscount;
      const couponDiscount = coupon ? Math.floor(subtotalAfterStoreDiscount * (coupon.discount / 100)) : 0;
      
      let currentShiftY = finalY;
      const labelX = pageWidth - 90;
      const valueX = pageWidth - 15;
      
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Original Value", labelX, currentShiftY);
      doc.text(`INR ${originalTotal.toFixed(2)}`, valueX, currentShiftY, { align: 'right' });
      
      if (storeDiscount > 0) {
        currentShiftY += 6;
        doc.setTextColor(22, 163, 74);
        doc.text("Inventory Sale Discount", labelX, currentShiftY);
        doc.text(`- INR ${storeDiscount.toFixed(2)}`, valueX, currentShiftY, { align: 'right' });
      }

      currentShiftY += 6;
      doc.setTextColor(120);
      doc.setFont("helvetica", "bold");
      doc.text("Subtotal", labelX, currentShiftY);
      doc.text(`INR ${subtotalAfterStoreDiscount.toFixed(2)}`, valueX, currentShiftY, { align: 'right' });

      if (couponDiscount > 0) {
        currentShiftY += 6;
        doc.setTextColor(pinkColor[0], pinkColor[1], pinkColor[2]);
        doc.setFont("helvetica", "normal");
        doc.text(`Coupon Discount (${coupon?.code})`, labelX, currentShiftY);
        doc.text(`- INR ${couponDiscount.toFixed(2)}`, valueX, currentShiftY, { align: 'right' });
      }

      currentShiftY += 8;
      doc.setDrawColor(230);
      doc.line(labelX, currentShiftY - 4, valueX, currentShiftY - 4);
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text("Grand Total", labelX, currentShiftY);
      doc.text(`INR ${totalPrice.toFixed(2)}`, valueX, currentShiftY, { align: 'right' });

      doc.setTextColor(150);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text("Page 1 of 2", pageWidth / 2, pageHeight - 10, { align: 'center' });

      // --- PAGE 2: ACCESS GUIDE ---
      doc.addPage();
      
      // Header
      doc.setFillColor(accentColorGuide[0], accentColorGuide[1], accentColorGuide[2]);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("PRODUCT ACCESS GUIDE", pageWidth / 2, 22, { align: 'center' });
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text("Transaction ID: " + orderId, pageWidth / 2, 30, { align: 'center' });

      // Transaction Details
      doc.setTextColor(40);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("TRANSACTION DETAILS", 20, 60);
      doc.setDrawColor(240);
      doc.setLineWidth(0.5);
      doc.line(20, 63, pageWidth - 20, 63);

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("PRODUCT NAME:", 20, 72);
      doc.setFont("helvetica", "normal");
      doc.text(firstItem.title, 60, 72);
      doc.setFont("helvetica", "bold");
      doc.text("CATEGORY:", 20, 80);
      doc.setFont("helvetica", "normal");
      doc.text(firstItem.categories?.join(', ') || firstItem.category || 'General', 60, 80);
      doc.setFont("helvetica", "bold");
      doc.text("PAID AMOUNT:", 20, 88);
      doc.setTextColor(accentColorGuide[0], accentColorGuide[1], accentColorGuide[2]);
      doc.text(`INR ${totalPrice.toLocaleString()}`, 60, 88);

      // Access Instructions
      doc.setFillColor(252, 242, 247);
      doc.roundedRect(20, 100, pageWidth - 40, 50, 4, 4, 'F');
      doc.setTextColor(accentColorGuide[0], accentColorGuide[1], accentColorGuide[2]);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("HOW TO ACCESS", pageWidth / 2, 112, { align: 'center' });
      doc.setTextColor(60);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const splitInstructions = doc.splitTextToSize(firstItem.productAccessInstructions || "Access your product via the link below.", pageWidth - 60);
      doc.text(splitInstructions, pageWidth / 2, 119, { align: 'center' });

      const accessUrl = firstItem.productAccessUrl || firstItem.demoUrl || "https://arhambuilds.in";
      doc.setTextColor(37, 99, 235);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.textWithLink(accessUrl, pageWidth / 2, 138, { url: accessUrl, align: 'center' });

      doc.setTextColor(150);
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.text("(Tap or Click URL to open)", pageWidth / 2, 143, { align: 'center' });

      // Policies
      doc.setTextColor(40);
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("STORE POLICIES", 20, 165);
      doc.setDrawColor(240);
      doc.line(20, 168, pageWidth - 20, 168);
      doc.setTextColor(100);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const policiesList = firstItem.section === 'Editing Assets' 
        ? EDITING_ASSETS_STORE_POLICIES 
        : (firstItem.section === 'Templates' 
            ? TEMPLATE_STORE_POLICIES 
            : [
                "All digital products are non-refundable once the order is placed.",
                "Personal use license only. Reselling or redistribution is strictly prohibited.",
                "Support is available via email for any technical issues related to the product."
              ]
          );
      let policyY = 178;
      policiesList.forEach((policy) => {
        const splitPolicy = doc.splitTextToSize("• " + policy, pageWidth - 40);
        doc.text(splitPolicy, 20, policyY);
        policyY += (splitPolicy.length * 5.5);
      });

      // Footer
      doc.setFillColor(250, 250, 250);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      doc.setTextColor(180);
      doc.setFontSize(8);
      doc.text("Thank you for choosing Arham Builds. For any help, contact arhamadib31@gmail.com", pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text("Page 2 of 2", pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Final Save with requested filename format
      const safeTitle = firstItem.title.replace(/[^a-z0-9]/gi, '_').toUpperCase();
      setTimeout(() => {
        doc.save(`${safeTitle}_${orderId}.pdf`);
        setIsGeneratingPDF(false);
      }, 100);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF.");
      setIsGeneratingPDF(false);
    }
  };

  return (
    <>
      {showCelebration && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i} 
              className="absolute animate-confetti-pop opacity-0"
              style={{
                width: '6px', height: '6px',
                backgroundColor: ['#ff014f', '#3b82f6', '#10b981', '#f59e0b'][i % 4],
                borderRadius: i % 2 === 0 ? '50%' : '2px',
                '--tx': `${(Math.random() - 0.5) * 80}vw`,
                '--ty': `${(Math.random() - 0.5) * 80}vh`,
                animationDuration: '1.5s'
              } as any}
            />
          ))}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        className="w-full space-y-4"
      >
        {/* Integrated Header */}
        <div className="flex items-center justify-between mb-4 md:mb-6 px-2">
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
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-all hover:scale-110 active:scale-95 bg-white border border-gray-100 text-gray-400 shadow-sm hover:bg-gray-50"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-start w-full">
          {/* Vertical Progress Stepper - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-12 pt-4 w-32 shrink-0">
            {/* Step 1 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 shrink-0 bg-emerald-50 border-emerald-500 text-emerald-500">
                <Check size={14} strokeWidth={4} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate text-emerald-500">Details</span>
              <div className="absolute top-8 left-4 w-[1px] h-12 transition-colors duration-500 bg-emerald-500/20"></div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 shrink-0 bg-emerald-50 border-emerald-500 text-emerald-500">
                <Check size={14} strokeWidth={4} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate text-emerald-500">Review</span>
              <div className="absolute top-8 left-4 w-[1px] h-12 transition-colors duration-500 bg-emerald-500/20"></div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-4 relative">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 shrink-0 transition-all duration-500 bg-emerald-50 border-emerald-500 text-emerald-500">
                <Check size={14} strokeWidth={4} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest transition-colors duration-500 truncate text-emerald-500">Success</span>
            </div>
          </div>

          <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] card-shadow overflow-hidden flex flex-col md:flex-row w-full lg:max-w-5xl border border-gray-100 min-h-[400px] md:min-h-[500px]">
          
          {/* Left Side: Status & Actions (Compact on Mobile) */}
          <div className="md:w-[45%] flex flex-col border-b md:border-b-0 md:border-r border-gray-100">
            <div className="p-6 md:p-10 text-center bg-gray-50/30 relative flex-1 flex flex-col items-center justify-center">
              <div className="flex mb-6 justify-center">
                <div className="relative">
                  <div className="absolute inset-[-10px] bg-emerald-500/10 rounded-full animate-ping-slow"></div>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-8 border-gray-50 flex items-center justify-center card-shadow transition-transform hover:scale-105 duration-500">
                    <CheckCircle2 size={40} className="text-emerald-500 stroke-[2.5]" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-0">
                <h1 className="text-xl md:text-3xl font-display font-black text-heading leading-tight uppercase tracking-tighter">
                  Transaction Successful
                </h1>
              </div>

              <p className="text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mt-1 md:mt-0 mb-2 md:mb-4">
                {new Intl.DateTimeFormat('en-IN', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true 
                }).format(new Date())}
              </p>

              <div 
                onClick={() => {
                  navigator.clipboard.writeText(orderId);
                  const btn = document.getElementById('copy-id-btn');
                  if (btn) {
                    const originalText = btn.innerText;
                    btn.innerText = "COPIED!";
                    setTimeout(() => btn.innerText = originalText, 2000);
                  }
                }}
                className="group cursor-pointer flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-3 bg-white border border-gray-100 rounded-xl md:rounded-2xl mt-1 md:mt-0 mb-2 md:mb-6 shadow-sm"
              >
                <span id="copy-id-btn" className="text-[8px] md:text-[10px] font-black text-gray-500 tracking-widest leading-none">ID: {orderId}</span>
                <ClipboardEdit size={10} className="text-gray-400 group-hover:text-primary transition-colors" />
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[320px] mt-2 md:mt-0">
                <button 
                  onClick={handleDownloadFullOrder}
                  disabled={isGeneratingPDF}
                  className="flex items-center justify-center gap-2.5 px-6 py-4 bg-primary text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 w-full shadow-sm"
                  style={{ boxShadow: '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff' }}
                >
                  {isGeneratingPDF ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Download size={14} strokeWidth={3} />
                  )}
                  {isGeneratingPDF ? 'GENERATING...' : 'GET ACCESS PDF'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary & Next Steps */}
          <div className="md:w-[55%] p-6 md:p-10 flex flex-col bg-white">
            {/* Product Details (As per request) */}
            {firstItem && (
              <div className="flex items-center gap-4 px-1 py-1 mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-sm border border-gray-100 shrink-0">
                  <img 
                    src={firstItem.thumbnailUrl} 
                    alt={firstItem.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] opacity-70">
                    {firstItem.categories?.[0] || 'Digital'} • {firstItem.section}
                  </span>
                  <h3 className="text-base md:text-lg font-black text-heading uppercase tracking-tight leading-tight">
                    {firstItem.title}
                  </h3>
                  <span className="text-sm font-black text-heading opacity-70 leading-none mt-0.5">₹{firstItem.currentPrice}</span>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* Order Summary - Header (Responsive) */}
              <div className="border-t border-gray-100">
                {/* Mobile Toggle Button */}
                <button 
                  onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
                  className="md:hidden w-full flex items-center justify-between py-4 px-1 group transition-all"
                >
                   <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary/60 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Order Summary</span>
                   </div>
                   {isOrderSummaryOpen ? 
                     <ChevronUp size={14} className="text-gray-400" /> : 
                     <ChevronDown size={14} className="text-gray-400" />
                   }
                </button>

                {/* Desktop Static Header */}
                <div className="hidden md:flex w-full items-center justify-between py-4 px-1">
                   <div className="flex items-center gap-2">
                      <Package size={14} className="text-primary/60" />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">Order Summary</span>
                   </div>
                </div>
                
                {/* Content - Toggleable on Mobile, Always Visible on Desktop */}
                <div className={`overflow-hidden md:!h-auto md:!opacity-100 ${!isOrderSummaryOpen ? 'h-0 opacity-0 md:h-auto md:opacity-100' : 'h-auto opacity-100'}`}>
                  <motion.div 
                    initial={false}
                    animate={isOrderSummaryOpen ? { height: 'auto', opacity: 1 } : { height: 'auto', opacity: 1 }}
                    className="md:block"
                  >
                    <div className="space-y-3 pb-6 pt-1 px-1">
                      {items.length > 0 ? items.map((item, i) => {
                        const hasDiscount = item.originalPrice && item.originalPrice > item.currentPrice;
                        return (
                          <div key={i} className="flex justify-between items-start text-xs md:text-sm font-black uppercase tracking-tight text-heading">
                              <span className="flex-1 pr-4 leading-tight">{item.title}</span>
                              <div className="flex flex-col items-end">
                                {hasDiscount && (
                                  <span className="text-[8px] text-gray-400 line-through tracking-tighter">₹{item.originalPrice}</span>
                                )}
                                <span className="text-primary leading-none mt-0.5">₹{item.currentPrice} {item.quantity > 1 ? `x ${item.quantity}` : ''}</span>
                              </div>
                          </div>
                        );
                      }) : (
                        <div className="flex justify-between items-center text-xs font-black text-heading uppercase tracking-widest">
                            <span>Verified Asset</span>
                            <span className="text-primary">Access Granted</span>
                        </div>
                      )}
                      
                      {/* Detailed Price Breakdown */}
                      {(() => {
                        const originalTotal = items.reduce((acc, item) => acc + ((item.originalPrice || item.currentPrice) * (item.quantity || 1)), 0);
                        const storeDiscount = originalTotal - subtotal;
                        
                        if (storeDiscount > 0 || couponDiscountAmount > 0) {
                          return (
                            <div className="pt-2 space-y-1.5 border-t border-gray-50">
                              <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                <span>Original Value</span>
                                <span>₹{originalTotal}</span>
                              </div>
                              {storeDiscount > 0 && (
                                <div className="flex justify-between items-center text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                                  <span>Inventory Discount</span>
                                  <span>-₹{storeDiscount}</span>
                                </div>
                              )}
                              {couponDiscountAmount > 0 && (
                                <div className="flex justify-between items-center text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                                  <span>Promo Discount ({coupon?.code})</span>
                                  <span>-₹{couponDiscountAmount}</span>
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Amount Paid (Always Visible) */}
              <div className="pt-4 border-t-2 border-gray-100 border-dashed flex justify-between items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-none">Grand Total</span>
                <span className="text-xl font-black text-primary uppercase tracking-tighter leading-none">₹{totalPrice || '0'}</span>
              </div>
            </div>

            <div className="mt-auto pt-8 flex flex-col items-center gap-2">
               <div className="flex items-center justify-center gap-2 opacity-40 select-none grayscale hover:grayscale-0 transition-all hover:opacity-100 cursor-default">
                 <span className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-400">Secured By</span>
                 <img 
                   src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                   alt="Razorpay" 
                   className="h-2.5 w-auto"
                   referrerPolicy="no-referrer"
                 />
              </div>
              <a 
                href="mailto:arhamadib31@gmail.com"
                className="text-[8px] font-black text-gray-400 hover:text-gray-600 uppercase tracking-[0.1em] transition-colors"
              >
                Need help? <span>Contact Support</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default DeliveryProcess;
