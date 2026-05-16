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
      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent
      ${isActive 
        ? 'bg-primary text-white shadow-lg shadow-primary/25 border-primary/20' 
        : 'text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/5'}
    `}
  >
    {({ isActive }) => (
      <>
        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
        <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{children}</span>
      </>
    )}
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
    <div className="min-h-screen bg-[#020203] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#050506] border-r border-white/5 flex flex-col p-6 sticky top-0 h-screen shadow-[10px_0_30px_-15px_rgba(0,0,0,0.5)] z-50">
        <div className="flex items-center gap-3 mb-10 px-2 transition-all hover:scale-105 active:scale-95 group">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 group-hover:rotate-12 transition-transform">
            <Settings className="text-primary" size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg leading-tight tracking-tight uppercase">Admin</h2>
            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] opacity-60">Arham Builds</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 custom-scrollbar overflow-y-auto pr-2 -mr-2">
          <SidebarLink to="/admin" icon={LayoutDashboard}>Dashboard</SidebarLink>
          
          <div className="pt-6 pb-2 px-4 flex items-center gap-3 opacity-40">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Inventory</p>
            <span className="flex-1 h-px bg-white/10"></span>
          </div>
          
          <SidebarLink to="/admin/products?section=Templates" icon={Monitor}>Templates</SidebarLink>
          <SidebarLink to="/admin/products?section=Editing Assets" icon={Video}>Editing Assets</SidebarLink>
          <SidebarLink to="/admin/products?section=Freebies" icon={Gift}>Freebies</SidebarLink>
          
          <div className="pt-6 pb-2 px-4 flex items-center gap-3 opacity-40">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">Sales</p>
            <span className="flex-1 h-px bg-white/10"></span>
          </div>
          
          <SidebarLink to="/admin/orders" icon={ShoppingCart}>Orders</SidebarLink>
          <SidebarLink to="/admin/coupons" icon={Ticket}>Coupons</SidebarLink>
          
          <div className="pt-6 pb-2 px-4 flex items-center gap-3 opacity-40">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">System</p>
            <span className="flex-1 h-px bg-white/10"></span>
          </div>
          
          <SidebarLink to="/admin/settings" icon={Settings}>Settings</SidebarLink>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-white/[0.03] rounded-2xl border border-white/5">
            <img 
              src={user?.photoURL || 'https://ui-avatars.com/api/?name=Admin&background=ff014f&color=fff'} 
              alt="Avatar" 
              className="w-9 h-9 rounded-full border border-white/10 ring-2 ring-primary/20"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[9px] text-gray-500 truncate font-mono opacity-50">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-300 active:scale-95 border border-transparent hover:border-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm tracking-wide">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#020203] relative min-h-screen">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 blur-[150px] -mr-[20%] -mt-[20%] pointer-events-none rounded-full z-0" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-500/5 blur-[120px] -ml-[10%] -mb-[10%] pointer-events-none rounded-full z-0" />

        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#020203]/80 backdrop-blur-2xl z-40">
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <h1 className="text-sm font-black tracking-[0.2em] text-white/90 uppercase">
                Control Center
              </h1>
              <div className="h-0.5 w-8 bg-primary rounded-full mt-1" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-4 py-2 rounded-full shadow-inner">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live</span>
            </div>
            
            <div className="w-px h-6 bg-white/10 mx-2" />
            
            <button className="p-2.5 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all relative border border-white/5 active:scale-90">
              <ShoppingCart size={18} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-[#020203]" />
            </button>
          </div>
        </header>

        <div className="p-8 relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
