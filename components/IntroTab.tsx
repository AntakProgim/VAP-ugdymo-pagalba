
import React from 'react';
import { 
  ExternalLink, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  Database, 
  Clock, 
  Mail, 
  ChevronRight, 
  ShieldCheck,
  CheckCircle2,
  Smile,
  ShieldAlert,
  AlertCircle,
  MessageSquareText
} from 'lucide-react';

interface IntroTabProps {
  setActiveTab: (tab: string) => void;
}

const IntroTab: React.FC<IntroTabProps> = ({ setActiveTab }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-green-700 p-8 md:p-12 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center space-x-2 text-green-200 font-black text-xs uppercase tracking-widest mb-4">
            <BookOpen size={16} />
            <span>Sistemos įvadas ir nuostatos</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight uppercase tracking-tight">
            VILNIAUS ANTAKALNIO PROGIMNAZIJOS PAGALBOS SISTEMA
          </h2>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <ShieldCheck size={200} />
        </div>
      </div>

      <div className="p-8 md:p-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Section */}
          <div className="prose prose-green max-w-none text-gray-700 space-y-6 leading-relaxed text-[15px]">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-2xl mb-8">
              <p className="font-bold text-green-900 italic m-0">
                Tikime, kad aiškūs susitarimai ir nuoseklūs veiksmai padės mums visiems jaustis saugiau 
                ir užtikrins kokybišką ugdymo procesą.
              </p>
            </div>

            <p>
              Kiekvienas vaikas turi teisę jaustis saugus ir gerbiamas mokykloje. Mūsų progimnazijoje tikime, kad saugi mokymosi aplinka kuriama bendromis visų pastangomis – mokytojų, mokinių ir tėvų. Todėl parengėme aiškias gaires, kaip kartu užtikrinsime pozityvų elgesį ir kaip reaguosime į taisyklių nesilaikymo atvejus.
            </p>

            {/* Rekomenduojama komunikacija Section */}
            <div className="bg-blue-50 p-8 rounded-[2rem] border border-blue-100 my-8">
               <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                    <MessageSquareText size={24} />
                  </div>
                  <h4 className="font-black text-blue-900 uppercase tracking-tight m-0 text-xl">Rekomenduojama greita pranešimo forma!</h4>
               </div>
               
               <p className="text-blue-900 font-medium mb-6 text-lg leading-relaxed">
                 Siekdami užtikrinti tylią ir greitą pagalbą per pamokas, primygtinai rekomenduojame naudoti <a href="https://chat.google.com/" target="_blank" className="font-black underline decoration-blue-400 decoration-2 hover:text-blue-700 transition-colors">Google Chat</a> programėlę, nes:
               </p>
               
               <ul className="list-none space-y-5 pl-0 text-blue-800 font-medium">
                  <li className="flex items-start space-x-4 group">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black mt-1 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">1</span>
                    <span className="text-base">
                      <strong className="text-blue-900 font-black">Mažiau įtampos.</strong> Mokytojas gali paprašyti pagalbos ar informuoti apie UAK be balsinio skambučio, klasėje niekas nieko negirdi. Nereikia palikti ugdymo kabineto.
                    </span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black mt-1 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">2</span>
                    <span className="text-base">
                      <strong className="text-blue-900 font-black">Pasiekiamumo kontrolė.</strong> Matysite, kuris vadovas ar socialinė pedagogė yra prisijungusi ir gali operatyviai atvykti.
                    </span>
                  </li>
                  <li className="flex items-start space-x-4 group">
                    <span className="bg-blue-600 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black mt-1 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">3</span>
                    <span className="text-base">
                      <strong className="text-blue-900 font-black">Konfidencialumas.</strong> Pranešimai matomi tik gavėjui, tai saugus būdas aptarti jautrias situacijas realiu laiku.
                    </span>
                  </li>
               </ul>
            </div>
            
            <p className="font-bold text-gray-900">Šis dokumentas – tai mūsų bendruomenės susitarimas, padėsiantis visiems aiškiai suprasti:</p>
            <ul className="list-none space-y-2 pl-0">
              <li className="flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Kaip užkertame kelią netinkamam elgesiui;</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Kokių veiksmų imamės, kai taisyklės pažeidžiamos;</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-green-500 mt-1 flex-shrink-0" />
                <span>Kaip padedame mokiniams ugdytis atsakomyber už savo veiksmus.</span>
              </li>
            </ul>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start space-x-4">
              <Smile className="text-amber-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <p className="font-bold text-amber-900 m-0 mb-2">Pozityvaus elgesio skatinimas</p>
                <p className="text-amber-800 m-0">
                  Ypatingą dėmesį mokykloje skiriame pozityvaus elgesio pastebėjimui ir skatinimui. Mokytojai nuolat ieško progų pagirti mokinius už jų pastangas, pagalbą kitiems, taisyklių laikymąsi ir konstruktyvų elgesį. Siekiame, kad kiekvienoje pamokoje pagyrimų būtų daugiau nei pastabų fiksavimo.
                </p>
              </div>
            </div>

            <p>
              Jei per pamoką pasitaiko trys ar daugiau taisyklių pažeidimų – taikomas ugdymo aplinkos keitimas. Svarbu paminėti, kad siekiame, jog mokytojai neliktų vieni sudėtingose situacijose – visada gali kreiptis į budintį administratorių.
            </p>

            <p>
              Tolimesniuose skyriuose rasite detalias instrukcijas specifinėms situacijoms. Kviečiame susipažinti ir kartu kurti saugią bei pozityvią mokymosi aplinką mūsų vaikams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm">
              <div>
                <span className="block font-bold text-gray-900 mb-1">Klasės vadovai</span>
                <span className="text-gray-500">Pirminė pagalba</span>
              </div>
              <div>
                <span className="block font-bold text-gray-900 mb-1">Pagalbos specialistai</span>
                <span className="text-gray-500">Individualus dėmesys</span>
              </div>
              <div>
                <span className="block font-bold text-gray-900 mb-1">Mokyklos vadovai</span>
                <span className="text-gray-500">Koordinavimas</span>
              </div>
            </div>

            {/* Metodinė Medžiaga Cards Section */}
            <div className="pt-10">
              <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-6 flex items-center">
                <FileText size={18} className="mr-2 text-green-600" />
                METODINĖ MEDŽIAGA IR VEIKIMO SISTEMOS
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <a 
                  href="https://docs.google.com/document/d/171tuL9pKuBYC376oxjoqmdM9NSqfAsinSpHJoyk2m8Y/edit?tab=t.6u6105owpp3f" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-blue-50 rounded-2xl border border-blue-100 hover:bg-blue-100 transition group"
                >
                  <div className="bg-blue-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-blue-100"><Mail size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-blue-900 text-[15px]">El. laiškų šablonai</span>
                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Dokumentas #1</span>
                  </div>
                  <ExternalLink size={16} className="text-blue-300 group-hover:text-blue-600" />
                </a>

                <a 
                  href="https://docs.google.com/document/d/108fN0vGKqQ8gP5I6hy4QgemoPIenAYZoq7fugSKMmrE/edit?tab=t.q2d7sa5ki968" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition group"
                >
                  <div className="bg-purple-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-purple-100"><ClipboardList size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-purple-900 text-[15px]">Pagalbos sistema</span>
                    <span className="text-[10px] text-purple-600 font-black uppercase tracking-widest">Dokumentas #2</span>
                  </div>
                  <ExternalLink size={16} className="text-purple-300 group-hover:text-purple-600" />
                </a>

                <a 
                  href="https://docs.google.com/document/d/12wcUtUmljg_DSQd2MUeNuvzQL9mJaBL0hyvQ4bYtxcE/edit?tab=t.0#heading=h.mcwb8idxixd5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-amber-50 rounded-2xl border border-amber-100 hover:bg-amber-100 transition group"
                >
                  <div className="bg-amber-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-amber-100"><Clock size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-amber-900 text-[15px]">Saugumo užtikrinimas (vadovai)</span>
                    <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Dokumentas #3</span>
                  </div>
                  <ExternalLink size={16} className="text-amber-300 group-hover:text-amber-600" />
                </a>

                <a 
                  href="https://docs.google.com/spreadsheets/d/1zeU4z5XOLIEGqkgdyL041p_cb5vDpJ6DUCy1K_GYL7E/edit?gid=144191619#gid=144191619" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-green-50 rounded-2xl border border-green-100 hover:bg-green-100 transition group"
                >
                  <div className="bg-green-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-green-100"><Database size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-green-900 text-[15px]">Saugumo užtikrinimas (mokytojai)</span>
                    <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Dokumentas #4</span>
                  </div>
                  <ExternalLink size={16} className="text-green-300 group-hover:text-green-600" />
                </a>

                <a 
                  href="https://docs.google.com/document/d/1lW_O3lDzignHyF09xLoizM3fDfZnb5wrt0sBei7zsiU/edit?tab=t.0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition group"
                >
                  <div className="bg-red-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-red-100"><ShieldAlert size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-red-900 text-[15px]">Priemonių taikymo tvarka</span>
                    <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">Dokumentas #5</span>
                  </div>
                  <ExternalLink size={16} className="text-red-300 group-hover:text-red-600" />
                </a>

                {/* Document #6 added into the grid */}
                <a 
                  href="https://docs.google.com/document/d/1FoK4FyQ8gch5CYku_cG_5fMX1Uiylv96nA3eTNyZeeo/edit?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center p-5 bg-indigo-50 rounded-2xl border border-indigo-100 hover:bg-indigo-100 transition group"
                >
                  <div className="bg-indigo-600 p-2.5 rounded-xl text-white mr-4 shadow-md shadow-indigo-100"><AlertCircle size={20}/></div>
                  <div className="flex-1">
                    <span className="block font-bold text-indigo-900 text-[15px]">Krizių valdymo tvarka</span>
                    <span className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">Dokumentas #6</span>
                  </div>
                  <ExternalLink size={16} className="text-indigo-300 group-hover:text-indigo-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroTab;
