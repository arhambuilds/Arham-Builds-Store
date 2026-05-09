import { motion, AnimatePresence } from 'motion/react';
import { Menu as MenuIcon, X, Briefcase, Calendar, Moon, Sun, User, ArrowRight, ChevronDown, Lock } from 'lucide-react';
import { useState, useEffect, MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { NAV_LINKS } from '../data';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '/') {
      if (location.pathname === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIsMenuOpen(false);
      return;
    }

    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      
      if (location.pathname !== '/') {
        navigate(`/${href}`);
        return;
      }

      const element = document.getElementById(id);
      if (element) {
        setIsMenuOpen(false);
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      setIsMenuOpen(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const DESKTOP_NAV = [
    { name: 'Home', href: '/home' },
    { name: 'Templates', href: '/premium-templates' },
    { name: 'Assets', href: '/editing-assets' },
    { name: 'Freebies', href: '/freebies' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  const LOGO_URL = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj_k4CqxRUYByW2SZXhkby2AxlfiQFsW6jm-KFzlA__1go2Lmu1AxA8hgyXDpEHwxyeBCRbpelQeIJnBfwPCzEhOeXxEUmoCiogiJxr-MwMahQymXwnoy5peuHdUGNlPAXXFzgtx4R3udF4oV20QdEFrfki71UE59XvuI5RDeGk26MkdNlRFMiz6nzqTw/s320/ArhamBuildsLogo.png";

  return (
    <>
      <header
        className={cn(
          'fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-full max-w-fit px-4',
          isScrolled ? 'top-2' : 'top-6'
        )}
      >
        <nav 
          className={cn(
            "flex items-center gap-1 p-0.5 rounded-full border shadow-xl transition-all duration-500",
            "bg-white/95 backdrop-blur-xl border-primary/20"
          )}
        >
          {/* Left Profile/Brand Area */}
          <Link
            to="/"
            className="group flex items-center gap-2 pl-0.5 pr-6 py-0.5 rounded-full hover:bg-primary/5 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-all overflow-hidden font-black text-primary shadow-lg shadow-primary/10 group-hover:scale-105">
               <img 
                 src={LOGO_URL} 
                 alt="Profile" 
                 className="w-full h-full object-cover scale-110"
               />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary whitespace-nowrap">Arham Builds</span>
          </Link>

          {/* Targeted Links for Navbar */}
          <div className="hidden lg:flex items-center gap-0.5 px-2">
            {DESKTOP_NAV.map((link) => {
              const isActive = location.pathname === link.href || (link.href === '/home' && location.pathname === '/');
              
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={cn(
                    "px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-full",
                    isActive ? "text-primary bg-primary/5" : "text-body/70 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Right Icons & Hamburger */}
          <div className="flex items-center gap-0.5 pl-2 pr-1">
            <a 
              href="https://arhamadib.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex p-2.5 rounded-full hover:bg-primary/5 text-primary/60 hover:text-primary transition-all"
            >
              <Briefcase size={16} strokeWidth={1.5} />
            </a>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 rounded-full bg-primary text-white border border-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center ml-1 shadow-lg shadow-primary/20 active:scale-95"
            >
              <MenuIcon size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Expanded Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            className="fixed inset-0 z-[100] bg-white"
          >
            {/* Menu Header with close button */}
            <div className="flex items-center justify-between px-8 py-4 border-b border-primary/5">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
                    <img 
                      src={LOGO_URL} 
                      alt="Profile" 
                      className="w-full h-full object-cover scale-110"
                    />
                  </div>
                  <span className="text-lg font-black uppercase tracking-tighter text-primary">Arham Builds</span>
               </div>
               <button 
                 onClick={() => setIsMenuOpen(false)}
                 className="p-2 text-heading transition-all active:scale-90"
               >
                 <X size={32} strokeWidth={1} />
               </button>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-10 grid lg:grid-cols-2 gap-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
               <div className="flex flex-col">
                {NAV_LINKS.map((link, i) => {
                  const isActive = location.pathname === link.href || (link.href === '/home' && location.pathname === '/');
                  
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      className="border-b border-primary/5 last:border-0"
                    >
                      {link.name === 'Store' ? (
                        <div className="flex flex-col">
                          <button 
                            onClick={() => toggleSection('store')}
                            className={cn(
                              "text-lg md:text-xl font-black uppercase tracking-tighter transition-all duration-300 flex items-center justify-between py-3 w-full group",
                              isActive || location.pathname === '/premium-templates' || location.pathname === '/editing-assets' || location.pathname === '/freebies' 
                                ? "text-primary" 
                                : "text-heading hover:text-primary"
                            )}
                          >
                            <span className="group-hover:translate-x-2 transition-transform">{link.name}</span>
                            <ChevronDown size={18} className={cn("transition-transform duration-300", expandedSection === 'store' ? "rotate-180" : "")} />
                          </button>
                          <AnimatePresence>
                            {expandedSection === 'store' && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-primary/5 rounded-xl mb-3"
                              >
                                <div className="flex flex-col p-4 gap-3">
                                  <Link to="/premium-templates" onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-bold uppercase tracking-widest transition-colors", location.pathname === '/premium-templates' ? "text-primary" : "text-body/60 hover:text-primary")}>Templates</Link>
                                  <Link to="/editing-assets" onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-bold uppercase tracking-widest transition-colors", location.pathname === '/editing-assets' ? "text-primary" : "text-body/60 hover:text-primary")}>Editing Assets</Link>
                                  <Link to="/freebies" onClick={() => setIsMenuOpen(false)} className={cn("text-sm font-bold uppercase tracking-widest transition-colors", location.pathname === '/freebies' ? "text-primary" : "text-body/60 hover:text-primary")}>Freebies</Link>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : link.name === 'Portfolio' ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "text-lg md:text-xl font-black uppercase tracking-tighter transition-all duration-300 inline-block py-3 w-full text-heading hover:text-primary hover:translate-x-4"
                          )}
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className={cn(
                            "text-lg md:text-xl font-black uppercase tracking-tighter transition-all duration-300 inline-block py-3 w-full",
                            isActive ? "text-primary translate-x-4" : "text-heading hover:text-primary hover:translate-x-4"
                          )}
                        >
                          {link.name}
                        </Link>
                      )}
                    </motion.div>
                  );
                })}
               </div>

               <div className="hidden lg:flex flex-col gap-10 max-w-sm">
                  <div className="space-y-4">
                    <span className="text-primary font-black uppercase tracking-[0.4em] text-[12px]">— Let's Connect</span>
                    <h2 className="text-4xl font-black text-heading leading-tight uppercase tracking-tighter">Design.<br />Code.<br />Elevate.</h2>
                  </div>
                  <div className="space-y-6 border-l-4 border-primary/10 pl-8">
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Email</span>
                        <p className="text-lg font-black text-heading text-pretty">bussiness@arhamadib.in</p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/40">Location</span>
                        <p className="text-lg font-black text-heading">Kishanganj, Bihar, India</p>
                     </div>
                  </div>
                  <Link 
                    to="/contact" 
                    onClick={(e) => handleNavClick(e, '/contact')}
                    className="inline-flex items-center justify-center gap-3 py-6 px-10 bg-primary text-white rounded-full text-base font-black uppercase tracking-widest hover:scale-105 hover:bg-primary/95 transition-all w-full group shadow-2xl shadow-primary/30"
                  >
                    Hire Me Now
                    <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                  </Link>
               </div>
            </div>

            {/* Backdrop Logo/Background */}
            <div className="absolute bottom-[8%] sm:bottom-[2%] left-0 w-full flex flex-col items-center sm:items-end sm:right-[5%] sm:left-auto text-center sm:text-right select-none pointer-events-none uppercase overflow-hidden">
              <span className="text-[28vw] sm:text-[20vw] leading-[0.7] font-black text-primary/5">ARHAM</span>
              <span className="text-[28vw] sm:text-[20vw] leading-[0.7] font-black text-primary/5">BUILDS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
