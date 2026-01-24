
import React from 'react';
import { ArrowRight, CheckCircle2, ShieldAlert, Users, MessageSquare, Target, HeartHandshake } from 'lucide-react';

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
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      {/* 1. Ugdymo aplinkos keitimas (UAK) */}
      <section className="bg-amber-50 p-8 md:p-10 rounded-[40px] border border-amber-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 text-amber-600 pointer-events-none">
          <ShieldAlert size={120} />
        </div>
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-amber-600 p-3 rounded-2xl text-white shadow-lg">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-amber-950 tracking-tight uppercase leading-none">Ugdymo aplinkos keitimas (UAK)</h2>
            <p className="text-amber-700 text-sm font-bold mt-2">Greitojo reagavimo protokolas kritinėms situacijoms klasėje.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-amber-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest mb-3">I etapas. mokytojo veiksmai</h4>
              <ul className="text-[14px] text-gray-700 space-y-3 font-medium">
                <li className="flex items-start"><span className="text-amber-500 font-black mr-2">1.</span> <strong>Pastaba.</strong> Pozityvus susitarimas.</li>
                <li className="flex items-start"><span className="text-amber-500 font-black mr-2">2.</span> <strong>Perspėjimas.</strong> Informavimas apie UAK grėsmę.</li>
                <li className="flex items-start"><span className="text-amber-500 font-black mr-2">3.</span> <strong>Vykdymas.</strong> Kviečiamas budintis vadovas.</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-blue-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest mb-3">II etapas. vadovo veiksmai</h4>
              <p className="text-[14px] text-gray-700 font-medium leading-relaxed">Nurodo mokiniui klasę ar kabinetą savarankiškam darbui (pagal budėjimo grafiką). Pabaigoje mokinys grįžta į klasę, jei nusiramino.</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-green-900 uppercase text-xs tracking-widest mb-3">III etapas. refleksija</h4>
              <p className="text-[14px] text-gray-700 font-medium leading-relaxed">Pokalbis su tėvais ir klasės vadovu. Po 3-iojo UAK atvejo – socialinis pedagogas inicijuoja oficialų pokalbį su tėvais.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-500 hover:translate-x-1 transition-transform">
              <h4 className="font-black text-red-900 uppercase text-xs tracking-widest mb-3">IV etapas. VGK įsikišimas</h4>
              <p className="text-[14px] text-gray-700 font-medium leading-relaxed">Jei UAK neduoda rezultatų, problemą perima Mokyklos vaiko gerovės komisija specializuotai pagalbai teikti.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Tėvų įtraukimas ir komunikacija */}
      <section className="bg-blue-50 p-8 md:p-10 rounded-[40px] border border-blue-100 shadow-sm">
        <div className="flex items-center space-x-4 mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
            <HeartHandshake size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-blue-950 tracking-tight uppercase leading-none">Tėvų įtraukimas ir komunikacija</h2>
            <p className="text-blue-700 text-sm font-bold mt-2">Strategijos sėkmingam bendradarbiavimui esant pasikartojantiems sunkumams.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="text-blue-600" size={20} />
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Komunikacijos strategijos</h4>
            </div>
            <ul className="space-y-4 text-[14px] text-gray-700 font-medium">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>„Sumuštinio“ metodas.</strong> Pradėkite nuo vaiko stiprybių, įvardinkite problemą ir užbaikite bendru sprendimo ieškojimu.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Faktų kalba.</strong> Venkite interpretacijų („jis blogai elgiasi“), įvardinkite konkrečius veiksmus („šiandien mokinys tris kartus trukdė pamoką garsiai kalbėdamas“).</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Bendras tikslas.</strong> Pabrėžkite, kad mokykla ir tėvai yra vienoje komandoje, siekiančioje vaiko sėkmės.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <Target className="text-blue-600" size={20} />
              <h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Aiškūs lūkesčiai</h4>
            </div>
            <ul className="space-y-4 text-[14px] text-gray-700 font-medium">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Elgesio kontraktas.</strong> Pasirašomas trišalis susitarimas (mokinys-tėvai-mokykla) su konkrečiais įsipareigojimais.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Pasekmės, ne bausmės.</strong> Iš anksto aptariamos natūralios netinkamo elgesio pasekmės (pvz. papildomas darbas refleksijai).</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Reguliarus ryšys.</strong> Susitariama dėl periodinių (pvz. kassavaitinių) trumpų susitikimų ar skambučių pažangai aptarti.</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center relative overflow-hidden group">
            <Users className="absolute -bottom-6 -right-6 text-white/10 group-hover:scale-125 transition-transform duration-700" size={160} />
            <h4 className="font-black text-blue-100 uppercase text-xs tracking-widest mb-4">Auksinė taisyklė</h4>
            <p className="text-lg font-bold leading-snug italic relative z-10">
              „Ryšys yra svarbiau už kontrolę. Kai tėvai jaučiasi palaikomi mokyklos, jie tampa aktyviausiais vaiko elgesio pokyčių partneriais.“
            </p>
          </div>
        </div>
      </section>

      {/* 3. Pagalbos mokiniui teikimo schema (Apačioje) */}
      <section>
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-green-100 p-2.5 rounded-xl text-green-700 shadow-sm border border-green-200">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Pagalbos mokiniui teikimo schema</h2>
            <p className="text-sm text-gray-500 font-medium">Standartizuota veiksmų seka sprendžiant elgesio sunkumus.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {primarySteps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative group">
              <div className={`absolute -top-3 -left-3 w-9 h-9 ${idx < 4 ? 'bg-green-600' : 'bg-red-600'} text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                {idx + 1}
              </div>
              <h4 className="font-bold text-gray-900 text-[17px] leading-tight mb-1">{step.title}</h4>
              <p className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-4">{step.subtitle}</p>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 italic text-[13px] text-gray-600 leading-relaxed font-medium">
                {step.note}
              </div>
              {idx < primarySteps.length - 1 && idx !== 3 && idx !== 7 && (
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 text-gray-200 hidden lg:block">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SchemesTab;
