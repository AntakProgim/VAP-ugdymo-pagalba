
import React from 'react';
import { 
  MessageCircle, 
  Zap, 
  AlertCircle,
  Users,
  Clock,
  ArrowRight,
  ChevronRight,
  Phone,
  MessageSquareText,
  ExternalLink
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onSelectScenario: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSelectScenario }) => {
  const stats = [
    { 
      id: 'templates', 
      label: 'Laiškų šablonai', 
      value: '29', 
      icon: <MessageCircle size={20} className="text-black" />, 
      bg: 'bg-[#D9EEFF]',
      isExternal: true,
      url: 'https://docs.google.com/document/d/171tuL9pKuBYC376oxjoqmdM9NSqfAsinSpHJoyk2m8Y/edit'
    },
    { id: 'contacts', label: 'Specialistai', value: '20', icon: <Users size={20} className="text-black" />, bg: 'bg-[#F5E6C4]' },
    { id: 'contacts', label: 'Budintys vadovai', value: '5', icon: <Zap size={20} className="text-black" />, bg: 'bg-[#C5E1A5]' },
  ];

  const dutySchedule = [
    { day: 'Pr', name: 'Agnė Motiejūnė', phone: '+37063617239', office: '48', email: 'agne.motiejune@antakalnio.lt' },
    { day: 'An', name: 'Jurgita Paravinskienė', phone: '+37065900715', office: '62', email: 'jurgita.paravinskiene@antakalnio.lt' },
    { day: 'Tr', name: 'Čianita Linkutė-Vuicik', phone: '+37067266304', office: '4', email: 'cianita.vuicik@antakalnio.lt' },
    { day: 'Ke', name: 'Tomas Jankūnas', phone: '+37065900712', office: '43', email: 'direktorius@antakalnio.lt' },
    { day: 'Pe', name: 'Rotacija (A/J/T/Č)', phone: '+37065900612', office: '43', email: 'rastine@antakalnio.lt' },
  ];

  const criticalCases = [
    { id: 'suicidinis', title: 'Suicidinis elgesys', desc: 'SOS algoritmas. nepaliekame mokinio vieno, kviečiame specialistus.', color: 'red' },
    { id: 'ginčas', title: 'Fizinis ginčas', desc: 'Nedelsiant įsikišti. atskirti dalyvius, informuoti budintį vadovą.', color: 'blue' },
    { id: 'draudziami', title: 'Draudžiamų daiktų turėjimas', desc: 'Įtarus vartojimą. patikra vykdoma tik komisijos būdu.', color: 'slate' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* Hero Section - Švarus, sucentruotas dizainas be kortelės */}
      <div className="relative bg-[#D9EEFF] rounded-[2.5rem] overflow-hidden shadow-sm border-2 border-black/5">
        <div className="relative z-10 p-10 md:p-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white border border-black rounded-md mb-6">
            <div className="w-2 h-2 rounded-full bg-black animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black">
              Mokyklos portalas
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tighter leading-tight">
            VILNIAUS ANTAKALNIO <br/> PROGIMNAZIJA
          </h1>
          <p className="text-slate-700 text-lg font-bold leading-relaxed mb-10 max-w-2xl mx-auto">
            Saugumo, komunikacijos ir ugdymo pagalbos sistema progimnazijos bendruomenei.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => setActiveTab('scenarios')}
              className="bg-black text-white px-7 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all text-sm flex items-center shadow-lg"
            >
              SITUACIJŲ VALDYMAS
              <ChevronRight size={18} className="ml-2" />
            </button>
            <button 
              onClick={() => setActiveTab('schemes')}
              className="bg-white text-black border-2 border-black px-7 py-4 rounded-2xl font-black hover:bg-slate-50 transition-all text-sm flex items-center"
            >
              PROCESŲ SCHEMOS
            </button>
            <a 
              href="https://chat.google.com"
              target="_blank"
              className="bg-[#C5E1A5] text-green-950 border-2 border-black/10 px-7 py-4 rounded-2xl font-black hover:bg-[#b8d696] transition-all text-sm flex items-center"
            >
              GOOGLE CHAT
              <ExternalLink size={16} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => {
              if (stat.isExternal) {
                window.open(stat.url, '_blank');
              } else {
                setActiveTab(stat.id);
              }
            }}
            className="bg-white p-8 rounded-[2rem] border-2 border-black/5 shadow-sm flex items-center space-x-6 hover:shadow-xl hover:border-black/20 hover:-translate-y-1 transition-all text-left group"
          >
            <div className={`p-5 ${stat.bg} border border-black/10 rounded-2xl group-hover:rotate-6 transition-transform`}>{stat.icon}</div>
            <div>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-black leading-none">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-black flex items-center uppercase tracking-tight">
              <AlertCircle className="text-red-600 mr-3" size={24} />
              Kritiniai atvejai
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {criticalCases.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectScenario(item.id)}
                className="group bg-white p-6 rounded-2xl border-2 border-black/5 shadow-sm hover:border-black/40 hover:shadow-xl transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-black text-black text-lg mb-1">{item.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-black group-hover:text-white text-slate-400 transition-all">
                  <ArrowRight size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-black flex items-center uppercase tracking-tight">
              <Clock size={24} className="text-blue-600 mr-3" />
              Budintys
            </h2>
          </div>
          <div className="bg-slate-50/50 border-2 border-black/5 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-black/5 bg-white/80">
              <p className="text-[11px] font-black text-black uppercase tracking-widest">SAVAITĖS GRAFIKAS</p>
            </div>
            <div className="p-4 space-y-4">
              {dutySchedule.map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-3xl border border-black/5 shadow-sm space-y-4 hover:border-black/10 transition-colors group/card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center text-[11px] font-black group-hover/card:scale-110 transition-transform">{item.day}</div>
                      <div>
                        <p className="text-[13px] font-black text-black leading-none mb-1">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.office} kabinetas</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a 
                      href={`tel:${item.phone}`} 
                      className="flex flex-col items-center justify-center space-y-1 py-3 bg-[#C5E1A5]/40 text-green-900 rounded-2xl hover:bg-[#C5E1A5] transition-all border border-green-200/50"
                    >
                      <Phone size={14} className="mb-0.5" />
                      <span className="text-[9px] font-black uppercase tracking-wider">Skambinti</span>
                    </a>
                    <a 
                      href={`https://chat.google.com/u/0/dm/${item.email}`}
                      target="_blank"
                      className="flex flex-col items-center justify-center space-y-1 py-3 bg-[#D9EEFF]/40 text-blue-900 rounded-2xl hover:bg-[#D9EEFF] transition-all border border-blue-200/50"
                    >
                      <MessageSquareText size={14} className="mb-0.5" />
                      <span className="text-[9px] font-black uppercase tracking-wider">G-Chat</span>
                    </a>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-300">{item.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
