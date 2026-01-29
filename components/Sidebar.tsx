import React from 'react';
import { 
  ShieldAlert, 
  Phone, 
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Sparkles,
  Siren,
  Trees,
  Database,
  LayoutGrid,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Apžvalga', icon: <LayoutGrid size={16} /> },
    { id: 'intro', label: 'Nuostatos', icon: <BookOpen size={16} /> },
    { id: 'scenarios', label: 'Situacijos', icon: <AlertTriangle size={16} /> },
    { id: 'schemes', label: 'Schemos', icon: <ShieldAlert size={16} /> },
    { id: 'contacts', label: 'Specialistai', icon: <Phone size={16} /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col z-40 shadow-sm">
      {/* Brand Header - Compact */}
      <div className="p-5">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center shadow-md transform rotate-1">
            <Trees size={16} />
          </div>
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tighter leading-none">VAP</h1>
            <p className="text-[8px] text-slate-400 uppercase font-black tracking-[0.15em] mt-0.5">PORTALAS</p>
          </div>
        </div>
      </div>
      
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-thin mt-8">
        
        {/* Main Navigation Section */}
        <div className="space-y-0.5">
          <p className="px-3 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Navigacija</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
                activeTab === item.id 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <span className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}>
                {item.icon}
              </span>
              <span className="text-[12px] font-bold flex-1 text-left">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        
        {/* Support Section */}
        <div className="space-y-0.5 pb-6">
          <p className="px-3 text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Pagalba ir Resursai</p>
          
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group border ${
              activeTab === 'ai-assistant' 
                ? 'bg-amber-50 text-amber-900 border-amber-100' 
                : 'text-slate-600 hover:bg-slate-50 border-transparent'
            }`}
          >
            <div className={`p-1.5 rounded-md ${activeTab === 'ai-assistant' ? 'bg-amber-200/50' : 'bg-slate-50'}`}>
              <Sparkles size={14} className={activeTab === 'ai-assistant' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'} />
            </div>
            <span className="text-[12px] font-bold flex-1 text-left">DI Pagalvėlė</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group border ${
              activeTab === 'emergency' 
                ? 'bg-rose-50 text-rose-700 border-rose-100' 
                : 'text-slate-600 hover:bg-slate-50 border-transparent'
            }`}
          >
            <div className={`p-1.5 rounded-md ${activeTab === 'emergency' ? 'bg-rose-100/50' : 'bg-slate-50'}`}>
              <Siren size={14} className={activeTab === 'emergency' ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-600'} />
            </div>
            <span className="text-[12px] font-bold flex-1 text-left">112 Pagalba</span>
          </button>

          {/* Letter Templates - Moved down above Registrai */}
          <button
            onClick={() => handleNavClick('templates')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all group ${
              activeTab === 'templates' 
                ? 'bg-emerald-700 text-white shadow-md' 
                : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <div className={`p-1.5 rounded-md transition-colors ${activeTab === 'templates' ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-emerald-100'}`}>
              <FileText size={14} className={activeTab === 'templates' ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'} />
            </div>
            <span className="text-[12px] font-bold flex-1 text-left">Laiškų šablonai</span>
          </button>

          <button
            onClick={() => window.open('https://antakalnio.lt/paslaugos/registrai', '_blank')}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-all group"
          >
            <div className="p-1.5 bg-slate-50 rounded-md">
              <Database size={14} className="text-slate-400 group-hover:text-slate-900" />
            </div>
            <span className="text-[12px] font-bold flex-1 text-left">Registrai</span>
          </button>
        </div>
      </nav>
      
      {/* Footer - Minimal */}
      <div className="p-5 border-t border-slate-100 bg-slate-50/20">
        <div className="text-center">
          <a href="https://antakalnio.lt" target="_blank" className="text-[9px] text-emerald-800 font-black uppercase tracking-tight hover:underline">
            antakalnio.lt
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;