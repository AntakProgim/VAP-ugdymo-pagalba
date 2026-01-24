
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink,
  Info,
  Edit3,
  Trees,
  LayoutGrid,
  ChevronRight
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
      const matchSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.subject.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-700">
      {/* List Sidebar */}
      <div className="lg:col-span-4 flex flex-col space-y-6 min-h-0">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-green-700 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Ieškoti šablono..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-green-700 transition-all text-sm font-bold"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                  selectedCategory === cat ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-4 scrollbar-thin">
          <div className="space-y-2">
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`w-full text-left p-5 rounded-[1.8rem] transition-all flex items-center space-x-4 border ${
                  selectedTemplate?.id === t.id ? 'bg-green-700 border-green-700 text-white shadow-xl translate-x-1' : 'bg-white border-transparent hover:bg-slate-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  selectedTemplate?.id === t.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'
                }`}>
                  <FileText size={20} />
                </div>
                <div className="flex-1 truncate">
                  <h4 className={`text-sm font-black truncate leading-none mb-2 ${selectedTemplate?.id === t.id ? 'text-white' : 'text-slate-800'}`}>{t.title}</h4>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${selectedTemplate?.id === t.id ? 'text-green-200' : 'text-slate-400'}`}>
                    {t.category}
                  </p>
                </div>
                <ChevronRight size={16} className={`transition-opacity ${selectedTemplate?.id === t.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor Main */}
      <div className="lg:col-span-8 flex flex-col min-h-0">
        {selectedTemplate ? (
          <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl h-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none">
                <Trees size={160} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">{selectedTemplate.category}</span>
                  <span className="px-3 py-1 bg-green-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{selectedTemplate.level || 'A'} LYGIS</span>
                </div>
                <h3 className="text-3xl font-black tracking-tight uppercase mb-8">{selectedTemplate.title}</h3>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 bg-white/5 rounded-2xl p-4 border border-white/10">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest block mb-1">TEMA</span>
                    <input className="w-full bg-transparent border-none outline-none text-sm font-bold text-white" value={editableSubject} onChange={e => setEditableSubject(e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={handleCopy} className="flex items-center space-x-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                      {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      <span>{copied ? 'NUKOPIJUOTA' : 'KOPIJUOTI'}</span>
                    </button>
                    <button onClick={() => window.location.href = `mailto:${selectedTemplate.to || ''}?cc=${selectedTemplate.cc || ''}&subject=${encodeURIComponent(editableSubject)}&body=${encodeURIComponent(editableBody)}`} className="flex items-center space-x-3 px-8 py-4 bg-green-600 hover:bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl">
                      <Send size={18} />
                      <span>SIŲSTI</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 bg-slate-50/30">
              <textarea className="w-full h-full bg-transparent border-none outline-none resize-none text-slate-800 leading-relaxed font-bold text-lg placeholder-slate-200 scrollbar-thin" value={editableBody} onChange={e => setEditableBody(e.target.value)} />
            </div>

            <div className="p-8 bg-blue-50/50 border-t border-blue-100 flex items-start space-x-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <Info size={24} />
              </div>
              <div className="text-sm font-bold text-blue-900 leading-relaxed">
                <strong className="block mb-1 font-black uppercase tracking-widest text-[10px]">Patarimas</strong>
                Prisiminkite užpildyti duomenis skliausteliuose <code className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">[...]</code>. Šis šablonas yra paruoštas pagal mokyklos susitarimus.
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] h-full flex flex-col items-center justify-center p-20 text-center space-y-8">
            <div className="bg-slate-50 p-16 rounded-full text-slate-100">
              <Mail size={120} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Pasirinkite šabloną</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Spustelėkite bet kurį šabloną iš kairiojo sąrašo, kad galėtumėte jį redaguoti ir naudoti.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesTab;
