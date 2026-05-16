import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Trash2, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch('/api/admin/users', {
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();
    } catch (e) {
      console.error("Error deleting user:", e);
      alert("Error deleting user.");
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2">Users Management</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Manage customer accounts and access</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text"
              placeholder="SEARCH USERS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <button className="bg-white p-4 border-2 border-slate-100 rounded-2xl text-slate-800 hover:border-primary transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center h-64">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 text-center">
              <User className="mx-auto text-slate-100 mb-6" size={64} />
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No users found</p>
            </div>
          ) : (
            <div className="bg-white border-2 border-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50 bg-slate-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Role</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Orders</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-black text-slate-800 uppercase text-xs tracking-tight">{user.displayName || 'Anonymous User'}</div>
                            <div className="text-[10px] font-bold text-gray-400">{user.email || 'No Email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-600">
                            Customer
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-gray-600">
                        {user.ordersCount || 0} Orders
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleDelete(user.id)}
                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
