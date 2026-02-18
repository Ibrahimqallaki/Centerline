
import React from 'react';
import { BookOpen, Target, AlertTriangle, Users, GitCommit, ShieldCheck, Zap, Activity } from 'lucide-react';

const Guide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-800/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            Centerlining Basic Training
          </h2>
          <p className="text-blue-200 max-w-2xl leading-relaxed">
            Centerlining är en grundläggande möjliggörare inom Autonomt Underhåll (AM). 
            Målet är att kontrollera processen genom att säkerställa att maskinens parametrar 
            alltid är inställda korrekt för att undvika förluster och variabilitet.
          </p>
        </div>
        <BookOpen className="absolute right-[-20px] bottom-[-40px] text-blue-900/20 w-64 h-64 -rotate-12" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: KULTUR & STRATEGI */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-purple-900/30 rounded-xl text-purple-400">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Kultur: Reaktiv vs Proaktiv</h3>
              <p className="text-xs text-gray-500 font-mono">Process Control Strategy</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 bg-red-950/20 p-4 rounded-xl border border-red-900/20">
                <h4 className="text-red-400 font-bold text-xs uppercase mb-2">Reaktiv (Gamla sättet)</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  "Jag tror jag vet felet, ge mig 10 minuter." Baserat på känsla och erfarenhet.
                  Problem löses tillfälligt utan spårbarhet.
                </p>
              </div>
              <div className="flex items-center text-gray-600">
                <Activity size={20} />
              </div>
              <div className="flex-1 bg-green-950/20 p-4 rounded-xl border border-green-900/20">
                <h4 className="text-green-400 font-bold text-xs uppercase mb-2">Proaktiv (Centerline)</h4>
                <p className="text-gray-400 text-xs leading-relaxed">
                  "Limmängden är låg men inom tolerans. Vi agerar nu för att undvika stopp."
                  Baserat på data, standarder och förutsägbarhet.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-950 p-4 rounded-xl text-sm text-gray-300 italic border-l-4 border-purple-500">
              "Målet är att minska variabiliteten i både INPUT (Material, Metod) och PROCESSEN för att garantera OUTPUT."
            </div>
          </div>
        </div>

        {/* CARD 2: DEFINITIONER & TYPER */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-blue-900/30 rounded-xl text-blue-400">
              <GitCommit size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Typer av Punkter</h3>
              <p className="text-xs text-gray-500 font-mono">CL vs CPE & Kategorier</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-800/50 p-3 rounded-lg">
                 <span className="text-blue-300 font-black text-xs block mb-1">CL (Centerline)</span>
                 <p className="text-[10px] text-gray-400">Justerbar inställning som kan övervakas. T.ex. rattar, tryck, temperaturer.</p>
               </div>
               <div className="bg-gray-800/50 p-3 rounded-lg">
                 <span className="text-orange-300 font-black text-xs block mb-1">CPE (Critical Equipment Point)</span>
                 <p className="text-[10px] text-gray-400">Fysisk referenspunkt i maskinen. T.ex. avstånd mellan kniv och mothåll.</p>
               </div>
             </div>

             <ul className="space-y-2 mt-2">
               {[
                 { label: 'Static CL', desc: 'Inställning vid stillastående (t.ex. vid SKU-byte).' },
                 { label: 'Dynamic CL', desc: 'Kontrolleras under drift (t.ex. mätare, flöden).' },
                 { label: 'Program (Set Point)', desc: 'Värden i recept/HMI.' },
                 { label: 'Condition', desc: 'Slitagekontroll (t.ex. knivskärpa).' }
               ].map((item, i) => (
                 <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                   <span><strong className="text-white">{item.label}:</strong> {item.desc}</span>
                 </li>
               ))}
             </ul>
          </div>
        </div>

        {/* CARD 3: KRITIKALITET & RÖDA KORT */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-red-900/30 rounded-xl text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Kritikalitet & Avvikelser</h3>
              <p className="text-xs text-gray-500 font-mono">Hantering av "Out of Standard"</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            <div className="p-3 border-l-4 border-red-500 bg-red-900/10">
              <h4 className="font-bold text-white mb-1">Kritisk Centerline</h4>
              <p className="text-xs">Om denna punkt är fel kommer det garanterat leda till kvalitetsproblem, stopp eller krasch. <strong>Kräver godkännande (TDP) för att ändras.</strong></p>
            </div>
            
            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-900/10">
              <h4 className="font-bold text-white mb-1">Icke-Kritisk Centerline</h4>
              <p className="text-xs">Påverkar processen men beror ofta på andra faktorer. Kan justeras av operatör men ska dokumenteras.</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-800">
              <h4 className="font-bold text-white text-xs uppercase mb-2">Röda Kort-systemet</h4>
              <p className="text-xs text-gray-400 mb-2">När en CL måste ändras utanför standard:</p>
              <ol className="list-decimal list-inside text-xs text-gray-400 space-y-1">
                <li>Dokumentera VAD som ändrades.</li>
                <li>Dokumentera VARFÖR (orsak).</li>
                <li>Sätt en "Röd Tagg" på maskinen/punkten.</li>
                <li>Processingenjör/Team Leader följer upp.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* CARD 4: ROLLER & ANSVAR */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-green-900/30 rounded-xl text-green-400">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Roller & Ansvar (R&R)</h3>
              <p className="text-xs text-gray-500 font-mono">Vem gör vad?</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="group">
              <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                <ShieldCheck size={16} /> Operatör
              </h4>
              <p className="text-xs text-gray-400 pl-6 border-l border-gray-700 ml-2">
                Utför dagliga/veckovisa kontroller. Rapporterar avvikelser. 
                Föreslår förbättringar. Äger sin maskin.
              </p>
            </div>

            <div className="group">
              <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                <Target size={16} /> Team Leader
              </h4>
              <p className="text-xs text-gray-400 pl-6 border-l border-gray-700 ml-2">
                Säkerställer att standarder följs. Coachar teamet. 
                Startar rotorsaksanalyser vid avvikelser.
              </p>
            </div>

            <div className="group">
              <h4 className="flex items-center gap-2 font-bold text-white text-sm mb-1 group-hover:text-blue-400 transition-colors">
                <GitCommit size={16} /> Processingenjör
              </h4>
              <p className="text-xs text-gray-400 pl-6 border-l border-gray-700 ml-2">
                Äger CL-systemet. Godkänner kritiska ändringar. 
                Analyserar trender och optimerar processen över tid.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;
