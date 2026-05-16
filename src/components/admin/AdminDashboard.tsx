import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { 
  BarChart3,
  ShoppingCart, 
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  TrendingUp
} from 'lucide-react';

import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface Stats {
  revenue: number;
  orders: number;
  products: number;
  users: number;
  uploads: number;
  avgOrderValue: number;
  chartData: any[];
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({ 
    revenue: 0, 
    orders: 0, 
    products: 0, 
    users: 0,
    uploads: 0,
    avgOrderValue: 0,
    chartData: []
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('arham_admin_username');
        const password = localStorage.getItem('arham_admin_password');
        const response = await fetch('/api/admin/stats', {
          headers: {
            'x-admin-username': username || '',
            'x-admin-password': password || ''
          }
        });
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        
        setStats({
          revenue: data.revenue,
          orders: data.orders,
          products: data.products,
          users: data.users || 0,
          uploads: data.uploads || 0,
          avgOrderValue: data.avgOrderValue,
          chartData: data.chartData || []
        });

        setRecentOrders(data.recentOrders || []);
        
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { name: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-500', bg: 'bg-blue-50' },
    { name: 'Total Users', value: stats.users, icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
    { name: 'Uploaded Files', value: stats.uploads, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl" />)}
    </div>
    <div className="h-96 bg-gray-200 rounded-3xl" />
  </div>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black mb-2 flex items-center gap-4">
          <span className="bg-primary/10 text-primary p-2 rounded-2xl"><LayoutDashboard size={24} /></span>
          DASHBOARD
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Real-time store analytics & performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl transition-all duration-500">
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{card.name}</p>
              <p className="text-2xl font-black text-slate-800">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black flex items-center gap-3 text-slate-800">
            <TrendingUp size={18} className="text-primary" />
            REVENUE GROWTH
          </h2>
          <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest outline-none">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px'}}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black flex items-center gap-3">
            <ShoppingCart size={18} className="text-primary" />
            RECENT ORDERS
          </h2>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Plan</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-[11px] font-black text-gray-400 uppercase">#{order.id.slice(0, 8)}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-slate-800">{order.customerName}</p>
                    <p className="text-[10px] font-bold text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase rounded-full">
                      {order.items?.[0]?.title || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-800">INR {(order.amount || 0).toFixed(2)}</td>
                  <td className="px-8 py-6 text-right text-[11px] font-bold text-gray-400">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
