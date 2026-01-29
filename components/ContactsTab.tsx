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
  Unlock,
  AlertTriangle,
  MessageSquareText
} from 'lucide-react';

const CATEGORY_META: Record<SpecialistCategory, { bg: string, color: string, icon: React.ReactNode, light: string }> = {
  [SpecialistCategory.ADMINISTRACIJA]: { 
    bg: 'bg-green-700', color: 'text-green-700', light: 'bg-green-50',
    icon: <Shield size={20} />
  },
  [SpecialistCategory.SOCIALINIAI]: { 
    bg: 'bg-blue-600', color: 'text-blue-600', light: 'bg-blue-50',
    icon: <Users size={20} />
  },
  [SpecialistCategory.SVEIKATA]: { 
    bg: 'bg-rose-500', color: 'text-rose-500', light: 'bg-rose-50',
    icon: <Heart size={20} />
  },
  [SpecialistCategory.PSICHOLOGAI]: { 
    bg: 'bg-purple-500', color: 'text-purple-500', light: 'bg-purple-50',
    icon: <Brain size={20} />
  },
  [SpecialistCategory.LOGOPEDAI]: { 
    bg: 'bg-amber-500', color: 'text-amber-500', light: 'bg-amber-50',
    icon: <MessageCircle size={20} />
  },
  [SpecialistCategory.SPECIALIEJI]: { 
    bg: 'bg-slate-600', color: 'text-slate-600', light: 'bg-slate-50',
    icon: <GraduationCap size={20} />
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
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

  const initiateDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      setSpecialists(prev => prev.filter(s => s.id !== deleteConfirmId));
      setDeleteConfirmId(null);
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

  const specialistToDelete = specialists.find(s => s.id === deleteConfirmId);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Visual Header - Compact Height */}
      <div className="relative bg-green-700 rounded-[2rem] overflow-hidden p-8 shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-5 text-white pointer-events-none transform translate-x-1/4 -translate-y-1/4">
          <Trees size={300} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase mb-2 leading-none">
              Specialistai
            </h1>
            <p className="text-sm text-green-100/70 font-medium">Vilniaus Antakalnio progimnazijos komanda</p>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                isAdmin ? 'bg-amber-500 text-white shadow-md' : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
              <span>{isAdmin ? 'Admin Įjungtas' : 'Redagavimas'}</span>
            </button>
            
            {isAdmin && (
              <button 
                onClick={handleAdd}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Plus size={16} />
                <span>Pridėti</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Bar - Compact */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 px-1">
            {['Visi', ...Object.values(SpecialistCategory)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat ? 'bg-green-700 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="md:w-64 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Ieškoti..."
            className="w-full pl-10 pr-4 py-2 bg-transparent text-xs font-bold outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Specialist Grid - Compact spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const isEditing = editingId === s.id;
          const meta = CATEGORY_META[s.category];
          
          if (isEditing && editForm) {
            return (
              <div key={s.id} className="bg-white rounded-2xl border-2 border-green-600 overflow-hidden shadow-xl animate-in zoom-in-95 duration-200">
                <div className="p-5 bg-slate-50 border-b border-slate-100">
                  <input 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-base focus:border-green-600 outline-none mb-3"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-xs focus:border-green-600 outline-none bg-white"
                    value={editForm.category}
                    onChange={e => setEditForm({...editForm, category: e.target.value as SpecialistCategory})}
                  >
                    {Object.values(SpecialistCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="p-5 space-y-3">
                  <input className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-xs" value={editForm.classes} onChange={e => setEditForm({...editForm, classes: e.target.value})} placeholder="Atsakomybė" />
                  <input className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-xs" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="Tel." />
                  <input className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-xs" value={editForm.office} onChange={e => setEditForm({...editForm, office: e.target.value})} placeholder="Kab." />
                  <input className="w-full px-4 py-2 rounded-lg border border-slate-200 font-bold text-xs" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email" />
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSave} className="flex-1 bg-green-700 text-white py-2.5 rounded-lg font-black text-[10px] uppercase">Išsaugoti</button>
                    <button onClick={() => setEditingId(null)} className="bg-slate-100 text-slate-500 px-4 rounded-lg"><X size={16} /></button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={s.id} className="group bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all relative">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(s)} className="p-2 bg-white text-blue-600 rounded-lg shadow border border-blue-50 hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={12} /></button>
                  <button onClick={() => initiateDelete(s.id)} className="p-2 bg-white text-rose-600 rounded-lg shadow border border-rose-50 hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={12} /></button>
                </div>
              )}
              
              <div className={`p-5 ${meta.light} border-b border-slate-50 flex items-center space-x-4`}>
                <div className={`${meta.bg} text-white p-3 rounded-xl shadow-md`}>
                  {meta.icon}
                </div>
                <div className="overflow-hidden">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest mb-1 ${meta.light} ${meta.color} border border-current opacity-70`}>
                    {s.category}
                  </span>
                  <h4 className="text-base font-black text-slate-900 truncate leading-tight">{s.name}</h4>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Atsakomybė / Klasės</p>
                  <p className="text-xs font-black text-slate-800 leading-tight">{s.classes}</p>
                </div>

                <div className="space-y-2">
                  <a href={`tel:${s.phone}`} className="flex items-center p-3 rounded-xl bg-white border border-slate-100 hover:bg-green-50 transition-all text-xs font-bold text-slate-700">
                    <Phone size={14} className="text-slate-400 mr-3" />
                    <span>{s.phone}</span>
                    <ArrowRight size={10} className="ml-auto opacity-0 group-hover:opacity-100" />
                  </a>
                  
                  {s.email && (
                    <a href={`https://chat.google.com/u/0/dm/${s.email}`} target="_blank" className="flex items-center p-3 rounded-xl bg-white border border-slate-100 hover:bg-emerald-50 transition-all text-xs font-bold text-slate-700">
                      <MessageSquareText size={14} className="text-slate-400 mr-3" />
                      <span>Google Chat</span>
                      <ArrowRight size={10} className="ml-auto opacity-0 group-hover:opacity-100" />
                    </a>
                  )}

                  <a href={`mailto:${s.email}`} className="flex items-center p-3 rounded-xl bg-white border border-slate-100 hover:bg-blue-50 transition-all text-xs font-bold text-slate-700 truncate">
                    <Mail size={14} className="text-slate-400 mr-3" />
                    <span className="truncate">{s.email}</span>
                  </a>

                  <div className="flex items-center p-3 rounded-xl bg-slate-50 text-xs font-bold text-slate-700">
                    <MapPin size={14} className="text-slate-400 mr-3" />
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