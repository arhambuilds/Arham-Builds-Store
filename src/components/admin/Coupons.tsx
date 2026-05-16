import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { Ticket, Plus, Trash2 } from 'lucide-react';

export default function Coupons() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: 0 });

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const snap = await getDocs(collection(db, 'coupons'));
        setCoupons(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching coupons:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || newCoupon.discount <= 0) return;
    try {
      const docRef = await addDoc(collection(db, 'coupons'), {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(),
        isActive: true,
        createdAt: new Date().toISOString()
      });
      setCoupons([{ id: docRef.id, ...newCoupon, code: newCoupon.code.toUpperCase() }, ...coupons]);
      setNewCoupon({ code: '', discount: 0 });
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
      setCoupons(coupons.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Coupons</h1>
        <p className="text-gray-400">Create and manage global discount codes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
            <h3 className="text-xl font-bold">New Coupon</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Code</label>
              <input
                required
                value={newCoupon.code}
                onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value })}
                placeholder="PROMO20"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Discount (%)</label>
              <input
                required
                type="number"
                value={newCoupon.discount}
                onChange={e => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-primary transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform"
            >
              <Plus size={20} />
              Create Coupon
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold">Active Coupons</h3>
          {loading ? (
             <div className="h-40 bg-white/5 rounded-3xl animate-pulse" />
          ) : coupons.length === 0 ? (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
              <p className="text-gray-500">No active coupons found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Ticket size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-mono font-bold text-white tracking-widest">{coupon.code}</p>
                      <p className="text-sm text-green-500 font-bold">{coupon.discount}% OFF</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
