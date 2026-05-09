/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import { useNavigate } from 'react-router-dom';

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
    <>
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
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-secondary selection:bg-primary/10 selection:text-primary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/premium-templates" element={<StorePage />} />
          <Route path="/editing-assets" element={<AssetsPage />} />
          <Route path="/store/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/freebies" element={<FreebiesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

