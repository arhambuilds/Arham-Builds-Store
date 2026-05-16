import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Tag,
  Package
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Product } from '../../data';
import { motion } from 'motion/react';

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'Templates';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'products'), where('section', '==', section));
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [section]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                <Package size={16} className="text-primary" />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white/90">{section}</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">Managing your ultimate architecture of digital assets.</p>
        </div>
        <button 
          onClick={() => navigate(`/admin/products/new?section=${section}`)}
          className="flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all group"
        >
          <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
          Add To Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Query products by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/[0.08] transition-all">
            <Filter size={18} />
            Advanced Filter
          </button>
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/5 p-1 rounded-2xl">
             <button className="p-2.5 bg-white/10 rounded-xl text-primary"><MoreVertical size={16} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.03] rounded-[2rem] border border-white/5 animate-pulse" />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white/[0.01] rounded-[3rem] border-2 border-dashed border-white/5">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-gray-700" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">Inventory Empty</h3>
            <p className="text-gray-700 text-xs font-black uppercase tracking-wider">No products found in the "{section}" segment.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 flex items-center gap-8 hover:bg-white/[0.05] transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="relative shrink-0">
                <img 
                  src={product.thumbnailUrl} 
                  alt={product.title} 
                  className="w-24 h-24 object-cover rounded-3xl z-10 relative border border-white/5 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full -z-0 scale-75" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-xl tracking-tight text-white/90 truncate group-hover:text-primary transition-colors">{product.title}</h3>
                  {product.badge && (
                    <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 uppercase tracking-widest shadow-lg shadow-primary/20">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Slug Identifier</span>
                      <p className="text-xs font-mono text-gray-500">{product.slug}</p>
                   </div>
                   <div className="h-8 w-px bg-white/5 hidden sm:block" />
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Classification</span>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Tag size={12} className="text-primary/60" />
                        {product.categories?.[0] || 'Base Tier'}
                      </span>
                   </div>
                   <div className="h-8 w-px bg-white/5 hidden sm:block" />
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Asset Pricing</span>
                      <span className="text-lg font-black text-white tracking-tighter">
                        ₹{product.currentPrice}
                      </span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button 
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5"
                  title="Edit Master File"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="w-12 h-12 flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all border border-transparent hover:border-red-500/10"
                  title="Archive Product"
                >
                  <Trash2 size={20} />
                </button>
                <div className="w-px h-8 bg-white/5 mx-2" />
                <button 
                  onClick={() => navigate(`/${section.toLowerCase().replace(' ', '-')}/${product.slug}`)}
                  className="w-12 h-12 flex items-center justify-center bg-white/5 text-primary hover:bg-primary/20 rounded-2xl transition-all border border-white/10 hover:border-primary/30 shadow-lg"
                  title="Deploy Visual Preview"
                >
                  <ExternalLink size={20} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
