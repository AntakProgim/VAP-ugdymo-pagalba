
import React, { useState, useMemo } from 'react';
import { Specialist, SpecialistCategory } from '../types';
import { INITIAL_SPECIALISTS } from '../constants';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquareText, 
  Shield,
  Heart,
  Users,
  Brain,
  MessageCircle,
  GraduationCap,
  Trees,
  ExternalLink
} from 'lucide-react';

const CATEGORY_STYLES: Record<SpecialistCategory, { bg: string, badge: string, icon: React.ReactNode, iconBg: string, text: string }> = {
  [SpecialistCategory.ADMINISTRACIJA]: { 
    bg: 'bg-green-50', badge: 'bg-green-100 text-green-800', iconBg: 'bg-green-700', text: 'text-green-900',
    icon: <Shield size={18} />
  },
  [SpecialistCategory.SOCIALINIAI]: { 
    bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-800', iconBg: 'bg-blue-600', text: 'text-blue-900',
    icon: <Users size={18} />
  },
  [SpecialistCategory.SVEIKATA]: { 
    bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-800', iconBg: 'bg-rose-500', text: 'text-rose-900',
    icon: <Heart size={18} />
  },
  [SpecialistCategory.PSICHOLOGAI]: { 
    bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', iconBg: 'bg-purple-500', text: 'text-purple-900',
    icon: <Brain size={18} />
  },
  [SpecialistCategory.LOGOPEDAI]: { 
    bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-800', iconBg: 'bg-amber-500', text: 'text-amber-900',
    icon: <MessageCircle size={18} />
  },
  [SpecialistCategory.SPECIALIEJI]: { 
    bg: 'bg-slate-50', badge: 'bg-slate-200 text-slate-800', iconBg: 'bg-slate-600', text: 'text-slate-900',
    icon: <GraduationCap size={18} />
  },
};

const ContactsTab: React.FC = () => {
  const [specialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [selectedCategory, setSelectedCategory] = useState<SpecialistCategory | 'Visi'>('Visi');

  const filteredSpecialists = useMemo(() => {
    return specialists.filter(x => {
      return selectedCategory === 'Visi' || x.category === selectedCategory;
    });
  }, [specialists, selectedCategory]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative bg-green-700 rounded-[2rem] overflow-hidden border border-green-800 shadow-xl shadow-green-900/10">
        <div className="absolute top-0 right-0 p-4 opacity-[0.07] text-white pointer-events-none translate-x-12 -translate-y-12 rotate-12">
          <div className="bg-white/20 p-20 rounded-[5rem]">
            <Trees size={340} />
          </div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-600/50 backdrop-blur-md border border-white/10 rounded-full mb-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-100">
              Bendruomenės Pagalba
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white mb-2 tracking-tighter leading-tight uppercase">
            MOKYKLOS SPECIALISTAI
          </h1>
          <p className="text-lg md:text-xl font-bold text-green-200 uppercase tracking-tight opacity-90">
            Vilniaus Antakalnio progimnazija
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col space-y-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Filtruoti pagal sritį</p>
        <div className="flex flex-wrap gap-1.5 items-center">
          {['Visi', ...Object.values(SpecialistCategory)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as any)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                selectedCategory === cat 
                  ? 'bg-green-700 border-green-700 text-white shadow-md' 
                  : 'bg-white border-slate-100 text-slate-500 hover:border-green-700/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSpecialists.map(s => {
          const style = CATEGORY_STYLES[s.category] || CATEGORY_STYLES[SpecialistCategory.SOCIALINIAI];
          return (
            <div key={s.id} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:border-green-200 hover:shadow-md transition-all flex flex-col h-full hover:-translate-y-1 group">
              <div className={`p-6 ${style.bg} border-b border-slate-100 flex items-start justify-between relative`}>
                <div className="flex items-center space-x-4">
                  <div className={`${style.iconBg} text-white p-3 rounded-xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {style.icon}
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${style.badge} mb-1 border border-black/5`}>
                      {s.category}
                    </span>
                    <h4 className="text-base font-black text-slate-900 tracking-tight leading-tight">{s.name}</h4>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-5">
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Paskirtis / Klasės</p>
                  <p className="text-xs font-black text-slate-800 leading-tight">{s.classes}</p>
                </div>

                <div className="space-y-3">
                  <a href={`tel:${s.phone}`} className="flex items-center text-[13px] font-bold text-slate-600 hover:text-green-700 transition-colors group/link">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover/link:bg-green-50 transition-colors">
                      <Phone size={14} className="text-slate-400 group-hover/link:text-green-600" />
                    </div>
                    <span>{s.phone}</span>
                  </a>
                  <a href={`mailto:${s.email}`} className="flex items-center text-[13px] font-bold text-slate-600 hover:text-green-700 transition-colors group/link truncate">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3 group-hover/link:bg-green-50 transition-colors flex-shrink-0">
                      <Mail size={14} className="text-slate-400 group-hover/link:text-green-600" />
                    </div>
                    <span className="truncate">{s.email}</span>
                  </a>
                  <div className="flex items-center text-[13px] font-bold text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
                      <MapPin size={14} className="text-slate-400" />
                    </div>
                    <span>{s.office} kabinetas</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactsTab;
