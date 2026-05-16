import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { ShoppingCart } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                <ShoppingCart size={16} className="text-primary" />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white/90">Transaction Log</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">Monitoring the flow of assets through the store ecosystem.</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Hash ID</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Customer Entity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Target Asset</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Value</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">State</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-10"><div className="h-4 bg-white/5 rounded-full w-full" /></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="text-gray-800" size={32} />
                    </div>
                    <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No transaction data recorded in the current cycle.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.04] transition-all duration-300 group">
                    <td className="px-8 py-8">
                       <span className="font-mono text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-lg border border-white/5 group-hover:border-primary/20 group-hover:text-primary transition-all">
                          #{order.id.slice(-8).toUpperCase()}
                       </span>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/5 flex items-center justify-center text-[10px] font-black text-primary">
                             {order.customerEmail[0].toUpperCase()}
                          </div>
                          <span className="font-black text-xs text-white/80">{order.customerEmail}</span>
                       </div>
                    </td>
                    <td className="px-8 py-8 max-w-[200px]">
                       <span className="text-xs font-medium text-gray-500 truncate block uppercase tracking-tight">{order.productId}</span>
                    </td>
                    <td className="px-8 py-8 font-black text-white tracking-tighter">₹{order.amount}</td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] border ${
                        order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20 shadow-lg shadow-green-500/10' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-lg shadow-yellow-500/10'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                       {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
