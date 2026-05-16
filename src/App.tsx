/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Testimonials from './components/Testimonials';
import ProductSection from './components/Store';
import StorePage from './components/StorePage';
import AssetsPage from './components/AssetsPage';
import ProductDetailPage from './components/ProductDetailPage';
import TemplateDetailPage from './components/TemplateDetailPage';
import AssetDetailPage from './components/AssetDetailPage';
import FreebieDetailPage from './components/FreebieDetailPage';
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
import ScrollToHash from './components/ScrollToHash';
import CheckoutPage from './components/CheckoutPage';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import ProductForm from './components/admin/ProductForm';
import Orders from './components/admin/Orders';
import Coupons from './components/admin/Coupons';
import Settings from './components/admin/Settings';
import LoginPage from './components/admin/LoginPage';

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
          section="Templates"
          viewAllLink="/premium-templates"
          viewAllText="Explore Store"
        />
        <ProductSection 
          id="editing-assets"
          title="Editing Assets"
          description="Professional SFX packs, animations, and transitions for creators"
          section="Editing Assets"
          viewAllLink="/editing-assets"
          viewAllText="View All Assets"
        />
        <ProductSection 
          id="freebies"
          title="Freebies"
          description="High-quality resources available for free to help your projects"
          section="Freebies"
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
      <ScrollToHash />
      <div className="min-h-screen bg-secondary selection:bg-primary/10 selection:text-primary">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/premium-templates" element={<StorePage />} />
          <Route path="/premium-templates/:id" element={<TemplateDetailPage />} />
          <Route path="/editing-assets" element={<AssetsPage />} />
          <Route path="/editing-assets/:id" element={<AssetDetailPage />} />
          <Route path="/freebies" element={<FreebiesPage />} />
          <Route path="/freebies/:id" element={<FreebieDetailPage />} />
          <Route path="/store/:id" element={<ProductDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

