import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../data';

export default function Footer() {
  return (
    <footer className="bg-secondary pt-10 pb-10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-left">
          {/* Logo & Intro */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center justify-start gap-3">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                <img 
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgV4_PzmTUKmZfLipz0IZOO5cMvwqNvfX1zIQrv19tqdMzCd3qNRmbcqgLzeY-nfdCl-Y_3KbaToX3lLgamK1wbKH9We_0RdavOm4Ci24K6cVz0RorQK95k8aGSdh2lRMz0pyCdoVzKYFgN0cQQwerenIipHrNAYHDa2h61HIejBn07XpGX3SxOHnj9JA/s320/Arham-Adib-Logo.jpg" 
                  alt="Arham Adib" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-bold font-display uppercase tracking-tighter">
                Arham Adib
              </span>
            </Link>
            <p className="text-body/70 text-sm leading-relaxed max-w-xs">
              Designing the future, one pixel at a time. Join me on my journey to create digital excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-primary font-bold uppercase text-xs tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/home" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Home</Link></li>
              <li><Link to="/store" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Store</Link></li>
              <li><Link to="/home#testimonials" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Testimonials</Link></li>
              <li><Link to="/contact" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Contact</Link></li>
              <li><Link to="/faq" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">FAQ</Link></li>
            </ul>
          </div>

          {/* Store Links */}
          <div className="space-y-8">
            <h4 className="text-primary font-bold uppercase text-xs tracking-[0.2em]">Store</h4>
            <ul className="space-y-4">
              <li><Link to="/freebies" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Freebies</Link></li>
              <li><Link to="/store?category=Editing Assets" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Editing Assets</Link></li>
              <li><Link to="/store?category=Birthday" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Birthday Templates</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-8">
            <h4 className="text-primary font-bold uppercase text-xs tracking-[0.2em]">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Help Center</Link></li>
              <li><Link to="/contact" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Support</Link></li>
              <li><Link to="/privacy-policy" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="text-body/80 hover:text-primary transition-colors text-sm font-bold tracking-tight">Terms & Conditions</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-primary/5">
          <p className="text-body/40 text-xs font-semibold tracking-widest uppercase mb-2">
            © {new Date().getFullYear()} <a href="https://arhamadib.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Arham Adib</a>. All rights reserved.
          </p>
          <p className="text-[10px] text-body/40 font-medium tracking-widest">
            Made with 💗 Arham.
          </p>
        </div>
      </div>
    </footer>
  );
}
