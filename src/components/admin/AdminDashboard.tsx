import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  ShoppingBag,
  ExternalLink,
  LogOut,
  Settings,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PRODUCTS as INITIAL_PRODUCTS } from '../../data';
import { getStoredProducts, saveProducts, logoutAdmin, verifyPin, saveProductsToServer } from '../../lib/adminUtils';
import { ProductForm } from './ProductForm';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showPinModal, setShowPinModal] = useState<{ type: 'delete' | 'save', id?: string } | null>(null);
  const [actionPin, setActionPin] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    setProducts(getStoredProducts(INITIAL_PRODUCTS));
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async () => {
    if (verifyPin(actionPin)) {
      const updated = products.filter(p => p.id !== showPinModal?.id);
      const result = await saveProductsToServer(updated);
      if (result.success) {
        setProducts(updated);
        setShowPinModal(null);
        setActionPin('');
        setPinError(false);
      } else {
        alert(result.message || 'Failed to save changes to server.');
      }
    } else {
      setPinError(true);
    }
  };

  const handleSaveProduct = async (newProduct: Product) => {
    let updated;
    if (editingProduct) {
      updated = products.map(p => p.id === newProduct.id ? newProduct : p);
    } else {
      updated = [newProduct, ...products];
    }
    
    const result = await saveProductsToServer(updated);
    if (result.success) {
      setProducts(updated);
      setIsFormOpen(false);
      setEditingProduct(null);
    } else {
      alert(result.message || 'Failed to save product to server.');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-primary/5 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-lg">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            Admin
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-sm">
            <ShoppingBag size={18} /> Products
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-body/50 hover:bg-secondary transition-colors font-bold text-sm">
            <Settings size={18} /> Website
          </button>
        </nav>

        <div className="p-4 border-t border-primary/5">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-primary/5 px-8 py-6 sticky top-0 z-20 flex items-center justify-between">
          <h2 className="text-xl font-black text-heading uppercase tracking-widest">Store Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-body/30" size={18} />
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-secondary rounded-2xl border border-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium w-64"
              />
            </div>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Add Product
            </button>
            <button 
              onClick={handleLogout}
              className="lg:hidden p-3 bg-red-50 text-red-500 rounded-xl"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Total Products', val: products.length, icon: ShoppingBag, color: 'text-primary bg-primary/10' },
              { label: 'Categories', val: categories.length - 1, icon: Filter, color: 'text-indigo-500 bg-indigo-500/10' },
              { label: 'Website Status', val: 'Active', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-primary/5 card-shadow-sm flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-body/30 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-heading">{stat.val}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-8 overflow-auto pb-2 noscroll">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-body/50 border border-primary/5 hover:bg-primary/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products List */}
          <div className="space-y-4">
            {filteredProducts.map(product => (
              <div 
                key={product.id}
                className="bg-white p-4 rounded-3xl border border-primary/5 card-shadow-sm group hover:border-primary/20 transition-all flex items-center gap-6"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-secondary relative shrink-0 border border-primary/5">
                  <img src={product.thumbnailUrl} alt={product.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="text-white" size={24} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest">
                      {product.subCategory || product.category}
                    </span>
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded bg-indigo-500/5 text-indigo-500 text-[9px] font-black uppercase tracking-widest">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-heading tracking-tight truncate">{product.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm font-black text-primary">₹{product.currentPrice}</p>
                    {product.originalPrice > product.currentPrice && (
                      <p className="text-xs text-body/30 line-through font-bold">₹{product.originalPrice}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-secondary/50 p-2 rounded-2xl border border-primary/5 self-center">
                  <button 
                    onClick={() => {
                      setEditingProduct(product);
                      setIsFormOpen(true);
                    }}
                    className="p-3 text-body/40 hover:text-primary transition-colors bg-white rounded-xl shadow-sm border border-primary/5 hover:scale-105 active:scale-95"
                    title="Edit"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    className="p-3 text-body/40 hover:text-emerald-500 transition-colors bg-white rounded-xl shadow-sm border border-primary/5 hover:scale-105 active:scale-95"
                    title="View"
                    onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                  >
                    <Eye size={18} />
                  </button>
                  <button 
                    onClick={() => setShowPinModal({ type: 'delete', id: product.id })}
                    className="p-3 text-body/40 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm border border-primary/5 hover:scale-105 active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* PIN Verification Modal (For Delete) */}
      <AnimatePresence>
        {showPinModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-heading/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm card-shadow relative overflow-hidden"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-2">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-heading uppercase tracking-widest">Verify Action</h3>
                  <p className="text-sm text-body/50 font-medium">Enter your secret code to {showPinModal.type === 'delete' ? 'delete this product' : 'save changes'}</p>
                </div>

                <div className="space-y-4">
                  <input 
                    type="password"
                    maxLength={6}
                    value={actionPin}
                    onChange={(e) => {
                      setActionPin(e.target.value);
                      setPinError(false);
                    }}
                    placeholder="6-digit PIN"
                    className={`w-full text-center tracking-[1em] py-4 bg-secondary rounded-2xl border ${pinError ? 'border-red-500' : 'border-primary/5'} focus:outline-none text-xl font-black`}
                  />
                  {pinError && (
                    <p className="text-xs text-red-500 font-bold uppercase tracking-wider">Invalid Code!</p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setShowPinModal(null);
                        setActionPin('');
                        setPinError(false);
                      }}
                      className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-secondary text-body/50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all active:scale-95"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            onClose={() => setIsFormOpen(false)} 
            onSave={handleSaveProduct}
            verifyPin={verifyPin}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
