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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{section}</h1>
          <p className="text-gray-400">Manage your {section.toLowerCase()} inventory and details.</p>
        </div>
        <button 
          onClick={() => navigate(`/admin/products/new?section=${section}`)}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-colors">
          <Filter size={20} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
            <Package className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400">No products found in this section.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-6 hover:bg-white/[0.08] transition-all hover:border-white/20"
            >
              <img 
                src={product.thumbnailUrl} 
                alt={product.title} 
                className="w-20 h-20 object-cover rounded-xl"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg truncate">{product.title}</h3>
                  {product.badge && (
                    <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded border border-primary/20 uppercase tracking-widest">
                      {product.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mb-2">{product.slug}</p>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Tag size={12} />
                    {product.categories?.[0] || 'Uncategorized'}
                  </span>
                  <span className="text-xs font-bold text-white">
                    ₹{product.currentPrice}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                  className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
                <div className="w-px h-6 bg-white/10 mx-2" />
                <button 
                  onClick={() => navigate(`/${section.toLowerCase().replace(' ', '-')}/${product.slug}`)}
                  className="p-3 text-primary hover:bg-primary/10 rounded-xl transition-all"
                  title="View Live"
                >
                  <ExternalLink size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
