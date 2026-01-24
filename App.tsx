
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchemesTab from './components/SchemesTab';
import ContactsTab from './components/ContactsTab';
import ScenariosTab from './components/ScenariosTab';
import IntroTab from './components/IntroTab';
import EmergencyTab from './components/EmergencyTab';
import AIAssistant from './components/AIAssistant';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'scenarios') {
      setSelectedScenarioId(null);
    }
  };

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setActiveTab('scenarios');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={handleTabChange} onSelectScenario={handleSelectScenario} />;
      case 'emergency': return <EmergencyTab />;
      case 'intro': return <IntroTab setActiveTab={handleTabChange} />;
      case 'schemes': return <SchemesTab />;
      case 'contacts': return <ContactsTab />;
      case 'scenarios': return <ScenariosTab setActiveTab={handleTabChange} initialScenarioId={selectedScenarioId} />;
      case 'ai-assistant': return <AIAssistant />;
      default: return <Dashboard setActiveTab={handleTabChange} onSelectScenario={handleSelectScenario} />;
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Apžvalga';
      case 'emergency': return 'SKUBI PAGALBA 112';
      case 'intro': return 'Metodika';
      case 'schemes': return 'Procesai';
      case 'contacts': return 'Specialistai';
      case 'scenarios': return 'Situacijos';
      case 'ai-assistant': return 'DI emocinė pagalvėlė ✨';
      default: return 'VAP Pagalba';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center bg-[#D9EEFF] text-black">
          <h1 className="text-lg font-black tracking-tight uppercase">VAP PAGALBA</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-black/5 rounded-md"><X size={20} /></button>
        </div>
        <nav className="p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Apžvalga' },
            { id: 'intro', label: 'Nuostatos' },
            { id: 'scenarios', label: 'Situacijos' },
            { id: 'schemes', label: 'Schemos' },
            { id: 'contacts', label: 'Specialistai' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { handleTabChange(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                activeTab === item.id 
                  ? 'bg-[#D9EEFF] text-black font-black' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-slate-100">
             <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Pagalba sau</p>
             <button
              onClick={() => { handleTabChange('ai-assistant'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                activeTab === 'ai-assistant' ? 'bg-[#F5E6C4] text-black font-black' : 'text-slate-600'
              }`}
            >
              <span className="text-sm">DI emocinė pagalvėlė ✨</span>
            </button>
            <button
              onClick={() => { handleTabChange('emergency'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-colors flex items-center justify-between ${
                activeTab === 'emergency' ? 'bg-red-50 text-red-700 font-black' : 'text-slate-600'
              }`}
            >
              <span className="text-sm">112 Pagalba</span>
            </button>
          </div>
        </nav>
      </div>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 sticky top-0 z-30 px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} className="text-slate-600" />
            </button>
            <div>
              <h2 className={`text-base font-black tracking-tight uppercase ${activeTab === 'emergency' ? 'text-red-600' : 'text-slate-900'}`}>{getTitle()}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Vilniaus Antakalnio progimnazija</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-[#D9EEFF] border border-black rounded-lg flex items-center justify-center font-black text-xs">VAP</div>
        </header>

        <div className="p-6 md:p-10 flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
