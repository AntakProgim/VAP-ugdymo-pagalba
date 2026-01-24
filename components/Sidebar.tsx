import React from 'react';
import { 
  Mail, 
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
  MessageSquare
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Apžvalga', icon: <LayoutGrid size={18} /> },
    { id: 'intro', label: 'Nuostatos', icon: <BookOpen size={18} /> },
    { id: 'scenarios', label: 'Situacijos', icon: <AlertTriangle size={18} /> },
    { id: 'schemes', label: 'Schemos', icon: <ShieldAlert size={18} /> },
    { id: 'contacts', label: 'Specialistai', icon: <Phone size={18} /> },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
  };

  const handleExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden lg:flex flex-col z-40 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-green-700 text-white rounded-xl flex items-center justify-center shadow-md transform rotate-2 hover:rotate-0 transition-transform duration-300">
            <Trees size={18} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight leading-none">VAP</h1>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-0.5">PORTALAS</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-thin">
        <p className="px-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2">Navigacija</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group ${
              activeTab === item.id 
                ? 'bg-green-700 text-white shadow-lg shadow-green-100' 
                : 'text-slate-500 hover:text-green-700 hover:bg-green-50'
            }`}
          >
            <span className={`transition-colors ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-green-600'}`}>
              {item.icon}
            </span>
            <span className={`text-[13px] font-bold flex-1 text-left ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
          </button>
        ))}

        <div className="pt-4 space-y-1">
          <p className="px-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-2">Komunikacija</p>
          <button
            onClick={() => handleExternalLink('https://chat.google.com/')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-green-700 hover:bg-green-50 transition-all group"
          >
            <MessageSquare size={18} className="text-slate-400 group-hover:text-green-600" />
            <span className="text-[13px] font-bold flex-1 text-left">Google Chat</span>
            <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
          </button>
          <button
            onClick={() => handleExternalLink('https://docs.google.com/document/d/171tuL9pKuBYC376oxjoqmdM9NSqfAsinSpHJoyk2m8Y/edit?usp=sharing')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-green-700 hover:bg-green-50 transition-all group"
          >
            <Mail size={18} className="text-slate-400 group-hover:text-green-600" />
            <span className="text-[13px] font-bold flex-1 text-left">Laiškų šablonai</span>
            <ExternalLink size={12} className="opacity-30 group-hover:opacity-100" />
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 px-1 space-y-1 pb-6">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-3 ml-2">Pagalba ir Resursai</p>
          
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group ${
              activeTab === 'ai-assistant' 
                ? 'bg-[#F5E6C4] text-amber-900 border border-amber-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={16} className={activeTab === 'ai-assistant' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'} />
            <span>DI Pagalvėlė</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group ${
              activeTab === 'emergency' 
                ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Siren size={16} className={activeTab === 'emergency' ? 'text-rose-600' : 'text-slate-400 group-hover:text-rose-600'} />
            <span>112 Pagalba</span>
          </button>

          <button
            onClick={() => window.open('https://antakalnio.lt/paslaugos/registrai', '_blank')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all text-slate-600 hover:bg-slate-50 group"
          >
            <Database size={16} className="text-slate-400 group-hover:text-slate-900" />
            <span className="flex-1 text-left">Registrai</span>
            <ExternalLink size={12} className="text-slate-300 opacity-40 group-hover:opacity-100" />
          </button>
        </div>
      </nav>
      
      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] text-center mb-0.5">
          © {new Date().getFullYear()}
        </p>
        <p className="text-[9px] text-center">
          <a href="https://antakalnio.lt" target="_blank" className="text-slate-900 font-extrabold hover:underline">antakalnio.lt</a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;