import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchemesTab from './components/SchemesTab';
import ContactsTab from './components/ContactsTab';
import ScenariosTab from './components/ScenariosTab';
import IntroTab from './components/IntroTab';
import EmergencyTab from './components/EmergencyTab';
import AIAssistant from './components/AIAssistant';
import TemplatesTab from './components/TemplatesTab';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastContextTab, setLastContextTab] = useState('dashboard');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab !== 'ai-assistant') {
      setLastContextTab(tab);
    }
    setActiveTab(tab);
    if (tab !== 'scenarios') {
      setSelectedScenarioId(null);
    }
  };

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    handleTabChange('scenarios');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={handleTabChange} onSelectScenario={handleSelectScenario} />;
      case 'emergency': return <EmergencyTab />;
      case 'intro': return <IntroTab setActiveTab={handleTabChange} />;
      case 'schemes': return <SchemesTab />;
      case 'contacts': return <ContactsTab />;
      case 'templates': return <TemplatesTab />;
      case 'scenarios': return <ScenariosTab setActiveTab={handleTabChange} initialScenarioId={selectedScenarioId} />;
      case 'ai-assistant': return <AIAssistant contextTab={lastContextTab} />;
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
      case 'templates': return 'Laiškų šablonai';
      case 'scenarios': return 'Situacijos';
      case 'ai-assistant': return 'DI emocinė pagalvėlė ✨';
      default: return 'VAP Pagalba';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center bg-green-700 text-white">
          <h1 className="text-base font-black tracking-tight uppercase">VAP PAGALBA</h1>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-black/5 rounded-md"><X size={18} /></button>
        </div>
        <nav className="p-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Apžvalga' },
            { id: 'intro', label: 'Nuostatos' },
            { id: 'scenarios', label: 'Situacijos' },
            { id: 'schemes', label: 'Schemos' },
            { id: 'contacts', label: 'Specialistai' },
            { id: 'templates', label: 'Laiškų šablonai' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { handleTabChange(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                activeTab === item.id 
                  ? 'bg-green-50 text-green-700 font-black' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-14 sticky top-0 z-30 px-6 md:px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-4">
            <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center space-x-3">
              <h2 className={`text-sm font-black tracking-tight uppercase ${activeTab === 'emergency' ? 'text-red-600' : 'text-slate-900'}`}>{getTitle()}</h2>
              <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Vilniaus Antakalnio progimnazija</p>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;