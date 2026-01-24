
import React, { useState, useMemo } from 'react';
import { Specialist, SpecialistCategory } from '../types';
import { INITIAL_SPECIALISTS } from '../constants';
import { 
  Phone, 
  Mail, 
  Plus, 
  MapPin, 
  Search, 
  MessageSquareText, 
  Navigation,
  Shield,
  Heart,
  Users,
  Brain,
  MessageCircle,
  GraduationCap,
  ExternalLink
} from 'lucide-react';

const CATEGORY_STYLES: Record<SpecialistCategory, { bg: string, badge: string, icon: React.ReactNode, iconBg: string }> = {
  [SpecialistCategory.ADMINISTRACIJA]: { 
    bg: 'bg-[#D9EEFF]', badge: 'bg-blue-100 text-blue-800', iconBg: 'bg-black',
    icon: <Shield size={20} />
  },
  [SpecialistCategory.SOCIALINIAI]: { 
    bg: 'bg-[#C5E1A5]/20', badge: 'bg-green-100 text-green-800', iconBg: 'bg-green-600',
    icon: <Users size={20} />
  },
  [SpecialistCategory.SVEIKATA]: { 
    bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-800', iconBg: 'bg-rose-500',
    icon: <Heart size={20} />
  },
  [SpecialistCategory.PSICHOLOGAI]: { 
    bg: 'bg-purple-50', badge: 'bg-purple-100 text-purple-800', iconBg: 'bg-purple-500',
    icon: <Brain size={20} />
  },
  [SpecialistCategory.LOGOPEDAI]: { 
    bg: 'bg-[#F5E6C4]/30', badge: 'bg-amber-100 text-amber-800', iconBg: 'bg-amber-500',
    icon: <MessageCircle size={20} />
  },
  [SpecialistCategory.SPECIALIEJI]: { 
    bg: 'bg-slate-50', badge: 'bg-slate-200 text-slate-800', iconBg: 'bg-slate-600',
    icon: <GraduationCap size={20} />
  },
};

const ContactsTab: React.FC = () => {
  const [specialists] = useState<Specialist[]>(INITIAL_SPECIALISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SpecialistCategory | 'Visi'>('Visi');

  const handleMapRedirect = (office: string) => {
    const schoolAddress = "Antakalnio g. 33, Vilnius";
    const query = encodeURIComponent(`${schoolAddress}, kabinetas ${office}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const filteredSpecialists = useMemo(() => {
    return specialists.filter(x => {
      const matchesSearch = x.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           x.classes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Visi' || x.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [specialists, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Search & Filters Area */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-black/5 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tighter uppercase leading-none">Mokyklos specialistai</h2>
            <p className="text-slate-500 font-bold mt-2 text-lg">Ugdymo pagalba, konsultacijos ir administraciniai kontaktai.</p>
          </div>
          <button 
            className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={20} className="mr-2" />
            NAUJAS KONTAKTAS
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Ieškoti pagal vardą, klasę ar funkciją..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-black transition-all text-base font-bold text-slate-900"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {['Visi', ...Object.values(SpecialistCategory)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border-2 ${
                  selectedCategory === cat 
                    ? 'bg-black border-black text-white shadow-lg shadow-black/10' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-black/20 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Specialist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredSpecialists.map(s => {
          const style = CATEGORY_STYLES[s.category] || CATEGORY_STYLES[SpecialistCategory.SOCIALINIAI];
          return (
            <div key={s.id} className="bg-white border-2 border-black/5 rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-black/20 transition-all group flex flex-col h-full hover:-translate-y-1">
              {/* Card Header */}
              <div className={`p-8 ${style.bg} border-b border-black/5 flex items-start justify-between relative`}>
                <div className="flex items-center space-x-5">
                  <div className={`${style.iconBg} text-white p-4 rounded-[1.25rem] shadow-xl group-hover:rotate-6 transition-transform`}>
                    {style.icon}
                  </div>
                  <div className="min-w-0">
                    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${style.badge} mb-2 border border-black/5`}>
                      {s.category}
                    </span>
                    <h4 className="text-xl font-black text-black tracking-tight leading-tight truncate">{s.name}</h4>
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-8 flex-1 flex flex-col space-y-6">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-black/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pareigos / Klasės</p>
                  <p className="text-[15px] font-black text-slate-900 leading-snug">{s.classes}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <a href={`tel:${s.phone}`} className="flex items-center text-sm font-bold text-slate-600 hover:text-black transition-colors group/item">
                      <div className="bg-slate-100 p-2.5 rounded-xl mr-3 group-hover/item:bg-white border border-transparent group-hover/item:border-black/5 transition-all"><Phone size={16} /></div>
                      <span className="font-black">{s.phone}</span>
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <a href={`mailto:${s.email}`} className="flex items-center text-sm font-bold text-slate-600 hover:text-black transition-colors group/item truncate mr-2">
                      <div className="bg-slate-100 p-2.5 rounded-xl mr-3 group-hover/item:bg-white border border-transparent group-hover/item:border-black/5 transition-all"><Mail size={16} /></div>
                      <span className="font-black truncate">{s.email}</span>
                    </a>
                  </div>

                  <div className="flex items-center text-sm font-bold text-slate-600 group/item">
                    <div className="bg-slate-100 p-2.5 rounded-xl mr-3 group-hover/item:bg-white border border-transparent group-hover/item:border-black/5 transition-all"><MapPin size={16} /></div>
                    <span className="font-black">{s.office} kabinetas</span>
                  </div>
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-8 pt-0 mt-auto">
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href={s.email ? `https://chat.google.com/u/0/dm/${s.email}` : 'https://chat.google.com'} 
                    target="_blank" 
                    className="flex items-center justify-center space-x-2 py-4 bg-[#D9EEFF] text-black border-2 border-black/5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-[#c6e4ff] transition-all shadow-sm"
                  >
                    <MessageSquareText size={18} />
                    <span>GOOGLE CHAT</span>
                  </a>
                  <button 
                    onClick={() => handleMapRedirect(s.office)}
                    className="flex items-center justify-center space-x-2 py-4 bg-slate-100 text-slate-700 border-2 border-black/5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                  >
                    <Navigation size={18} />
                    <span>MARŠRUTAS</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSpecialists.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <Search size={40} />
          </div>
          <h3 className="text-xl font-black text-slate-900">Nėra rezultatų</h3>
          <p className="text-slate-500 font-bold mt-1">Pabandykite ieškoti kitaip arba pakeisti filtrą.</p>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;
