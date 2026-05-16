import { Settings as SettingsIcon, Shield, Bell, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Configure your store preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: Shield, title: 'Security', desc: 'Manage admin access and authentication.' },
          { icon: Bell, title: 'Notifications', desc: 'Configure order alerts and system updates.' },
          { icon: Database, title: 'Data Backup', desc: 'Export your product and order database.' },
          { icon: SettingsIcon, title: 'General', desc: 'Update store name, logo and contact info.' }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:bg-white/[0.08] transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <item.icon className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            <button className="mt-6 text-xs font-bold text-primary uppercase tracking-widest hover:underline">
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
