
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  ChevronRight, 
  FileText, 
  ExternalLink,
  Info,
  Edit3,
  Trees
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '../constants';
import { EmailTemplate, TemplateCategory } from '../types';

const TemplatesTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'Visi'>('Visi');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editableBody, setEditableBody] = useState('');
  const [editableSubject, setEditableSubject] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(INITIAL_TEMPLATES.map(t => t.category)));
    return ['Visi', ...cats];
  }, []);

  const filteredTemplates = useMemo(() => {
    return INITIAL_TEMPLATES.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Visi' || t.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelectTemplate = (t: EmailTemplate) => {
    setSelectedTemplate(t);
    setEditableBody(t.body);
    setEditableSubject(t.subject);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (!selectedTemplate) return;
    const to = selectedTemplate.to || '';
    const cc = selectedTemplate.cc || '';
    const subject = encodeURIComponent(editableSubject);
    const body = encodeURIComponent(editableBody);
    window.location.href = `mailto:${to}?cc=${cc}&subject=${subject}&body=${body}`;
  };

  const editUrl = "https://docs.google.com/document/d/171tuL9pKuBYC376oxjoqmdM9NSqfAsinSpHJoyk2m8Y/edit";

  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Vientisa Hero antraštė */}
      <div className="relative bg-green-700 rounded-[2rem] overflow-hidden border border-green-800 shadow-xl shadow-green-900/10">
        <div className="absolute top-0 right-0 p-4 opacity-[0.07] text-white pointer-events-none translate-x-12 -translate-y-12 rotate-12">
          <div className="bg-white/20 p-20 rounded-[5rem]">
            <Trees size={340} />
          </div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-600/50 backdrop-blur-md border border-white/10 rounded-full mb-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-100">
              Bendruomenės Komunikacija
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white mb-4 tracking-tighter leading-tight uppercase">
            LAIŠKŲ <br/> ŠABLONAI
          </h1>
          <p className="text-green-100 text-sm md:text-base font-medium leading-relaxed opacity-90">
            Profesionalūs susirašinėjimo pavyzdžiai, skirti greitam ir efektyviam bendradarbiavimui su tėvais bei institucijomis.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-320px)] overflow-hidden">
        {/* Sidebar: List of Templates */}
        <div className="lg:col-span-4 flex flex-col space-y-4 min-h-0 h-full">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Ieškoti šablono..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-green-700 transition-all text-sm font-bold"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
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

          <div className="flex-1 overflow-y-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm p-3 scrollbar-thin">
            <div className="space-y-1.5">
              {filteredTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-start space-x-3 group border ${
                    selectedTemplate?.id === t.id 
                      ? 'bg-green-50 border-green-100 shadow-sm' 
                      : 'bg-white border-transparent hover:bg-slate-50'
                  }`}
                >
                  <div className={`p-3 rounded-xl flex-shrink-0 transition-all ${
                    selectedTemplate?.id === t.id ? 'bg-green-700 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[13px] font-black truncate leading-tight mb-1 ${selectedTemplate?.id === t.id ? 'text-green-900' : 'text-slate-800'}`}>
                      {t.title}
                    </h4>
                    <p className={`text-[9px] font-black uppercase tracking-widest ${selectedTemplate?.id === t.id ? 'text-green-600/70' : 'text-slate-400'}`}>
                      {t.recipientType}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <a 
            href={editUrl} 
            target="_blank" 
            className="flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg hover:-translate-y-0.5"
          >
            <Edit3 size={16} />
            <span>REDAGUOTI ŠABLONUS</span>
            <ExternalLink size={12} className="opacity-50" />
          </a>
        </div>

        {/* Main Area: Editor */}
        <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
          {selectedTemplate ? (
            <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm flex-1 flex flex-col overflow-hidden relative">
              <div className="p-8 border-b border-green-800 bg-green-700 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-white/10 backdrop-blur-sm text-green-100 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-white/10">
                        {selectedTemplate.category}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase">{selectedTemplate.title}</h3>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleCopy}
                      className="flex items-center space-x-3 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group"
                    >
                      {copied ? <Check size={16} className="text-green-300" /> : <Copy size={16} className="group-hover:rotate-6 transition-transform" />}
                      <span>{copied ? 'NUKOPIJUOTA' : 'KOPIJUOTI'}</span>
                    </button>
                    <button 
                      onClick={handleSend}
                      className="flex items-center space-x-3 px-7 py-3 bg-white text-green-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-50 transition-all shadow-xl hover:-translate-y-0.5"
                    >
                      <Send size={16} />
                      <span>SIŲSTI</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center bg-green-800/50 p-3 rounded-xl border border-white/10">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest w-14">Tema:</span>
                    <input 
                      className="flex-1 bg-transparent border-none outline-none text-xs font-bold text-white placeholder-white/30"
                      value={editableSubject}
                      onChange={e => setEditableSubject(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 relative bg-white">
                <textarea 
                  className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-800 leading-relaxed font-bold text-base placeholder-slate-200 scrollbar-thin"
                  value={editableBody}
                  onChange={e => setEditableBody(e.target.value)}
                />
              </div>

              <div className="p-6 bg-blue-50 border-t border-blue-100 flex items-start space-x-4">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg flex-shrink-0">
                  <Info size={20} />
                </div>
                <div className="text-[12px] text-blue-900 leading-relaxed font-bold">
                  <strong className="block mb-0.5 font-black uppercase tracking-widest text-[9px] text-blue-800">REKOMENDACIJA</strong>
                  Nepamirškite pakeisti teksto skliausteliuose <code className="bg-blue-100 px-1 rounded font-black text-blue-700">[pvz., vardą]</code>.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center p-12 text-center group">
              <div className="bg-green-50 p-10 rounded-full mb-6 text-green-200 group-hover:bg-green-700 group-hover:text-white transition-all duration-700 transform group-hover:rotate-12">
                <Mail size={80} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight uppercase">Pasirinkite šabloną</h3>
              <p className="text-slate-400 font-bold max-w-sm text-sm">
                Pasirinkite laišką iš kairiojo sąrašo, kad galėtumėte jį redaguoti ir išsiųsti.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatesTab;
