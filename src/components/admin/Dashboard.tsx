import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        <Icon className="text-primary" size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {trendValue}%
        </div>
      )}
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome Back, Admin</h1>
        <p className="text-gray-400">Here's what's happening with Arham Builds today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={stats.revenue} icon={DollarSign} trend="up" trendValue={12} />
        <StatCard title="Total Orders" value={stats.orders} icon={ShoppingCart} trend="up" trendValue={8} />
        <StatCard title="Unique Customers" value={stats.customers} icon={Users} trend="up" trendValue={15} />
        <StatCard title="Active Products" value={stats.activeProducts} icon={Package} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Recent Orders</h3>
            <button className="text-primary text-sm font-bold hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-center py-10 text-gray-500 italic">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Clock size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{order.customerEmail}</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">₹{order.amount}</p>
                    <p className={`text-[10px] font-bold uppercase ${order.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Add Template', icon: Package, link: '/admin/products/new?section=Templates' },
              { label: 'Create Coupon', icon: Ticket, link: '/admin/coupons' },
              { label: 'Manage Orders', icon: ShoppingCart, link: '/admin/orders' },
              { label: 'Site Settings', icon: Settings, link: '/admin/settings' }
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => window.location.href = action.link}
                className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center gap-3 hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                   <action.icon className="text-primary" size={20} />
                </div>
                <span className="text-sm font-bold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Ticket, Settings } from 'lucide-react';
