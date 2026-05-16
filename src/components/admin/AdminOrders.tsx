import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { Trash2, ExternalLink, Mail, Phone, Calendar, IndianRupee, ShoppingCart } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch('/api/admin/orders', {
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (e) {
      console.error("Error fetching orders:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order record?")) return;
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to delete order');
      fetchOrders();
    } catch (e) {
      console.error("Error deleting order:", e);
      alert("Error deleting order.");
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">
    {[1,2,3,4,5].map(i => <div key={i} className="h-24 bg-gray-200 rounded-3xl" />)}
  </div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black mb-2 uppercase tracking-tighter">Orders</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Track and manage customer transactions</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 group relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-lg">
                    #{order.id.slice(0, 10)}
                  </span>
                  <span className={cn(
                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg",
                    order.status === 'completed' ? "bg-emerald-50 text-emerald-500" : "bg-orange-50 text-orange-500"
                  )}>
                    {order.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-800 uppercase leading-none mb-1">{order.customerName}</h3>
                  <div className="flex flex-wrap gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Mail size={12} /> {order.customerEmail}</span>
                    <span className="flex items-center gap-1.5"><Phone size={12} /> {order.customerPhone}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={12} /> {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {order.items?.map((item: any, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-wider rounded-xl">
                      {item.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col md:items-end justify-between gap-4 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Paid</p>
                  <p className="text-2xl font-black text-slate-800">INR {order.amount ? Number(order.amount).toFixed(2) : '0.00'}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleDelete(order.id)}
                    className="p-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                  {order.razorpayPaymentId && (
                    <a 
                      href={`https://dashboard.razorpay.com/app/payments/${order.razorpayPaymentId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-primary rounded-xl transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <ShoppingCart size={40} />
            </div>
            <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No orders found</h3>
          </div>
        )}
      </div>
    </div>
  );
};
