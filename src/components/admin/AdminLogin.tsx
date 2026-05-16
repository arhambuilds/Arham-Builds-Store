import React, { useState } from 'react';
import { LayoutDashboard, ShieldAlert, KeyRound, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signInAnonymously } from 'firebase/auth';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'up' | 'down'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? setServerStatus('up') : setServerStatus('down'))
      .catch(() => setServerStatus('down'));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (username && password) {
      try {
        const response = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        if (response.ok) {
          localStorage.setItem('arham_admin_session', 'true');
          localStorage.setItem('arham_admin_username', username);
          localStorage.setItem('arham_admin_password', password);
          navigate('/admin');
        } else {
          setError('Invalid username or password');
        }
      } catch (err) {
        setError('Connection error. Please try again.');
        console.error(err);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
          
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8">
            <LayoutDashboard size={40} />
          </div>

          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-4">Admin Access</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-12">Arham Builds Store Management System</p>

          {serverStatus === 'down' && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-700">
              <ShieldAlert size={18} />
              <p className="text-[10px] font-black uppercase text-left">Backend server is offline. Some features may not work.</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative group">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="USERNAME"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-12 font-black text-xs uppercase tracking-widest focus:border-primary outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="PASSWORD"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-5 pl-12 font-black text-xs uppercase tracking-widest focus:border-primary outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-4 bg-slate-900 text-white p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200 mt-4 disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-[8px] font-black uppercase tracking-[0.3em] text-gray-300 bg-white px-4">OR SECURE LOGIN</div>
            </div>

            <button 
              type="button"
              onClick={async () => {
                const { signInWithPopup, googleProvider } = await import('../../lib/firebase');
                try {
                  const result = await signInWithPopup(auth, googleProvider);
                  if (result.user.email === "alibabasports.in@gmail.com") {
                    localStorage.setItem('arham_admin_session', 'true');
                    localStorage.setItem('arham_admin_username', 'arham2026');
                    localStorage.setItem('arham_admin_password', 'admin2026');
                    navigate('/admin');
                  } else {
                    setError('Access Denied: You are not authorized.');
                  }
                } catch (e) {
                  console.error(e);
                  setError('Google Sign-In failed.');
                }
              }}
              className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 text-slate-800 p-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            >
              <img src="https://www.google.com/favicon.ico" alt="" className="w-4 h-4" />
              Sign in with Google
            </button>
            <button 
              type="button"
              onClick={() => navigate('/')}
              className="w-full p-5 text-gray-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
            >
              Back to Store
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-red-400">
            <ShieldAlert size={14} />
            <span className="text-[8px] font-black uppercase tracking-[0.2em]">Authorized Access Only</span>
          </div>
        </div>
      </div>
    </div>
  );
};
