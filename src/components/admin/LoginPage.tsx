import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../../lib/firebase';
import { useAdmin } from '../../hooks/useAdmin';
import { LogIn, ShieldCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading } = useAdmin();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin) {
    navigate('/admin');
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <button 
          onClick={() => navigate('/')}
          className="mb-8 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>

        <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 backdrop-blur-xl shadow-2xl space-y-8 text-center">
          <div className="inline-flex w-20 h-20 bg-primary/10 rounded-3xl items-center justify-center mb-4">
             <ShieldCheck className="text-primary" size={40} />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p className="text-gray-400">Authorized access only for Arham Builds management.</p>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || authLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            )}
            Sign in with Google
          </button>

          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            Controlled by Arham Adib Security Systems
          </p>
        </div>
      </motion.div>
    </div>
  );
}
