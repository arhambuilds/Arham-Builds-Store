import { Settings as SettingsIcon, Shield, Bell, Database } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center border border-primary/20">
                <SettingsIcon size={16} className="text-primary" />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white/90">System Engine</h1>
          </div>
          <p className="text-gray-500 font-medium text-sm">Fine-tuning the core parameters of your digital infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: 'Security Protocol', desc: 'Managing firewall parameters, admin permissions, and multi-factor authentication systems.' },
          { icon: Bell, title: 'Neural Alerts', desc: 'Configuring real-time order notifications, system health pings, and customer response triggers.' },
          { icon: Database, title: 'Core Archive', desc: 'Executing deep database backups, product stock synchronization, and historical transaction exports.' },
          { icon: SettingsIcon, title: 'Identity Config', desc: 'Refreshing brand signatures, digital logos, and environmental contact variables across the front.' }
        ].map((item, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-10 rounded-[2.5rem] hover:bg-white/[0.05] transition-all duration-500 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-[40px] -mr-12 -mt-12 pointer-events-none rounded-full group-hover:bg-primary/10 transition-all" />
            
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary/20 transition-all border border-white/5 group-hover:border-primary/20 shadow-2xl">
              <item.icon className="text-gray-500 group-hover:text-primary transition-colors" size={24} />
            </div>
            
            <h3 className="text-xl font-black tracking-tight text-white/90 mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-gray-600 text-xs font-medium leading-relaxed mb-8">{item.desc}</p>
            
            <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-all group/btn">
              Access Module 
              <div className="w-4 h-px bg-gray-800 group-hover/btn:w-8 group-hover/btn:bg-primary transition-all" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
