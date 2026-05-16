import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { Plus, Pencil, Trash2, X, Search, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { handleFirestoreError, OperationType } from '../../lib/firebase';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    currentPrice: 0,
    originalPrice: 0,
    thumbnailUrl: '',
    section: 'Templates',
    categories: '',
    badge: 'Latest',
    videoUrl: '',
    demoUrl: '',
    productAccessUrl: '',
    productAccessInstructions: '',
    features: '', // Will be parsed as JSON or comma-sep
    whatYouReceive: '' // Will be parsed as comma-sep
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch('/api/admin/products', {
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let featuresData = [];
    try {
      if (formData.features && formData.features.trim()) {
        featuresData = JSON.parse(formData.features);
      }
    } catch (e) {
      featuresData = (formData.features || '').split(',').map(f => ({ name: f.trim(), description: '' }));
    }

    const data: any = {
      title: formData.title || '',
      slug: formData.slug || '',
      description: formData.description || '',
      currentPrice: Number(formData.currentPrice || 0),
      originalPrice: Number(formData.originalPrice || 0),
      thumbnailUrl: formData.thumbnailUrl || '',
      section: formData.section || 'Templates',
      categories: (formData.categories || '').split(',').map(s => s.trim()).filter(Boolean),
      badge: formData.badge || 'Latest',
      videoUrl: formData.videoUrl || '',
      demoUrl: formData.demoUrl || '',
      productAccessUrl: formData.productAccessUrl || '',
      productAccessInstructions: formData.productAccessInstructions || '',
      whatYouReceive: (formData.whatYouReceive || '').split(',').map(s => s.trim()).filter(Boolean),
      features: featuresData,
    };

    const username = localStorage.getItem('arham_admin_username');
    const password = localStorage.getItem('arham_admin_password');

    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Failed to save product');

      setIsModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (e: any) {
      console.error("Error saving product:", e);
      alert("Error saving product. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to delete product');
      fetchProducts();
    } catch (e) {
      console.error("Error deleting product:", e);
      alert("Error deleting product.");
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setFormData({
      title: product.title || '',
      slug: product.slug || '',
      description: product.description || '',
      currentPrice: product.currentPrice || 0,
      originalPrice: product.originalPrice || 0,
      thumbnailUrl: product.thumbnailUrl || '',
      section: product.section || 'Templates',
      categories: Array.isArray(product.categories) ? product.categories.join(', ') : '',
      badge: product.badge || 'Latest',
      videoUrl: product.videoUrl || '',
      demoUrl: product.demoUrl || '',
      productAccessUrl: product.productAccessUrl || '',
      productAccessInstructions: product.productAccessInstructions || '',
      features: product.features ? JSON.stringify(product.features, null, 2) : '',
      whatYouReceive: Array.isArray(product.whatYouReceive) ? product.whatYouReceive.join(', ') : ''
    });
    setIsModalOpen(true);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Products</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage your store inventory</p>
        </div>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              title: '', slug: '', description: '', currentPrice: 0, 
              originalPrice: 0, thumbnailUrl: '', section: 'Templates', 
              categories: '', badge: 'Latest', videoUrl: '', demoUrl: '',
              productAccessUrl: '', productAccessInstructions: '',
              features: '', whatYouReceive: ''
            });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
        >
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
        <Search className="text-gray-400 ml-4" size={20} />
        <input 
          type="text" 
          placeholder="SEARCH PRODUCTS..." 
          className="flex-1 bg-transparent border-none outline-none font-black text-xs uppercase tracking-widest p-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                        {product.thumbnailUrl ? (
                          <img src={product.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={20}/></div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 leading-tight mb-0.5">{product.title}</p>
                        <p className="text-[10px] font-bold text-gray-400">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-500 text-[9px] font-black uppercase rounded-full">
                      {product.section}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-800">INR {product.currentPrice}</td>
                  <td className="px-8 py-6 font-bold text-emerald-500">Live</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        className="p-3 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-3 hover:bg-white rounded-full transition-all text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Title</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Slug</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Section</label>
                    <select 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.section}
                      onChange={e => setFormData({...formData, section: e.target.value})}
                    >
                      <option value="Templates">Templates</option>
                      <option value="Freebies">Freebies</option>
                      <option value="Editing Assets">Editing Assets</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Demo URL</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.demoUrl}
                      onChange={e => setFormData({...formData, demoUrl: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Sale Price (INR)</label>
                      <input 
                        required
                        type="number" 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                        value={formData.currentPrice}
                        onChange={e => setFormData({...formData, currentPrice: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Original (INR)</label>
                      <input 
                        type="number" 
                        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                        value={formData.originalPrice}
                        onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Thumbnail URL</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.thumbnailUrl}
                      onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Categories (comma sep)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.categories}
                      onChange={e => setFormData({...formData, categories: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Video URL</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.videoUrl}
                      onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-6 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">Delivery & Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Product Access URL (for receipt)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.productAccessUrl}
                      onChange={e => setFormData({...formData, productAccessUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">What You Receive (comma sep)</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all"
                      value={formData.whatYouReceive}
                      onChange={e => setFormData({...formData, whatYouReceive: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Access Instructions</label>
                  <textarea 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all min-h-[80px]"
                    value={formData.productAccessInstructions}
                    onChange={e => setFormData({...formData, productAccessInstructions: e.target.value})}
                    placeholder="E.g. Download the ZIP and follow the PDF guide..."
                  ></textarea>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Features (JSON Array of {`{name, description}`})</label>
                  <textarea 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-mono text-[10px] focus:border-primary outline-none transition-all min-h-[120px]"
                    value={formData.features}
                    onChange={e => setFormData({...formData, features: e.target.value})}
                    placeholder='[{"name": "Responsive", "description": "Works on all devices"}]'
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Long Description</label>
                <textarea 
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 font-bold text-sm focus:border-primary outline-none transition-all min-h-[100px]"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="mt-8 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
