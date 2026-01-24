
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
  Filter
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-180px)] animate-in fade-in duration-500 overflow-hidden">
      {/* Sidebar: List of Templates */}
      <div className="lg:col-span-4 flex flex-col space-y-4 min-h-0 h-full">
        <div className="bg-white p-6 rounded-[2rem] border-2 border-black/5 shadow-sm space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Ieškoti šablono..."
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-black transition-all text-sm font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border-2 ${
                  selectedCategory === cat 
                    ? 'bg-black border-black text-white shadow-md' 
                    : 'bg-white border-slate-100 text-slate-500 hover:border-black/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-[2rem] border-2 border-black/5 shadow-sm p-4 scrollbar-thin">
          <div className="space-y-2">
            {filteredTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-start space-x-4 group border-2 ${
                  selectedTemplate?.id === t.id 
                    ? 'bg-[#D9EEFF] border-black/10 shadow-sm' 
                    : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`p-3 rounded-xl flex-shrink-0 transition-all ${
                  selectedTemplate?.id === t.id ? 'bg-black text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                }`}>
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`text-sm font-black truncate leading-tight ${selectedTemplate?.id === t.id ? 'text-black' : 'text-slate-800'}`}>
                      {t.title}
                    </h4>
                    {t.level && (
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ml-2 border border-black/10 shadow-sm ${
                        t.level === 'A' ? 'bg-blue-100 text-blue-700' : 
                        t.level === 'B' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {t.level} LYGIS
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${selectedTemplate?.id === t.id ? 'text-blue-700/70' : 'text-slate-400'}`}>
                    {t.recipientType} • {t.category}
                  </p>
                </div>
                <ChevronRight size={18} className={`mt-2 transition-transform ${selectedTemplate?.id === t.id ? 'text-black translate-x-1' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          {filteredTemplates.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-400 font-black uppercase tracking-widest">Sąrašas tuščias</p>
            </div>
          )}
        </div>

        <a 
          href={editUrl} 
          target="_blank" 
          className="flex items-center justify-center space-x-3 py-4 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Edit3 size={18} />
          <span>REDAGUOTI MASTER DOKUMENTĄ</span>
          <ExternalLink size={14} className="opacity-50" />
        </a>
      </div>

      {/* Main Area: Editor */}
      <div className="lg:col-span-8 flex flex-col min-h-0 h-full">
        {selectedTemplate ? (
          <div className="bg-white border-2 border-black/5 rounded-[3rem] shadow-sm flex-1 flex flex-col overflow-hidden relative">
            <div className="p-8 md:p-10 border-b border-black/5 bg-[#F8FAFC]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border border-black/10">
                      {selectedTemplate.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                      KAM: {selectedTemplate.recipientType}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{selectedTemplate.title}</h3>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center space-x-2 px-6 py-3.5 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-black/10 transition-all shadow-sm group"
                  >
                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="group-hover:rotate-6 transition-transform" />}
                    <span>{copied ? 'NUKOPIJUOTA' : 'KOPIJUOTI'}</span>
                  </button>
                  <button 
                    onClick={handleSend}
                    className="flex items-center space-x-3 px-8 py-3.5 bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10 hover:-translate-y-0.5"
                  >
                    <Send size={18} />
                    <span>SIŲSTI</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Tema:</span>
                  <input 
                    className="flex-1 bg-transparent border-none outline-none text-sm font-black text-slate-800"
                    value={editableSubject}
                    onChange={e => setEditableSubject(e.target.value)}
                  />
                </div>
                <div className="flex items-center bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-inner">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">CC:</span>
                  <span className="text-xs font-black text-slate-500 truncate">{selectedTemplate.cc || 'Nepriskirta'}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 relative bg-white overflow-hidden">
               {/* Decorative Background */}
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
                 <Mail size={400} />
              </div>

              <textarea 
                className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-800 leading-relaxed font-bold text-lg placeholder-slate-200 relative z-10 scrollbar-thin"
                value={editableBody}
                onChange={e => setEditableBody(e.target.value)}
                placeholder="Pradėkite rašyti laišką..."
              />
            </div>

            <div className="p-8 bg-[#F5E6C4]/30 border-t border-black/5 flex items-start space-x-5">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-700 shadow-sm border border-amber-200/50 flex-shrink-0">
                <Info size={24} />
              </div>
              <div className="text-[13px] text-amber-900 leading-relaxed">
                <strong className="block mb-1 font-black uppercase tracking-widest text-[10px]">REDAKCIJOS REKOMENDACIJA</strong>
                Prieš siųsdami laišką, būtinai pakeiskite tekstą skliausteliuose <code className="bg-white/50 px-1 rounded font-black">[pvz., vardą ar datą]</code>. Paspaudus mygtuką „SIŲSTI“, jūsų numatytoje pašto programoje bus sukurta nauja žinutė su paruoštu tekstu.
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3rem] flex-1 flex flex-col items-center justify-center p-16 text-center group">
            <div className="bg-slate-50 p-10 rounded-full mb-8 text-slate-200 group-hover:bg-[#D9EEFF] group-hover:text-black transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110">
              <Mail size={80} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Pasirinkite šabloną</h3>
            <p className="text-slate-500 font-bold max-w-sm leading-relaxed">
              Kairiajame sąraše pasirinkite reikiamą laišką, kad galėtumėte jį peržiūrėti, redaguoti ir greitai išsiųsti adresatui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesTab;
