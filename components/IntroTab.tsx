
import React from 'react';
import { 
  ExternalLink, 
  FileText, 
  ClipboardList, 
  Database, 
  Clock, 
  Mail, 
  ShieldCheck,
  CheckCircle2,
  Smile,
  ShieldAlert,
  AlertCircle,
  MessageSquareText,
  Trees
} from 'lucide-react';

interface IntroTabProps {
  setActiveTab: (tab: string) => void;
}

const IntroTab: React.FC<IntroTabProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative bg-green-700 rounded-[2rem] overflow-hidden border border-green-800 shadow-xl shadow-green-900/10">
        <div className="absolute top-0 right-0 p-4 opacity-[0.07] text-white pointer-events-none translate-x-12 -translate-y-12 rotate-12">
          <div className="bg-white/20 p-20 rounded-[5rem]">
            <Trees size={340} />
          </div>
        </div>
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col items-start max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-600/50 backdrop-blur-md border border-white/10 rounded-full mb-6">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-green-100">
              Sistemos įvadas ir nuostatos
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white mb-2 tracking-tighter leading-tight uppercase">
            PAGALBOS NUOSTATOS
          </h1>
          <p className="text-[10px] md:text-[11px] font-black text-green-200/60 uppercase tracking-[0.2em]">
            Vilniaus Antakalnio progimnazija
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-green max-w-none text-slate-700 space-y-8 leading-relaxed text-[15px]">
            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-r-2xl mb-8">
              <p className="font-bold text-green-900 italic m-0 text-lg">
                „Tikime, kad aiškūs susitarimai ir nuoseklūs veiksmai padės mums visiems jaustis saugiau 
                ir užtikrins kokybišką ugdymo procesą.“
              </p>
            </div>

            <p className="font-medium text-slate-600 leading-relaxed">
              Kiekvienas vaikas turi teisę jaustis saugus ir gerbiamas mokykloje. Mūsų progimnazijoje tikime, kad saugi mokymosi aplinka kuriama bendromis visų pastangomis – mokytojų, mokinių ir tėvų. Todėl parengėme aiškias gaires, kaip kartu užtikrinsime pozityvų elgesį ir kaip reaguosime į taisyklių nesilaikymo atvejus.
            </p>

            <div className="bg-blue-50 p-8 md:p-10 rounded-[2.5rem] border border-blue-100 my-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 text-blue-600 pointer-events-none">
                  <MessageSquareText size={120} />
               </div>
               <div className="flex items-center space-x-4 mb-8 relative z-10">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <MessageSquareText size={28} />
                  </div>
                  <h4 className="font-black text-blue-900 uppercase tracking-tight m-0 text-2xl">Rekomenduojama greita pranešimo forma!</h4>
               </div>
               
               <p className="text-blue-900 font-bold mb-8 text-lg leading-relaxed relative z-10">
                 Siekdami užtikrinti tylią ir greitą pagalbą per pamokas, primygtinai rekomenduojame naudoti <a href="https://chat.google.com/" target="_blank" className="font-black underline decoration-blue-400 decoration-4 hover:text-blue-700 transition-colors">Google Chat</a> programėlę:
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black mb-4">1</span>
                    <p className="text-[13px] font-bold text-blue-900 mb-1 uppercase tracking-wider">Mažiau įtampos</p>
                    <p className="text-[12px] text-blue-700 font-medium">Mokytojas gali paprašyti pagalbos be balso skambučio, nepalikdamas ugdymo kabineto.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black mb-4">2</span>
                    <p className="text-[13px] font-bold text-blue-900 mb-1 uppercase tracking-wider">Pasiekiamumas</p>
                    <p className="text-[12px] text-blue-700 font-medium">Matysite, kuris vadovas ar socialinė pedagogė yra prisijungusi ir gali operatyviai atvykti.</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                    <span className="bg-blue-600 text-white w-7 h-7 rounded-xl flex items-center justify-center text-[12px] font-black mb-4">3</span>
                    <p className="text-[13px] font-bold text-blue-900 mb-1 uppercase tracking-wider">Saugumas</p>
                    <p className="text-[12px] text-blue-700 font-medium">Pranešimai matomi tik gavėjui, tai saugus būdas aptarti jautrias situacijas realiu laiku.</p>
                  </div>
               </div>
            </div>
            
            <p className="font-black text-slate-900 uppercase tracking-tight text-lg">Bendruomenės susitarimas:</p>
            <ul className="list-none space-y-4 pl-0">
              <li className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-green-500 p-1.5 rounded-lg text-white"><CheckCircle2 size={16} /></div>
                <span className="font-bold text-slate-700">Kaip užkertame kelią netinkamam elgesiui;</span>
              </li>
              <li className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-green-500 p-1.5 rounded-lg text-white"><CheckCircle2 size={16} /></div>
                <span className="font-bold text-slate-700">Kokių veiksmų imamės, kai taisyklės pažeidžiamos;</span>
              </li>
              <li className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="bg-green-500 p-1.5 rounded-lg text-white"><CheckCircle2 size={16} /></div>
                <span className="font-bold text-slate-700">Kaip padedame mokiniams ugdytis atsakomybę už savo veiksmus.</span>
              </li>
            </ul>

            <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex items-start space-x-6">
              <div className="bg-amber-600 p-3 rounded-2xl text-white shadow-lg"><Smile size={28} /></div>
              <div>
                <p className="font-black text-amber-900 m-0 mb-3 uppercase tracking-widest text-xs">Pozityvaus elgesio skatinimas</p>
                <p className="text-amber-800 m-0 font-medium leading-relaxed">
                  Ypatingą dėmesį mokykloje skiriame pozityvaus elgesio pastebėjimui ir skatinimui. Mokytojai nuolat ieško progų pagirti mokinius už jų pastangas, pagalbą kitiems, taisyklių laikymąsi ir konstruktyvų elgesį.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroTab;
