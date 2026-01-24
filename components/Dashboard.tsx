
import React from 'react';
import { 
  MessageCircle, 
  Zap, 
  AlertCircle,
  Users,
  ArrowRight,
  ChevronRight,
  Phone,
  MessageSquareText,
  Trees,
  CalendarDays
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
      icon: <MessageCircle size={20} />, 
      bg: 'bg-green-50 text-green-700',
    },
    { id: 'contacts', label: 'Specialistai', value: '20', icon: <Users size={20} />, bg: 'bg-blue-50 text-blue-700' },
    { id: 'contacts', label: 'Mokyklos vadovai', value: '5', icon: <Zap size={20} />, bg: 'bg-amber-50 text-amber-600' },
  ];

  const dutySchedule = [
    { day: 'Pr', name: 'Agnė Motiejūnė', phone: '+37063617239', office: '48', email: 'agne.motiejune@antakalnio.lt' },
    { day: 'An', name: 'Jurgita Paravinskienė', phone: '+37065900715', office: '62', email: 'jurgita.paravinskiene@antakalnio.lt' },
    { day: 'Tr', name: 'Čianita Linkutė-Vuicik', phone: '+37067266304', office: '4', email: 'cianita.vuicik@antakalnio.lt' },
    { day: 'Ke', name: 'Tomas Jankūnas', phone: '+37065900712', office: '43', email: 'direktorius@antakalnio.lt' },
    { day: 'Pe', name: 'Rotacija', phone: '+37065900612', office: '43', email: 'rastine@antakalnio.lt' },
  ];

  const criticalCases = [
    { id: 'suicidinis', title: 'Suicidinis elgesys', desc: 'SOS algoritmas: specialistai kviečiami nedelsiant.', color: 'rose' },
    { id: 'ginčas', title: 'Fizinis ginčas', desc: 'Nedelsiant atskirti dalyvius, kviesti vadovą.', color: 'indigo' },
    { id: 'draudziami', title: 'Draudžiami daiktai', desc: 'Patikra vykdoma tik komisijos būdu.', color: 'slate' },
  ];

  return (
    <div className="space-y-6 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section - Refined Typography */}
      <div className="relative bg-green-700 rounded-[2rem] overflow-hidden border border-green-800 shadow-xl shadow-green-900/10">
        <div className="absolute top-0 right-0 p-4 opacity-[0.07] text-white pointer-events-none translate-x-12 -translate-y-12 rotate-12">
          <div className="bg-white/20 p-20 rounded-[5rem]">
            <Trees size={340} />
          </div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-600/50 backdrop-blur-md border border-white/10 rounded-full mb-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-100">
              Bendruomenės Pagalbos Portalas
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white mb-2 tracking-tighter leading-tight uppercase">
            PAGALBOS SISTEMA
          </h1>
          <p className="text-[10px] md:text-[11px] font-black text-green-200/60 uppercase tracking-[0.2em] mb-8">
            Vilniaus Antakalnio progimnazija
          </p>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setActiveTab('scenarios')}
              className="bg-white text-green-700 px-8 py-3.5 rounded-xl font-black hover:bg-green-50 transition-all text-xs flex items-center shadow-lg hover:-translate-y-0.5"
            >
              SITUACIJŲ VALDYMAS
              <ChevronRight size={14} className="ml-2" />
            </button>
            <button 
              onClick={() => setActiveTab('schemes')}
              className="bg-green-600/40 text-white border border-white/20 px-8 py-3.5 rounded-xl font-black hover:bg-green-600/60 transition-all text-xs flex items-center shadow-sm"
            >
              PROCESŲ SCHEMOS
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <button 
            key={idx} 
            onClick={() => setActiveTab(stat.id)}
            className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center space-x-5 hover:border-green-200 hover:-translate-y-1 transition-all text-left group"
          >
            <div className={`p-4 ${stat.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest mb-0.5">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center uppercase tracking-tight">
              <AlertCircle className="text-rose-500 mr-2" size={20} />
              Kritiniai atvejai
            </h2>
            <button onClick={() => setActiveTab('scenarios')} className="text-[11px] font-bold text-green-700 hover:underline">Algoritmai →</button>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {criticalCases.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectScenario(item.id)}
                className="group bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm hover:border-green-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-1.5 h-8 rounded-full bg-${item.color}-500/30 flex-shrink-0 group-hover:h-10 transition-all duration-300`}></div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">{item.desc}</p>
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-green-700 group-hover:text-white text-slate-300 transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center uppercase tracking-tight">
              <CalendarDays size={20} className="text-green-600 mr-2" />
              RŪPINIMASIS SAUGUMU
            </h2>
          </div>
          <div className="bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
              <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">MOKYKLOS VADOVAI</p>
            </div>
            <div className="p-3 space-y-1.5">
              {dutySchedule.map((item, idx) => (
                <div key={idx} className="bg-white/5 hover:bg-white/10 p-3 rounded-xl border border-white/5 transition-all group/card">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-green-700 text-white flex items-center justify-center text-[10px] font-black">{item.day}</div>
                      <div>
                        <p className="text-xs font-extrabold text-white">{item.name}</p>
                        <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Kab. {item.office}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1.5">
                      <a href={`tel:${item.phone}`} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all border border-green-500/20">
                        <Phone size={14} />
                      </a>
                      <a href={`https://chat.google.com/u/0/dm/${item.email}`} target="_blank" className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20">
                        <MessageSquareText size={14} />
                      </a>
                    </div>
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
