
import React from 'react';
import { 
  Home, 
  Mail, 
  ShieldAlert, 
  Phone, 
  AlertTriangle,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Siren,
  MessageSquareText,
  Trees,
  Database
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Apžvalga', icon: <Home size={18} /> },
    { id: 'intro', label: 'Nuostatos', icon: <BookOpen size={18} /> },
    { id: 'scenarios', label: 'Situacijos', icon: <AlertTriangle size={18} /> },
    { id: 'schemes', label: 'Schemos', icon: <ShieldAlert size={18} /> },
    { id: 'contacts', label: 'Specialistai', icon: <Phone size={18} /> },
    { 
      id: 'templates-link', 
      label: 'Laiškų šablonai', 
      icon: <Mail size={18} />, 
      isExternal: true, 
      url: 'https://docs.google.com/document/d/171tuL9pKuBYC376oxjoqmdM9NSqfAsinSpHJoyk2m8Y/edit' 
    },
    { 
      id: 'google-chat-link', 
      label: 'Google Chat', 
      icon: <MessageSquareText size={18} />, 
      isExternal: true, 
      url: 'https://chat.google.com/' 
    },
  ];

  const handleNavClick = (item: any) => {
    if (item.isExternal) {
      window.open(item.url, '_blank');
    } else {
      setActiveTab(item.id);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 hidden md:flex flex-col z-40">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-1">
          <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center shadow-lg">
            <Trees size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Antakalnio</h1>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em]">Progimnazija</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-5 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
              activeTab === item.id 
                ? 'bg-[#D9EEFF] text-black border border-black/10 shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span className={`transition-colors ${activeTab === item.id ? 'text-black' : 'text-slate-400 group-hover:text-slate-600'}`}>
              {item.icon}
            </span>
            <span className={`text-[13px] font-bold flex-1 text-left ${activeTab === item.id ? 'opacity-100' : 'opacity-80'}`}>
              {item.label}
            </span>
            {item.isExternal && (
              <ExternalLink size={14} className="text-slate-300 group-hover:text-black transition-colors" />
            )}
          </button>
        ))}
        
        <div className="mt-10 pt-10 border-t border-slate-100 px-2 space-y-1 pb-8">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em] mb-4 ml-3">Pagalba sau</p>
          
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              activeTab === 'ai-assistant' 
                ? 'bg-[#F5E6C4] text-black border border-black/10' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sparkles size={14} className={activeTab === 'ai-assistant' ? 'text-amber-600' : 'text-slate-400 group-hover:text-amber-500'} />
            <span>DI emocinė pagalvėlė</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
              activeTab === 'emergency' 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Siren size={14} className={activeTab === 'emergency' ? 'text-red-600' : 'text-slate-400 group-hover:text-red-600'} />
            <span>112 Pagalba</span>
          </button>

          <button
            onClick={() => window.open('https://antakalnio.lt/paslaugos/registrai', '_blank')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-slate-600 hover:bg-slate-50 group"
          >
            <Database size={14} className="text-slate-400 group-hover:text-black" />
            <span className="flex-1 text-left">Registrai</span>
            <ExternalLink size={12} className="text-slate-300 group-hover:text-black" />
          </button>
        </div>
      </nav>
      
      <div className="p-8 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] text-center">
          © {new Date().getFullYear()} <a href="https://antakalnio.lt" target="_blank" className="hover:text-slate-900 transition-colors">https://antakalnio.lt</a>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
