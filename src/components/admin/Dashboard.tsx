import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Ticket,
  Settings,
  Box,
  Video
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group hover:bg-white/[0.08] transition-all duration-500 shadow-2xl">
    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[50px] -mr-12 -mt-12 pointer-events-none rounded-full" />
    <div className="flex items-center justify-between relative z-10">
      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[1.25rem] flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
        <Icon className="text-primary" size={28} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trend === 'up' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
          {trendValue}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-4xl font-black mt-2 tracking-tighter text-white/90">{value}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    revenue: '₹0',
    orders: 0,
    customers: 0,
    activeProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [ordersSnap, productsSnap] = await Promise.all([
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'products'))
        ]);

        const orders = ordersSnap.docs.map(d => d.data());
        const totalRevenue = orders.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        
        setStats({
          revenue: `₹${totalRevenue.toLocaleString()}`,
          orders: ordersSnap.size,
          customers: new Set(orders.map(o => o.customerEmail)).size,
          activeProducts: productsSnap.size
        });

        // Fetch recent orders
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        setRecentOrders(recentSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent capitalize">Welcome Back, Arham</h1>
          <p className="text-gray-500 text-sm font-medium">Monitoring your premium ecosystem performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <button className="px-4 py-2 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg">Today</button>
          <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors">7 Days</button>
          <button className="px-4 py-2 hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 transition-colors">30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Revenue" value={stats.revenue} icon={DollarSign} trend="up" trendValue={12} />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} trend="up" trendValue={8} />
        <StatCard title="Unique Customers" value={stats.customers} icon={Users} trend="up" trendValue={15} />
        <StatCard title="Active Products" value={stats.activeProducts} icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 blur-[60px] -ml-16 -mt-16 pointer-events-none rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h3 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Recent Orders</h3>
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Real-time purchase activity</p>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-primary/20 pb-0.5 hover:border-primary transition-all">View Full Log</button>
          </div>
          
          <div className="space-y-4 relative z-10">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-black/20 rounded-[2rem] border border-white/5 border-dashed">
                <Box size={40} className="text-gray-800 mb-4" />
                <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">No order data synchronized</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="group/item flex items-center justify-between p-5 bg-white/[0.03] hover:bg-white/[0.06] rounded-[1.5rem] border border-white/5 transition-all duration-300">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover/item:border-white/20 transition-colors">
                      <Clock size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight text-white/80">{order.customerEmail}</p>
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-lg tracking-tighter text-primary">₹{order.amount}</p>
                    <div className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors ${order.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                      <div className={`w-1 h-1 rounded-full ${order.status === 'completed' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] -mr-16 -mb-16 pointer-events-none rounded-full" />
          
          <div className="mb-10">
            <h3 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Operations</h3>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mt-1">Management shortcuts</p>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Add Template', icon: Package, link: '/admin/products?new=true&section=Templates' },
              { label: 'Asset Portal', icon: Video, link: '/admin/products?section=Editing Assets' },
              { label: 'Coupons', icon: Ticket, link: '/admin/coupons' },
              { label: 'Global Setup', icon: Settings, link: '/admin/settings' }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => window.location.href = action.link}
                className="group/action p-6 bg-white/[0.03] rounded-[2rem] border border-white/5 flex flex-col items-center gap-4 hover:bg-white/[0.08] hover:border-primary/30 transition-all hover:-translate-y-2 duration-500"
              >
                <div className="w-14 h-14 bg-white/5 rounded-[1.25rem] flex items-center justify-center group-hover/action:bg-primary/10 group-hover/action:scale-110 transition-all duration-500 shadow-lg border border-white/5 group-hover/action:border-primary/20">
                   <action.icon className="text-gray-500 group-hover/action:text-primary transition-colors" size={24} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover/action:text-white transition-colors">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-10 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center gap-5">
             <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                <Users size={20} className="text-primary" />
             </div>
             <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Support Active</p>
                <p className="text-xs font-bold text-white/50 leading-tight">Need assistance? Your technical architect is available 24/7.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
