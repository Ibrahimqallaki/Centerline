
import React from 'react';
import { BookOpen, Target, AlertTriangle, Users, GitCommit, ShieldCheck, Zap, Activity, AlertOctagon, PenBox } from 'lucide-react';

const Guide: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-900/40 to-black border border-blue-800/30 p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="text-blue-400" size={20} />
            <span className="text-blue-400 font-black text-xs uppercase tracking-widest">Centerline Excellence (CLX)</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">
            Standardiserat Arbetssätt
          </h2>
          <p className="text-blue-200 max-w-2xl leading-relaxed">
            Syftet med CLX är att eliminera variation genom att säkerställa att maskinen alltid körs enligt 
            fastställda <strong className="text-white">Golden Run-inställningar</strong>. Vi går från reaktivt agerande ("jag tror") 
            till faktabaserad styrning ("jag vet").
          </p>
        </div>
        <BookOpen className="absolute right-[-20px] bottom-[-40px] text-blue-900/20 w-64 h-64 -rotate-12" />
      </div>

      {/* CARD: KULTUR & STRATEGI */}
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
          <div className="p-3 bg-purple-900/30 rounded-xl text-purple-400">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wide italic">Kultur: Reaktiv vs Proaktiv</h3>
            <p className="text-xs text-gray-500 font-mono">Process Control Strategy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          <div className="md:col-span-5 bg-red-950/10 p-5 rounded-2xl border border-red-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h4 className="text-red-400 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Reaktiv (Gamla sättet)
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed italic mb-2">
              "Jag tror jag vet felet, ge mig 10 minuter."
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Baserat på känsla och erfarenhet. Problem löses tillfälligt utan spårbarhet.
            </p>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-600 border border-gray-700">
              <Activity size={20} />
            </div>
          </div>

          <div className="md:col-span-5 bg-green-950/10 p-5 rounded-2xl border border-green-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={40} className="text-green-500" />
            </div>
            <h4 className="text-green-400 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Proaktiv (Centerline)
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed italic mb-2">
              "Limmängden är låg men inom tolerans. Vi agerar nu för att undvika stopp."
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Baserat på data, standarder och förutsägbarhet.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-950 p-5 rounded-2xl text-sm text-gray-400 italic border-l-4 border-purple-500 shadow-inner">
          "Målet är att minska variabiliteten i både <span className="text-white font-bold">INPUT</span> (Material, Metod) och <span className="text-white font-bold">PROCESSEN</span> för att garantera <span className="text-white font-bold">OUTPUT</span>."
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: DEFINITIONER */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-blue-900/30 rounded-xl text-blue-400">
              <GitCommit size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Definitioner</h3>
              <p className="text-xs text-gray-500 font-mono">CL vs CPE & Kategorier</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: 'CL', label: 'Centerline', desc: 'Justerbara processparametrar som övervakas mot standard (Tryck, temp, hastighet).', color: 'text-blue-400' },
                { type: 'CPE', label: 'Critical Physical Element', desc: 'Fysiska referenspunkter i utrustningen (Knivavstånd, givarpositioner).', color: 'text-orange-400' },
                { type: 'Static', label: 'Static CL', desc: 'Inställningar som görs vid stillastående eller omställning (Mekaniska stopp).', color: 'text-gray-400' },
                { type: 'Dynamic', label: 'Dynamic CL', desc: 'Parametrar som kontrolleras och följs upp under drift (Flöden, PLC-värden).', color: 'text-cyan-400' },
                { type: 'Setpoint', label: 'Setpoint (Program)', desc: 'Receptstyrda värden i HMI/PLC. Skall alltid vara uppdaterade och synkade med fysisk miljö.', color: 'text-purple-400' },
                { type: 'Condition', label: 'Condition (Skick)', desc: 'Säkerställs under Service Window. CIL-rutiner initierar aktiviteter till renoveringar.', color: 'text-green-400' }
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/40 p-4 rounded-xl border border-gray-700/50 flex flex-col gap-3 h-full hover:bg-gray-800/60 transition-colors">
                  <div className={`text-[10px] font-black px-2 py-1 rounded bg-black/40 ${item.color} w-fit text-center shrink-0 tracking-widest uppercase`}>{item.type}</div>
                  <div>
                    <div className="text-xs font-bold text-white mb-1">{item.label}</div>
                    <div className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: ROLLER & ANSVAR (RACI) - HORIZONTAL */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
            <div className="p-3 bg-green-900/30 rounded-xl text-green-400">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Roller & Ansvar (RACI)</h3>
              <p className="text-xs text-gray-500 font-mono">Vem gör vad?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { role: 'Operatör', desc: 'Utför kontroller. Återställer till standard. Sätter Röd/Gul Tagg vid avvikelse.', icon: ShieldCheck },
              { role: 'Team Leader', desc: 'Coachar teamet. Säkerställer att standard följs. Eskalerar taggar.', icon: Target },
              { role: 'Line Tech Lead (LTL)', desc: 'Analyserar mekaniska avvikelser (CPE). Identifierar slitage.', icon: Activity },
              { role: 'Processingenjör (PE)', desc: 'Systemägare. Analyserar data. Uppdaterar standarder.', icon: GitCommit },
              { role: 'Line Leader', desc: 'Säkerställer resurser och möjliggör förbättringsarbete.', icon: Users }
            ].map((item, i) => (
              <div key={i} className="group flex flex-col gap-3 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-gray-900 rounded-lg text-gray-400 group-hover:text-green-400 transition-colors w-fit">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white uppercase mb-2 tracking-wider">{item.role}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: ARBETSCYKELN (4 STEG) */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
            <div className="p-3 bg-purple-900/30 rounded-xl text-purple-400">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Tagg-Systemet (Arbetscykeln)</h3>
              <p className="text-xs text-gray-500 font-mono">Process vid avvikelse från standard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gray-800 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg">1</div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Identifiera</h4>
                <p className="text-[9px] text-gray-500 leading-relaxed px-2">
                  Dokumentera <span className="text-white">VAD</span> som ändrades och till vilket värde.
                </p>
              </div>
              <div className="text-[8px] text-blue-400 font-bold uppercase tracking-tighter bg-blue-900/20 px-2 py-0.5 rounded">Operatör</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-sm font-black text-white shadow-lg">2</div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Varför</h4>
                <p className="text-[9px] text-gray-500 leading-relaxed px-2">
                  Dokumentera orsaken (t.ex. förändrat råmaterial eller mekaniskt slitage).
                </p>
              </div>
              <div className="text-[8px] text-amber-400 font-bold uppercase tracking-tighter bg-amber-900/20 px-2 py-0.5 rounded">Operatör / LTL</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-sm font-black text-white shadow-lg">3</div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Tagga</h4>
                <p className="text-[9px] text-gray-500 leading-relaxed px-2">
                  Ansvarar för att visualisera taggen för LTL och PE för att säkerställa eskalering.
                </p>
              </div>
              <div className="text-[8px] text-red-400 font-bold uppercase tracking-tighter bg-red-900/20 px-2 py-0.5 rounded">Team Leader</div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-sm font-black text-white shadow-lg">4</div>
              <div>
                <h4 className="text-[11px] font-black text-white uppercase mb-1">Standardisering</h4>
                <p className="text-[9px] text-gray-500 leading-relaxed px-2">
                  Analysera om standarden behöver uppdateras permanent eller om maskinen kräver underhåll.
                </p>
              </div>
              <div className="text-[8px] text-green-400 font-bold uppercase tracking-tighter bg-green-900/20 px-2 py-0.5 rounded">PE / LTL</div>
            </div>
          </div>
        </div>

        {/* CARD 4: KRITIKALITET & AVVIKELSER */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
            <div className="p-3 bg-red-900/30 rounded-xl text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Kritikalitet & Avvikelser</h3>
              <p className="text-xs text-gray-500 font-mono">Hantering av "Out of Standard"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* P1 */}
            <div className="bg-red-950/10 border border-red-900/20 p-5 rounded-xl space-y-4 relative overflow-hidden group">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                <h4 className="text-red-400 font-black text-xs uppercase tracking-tighter">P1: KRITISK (Haveri- & Kvalitetsrisk)</h4>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">Fokus på punkter som orsakar krascher i 360°-cykeln eller allvarlig kvalitet.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Def:</strong> Fel leder garanterat till stopp, krasch eller osäljbar produkt.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Åtgärd:</strong> Maskinen <span className="text-red-400 font-bold underline">SKALL stoppas omedelbart</span>.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Beslut:</strong> Kräver TDP signerat av Processingenjör.</p>
                <div className="pt-2 mt-2 border-t border-red-900/30">
                  <p className="text-[9px] text-red-300/70 font-bold uppercase">CIL-koppling:</p>
                  <p className="text-[9px] text-gray-500 italic">Alltid CIL-säkrade för att garantera att maskinen håller inställningen.</p>
                </div>
              </div>
            </div>
            {/* P2 */}
            <div className="bg-orange-950/10 border border-orange-900/20 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h4 className="text-orange-400 font-black text-xs uppercase tracking-tighter">P2: VIKTIG (Produktivitet & Slitage)</h4>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">Täcker "medel-kritiska" spannet som påverkar effektivitet och grundkondition.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Def:</strong> Påverkar stabilitet, spill eller orsakar slitage på CPE.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Åtgärd:</strong> Dokumentera. Återställ senast vid nästa planerade stopp.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Beslut:</strong> En Röd Tagg skapas för att informera Core Team.</p>
                <div className="pt-2 mt-2 border-t border-orange-900/30">
                  <p className="text-[9px] text-orange-300/70 font-bold uppercase">CIL-koppling:</p>
                  <p className="text-[9px] text-gray-500 italic">Används för att identifiera glapp innan Centerline-värdet tappas.</p>
                </div>
              </div>
            </div>
            {/* P3 */}
            <div className="bg-blue-950/10 border border-blue-900/20 p-5 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h4 className="text-blue-400 font-black text-xs uppercase tracking-tighter">P3: STANDARD (Processoptimering)</h4>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">Basinställningar som hjälper till att eliminera variation utan direkt risk.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Def:</strong> Parametrar som optimerar processen. Ingen risk för krasch.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Åtgärd:</strong> Justeras tillbaka till standard vid upptäckt.</p>
                <p className="text-[10px] text-gray-400 leading-relaxed"><strong className="text-gray-200">Beslut:</strong> Dokumenteras som rutinmässig justering i skiftrapport.</p>
                <div className="pt-2 mt-2 border-t border-blue-900/30">
                  <p className="text-[9px] text-blue-300/70 font-bold uppercase">CIL-koppling:</p>
                  <p className="text-[9px] text-gray-500 italic">Ingen separat eskalering krävs om standarden kan hållas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: STYRNING (GOVERNANCE) - HORIZONTAL */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-800 pb-4">
            <div className="p-3 bg-cyan-900/30 rounded-xl text-cyan-400">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white uppercase tracking-wide">Styrning (Governance)</h3>
              <p className="text-xs text-gray-500 font-mono">Uppföljning & Styrning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
              <h4 className="text-white font-black text-xs uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                Daglig Styrning
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Team Leader (TL) följer upp antal <strong className="text-red-400">Röda Taggar</strong> (P1) och <strong className="text-orange-400">Gula Taggar</strong> (P2). 
                Status på återställning till standard rapporteras och verifieras.
              </p>
            </div>
            
            <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
              <h4 className="text-white font-black text-xs uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Veckovis Core Team
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                PE och LTL analyserar återkommande avvikelser för att skilja på maskinproblem (LTL) och parameteroptimering (PE). 
                <strong className="text-white uppercase">Line Leader (LL)</strong> beslutar om prioritering av resurser och förbättringsarbete.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;
