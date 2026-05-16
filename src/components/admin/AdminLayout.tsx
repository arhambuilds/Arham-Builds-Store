import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  Users,
  Upload,
  Moon,
  Sun
} from 'lucide-react';
import { auth, signOut } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('admin_dark_mode') === 'true';
    setIsDark(saved);
  }, []);

  const toggleDark = () => {
    const newVal = !isDark;
    setIsDark(newVal);
    localStorage.setItem('admin_dark_mode', String(newVal));
  };

  const handleSignOut = async () => {
    localStorage.removeItem('arham_admin_session');
    localStorage.removeItem('arham_admin_username');
    localStorage.removeItem('arham_admin_password');
    await signOut(auth);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
          <h1 className="text-3xl font-black mb-4">RESTRICTED AREA</h1>
          <p className="text-gray-500 mb-8 font-medium">You do not have permission to access the admin panel.</p>
          <button 
            onClick={() => navigate('/admin/login')}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary/90 transition-all active:scale-95"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: Package, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Uploads', icon: Upload, path: '/admin/uploads' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className={cn(
      "min-h-screen flex flex-col md:flex-row transition-colors",
      isDark ? "bg-[#0f172a] text-slate-100" : "bg-[#f4f5f8] text-slate-800"
    )}>
      {/* Sidebar */}
      <aside className={cn(
        "w-full md:w-64 flex flex-col shrink-0 border-r transition-all",
        isDark ? "bg-[#1e293b] border-slate-800" : "bg-white border-gray-100"
      )}>
        <div className={cn(
          "p-8 border-b flex items-center justify-between",
          isDark ? "border-slate-800" : "border-gray-100"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm uppercase tracking-tighter">Arham Builds</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest -mt-1">Admin Panel</span>
            </div>
          </div>
          <button 
            onClick={toggleDark}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-400" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : isDark ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                )}
              >
                <item.icon size={16} />
                {item.name}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className={cn(
          "p-4 border-t",
          isDark ? "border-slate-800" : "border-gray-100"
        )}>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
