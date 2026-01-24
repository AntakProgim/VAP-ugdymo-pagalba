
import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Users, MessageSquare, Target, HeartHandshake, Trees } from 'lucide-react';

const SchemesTab: React.FC = () => {
  const primarySteps = [
    { title: 'Dalyko mokytojas', subtitle: '+ MOKINYS', note: 'Žodinė pastaba Mano Dienyne' },
    { title: 'Klasės vadovas', subtitle: '+ MOKINYS', note: 'Susitarimų lapas (fiksavimas)' },
    { title: 'Klasės vadovas', subtitle: '+ TĖVAI', note: 'Susitarimų lapas + informavimas' },
    { title: 'Klasės vadovas', subtitle: '+ SOC. PEDAGOGĖ', note: 'Pagalbos plano sudarymas' },
    { title: 'Specialistai', subtitle: '+ KOMANDA', note: 'Plano įgyvendinimas ir stebėsena' },
    { title: 'VGK', subtitle: '+ ADMINISTRACIJA', note: 'VGK posėdis, direktoriaus sprendimai' },
    { title: 'Išorės institucijos', subtitle: 'PPT, VTAS, AV', note: 'Kritiniai atvejai / policija' },
    { title: 'Tėvų partnerystė', subtitle: 'BENDRI LŪKESČIAI', note: 'Sutartys dėl bendrų veiksmų ir nuolatinis ryšys' },
  ];

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
              Procesų Valdymas
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-[900] text-white mb-4 tracking-tighter leading-tight uppercase">
            PAGALBOS <br/> SCHEMOS
          </h1>
          <p className="text-green-100 text-sm md:text-base font-medium leading-relaxed opacity-90">
            Algoritmai ir veiksmų seka, užtikrinanti nuoseklų bei efektyvų problemų sprendimą.
          </p>
        </div>
      </div>

      {/* 1. Ugdymo aplinkos keitimas (UAK) */}
      <section className="bg-amber-50 p-8 md:p-12 rounded-[2.5rem] border border-amber-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-amber-600 pointer-events-none">
          <ShieldAlert size={120} />
        </div>
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-amber-600 p-4 rounded-2xl text-white shadow-lg">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-[900] text-amber-950 tracking-tight uppercase leading-none">UAK PROTOKOLAS</h2>
            <p className="text-amber-700 text-sm font-bold mt-2">Greitojo reagavimo schema kritinėms situacijoms klasėje.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-amber-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest mb-4">I etapas. mokytojo veiksmai</h4>
              <ul className="text-[14px] text-gray-700 space-y-4 font-bold">
                <li className="flex items-start"><span className="text-amber-500 mr-3">1.</span> Pastaba. Pozityvus susitarimas.</li>
                <li className="flex items-start"><span className="text-amber-500 mr-3">2.</span> Perspėjimas. Informavimas apie UAK grėsmę.</li>
                <li className="flex items-start"><span className="text-amber-500 mr-3">3.</span> Vykdymas. Kviečiamas vadovas per G-Chat.</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
             <div className="bg-white p-8 rounded-3xl shadow-sm border-l-8 border-blue-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-4">II etapas. vadovo veiksmai</h4>
              <p className="text-[14px] text-gray-700 font-bold leading-relaxed italic">Nurodo mokiniui klasę ar kabinetą savarankiškam darbui. Mokinys grįžta į klasę tik nusiraminęs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tėvų įtraukimas */}
      <section className="bg-blue-50 p-8 md:p-12 rounded-[2.5rem] border border-blue-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-10">
          <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg">
            <HeartHandshake size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-[900] text-blue-950 tracking-tight uppercase leading-none">TĖVŲ PARTNERYSTĖ</h2>
            <p className="text-blue-700 text-sm font-bold mt-2">Strategijos sėkmingam bendradarbiavimui.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="text-blue-600" size={24} />
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Komunikacija</h4>
            </div>
            <p className="text-[14px] text-gray-700 font-bold leading-relaxed mb-4">„Sumuštinio“ metodas: stiprybės → problema → sprendimas.</p>
            <p className="text-[14px] text-gray-700 font-bold leading-relaxed">Faktų kalba: konkrečių veiksmų įvardijimas be interpretacijų.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-blue-100">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="text-blue-600" size={24} />
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Lūkesčiai</h4>
            </div>
            <p className="text-[14px] text-gray-700 font-bold leading-relaxed mb-4">Elgesio kontraktas: trišalis susitarimas (mokinys-tėvai-mokykla).</p>
            <p className="text-[14px] text-gray-700 font-bold leading-relaxed">Pasekmės, ne bausmės: natūralus elgesio rezultatas.</p>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden group">
            <Users className="absolute -bottom-10 -right-10 text-white/5 group-hover:scale-125 transition-transform duration-700" size={180} />
            <p className="text-xl font-black leading-snug italic relative z-10">
              „Ryšys yra svarbiau už kontrolę. Kai tėvai jaučiasi palaikomi, jie tampa partneriais.“
            </p>
          </div>
        </div>
      </section>

      {/* 3. Pagalbos schema */}
      <section>
        <div className="flex items-center space-x-4 mb-10 px-4">
          <div className="bg-green-100 p-3 rounded-2xl text-green-700 border border-green-200">
            <CheckCircle2 size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-[900] text-slate-900 tracking-tight uppercase">PAGALBOS SEKA</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {primarySteps.map((step, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all relative group">
              <div className={`absolute -top-3 -left-3 w-10 h-10 ${idx < 4 ? 'bg-green-700' : 'bg-red-600'} text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl group-hover:scale-110 transition-transform`}>
                {idx + 1}
              </div>
              <h4 className="font-black text-slate-900 text-lg leading-tight mb-2">{step.title}</h4>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-6">{step.subtitle}</p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 italic text-[13px] text-slate-600 font-bold leading-relaxed">
                {step.note}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SchemesTab;
