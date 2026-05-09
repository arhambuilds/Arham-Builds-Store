import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  MessageSquare, 
  Save, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  PlusCircle,
  Code,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  TrendingUp,
  Image as ImageIcon,
  DollarSign,
  Phone
} from 'lucide-react';
import { PRODUCTS, FAQ_DATA, HERO_DATA, TESTIMONIALS, NAV_LINKS, PRIVACY_POLICY, TERMS_CONDITIONS, CONTACT_INFO, Product } from '../data';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'cms' | 'raw'>('products');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [githubStatus, setGithubStatus] = useState<'idle' | 'synced' | 'failed'>('idle');
  const [githubError, setGithubError] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [heroData, setHeroData] = useState(HERO_DATA);
  const [faqData, setFaqData] = useState(FAQ_DATA);
  const [testimonials, setTestimonials] = useState(TESTIMONIALS);
  const [navLinks, setNavLinks] = useState(NAV_LINKS);
  const [privacyPolicy, setPrivacyPolicy] = useState(PRIVACY_POLICY);
  const [termsConditions, setTermsConditions] = useState(TERMS_CONDITIONS);
  const [contactInfo, setContactInfo] = useState(CONTACT_INFO);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('adminToken');
    if (!isAdmin) navigate('/admin');
    
    // Fetch raw data for the editor
    fetch('/api/admin/data')
      .then(res => res.json())
      .then(data => setRawContent(data.content))
      .catch(err => console.error('Error fetching data:', err));
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    navigate('/admin');
  };

  const generateDataTS = (updatedProducts: Product[]) => {
    // This function reconstructs the data.ts file based on the state
    // For simplicity, we wrap the arrays/objects and export them.
    // We try to preserve the existing interfaces by including them at the top.
    
    const interfaces = `export interface NavLink {
  name: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description: string;
  currentPrice: number;
  originalPrice: number;
  thumbnailUrl: string;
  videoUrl?: string;
  category: string;
  badge?: 'Hot Sell' | 'Trending' | 'Latest';
  checkoutUrl: string;
  features: { name: string; description: string }[];
  demoUrl?: string;
  stockCount?: number;
  whatYouReceive?: string[];
  whyChooseThisPack?: { title: string; description: string; icon: string }[];
  whereCanYouUseIt?: { title: string; description: string; icon: string }[];
}

export interface PricingPlan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  category: string;
  image: string;
  readTime: string;
  date: string;
  content: string;
}

export interface Testimonial {
  id: number;
  name: string;
  designation: string;
  company: string;
  image: string;
  content: string;
  rating: number;
}

export interface ResumeItem {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export interface Skill {
  name: string;
  level: number;
}
`;

    const navLinksStr = `export const NAV_LINKS: NavLink[] = ${JSON.stringify(navLinks, null, 2)};\n`;
    const faqDataStr = `export const FAQ_DATA = ${JSON.stringify(faqData, null, 2)};\n`;
    const privacyPolicyStr = `export const PRIVACY_POLICY = ${JSON.stringify(privacyPolicy, null, 2)};\n`;
    const termsConditionsStr = `export const TERMS_CONDITIONS = ${JSON.stringify(termsConditions, null, 2)};\n`;
    const heroDataStr = `export const HERO_DATA = ${JSON.stringify(heroData, null, 2)};\n`;
    const testimonialsStr = `export const TESTIMONIALS: Testimonial[] = ${JSON.stringify(testimonials, null, 2)};\n`;
    const productsArray = `export const PRODUCTS: Product[] = ${JSON.stringify(updatedProducts, null, 2)};\n`;
    const contactInfoStr = `export const CONTACT_INFO = ${JSON.stringify(contactInfo, null, 2)};\n`;

    return `${interfaces}\n${navLinksStr}\n${faqDataStr}\n${privacyPolicyStr}\n${termsConditionsStr}\n${heroDataStr}\n${contactInfoStr}\n${productsArray}\n${testimonialsStr}`;
  };

  const handleSave = async (contentToSave?: string) => {
    setIsSaving(true);
    setSaveStatus('idle');
    setGithubStatus('idle');
    setGithubError('');
    
    // Generate the TS content
    const updatedProducts = products;
    const finalContent = contentToSave || (activeTab === 'raw' ? rawContent : generateDataTS(products));

    // Prepare a clean JSON version of the data for the public site to fetch
    const jsonData = {
      PRODUCTS: products,
      HERO_DATA: heroData,
      FAQ_DATA: faqData,
      NAV_LINKS: navLinks,
      TESTIMONIALS: testimonials,
      PRIVACY_POLICY: privacyPolicy,
      TERMS_CONDITIONS: termsConditions,
      CONTACT_INFO: contactInfo
    };

    try {
      const res = await fetch('/api/admin/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: finalContent,
          jsonData: jsonData // Send JSON version too
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSaveStatus('success');
        if (data.githubSync) {
          setGithubStatus('synced');
        } else if (data.githubError) {
          setGithubStatus('failed');
          setGithubError(data.githubError);
        }
        setRawContent(finalContent);
        setTimeout(() => {
          setSaveStatus('idle');
          setGithubStatus('idle');
        }, 5000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This will update the code.')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProduct(null);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    setIsAddModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Product Editor Modal */}
      <AnimatePresence>
        {(editingProduct || isAddModalOpen) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar card-shadow p-10 scroll-smooth"
            >
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-primary/5">
                <div>
                  <h2 className="text-2xl font-black text-heading uppercase tracking-tight">
                    {isAddModalOpen ? 'Add New Product' : 'Edit Product'}
                  </h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                    {isAddModalOpen ? 'Creating new entry in data.ts' : `Editing ID: ${editingProduct?.id}`}
                  </p>
                </div>
                <button 
                  onClick={() => { setEditingProduct(null); setIsAddModalOpen(false); }}
                  className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center hover:bg-heading hover:text-white transition-all shadow-sm"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>

              <ProductForm 
                initialData={editingProduct || {
                  id: `p${Date.now()}`,
                  slug: '',
                  title: '',
                  description: '',
                  currentPrice: 0,
                  originalPrice: 0,
                  thumbnailUrl: '',
                  category: 'Templates',
                  checkoutUrl: '',
                  features: [],
                  whatYouReceive: []
                }}
                onSubmit={isAddModalOpen ? handleAddProduct : handleUpdateProduct}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-primary/5 flex flex-col fixed h-screen z-20">
        <div className="p-8 border-b border-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 className="font-black text-heading uppercase tracking-tighter leading-none">Arham</h2>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
              activeTab === 'products' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-body/40 hover:bg-primary/5 hover:text-primary"
            )}
          >
            <Package size={18} />
            Manage Products
          </button>
          <button 
            onClick={() => setActiveTab('cms')}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
              activeTab === 'cms' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-body/40 hover:bg-primary/5 hover:text-primary"
            )}
          >
            <MessageSquare size={18} />
            Content (CMS)
          </button>
          <button 
            onClick={() => setActiveTab('raw')}
            className={cn(
              "w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all",
              activeTab === 'raw' ? "bg-primary text-white shadow-xl shadow-primary/10" : "text-body/40 hover:bg-primary/5 hover:text-primary"
            )}
          >
            <Code size={18} />
            Code Editor
          </button>
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-heading uppercase tracking-tighter">
              {activeTab === 'products' ? 'Product Management' : activeTab === 'cms' ? 'General Content' : 'Raw Data Editor'}
            </h1>
            <p className="text-xs font-bold text-body/40 uppercase tracking-widest mt-1">
              Changes will update Github coding automatically
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-4">
              {saveStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  <CheckCircle2 size={16} /> Saved Locally
                </motion.div>
              )}
              {githubStatus === 'synced' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest"
                >
                  <TrendingUp size={16} /> Pushed to Github
                </motion.div>
              )}
              {githubStatus === 'failed' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest"
                >
                  <AlertCircle size={16} /> Github Sync Failed
                </motion.div>
              )}
              <button 
                onClick={() => handleSave()}
                disabled={isSaving}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSaving ? 'Deploying...' : <><Save size={18} /> Deploy Changes</>}
              </button>
            </div>
            {githubError && (
              <p className="text-[8px] font-black text-red-400 uppercase tracking-[0.2em] max-w-xs text-right">
                Error: {githubError}
              </p>
            )}
          </div>
        </header>

        {activeTab === 'products' && (
          <div className="space-y-8">
              <div className="flex items-center gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-body/30 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Search products by title or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-primary/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold text-heading outline-none shadow-sm focus:border-primary/20 transition-all"
                />
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-heading text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary transition-all"
              >
                <PlusCircle size={18} /> Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-primary/5 card-shadow flex items-center gap-8 group hover:border-primary/20 transition-all">
                  <div className="w-24 h-16 rounded-xl overflow-hidden bg-secondary border border-primary/5 relative shrink-0">
                    <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-primary text-[7px] font-black text-white uppercase tracking-widest">
                      {p.category}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-heading uppercase truncate">{p.title}</h3>
                    <p className="text-[10px] font-black text-body/30 uppercase tracking-widest mt-1 shrink-0 flex items-center gap-2">
                       ID: {p.id} • {p.badge || 'No Badge'}
                    </p>
                  </div>

                  <div className="flex items-center gap-12 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-body/30 uppercase tracking-widest mb-1 italic">Price</p>
                      <p className="font-black text-heading">₹{p.currentPrice}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-body/30 uppercase tracking-widest mb-1 italic">Stock</p>
                      <p className={cn("font-black", p.stockCount === 0 ? "text-red-500" : "text-emerald-500")}>
                        {p.stockCount !== undefined ? p.stockCount : 'Unlimited'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="w-10 h-10 rounded-xl bg-secondary text-body/40 flex items-center justify-center hover:bg-heading hover:text-white transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-8 rounded-[2rem] flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="font-black text-blue-900 uppercase tracking-tight">Interactive Editor Note</h4>
                <p className="text-sm text-blue-800/70 font-bold leading-relaxed">
                  For full control over data structures and complex nested fields (like lists or feature objects), please use the <span className="text-blue-900 border-b-2 border-blue-200 cursor-pointer" onClick={() => setActiveTab('raw')}>Code Editor</span>. This ensures perfect syntax for the React application.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hero Editor */}
                <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                    <TrendingUp size={16} /> Hero Section Data
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-body/30 block mb-2">Display Name</label>
                      <input 
                        className="w-full bg-secondary border border-transparent rounded-xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/10 transition-all shadow-inner" 
                        value={heroData.name} 
                        onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-body/30 block mb-2">Hero Description</label>
                      <textarea 
                        className="w-full bg-secondary border border-transparent rounded-xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/10 transition-all shadow-inner min-h-[100px]" 
                        value={heroData.description} 
                        onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ Quick View */}
                <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                    <MessageSquare size={16} /> FAQ Quick Edit
                  </h3>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                    {faqData.map((faq, i) => (
                      <div key={i} className="p-4 bg-secondary rounded-xl space-y-2">
                        <input 
                          className="w-full bg-white/50 border-none rounded-lg p-2 text-[10px] font-black uppercase outline-none" 
                          value={faq.question} 
                          onChange={(e) => {
                            const updated = [...faqData];
                            updated[i].question = e.target.value;
                            setFaqData(updated);
                          }}
                        />
                        <textarea 
                          className="w-full bg-white/50 border-none rounded-lg p-2 text-[10px] font-bold outline-none" 
                          value={faq.answer} 
                          onChange={(e) => {
                            const updated = [...faqData];
                            updated[i].answer = e.target.value;
                            setFaqData(updated);
                          }}
                        />
                      </div>
                    ))}
                    <button 
                      onClick={() => setFaqData([...faqData, { question: 'New Question', answer: 'New Answer' }])}
                      className="w-full py-4 border-2 border-dashed border-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary hover:border-primary transition-all"
                    >
                      Add New FAQ Item
                    </button>
                  </div>
                </div>

                {/* Contact Info Edit */}
                <div className="bg-white p-8 rounded-[2.5rem] card-shadow border border-primary/5 space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-3">
                    <Phone size={16} /> Contact Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold text-body/40 uppercase ml-1">Email Address</label>
                       <input 
                         className="w-full bg-secondary border-none rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" 
                         value={contactInfo.email} 
                         onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold text-body/40 uppercase ml-1">Phone Number</label>
                       <input 
                         className="w-full bg-secondary border-none rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" 
                         value={contactInfo.phone} 
                         onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-bold text-body/40 uppercase ml-1">Physical Address</label>
                       <input 
                         className="w-full bg-secondary border-none rounded-xl p-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20" 
                         value={contactInfo.address} 
                         onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                       />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'raw' && (
          <div className="space-y-6">
             <div className="relative group">
               <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
                 <div className="px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-600 text-[10px] font-black uppercase tracking-widest">
                   Direct File Editing
                 </div>
               </div>
               <textarea 
                 value={rawContent}
                 onChange={(e) => setRawContent(e.target.value)}
                 className="w-full h-[600px] bg-[#1e2125] text-blue-100 font-mono text-xs p-8 rounded-[2.5rem] card-shadow shadow-2xl focus:ring-2 focus:ring-primary/20 outline-none resize-none leading-relaxed"
                 spellCheck={false}
               />
             </div>
             <p className="text-[10px] text-body/40 font-bold uppercase tracking-widest text-center">
               WARNING: Modifying code directly can break the website if syntax errors are present.
             </p>
          </div>
        )}
      </main>
    </div>
  );
}

function ProductForm({ initialData, onSubmit }: { initialData: Partial<Product>, onSubmit: (p: Product) => void }) {
  const [formData, setFormData] = useState({
    id: initialData.id || '',
    slug: initialData.slug || '',
    title: initialData.title || '',
    description: initialData.description || '',
    currentPrice: initialData.currentPrice || 0,
    originalPrice: initialData.originalPrice || 0,
    thumbnailUrl: initialData.thumbnailUrl || '',
    videoUrl: initialData.videoUrl || '',
    category: initialData.category || 'Templates',
    badge: initialData.badge || undefined,
    checkoutUrl: initialData.checkoutUrl || '',
    demoUrl: initialData.demoUrl || '',
    stockCount: initialData.stockCount,
  });

  const [features, setFeatures] = useState(initialData.features || []);
  const [whatYouReceive, setWhatYouReceive] = useState(initialData.whatYouReceive || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(formData as unknown as Product),
      features,
      whatYouReceive
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Basic Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">ID</label>
                <input 
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                  value={formData.id}
                  onChange={e => setFormData({ ...formData, id: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Slug</label>
                <input 
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                  value={formData.slug}
                  onChange={e => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Product Title</label>
              <input 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Description</label>
              <textarea 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner min-h-[100px] outline-none"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Category</label>
                <select 
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none appearance-none"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Templates</option>
                  <option>Editing Assets</option>
                  <option>Freebies</option>
                  <option>Birthday</option>
                  <option>Special</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Badge</label>
                <select 
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none appearance-none"
                  value={formData.badge || ''}
                  onChange={e => setFormData({ ...formData, badge: e.target.value as any || undefined })}
                >
                  <option value="">None</option>
                  <option value="Hot Sell">Hot Sell</option>
                  <option value="Trending">Trending</option>
                  <option value="Latest">Latest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Media & Pricing</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Current Price (₹)</label>
                <input 
                  type="number"
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                  value={formData.currentPrice}
                  onChange={e => setFormData({ ...formData, currentPrice: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Original Price (₹)</label>
                <input 
                  type="number"
                  className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                  value={formData.originalPrice}
                  onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Stock Count</label>
              <input 
                type="number"
                placeholder="Leave empty for unlimited"
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.stockCount || ''}
                onChange={e => setFormData({ ...formData, stockCount: e.target.value === '' ? undefined : Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Thumbnail URL</label>
              <input 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.thumbnailUrl}
                onChange={e => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Video Preview URL</label>
              <input 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.videoUrl}
                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Checkout Link</label>
              <input 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.checkoutUrl}
                onChange={e => setFormData({ ...formData, checkoutUrl: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-widest text-body/30 ml-2">Live Demo URL</label>
              <input 
                className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-xs font-bold focus:bg-white focus:ring-1 focus:ring-primary/20 transition-all shadow-inner outline-none"
                value={formData.demoUrl}
                onChange={e => setFormData({ ...formData, demoUrl: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Features</h3>
            <button 
              type="button"
              onClick={() => setFeatures([...features, { name: '', description: '' }])}
              className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex gap-2 items-start bg-secondary p-3 rounded-xl relative group">
                <div className="flex-1 space-y-2">
                  <input 
                    placeholder="Feature Name"
                    className="w-full bg-white rounded-lg p-2 text-[10px] font-black border-none outline-none"
                    value={f.name}
                    onChange={e => {
                      const updated = [...features];
                      updated[i].name = e.target.value;
                      setFeatures(updated);
                    }}
                  />
                  <textarea 
                    placeholder="Feature Description"
                    className="w-full bg-white rounded-lg p-2 text-[10px] font-bold border-none outline-none"
                    value={f.description}
                    onChange={e => {
                      const updated = [...features];
                      updated[i].description = e.target.value;
                      setFeatures(updated);
                    }}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">What You Receive</h3>
            <button 
              type="button"
              onClick={() => setWhatYouReceive([...whatYouReceive, ''])}
              className="px-3 py-1 bg-primary text-white text-[8px] font-black uppercase tracking-widest rounded-lg"
            >
              Add
            </button>
          </div>
          <div className="space-y-3">
            {whatYouReceive.map((item, i) => (
              <div key={i} className="flex gap-2 items-center bg-secondary p-3 rounded-xl relative group">
                <input 
                  placeholder="Item description"
                  className="flex-1 bg-white rounded-lg p-2 text-[10px] font-black border-none outline-none"
                  value={item}
                  onChange={e => {
                    const updated = [...whatYouReceive];
                    updated[i] = e.target.value;
                    setWhatYouReceive(updated);
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setWhatYouReceive(whatYouReceive.filter((_, idx) => idx !== i))}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        type="submit"
        className="w-full bg-heading text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-heading/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
      >
        <CheckCircle2 size={18} /> Update Data Instance
      </button>
    </form>
  );
}
