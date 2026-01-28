import React, { useState, useMemo, useEffect } from 'react';
import { Specialist, SpecialistCategory } from '../types';
import { INITIAL_SPECIALISTS } from '../constants';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Shield,
  Heart,
  Users,
  Brain,
  MessageCircle,
  GraduationCap,
  Trees,
  Search,
  ArrowRight,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Lock,
  Unlock
} from 'lucide-react';

const CATEGORY_META: Record<SpecialistCategory, { bg: string, color: string, icon: React.ReactNode, light: string }> = {
  [SpecialistCategory.ADMINISTRACIJA]: { 
    bg: 'bg-green-700', color: 'text-green-700', light: 'bg-green-50',
    icon: <Shield size={24} />
  },
  [SpecialistCategory.SOCIALINIAI]: { 
    bg: 'bg-blue-600', color: 'text-blue-600', light: 'bg-blue-50',
    icon: <Users size={24} />
  },
  [SpecialistCategory.SVEIKATA]: { 
    bg: 'bg-rose-500', color: 'text-rose-500', light: 'bg-rose-50',
    icon: <Heart size={24} />
  },
  [SpecialistCategory.PSICHOLOGAI]: { 
    bg: 'bg-purple-500', color: 'text-purple-500', light: 'bg-purple-50',
    icon: <Brain size={24} />
  },
  [SpecialistCategory.LOGOPEDAI]: { 
    bg: 'bg-amber-500', color: 'text-amber-500', light: 'bg-amber-50',
    icon: <MessageCircle size={24} />
  },
  [SpecialistCategory.SPECIALIEJI]: { 
    bg: 'bg-slate-600', color: 'text-slate-600', light: 'bg-slate-50',
    icon: <GraduationCap size={24} />
  },
};

const STORAGE_KEY = 'vap_specialists_v1';

const ContactsTab: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_SPECIALISTS;
  });
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Specialist | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<SpecialistCategory | 'Visi'>('Visi');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(specialists));
  }, [specialists]);

  const filtered = useMemo(() => {
    return specialists.filter(s => {
      const matchCat = selectedCategory === 'Visi' || s.category === selectedCategory;
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.classes.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [specialists, selectedCategory, searchQuery]);

  const handleEdit = (s: Specialist) => {
    setEditingId(s.id);
    setEditForm({ ...s });
  };

  const handleSave = () => {
    if (editForm) {
      setSpecialists(prev => prev.map(s => s.id === editForm.id ? editForm : s));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Ar tikrai norite pašalinti šį specialistą?")) {
      setSpecialists(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAdd = () => {
    const newId = `new-${Date.now()}`;
    const newSpecialist: Specialist = {
      id: newId,
      name: 'Naujas Specialistas',
      category: SpecialistCategory.SOCIALINIAI,
      classes: 'Pildoma',
      phone: '+370',
      office: '0',
      email: 'pavyzdys@antakalnio.lt'
    };
    setSpecialists(prev => [newSpecialist, ...prev]);
    handleEdit(newSpecialist);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Visual Header */}
      <div className="relative bg-green-700 rounded-[3rem] overflow-hidden p-8 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-white pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Trees size={400} />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full mb-8">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-50">Kontaktai ir Pagalba</span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase mb-4 leading-none whitespace-nowrap">
                Mokyklos Specialistai
              </h1>
              <p className="text-lg text-green-100/80 font-medium">Vilniaus Antakalnio progimnazijos komanda, pasiruošusi padėti kiekvienam.</p>
            </div>
            
            <div className="flex flex-col items-end space-y-4">
              <button 
                onClick={() => setIsAdmin(!isAdmin)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isAdmin ? 'bg-amber-500 text-white shadow-xl' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
                <span>{isAdmin ? 'Admin Režimas Įjungtas' : 'Įjungti Redagavimą'}</span>
              </button>
              
              {isAdmin && (
                <button 
                  onClick={handleAdd}
                  className="flex items-center space-x-3 px-8 py-4 bg-white text-green-700 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all"
                >
                  <Plus size={18} />
                  <span>Pridėti Specialistą</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm flex items-center">
          <div className="flex overflow-x-auto no-scrollbar gap-2 px-2">
            {['Visi', ...Object.values(SpecialistCategory)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat ? 'bg-green-700 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-72 bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm relative group">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-700 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Ieškoti pavardės..."
            className="w-full pl-12 pr-6 py-3 bg-transparent text-sm font-bold outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Specialist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => {
          const isEditing = editingId === s.id;
          const meta = CATEGORY_META[s.category];
          
          if (isEditing && editForm) {
            return (
              <div key={s.id} className="bg-white rounded-[2.5rem] border-2 border-green-600 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Redaguoti duomenis</p>
                  <div className="space-y-4">
                    <input 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-lg focus:border-green-600 outline-none"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Vardas Pavardė"
                    />
                    <select 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm focus:border-green-600 outline-none bg-white"
                      value={editForm.category}
                      onChange={e => setEditForm({...editForm, category: e.target.value as SpecialistCategory})}
                    >
                      {Object.values(SpecialistCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Atsakomybė / Klasės</label>
                    <input 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-green-600"
                      value={editForm.classes}
                      onChange={e => setEditForm({...editForm, classes: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Telefonas</label>
                      <input 
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-green-600"
                        value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kabinetas</label>
                      <input 
                        className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-green-600"
                        value={editForm.office}
                        onChange={e => setEditForm({...editForm, office: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">El. paštas</label>
                    <input 
                      className="w-full px-5 py-3 rounded-xl border border-slate-200 font-bold text-sm outline-none focus:border-green-600"
                      value={editForm.email}
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <button onClick={handleSave} className="flex-1 bg-green-700 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center space-x-2">
                      <Save size={16} />
                      <span>Išsaugoti</span>
                    </button>
                    <button onClick={() => { setEditingId(null); setEditForm(null); }} className="bg-slate-100 text-slate-500 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={s.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-green-200 transition-all duration-500 hover:-translate-y-2 relative">
              {isAdmin && (
                <div className="absolute top-6 right-6 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(s)}
                    className="p-3 bg-white text-blue-600 rounded-xl shadow-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="p-3 bg-white text-rose-600 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              
              <div className={`p-8 ${meta.light} border-b border-slate-50 flex items-start justify-between relative`}>
                <div className="flex items-center space-x-5">
                  <div className={`${meta.bg} text-white p-4 rounded-2xl shadow-xl transform group-hover:rotate-6 transition-transform duration-500`}>
                    {meta.icon}
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest mb-2 ${meta.light} ${meta.color} border border-current opacity-70`}>
                      {s.category}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight leading-none">{s.name}</h4>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Atsakomybė / Klasės</p>
                  <p className="text-sm font-black text-slate-800 leading-tight">{s.classes}</p>
                </div>

                <div className="space-y-3">
                  <a href={`tel:${s.phone}`} className="flex items-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-green-600 hover:bg-green-50 transition-all group/link">
                    <Phone size={18} className="text-slate-400 group-hover/link:text-green-600 mr-4" />
                    <span className="text-sm font-bold text-slate-700">{s.phone}</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover/link:opacity-100 transform translate-x-2 group-hover/link:translate-x-0 transition-all" />
                  </a>
                  <a href={`mailto:${s.email}`} className="flex items-center p-4 rounded-2xl bg-white border border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all group/link">
                    <Mail size={18} className="text-slate-400 group-hover/link:text-blue-600 mr-4" />
                    <span className="text-sm font-bold text-slate-700 truncate">{s.email}</span>
                  </a>
                  <div className="flex items-center p-4 rounded-2xl bg-slate-50 border border-transparent">
                    <MapPin size={18} className="text-slate-400 mr-4" />
                    <span className="text-sm font-bold text-slate-700">{s.office} kabinetas</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <Users size={80} className="mx-auto text-slate-100 mb-6" />
          <h3 className="text-2xl font-black text-slate-900 uppercase">Specialistų nerasta</h3>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pabandykite pakeisti paieškos frazę</p>
        </div>
      )}
    </div>
  );
};

export default ContactsTab;