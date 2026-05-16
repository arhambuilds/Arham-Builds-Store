import React, { useState, useEffect } from 'react';
import { Settings, Save, Shield, Bell, Palette, Globe, Mail } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    storeName: 'Arham Builds',
    contactEmail: 'contact@arhambuilds.com',
    supportNumber: '+91 9876543210',
    maintenanceMode: false,
    darkMode: true,
    currencySymbol: 'INR'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const sections = [
    { title: 'General Store', icon: Globe, fields: ['storeName', 'contactEmail', 'supportNumber', 'currencySymbol'] },
    { title: 'Preferences', icon: Palette, fields: ['darkMode', 'maintenanceMode'] },
    { title: 'Security', icon: Shield, fields: [] },
    { title: 'Notifications', icon: Bell, fields: [] }
  ];

  return (
    <div className="p-8 pb-20 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tighter mb-2">System Settings</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Configure your digital store environment</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          ) : (
            <Save size={18} />
          )}
          {success ? 'SAVED!' : 'SAVE CHANGES'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1 space-y-2">
          {sections.map(s => (
            <button key={s.title} className="w-full flex items-center gap-4 p-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-primary hover:bg-white transition-all text-left">
              <s.icon size={16} />
              {s.title}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-8">
          <div className="bg-white border-2 border-slate-100 rounded-3xl p-8">
            <h3 className="font-black uppercase tracking-widest text-xs text-slate-800 mb-8 pb-4 border-b border-slate-50">General Configuration</h3>
            
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Public Name</label>
                <input 
                  type="text"
                  value={settings.storeName}
                  onChange={e => setSettings({...settings, storeName: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-2xl p-4 text-xs font-bold transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Support Email</label>
                  <input 
                    type="email"
                    value={settings.contactEmail}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-2xl p-4 text-xs font-bold transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Currency</label>
                  <select className="w-full bg-slate-50 border-2 border-transparent focus:border-primary focus:bg-white outline-none rounded-2xl p-4 text-xs font-bold transition-all">
                    <option>INR</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl mt-4">
                <div>
                  <div className="font-black uppercase tracking-widest text-[10px] text-slate-800 mb-1">Maintenance Mode</div>
                  <div className="text-[9px] font-bold text-gray-400">Lock the store for public visitors</div>
                </div>
                <button 
                  onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                  className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
