import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Info,
  Trees,
  ChevronRight,
  Sparkles,
  ArrowUpRight
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

  const categories = useMemo(() => ['Visi', ...Array.from(new Set(INITIAL_TEMPLATES.map(t => t.category)))], []);
  
  const filtered = useMemo(() => {
    return INITIAL_TEMPLATES.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'Visi' || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCategory]);

  const handleSelect = (t: EmailTemplate) => {
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
    const mailto = `mailto:${selectedTemplate.to || ''}?cc=${selectedTemplate.cc || ''}&subject=${encodeURIComponent(editableSubject)}&body=${encodeURIComponent(editableBody)}`;
    window.location.href = mailto;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      
      {/* Search & List Pane */}
      <div className="lg:col-span-4 flex flex-col space-y-4 min-h-0">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-700 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Ieškoti šablono..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-700 transition-all text-xs font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all border ${
                  selectedCategory === cat ? 'bg-emerald-700 border-emerald-700 text-white shadow-md' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-[2rem] border border-slate-100 shadow-sm p-2 scrollbar-thin">
          <div className="space-y-1">
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center space-x-3 border ${
                  selectedTemplate?.id === t.id ? 'bg-emerald-700 border-emerald-700 text-white shadow-lg translate-x-1' : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedTemplate?.id === t.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileText size={18} />
                </div>
                <div className="flex-1 truncate">
                  <h4 className={`text-xs font-black truncate leading-none mb-1.5 ${selectedTemplate?.id === t.id ? 'text-white' : 'text-slate-800'}`}>{t.title}</h4>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${selectedTemplate?.id === t.id ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {t.category}
                  </p>
                </div>
                <ChevronRight size={14} className={`transition-opacity ${selectedTemplate?.id === t.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Pane */}
      <div className="lg:col-span-8 flex flex-col min-h-0">
        {selectedTemplate ? (
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-400">
            
            {/* Dark Header similar to 'Dokumentai' block */}
            <div className="p-8 bg-slate-950 text-white relative">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-white pointer-events-none">
                <Trees size={140} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-0.5 bg-white/10 rounded-md text-[8px] font-black uppercase tracking-widest border border-white/10">{selectedTemplate.category}</span>
                  {selectedTemplate.level && (
                    <span className="px-2 py-0.5 bg-emerald-500 rounded-md text-[8px] font-black uppercase tracking-widest">{selectedTemplate.level} LYGIS</span>
                  )}
                </div>
                <h3 className="text-xl font-black tracking-tight uppercase mb-6 leading-tight">{selectedTemplate.title}</h3>
                
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full bg-white/5 rounded-xl p-3 border border-white/5">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-1">El. laiško tema</span>
                    <input 
                      className="w-full bg-transparent border-none outline-none text-xs font-bold text-white focus:text-emerald-400 transition-colors" 
                      value={editableSubject} 
                      onChange={e => setEditableSubject(e.target.value)} 
                    />
                  </div>
                  <div className="flex space-x-2 w-full md:w-auto">
                    <button 
                      onClick={handleCopy} 
                      className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      <span>{copied ? 'Kopijuota' : 'Kopijuoti'}</span>
                    </button>
                    <button 
                      onClick={handleSend} 
                      className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                      <Send size={14} />
                      <span>Siųsti paštu</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Content Area */}
            <div className="flex-1 p-8 bg-slate-50/20 relative">
              <div className="absolute top-4 left-4 p-1 bg-emerald-50 text-emerald-600 rounded-md opacity-50">
                <Sparkles size={12} />
              </div>
              <textarea 
                className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-800 leading-relaxed font-bold text-base placeholder-slate-200 scrollbar-thin" 
                value={editableBody} 
                onChange={e => setEditableBody(e.target.value)} 
                placeholder="Rašykite laišką čia..."
              />
            </div>

            {/* Hint Footer */}
            <div className="p-6 bg-blue-50/50 border-t border-blue-100 flex items-start space-x-3">
              <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md flex-shrink-0">
                <Info size={16} />
              </div>
              <div className="text-[11px] font-bold text-blue-900 leading-relaxed">
                <strong className="block mb-0.5 font-black uppercase tracking-widest text-[9px]">Patarimas</strong>
                Užpildykite duomenis skliausteliuose <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-black">[...]</code>. Redaguotas tekstas nebus išsaugotas visam laikui, jis skirtas vienkartiniam siuntimui.
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="bg-slate-50 p-12 rounded-full text-slate-100">
              <Mail size={80} />
            </div>
            <div className="max-w-xs">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Pasirinkite šabloną</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] leading-relaxed">
                Spustelėkite bet kurį šabloną kairėje pusėje, kad galėtumėte jį pritaikyti savo situacijai.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                <span className="text-[8px] font-black uppercase text-slate-400">Incidentai</span>
                <ArrowUpRight size={10} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group">
                <span className="text-[8px] font-black uppercase text-slate-400">Lankomumas</span>
                <ArrowUpRight size={10} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesTab;