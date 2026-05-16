import React, { useState, useEffect, useRef } from 'react';
import { Upload, File, FileText, Download, Trash2, Search, Plus, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminUploads: React.FC = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUploads = async () => {
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch('/api/admin/uploads', {
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to fetch uploads');
      const data = await response.json();
      setUploads(data);
    } catch (e) {
      console.error("Error fetching uploads:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      fetchUploads();
    } catch (e) {
      console.error("Error uploading file:", e);
      alert("Error uploading file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      const username = localStorage.getItem('arham_admin_username');
      const password = localStorage.getItem('arham_admin_password');
      const response = await fetch(`/api/admin/uploads/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-username': username || '',
          'x-admin-password': password || ''
        }
      });
      if (!response.ok) throw new Error('Failed to delete file');
      fetchUploads();
    } catch (e) {
      console.error("Error deleting file:", e);
      alert("Error deleting file.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredUploads = uploads.filter(file => 
    file.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2">File Assets</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cloud storage for products, invoices, and reports</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text"
              placeholder="SEARCH FILES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-primary outline-none transition-all w-64 shadow-sm"
            />
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          
          <button 
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isUploading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Upload size={18} />
            )}
            UPLOAD NEW
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center h-64">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUploads.length === 0 ? (
            <div className="col-span-full bg-white border-2 border-dashed border-slate-100 rounded-3xl p-20 text-center">
              <File className="mx-auto text-slate-100 mb-6" size={64} />
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No files uploaded yet</p>
            </div>
          ) : (
            filteredUploads.map((file) => (
              <motion.div 
                layout
                key={file.id} 
                className="bg-white border-2 border-slate-100 rounded-3xl p-6 group hover:border-primary/20 transition-all shadow-sm flex flex-col"
              >
                <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                  {file.mimetype?.startsWith('image/') ? (
                    <img src={file.path} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-300">
                      {file.mimetype?.includes('pdf') ? <FileText size={48} /> : <File size={48} />}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <a 
                      href={file.path} 
                      download 
                      className="p-3 bg-white text-slate-900 rounded-xl hover:bg-primary hover:text-white transition-all shadow-xl"
                    >
                      <Download size={18} />
                    </a>
                    <button 
                      onClick={() => handleDelete(file.id)}
                      className="p-3 bg-white text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-black text-slate-800 uppercase text-[10px] tracking-tight truncate mb-1">{file.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{formatSize(file.size)}</span>
                    <span className="text-[8px] font-bold text-gray-300 uppercase">
                      {file.createdAt?.seconds ? new Date(file.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
