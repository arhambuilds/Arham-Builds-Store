import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Upload, 
  RefreshCw,
  Layout,
  ExternalLink,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Video,
  Gift,
  Ticket,
  Package,
  X
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Product } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

// Reusable Array Field Component
const ArrayField = ({ 
  label, 
  items, 
  onAdd, 
  onRemove, 
  onChange, 
  renderInput,
  description
}: { 
  label: string, 
  items: any[], 
  onAdd: () => void, 
  onRemove: (index: number) => void,
  onChange: (index: number, value: any) => void,
  renderInput: (item: any, index: number) => React.ReactNode,
  description?: string
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-bold text-sm text-white">{label}</h4>
        {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-light transition-colors"
      >
        <Plus size={14} />
        Add Item
      </button>
    </div>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3 group">
          <div className="flex-1">
            {renderInput(item, index)}
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-3 text-gray-500 hover:text-red-500 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default function ProductForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialSection = (searchParams.get('section') as any) || 'Templates';
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [step, setStep] = useState(isEdit ? 2 : 1);

  const [formData, setFormData] = useState<Partial<Product>>({
    section: initialSection,
    categories: [],
    features: [],
    whatYouReceive: [],
    coupons: [],
    supportedDevices: ['Mobile', 'Desktop'],
    format: [],
    currentPrice: 0,
    originalPrice: 0,
    stockCount: 5,
    status: 'active' as any
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        try {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data() as Product);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          setError('System failed to synchronize product metadata.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    
    if (type === 'number') newValue = Number(value);
    setError(null);
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      if (name === 'title' && !isEdit) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const productId = id || `p_${Date.now()}`;
      const payload = {
        ...formData,
        id: productId,
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'products', productId), payload);
      navigate(`/admin/products?section=${formData.section}`);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Critical Error: Could not commit changes to the decentralized database.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest animate-pulse">Initializing Data Architect...</p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 flex items-center justify-center bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-white/5"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[8px] font-black text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded border border-primary/20">{formData.section}</span>
               <div className="w-1 h-1 rounded-full bg-white/20" />
               <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{isEdit ? 'Revision Mode' : 'New Deployment'}</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white/90">{isEdit ? 'Modify Asset' : 'Deploy New Asset'}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border ${
              previewMode 
                ? 'bg-primary text-white border-primary shadow-2xl shadow-primary/30' 
                : 'bg-white/[0.03] text-gray-500 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {previewMode ? <X size={18} /> : <Eye size={18} />}
            {previewMode ? 'Close Portal' : 'Live Preview'}
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center justify-center gap-3 bg-[#00d084] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#00d084]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 group"
          >
            {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
            {isEdit ? 'Commit Changes' : 'Push To Live'}
          </button>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-red-500/10 border border-red-500/20 rounded-[1.5rem] flex items-center gap-4 text-red-500"
        >
          <AlertCircle size={20} />
          <p className="text-[10px] font-black uppercase tracking-wider">{error}</p>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2 mb-10">
              <h2 className="text-3xl font-bold">Select Product Section</h2>
              <p className="text-gray-400">Choose the type of product you want to upload to render the correct fields.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  id: 'Templates', 
                  icon: Layout, 
                  label: 'Website Templates', 
                  desc: 'Gift sites, portfolios, business pages' 
                },
                { 
                  id: 'Editing Assets', 
                  icon: Video, 
                  label: 'Editing Assets', 
                  desc: 'SFX Packs, VFX presets, transitions' 
                },
                { 
                  id: 'Freebies', 
                  icon: Gift, 
                  label: 'Freebies', 
                  desc: 'High-quality resources for zero cost' 
                }
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, section: s.id as any }));
                    setStep(2);
                  }}
                  className={`
                    group p-8 rounded-3xl border-2 transition-all text-left space-y-4
                    ${formData.section === s.id 
                      ? 'bg-primary/10 border-primary text-white shadow-2xl shadow-primary/20' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:bg-white/[0.08]'}
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                    ${formData.section === s.id ? 'bg-primary text-white' : 'bg-white/10 text-gray-400 group-hover:text-white'}
                  `}>
                    <s.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold block">{s.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`ml-auto transition-transform ${formData.section === s.id ? 'translate-x-1 opacity-100' : 'opacity-0'}`} 
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="step2"
            onSubmit={handleSave}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column: Basic Details */}
            <div className="space-y-8">
              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <Package className="text-primary" size={20} />
                  General Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Title</label>
                    <input
                      required
                      name="title"
                      value={formData.title || ''}
                      onChange={handleChange}
                      placeholder="e.g. Cinematic SFX Pack"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Slug</label>
                      <input
                        required
                        name="slug"
                        value={formData.slug || ''}
                        onChange={handleChange}
                        placeholder="cinematic-sfx-pack"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Badge</label>
                      <select
                        name="badge"
                        value={formData.badge || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="">No Badge</option>
                        <option value="Latest">Latest</option>
                        <option value="Hot Sell">Hot Sell</option>
                        <option value="Trending">Trending</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categories (Comma separated)</label>
                    <input
                      name="categories"
                      value={formData.categories?.join(', ') || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, categories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                      placeholder="e.g. Birthday, Anniversary, Minimalism"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      required
                      name="description"
                      rows={4}
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder="Describe your product..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <Ticket className="text-primary" size={20} />
                  Pricing & Stock
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Current Price (₹)</label>
                    <input
                      type="number"
                      name="currentPrice"
                      value={formData.currentPrice || 0}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice || 0}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {formData.section !== 'Freebies' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Count</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        name="stockCount"
                        value={formData.stockCount || 0}
                        onChange={handleChange}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                      />
                      <span className="text-xs text-gray-600">Enter 0 for unlimited</span>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <ExternalLink className="text-primary" size={20} />
                  Product Delivery
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Checkout URL (Manual)</label>
                    <input
                      name="checkoutUrl"
                      value={formData.checkoutUrl || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Access Link (Post-Purchase)</label>
                    <input
                      name="productAccessUrl"
                      placeholder="e.g. Google Drive or Customization Form link"
                      value={formData.productAccessUrl || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Access Instructions</label>
                    <textarea
                      name="productAccessInstructions"
                      rows={2}
                      value={formData.productAccessInstructions || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all resize-none"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Dynamic & Media Content */}
            <div className="space-y-8">
              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <Upload className="text-primary" size={20} />
                  Media Assets
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Thumbnail URL</label>
                    <input
                      required
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Video/Preview URL</label>
                    <input
                      name="videoUrl"
                      value={formData.videoUrl || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                </div>
              </section>

              {/* Dynamic Fields Section */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-white/5 pb-4">
                  <Layout className="text-primary" size={20} />
                  {formData.section} Details
                </h3>

                {formData.section === 'Templates' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Demo URL</label>
                      <input
                        name="demoUrl"
                        value={formData.demoUrl || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Deployment Time</label>
                      <input
                        name="deploymentTime"
                        placeholder="e.g. 12-24 Hours"
                        value={formData.deploymentTime || ''}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                      />
                    </div>
                    <div className="flex gap-4">
                      {['Mobile', 'Desktop'].map(device => (
                        <label key={device} className="flex-1 flex items-center gap-2 px-4 py-3 bg-black/40 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                          <input
                            type="checkbox"
                            checked={formData.supportedDevices?.includes(device)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                supportedDevices: checked 
                                  ? [...(prev.supportedDevices || []), device]
                                  : (prev.supportedDevices || []).filter(d => d !== device)
                              }));
                            }}
                            className="w-4 h-4 rounded border-white/10 bg-black/40 text-primary focus:ring-primary"
                          />
                          <span className="text-sm font-medium">{device}</span>
                          {device === 'Mobile' ? <Smartphone size={14} /> : <Monitor size={14} />}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {formData.section === 'Editing Assets' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">File Size</label>
                        <input
                          name="fileSize"
                          placeholder="e.g. 2.4 GB"
                          value={formData.fileSize || ''}
                          onChange={handleChange}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Formats</label>
                        <input
                          placeholder="WAV, MP3, ZIP"
                          value={formData.format?.join(', ') || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, format: e.target.value.split(',').map(s => s.trim()) }))}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.section === 'Freebies' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Download Type</label>
                    <input
                      name="downloadType"
                      placeholder="e.g. Telegram Access, Direct Drive"
                      value={formData.downloadType || ''}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
                    />
                  </div>
                )}
              </section>

              {/* Dynamic Array Sections */}
              <section className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-8">
                <ArrayField
                  label="Features"
                  items={formData.features || []}
                  onAdd={() => setFormData(p => ({ ...p, features: [...(p.features || []), { name: '', description: '' }] }))}
                  onRemove={(i) => setFormData(p => ({ ...p, features: (p.features || []).filter((_, idx) => idx !== i) }))}
                  onChange={(i, v) => {
                    const next = [...(formData.features || [])];
                    next[i] = v;
                    setFormData(p => ({ ...p, features: next }));
                  }}
                  renderInput={(item, i) => (
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        placeholder="Feature Name"
                        value={item.name}
                        onChange={(e) => {
                          const next = [...(formData.features || [])];
                          next[i] = { ...item, name: e.target.value };
                          setFormData(p => ({ ...p, features: next }));
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm"
                      />
                      <input
                        placeholder="Feature Description"
                        value={item.description}
                        onChange={(e) => {
                          const next = [...(formData.features || [])];
                          next[i] = { ...item, description: e.target.value };
                          setFormData(p => ({ ...p, features: next }));
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm"
                      />
                    </div>
                  )}
                />

                <ArrayField
                  label="What You Receive"
                  items={formData.whatYouReceive || []}
                  onAdd={() => setFormData(p => ({ ...p, whatYouReceive: [...(p.whatYouReceive || []), ''] }))}
                  onRemove={(i) => setFormData(p => ({ ...p, whatYouReceive: (p.whatYouReceive || []).filter((_, idx) => idx !== i) }))}
                  onChange={(i, v) => {
                    const next = [...(formData.whatYouReceive || [])];
                    next[i] = v;
                    setFormData(p => ({ ...p, whatYouReceive: next }));
                  }}
                  renderInput={(item, i) => (
                    <input
                      placeholder="Item name"
                      value={item}
                      onChange={(e) => {
                        const next = [...(formData.whatYouReceive || [])];
                        next[i] = e.target.value;
                        setFormData(p => ({ ...p, whatYouReceive: next }));
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm"
                    />
                  )}
                />

                {formData.section === 'Editing Assets' && (
                  <>
                    <ArrayField
                      label="Why Choose This Pack"
                      items={formData.whyChooseThisPack || []}
                      onAdd={() => setFormData(p => ({ ...p, whyChooseThisPack: [...(p.whyChooseThisPack || []), ''] }))}
                      onRemove={(i) => setFormData(p => ({ ...p, whyChooseThisPack: (p.whyChooseThisPack || []).filter((_, idx) => idx !== i) }))}
                      onChange={(i, v) => {
                        const next = [...(formData.whyChooseThisPack || [])];
                        next[i] = v;
                        setFormData(p => ({ ...p, whyChooseThisPack: next }));
                      }}
                      renderInput={(item, i) => (
                        <input
                          placeholder="Reason"
                          value={item}
                          onChange={(e) => {
                            const next = [...(formData.whyChooseThisPack || [])];
                            next[i] = e.target.value;
                            setFormData(p => ({ ...p, whyChooseThisPack: next }));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm"
                        />
                      )}
                    />
                    <ArrayField
                      label="Where Can You Use It"
                      items={formData.whereCanYouUseIt || []}
                      onAdd={() => setFormData(p => ({ ...p, whereCanYouUseIt: [...(p.whereCanYouUseIt || []), ''] }))}
                      onRemove={(i) => setFormData(p => ({ ...p, whereCanYouUseIt: (p.whereCanYouUseIt || []).filter((_, idx) => idx !== i) }))}
                      onChange={(i, v) => {
                        const next = [...(formData.whereCanYouUseIt || [])];
                        next[i] = v;
                        setFormData(p => ({ ...p, whereCanYouUseIt: next }));
                      }}
                      renderInput={(item, i) => (
                        <input
                          placeholder="Usage location/software"
                          value={item}
                          onChange={(e) => {
                            const next = [...(formData.whereCanYouUseIt || [])];
                            next[i] = e.target.value;
                            setFormData(p => ({ ...p, whereCanYouUseIt: next }));
                          }}
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm"
                        />
                      )}
                    />
                  </>
                )}

                <ArrayField
                  label="Coupons"
                  items={formData.coupons || []}
                  onAdd={() => setFormData(p => ({ ...p, coupons: [...(p.coupons || []), { code: '', discount: 0 }] }))}
                  onRemove={(i) => setFormData(p => ({ ...p, coupons: (p.coupons || []).filter((_, idx) => idx !== i) }))}
                  onChange={(i, v) => {
                    const next = [...(formData.coupons || [])];
                    next[i] = v;
                    setFormData(p => ({ ...p, coupons: next }));
                  }}
                  renderInput={(item, i) => (
                    <div className="flex gap-2">
                      <input
                        placeholder="Code"
                        value={item.code}
                        onChange={(e) => {
                          const next = [...(formData.coupons || [])];
                          next[i] = { ...item, code: e.target.value.toUpperCase() };
                          setFormData(p => ({ ...p, coupons: next }));
                        }}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm font-mono"
                      />
                      <input
                        type="number"
                        placeholder="%"
                        value={item.discount}
                        onChange={(e) => {
                          const next = [...(formData.coupons || [])];
                          next[i] = { ...item, discount: Number(e.target.value) };
                          setFormData(p => ({ ...p, coupons: next }));
                        }}
                        className="w-20 bg-black/40 border border-white/10 rounded-xl py-2 px-3 text-sm"
                      />
                    </div>
                  )}
                />
              </section>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Preview Overlay */}
      {previewMode && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-auto p-4 md:p-12">
           <div className="max-w-6xl mx-auto space-y-12">
              <div className="flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-xl py-4 z-10 border-b border-white/10">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Eye className="text-primary" />
                  Real-Time Live Preview
                </h2>
                <button 
                  onClick={() => setPreviewMode(false)}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all"
                >
                  Close Preview
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Card Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Card Preview</h3>
                  <div className="max-w-[340px] bg-secondary border border-white/5 rounded-3xl overflow-hidden group">
                     {/* Simplified card skeleton mapping to real site styles */}
                     <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={formData.thumbnailUrl || 'https://via.placeholder.com/400x400?text=Product+Thumbnail'} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        {formData.badge && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                              {formData.badge}
                            </span>
                          </div>
                        )}
                     </div>
                     <div className="p-6 space-y-3">
                        <h4 className="text-xl font-bold truncate">{formData.title || 'Product Title'}</h4>
                        <p className="text-sm text-gray-400 line-clamp-2">{formData.description || 'Provide a compelling description...'}</p>
                        <div className="flex items-center justify-between pt-2">
                           <div className="flex flex-col">
                              <span className="text-2xl font-bold text-primary">₹{formData.currentPrice || 0}</span>
                              <span className="text-sm text-gray-500 line-through">₹{formData.originalPrice || 0}</span>
                           </div>
                           <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-2xl font-bold text-sm">
                              Get Started
                           </button>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Details Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Page Highlights</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={20} />
                        Key Features
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.features?.map((f, i) => (
                          <div key={i} className="flex gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                            <div>
                               <p className="font-bold text-sm">{f.name || 'Feature Title'}</p>
                               <p className="text-xs text-gray-500">{f.description || 'Feature description...'}</p>
                            </div>
                          </div>
                        )) || <p className="text-gray-500 italic">No features added yet</p>}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="text-primary" size={20} />
                        Inside the Pack
                      </h4>
                      <ul className="space-y-2">
                        {formData.whatYouReceive?.map((r, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-gray-400">
                            <ChevronRight size={14} className="text-primary" />
                            {r || 'Item name'}
                          </li>
                        )) || <p className="text-gray-500 italic">No items listed</p>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
