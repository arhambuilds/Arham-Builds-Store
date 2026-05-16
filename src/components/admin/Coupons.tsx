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
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                <Ticket size={16} className="text-primary" />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white/90">Coupons</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">Orchestrate global discount structures for your ecosystem.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -mr-16 -mt-16 pointer-events-none rounded-full" />
            <h3 className="text-xl font-black tracking-tight text-white/90 relative z-10">New Strategy</h3>
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2.5">Promo Identifier</label>
                <input
                  required
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. ARCHITECT50"
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm font-black tracking-widest text-white focus:border-primary/50 focus:bg-black/60 transition-all uppercase placeholder:text-gray-800"
                />
              </div>
              <div>
                <label className="block text-[8px] font-black text-gray-600 uppercase tracking-[0.2em] mb-2.5">Discount Percentage</label>
                <div className="relative">
                  <input
                    required
                    type="number"
                    value={newCoupon.discount || ''}
                    onChange={e => setNewCoupon({ ...newCoupon, discount: Number(e.target.value) })}
                    placeholder="20"
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-sm font-black text-white focus:border-primary/50 focus:bg-black/60 transition-all placeholder:text-gray-800"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-gray-600">%</span>
                </div>
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all group/btn"
              >
                <Plus size={18} strokeWidth={3} className="group-hover/btn:rotate-90 transition-transform" />
                Commit Coupon
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-black tracking-tight text-white/40 uppercase tracking-[0.2em]">Active Assets</h3>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">{coupons.length} CODES</span>
          </div>
          
          {loading ? (
             <div className="h-60 bg-white/5 rounded-[2.5rem] animate-pulse border border-white/5" />
          ) : coupons.length === 0 ? (
            <div className="text-center py-24 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[3rem]">
              <Ticket className="mx-auto text-gray-800 mb-6" size={56} strokeWidth={1} />
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No promo strategies in the current deployment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 hover:shadow-2xl">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 group-hover:scale-110 transition-transform">
                      <Ticket size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-black text-lg text-white tracking-[0.2em] uppercase">{coupon.code}</p>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest border border-green-500/20">
                            {coupon.discount}% SAVINGS
                         </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-500/10"
                    title="Terminate Strategy"
                  >
                    <Trash2 size={20} />
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
