import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  ShoppingCart, 
  Ticket, 
  LogOut,
  ChevronRight,
  Monitor,
  Video,
  Gift
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useAdmin } from '../../hooks/useAdmin';
import { motion, AnimatePresence } from 'motion/react';

const SidebarLink = ({ to, icon: Icon, children }: { to: string, icon: any, children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
      ${isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white'}
    `}
  >
    <Icon size={20} />
    <span className="font-medium">{children}</span>
  </NavLink>
);

export default function AdminLayout() {
  const { user, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You do not have permission to access the admin panel.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-primary rounded-full font-medium"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Settings className="text-white" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight">Admin Panel</h2>
            <p className="text-xs text-gray-500 font-medium">Arham Builds</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink to="/admin" icon={LayoutDashboard}>Dashboard</SidebarLink>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Inventory</p>
          </div>
          
          <SidebarLink to="/admin/products?section=Templates" icon={Monitor}>Templates</SidebarLink>
          <SidebarLink to="/admin/products?section=Editing Assets" icon={Video}>Editing Assets</SidebarLink>
          <SidebarLink to="/admin/products?section=Freebies" icon={Gift}>Freebies</SidebarLink>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Sales</p>
          </div>
          
          <SidebarLink to="/admin/orders" icon={ShoppingCart}>Orders</SidebarLink>
          <SidebarLink to="/admin/coupons" icon={Ticket}>Coupons</SidebarLink>
          
          <div className="pt-4 pb-2 px-4">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">System</p>
          </div>
          
          <SidebarLink to="/admin/settings" icon={Settings}>Settings</SidebarLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 mb-6">
            <img 
              src={user?.photoURL || 'https://ui-avatars.com/api/?name=Admin'} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Arham Builds Control Center
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Package size={20} />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              PRO ACCESS
            </span>
          </div>
        </header>

        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
