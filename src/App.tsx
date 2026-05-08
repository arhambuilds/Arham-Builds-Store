/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import ProductSection from './components/Store';
import StorePage from './components/StorePage';
import AssetsPage from './components/AssetsPage';
import ProductDetailPage from './components/ProductDetailPage';
import ContactPage from './components/ContactPage';
import FAQPage from './components/FAQPage';
import AboutPage from './components/AboutPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Contact from './components/Contact';
import Footer from './components/Footer';
import TermsConditionsPage from './components/TermsConditionsPage';
import FreebiesPage from './components/FreebiesPage';
import FAQ from './components/FAQ';
import About from './components/About';
import AdminPage from './components/admin/AdminPage';
import Preloader from './components/Preloader';

import { useNavigate } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Home() {
  const navigate = useNavigate();

  const scrollToStore = () => {
    const storeSection = document.getElementById('store');
    if (storeSection) {
      storeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategorySelect = (category: string) => {
    navigate(`/store?category=${encodeURIComponent(category)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="optimize-gpu"
    >
      <Navbar />
      <main>
        <Hero onExplore={scrollToStore} onCategorySelect={handleCategorySelect} />
        <ProductSection 
          id="store"
          title="Premium Templates"
          description="Everything you need to give the best gifts effortlessly"
          category="Templates"
          viewAllLink="/premium-templates"
          viewAllText="Explore Store"
        />
        <ProductSection 
          id="editing-assets"
          title="Editing Assets"
          description="Professional SFX packs, animations, and transitions for creators"
          category="Editing Assets"
          viewAllLink="/editing-assets"
          viewAllText="View All Assets"
        />
        <ProductSection 
          id="freebies"
          title="Freebies"
          description="High-quality resources available for free to help your projects"
          category="Freebies"
          viewAllLink="/freebies"
          viewAllText="Browse Freebies"
        />
        <Testimonials />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/premium-templates" element={<StorePage />} />
        <Route path="/editing-assets" element={<AssetsPage />} />
        <Route path="/store/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditionsPage />} />
        <Route path="/freebies" element={<FreebiesPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Preloader />
      <div className="min-h-screen bg-secondary selection:bg-primary/10 selection:text-primary">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

