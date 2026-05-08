import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  Video, 
  Tag, 
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Zap,
  Target,
  Award,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../../data';

interface ProductFormProps {
  product: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
  verifyPin: (pin: string) => boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onClose, onSave, verifyPin }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      id: Math.random().toString(36).substr(2, 9),
      slug: '',
      title: '',
      description: '',
      currentPrice: 0,
      originalPrice: 0,
      thumbnailUrl: '',
      videoUrl: '',
      category: 'Editing Assets',
      subCategory: '',
      badge: undefined,
      checkoutUrl: '',
      demoUrl: '',
      features: [],
      whatYouReceive: [],
      whyChoose: [],
      whereToUse: [],
    }
  );

  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleAddField = (field: keyof Product, val: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[] || []), val]
    }));
  };

  const handleRemoveField = (field: keyof Product, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleUpdateListItem = (field: keyof Product, index: number, key: string, val: string) => {
    setFormData(prev => {
      const list = [...(prev[field] as any[])];
      if (typeof list[index] === 'string') {
        list[index] = val;
      } else {
        list[index] = { ...list[index], [key]: val };
      }
      return { ...prev, [field]: list };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 6) return;

    setIsVerifying(true);
    setPinError(false);

    setTimeout(() => {
      if (verifyPin(pin)) {
        onSave(formData as Product);
      } else {
        setPinError(true);
        setPin('');
      }
      setIsVerifying(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end bg-heading/60 backdrop-blur-sm p-4 sm:p-6 lg:p-8">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-4xl bg-white h-full rounded-[40px] shadow-2xl flex flex-col overflow-hidden relative"
      >
        <header className="p-8 border-b border-primary/5 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-black text-heading uppercase tracking-[0.2em]">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-[10px] text-body/40 font-bold uppercase tracking-widest mt-1">Configure your product data</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-body/40 hover:text-red-500 hover:bg-red-50 transition-all hover:rotate-90"
          >
            <X size={24} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-8 space-y-12">
          {/* General Section */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
              <Tag size={14} /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                  placeholder="Cinematic SFX Pack"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Slug</label>
                <input 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary/50 rounded-2xl border border-dashed border-primary/10 focus:outline-none font-mono text-xs text-primary"
                  placeholder="product-slug"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-semibold text-sm leading-relaxed"
                  placeholder="Tell your customers about this product..."
                />
              </div>
            </div>
          </section>

          {/* Pricing & Category */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
              <Zap size={14} /> Category & Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Current Price</label>
                <input 
                  type="number"
                  required
                  value={formData.currentPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPrice: Number(e.target.value) }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Original Price</label>
                <input 
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-bold text-sm"
                >
                  <option>Editing Assets</option>
                  <option>Birthday</option>
                  <option>Freebies</option>
                  <option>Special</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Sub Category</label>
                <input 
                  value={formData.subCategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-bold text-sm"
                  placeholder="SFX / Animation / LUTs"
                />
              </div>
            </div>
          </section>

          {/* Links & Assets */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
              <LinkIcon size={14} /> Assets & Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                  <ImageIcon size={10} /> Thumbnail URL
                </label>
                <input 
                  required
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest flex items-center gap-2">
                  <Video size={10} /> Video Preview URL (Optional)
                </label>
                <input 
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Checkout URL</label>
                <input 
                  required
                  value={formData.checkoutUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, checkoutUrl: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-mono text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-body/40 uppercase ml-2 tracking-widest">Live Demo URL (Optional)</label>
                <input 
                  value={formData.demoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, demoUrl: e.target.value }))}
                  className="w-full px-6 py-4 bg-secondary rounded-2xl border border-primary/5 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                <CheckCircle2 size={14} /> Key Features
              </h3>
              <button 
                type="button"
                onClick={() => handleAddField('features', { name: '', description: '' })}
                className="p-2 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white transition-all scale-90"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {formData.features?.map((feat, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-secondary/30 p-4 rounded-2xl border border-primary/5 group">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                      placeholder="Feature Name"
                      value={feat.name}
                      onChange={(e) => handleUpdateListItem('features', idx, 'name', e.target.value)}
                      className="bg-white px-4 py-2.5 rounded-xl border border-primary/5 text-xs font-black uppercase tracking-wider focus:outline-none"
                    />
                    <input 
                      placeholder="Short Description"
                      value={feat.description}
                      onChange={(e) => handleUpdateListItem('features', idx, 'description', e.target.value)}
                      className="bg-white px-4 py-2.5 rounded-xl border border-primary/5 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveField('features', idx)}
                    className="p-2.5 text-body/20 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Editing Assets Specific Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-primary/5">
            {/* Why Choose */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Award size={14} /> Why Choose
                </h3>
                <button 
                  type="button"
                  onClick={() => handleAddField('whyChoose', { label: '', description: '' })}
                  className="p-2 bg-indigo-600/5 text-indigo-600 rounded-lg scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {formData.whyChoose?.map((item, idx) => (
                  <div key={idx} className="bg-indigo-600/[0.03] p-4 rounded-2xl border border-indigo-600/5 space-y-3">
                    <input 
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => handleUpdateListItem('whyChoose', idx, 'label', e.target.value)}
                      className="w-full bg-white px-4 py-2 rounded-xl text-xs font-black uppercase"
                    />
                    <div className="flex gap-2">
                    <textarea 
                      placeholder="Description"
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleUpdateListItem('whyChoose', idx, 'description', e.target.value)}
                      className="flex-1 bg-white px-4 py-2 rounded-xl text-xs font-medium"
                    />
                    <button onClick={() => handleRemoveField('whyChoose', idx)} className="text-red-300 hover:text-red-500 self-start"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Where to Use */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Target size={14} /> Where to Use
                </h3>
                <button 
                  type="button"
                  onClick={() => handleAddField('whereToUse', { label: '', description: '' })}
                  className="p-2 bg-emerald-600/5 text-emerald-600 rounded-lg scale-90"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {formData.whereToUse?.map((item, idx) => (
                  <div key={idx} className="bg-emerald-600/[0.03] p-4 rounded-2xl border border-emerald-600/5 space-y-3">
                    <input 
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => handleUpdateListItem('whereToUse', idx, 'label', e.target.value)}
                      className="w-full bg-white px-4 py-2 rounded-xl text-xs font-black uppercase"
                    />
                    <div className="flex gap-2">
                    <textarea 
                      placeholder="Description"
                      rows={2}
                      value={item.description}
                      onChange={(e) => handleUpdateListItem('whereToUse', idx, 'description', e.target.value)}
                      className="flex-1 bg-white px-4 py-2 rounded-xl text-xs font-medium"
                    />
                    <button onClick={() => handleRemoveField('whereToUse', idx)} className="text-red-300 hover:text-red-500 self-start"><Trash2 size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* What You Receive */}
          <section className="space-y-6 pt-8 border-t border-primary/5">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-3">
                <Package size={14} /> What You Receive
              </h3>
              <button 
                type="button"
                onClick={() => handleAddField('whatYouReceive', '')}
                className="p-2 bg-primary/5 text-primary rounded-lg scale-90"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.whatYouReceive?.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <input 
                    value={item}
                    onChange={(e) => handleUpdateListItem('whatYouReceive', idx, '', e.target.value)}
                    className="flex-1 px-4 py-3 bg-secondary rounded-xl border border-primary/5 text-xs font-bold"
                    placeholder="e.g., Custom Link"
                  />
                  <button type="button" onClick={() => handleRemoveField('whatYouReceive', idx)} className="text-body/20 hover:text-red-500"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </section>
        </form>

        <footer className="p-8 border-t border-primary/5 bg-secondary/20 sticky bottom-0 z-10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 max-w-2xl mx-auto">
            <div className="relative flex-1 w-full">
              <input 
                type="password"
                required
                maxLength={6}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 ${pinError ? 'border-red-500' : 'border-primary/10'} focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-center tracking-[1em] text-lg font-black placeholder:tracking-widest placeholder:text-body/20`}
                placeholder="6-DIGIT CODE"
              />
              {pinError && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase animate-bounce">
                  <AlertCircle size={12} /> Invalid Secret Code
                </div>
              )}
            </div>
            <button 
              onClick={handleSubmit}
              disabled={isVerifying || pin.length !== 6}
              className={`w-full sm:w-auto px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95 ${
                pin.length === 6 && !isVerifying
                  ? 'bg-primary text-white shadow-primary/30'
                  : 'bg-primary/20 text-white cursor-not-allowed'
              }`}
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} /> {product ? 'Update Product' : 'Create Product'}
                </>
              )}
            </button>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};
