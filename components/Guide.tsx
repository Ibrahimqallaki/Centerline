
import React from 'react';
import { BookOpen, Target, AlertTriangle, Users, GitCommit, ShieldCheck, Zap, Activity, AlertOctagon, PenBox } from 'lucide-react';

interface GuideProps {
  theme?: 'light' | 'dark';
}

const Guide: React.FC<GuideProps> = ({ theme = 'dark' }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Intro Header - Standardiserat Arbetssätt */}
      <div className="relative overflow-hidden p-8 rounded-[2.5rem] border transition-all duration-500
        bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-md
        dark:bg-gradient-to-br dark:from-blue-950 dark:to-black dark:border-blue-900/50 dark:shadow-2xl">
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-[0.25em]">
              Centerline Excellence (CLX)
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase italic tracking-tighter mb-6 leading-none">
            Standardiserat <br />
            <span className="text-blue-600 dark:text-blue-500">Arbetssätt</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <p className="text-gray-700 dark:text-blue-100/90 text-lg leading-relaxed font-medium">
              Syftet med CLX är att eliminera variation genom att säkerställa att maskinen alltid körs enligt 
              fastställda <strong className="text-gray-900 dark:text-white underline decoration-blue-500 decoration-2 underline-offset-4">Golden Run-inställningar</strong>. 
              Vi går från reaktivt agerande <span className="italic opacity-70">("jag tror")</span> till faktabaserad styrning <span className="italic text-blue-600 dark:text-blue-400 font-bold">("jag vet")</span>.
            </p>
            
            <div className="hidden lg:block bg-blue-600/5 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 p-6 rounded-2xl backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Target className="text-blue-600 dark:text-blue-400 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase mb-1">Målbild</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    100% efterlevnad av Centerline-standarder för att garantera noll haverier och maximal OEE (maskineffektivitet).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background element */}
        <BookOpen className="absolute right-[-40px] bottom-[-60px] text-blue-600/5 dark:text-blue-500/10 w-80 h-80 -rotate-12 pointer-events-none" />
      </div>

      {/* CARD: KULTUR & STRATEGI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-xl hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide italic">Kultur: Reaktiv vs Proaktiv</h3>
            <p className="text-xs text-gray-500 font-mono">Process Control Strategy</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          <div className="md:col-span-5 bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-200 dark:border-red-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
            <h4 className="text-red-700 dark:text-red-400 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Reaktiv (Gamla sättet)
            </h4>
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic mb-2">
              "Jag tror jag vet felet, ge mig 10 minuter."
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              Baserat på känsla och erfarenhet. Problem löses tillfälligt utan spårbarhet.
            </p>
          </div>

          <div className="md:col-span-1 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700">
              <Activity size={20} />
            </div>
          </div>

          <div className="md:col-span-5 bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={40} className="text-green-500" />
            </div>
            <h4 className="text-green-700 dark:text-green-400 font-black text-xs uppercase mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Proaktiv (Centerline)
            </h4>
            <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed italic mb-2">
              "Limmängden är låg men inom tolerans. Vi agerar nu för att undvika stopp."
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
              Baserat på data, standarder och förutsägbarhet.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-50 dark:bg-gray-950 p-5 rounded-2xl text-sm text-gray-600 dark:text-gray-400 italic border-l-4 border-purple-500 shadow-inner">
          "Målet är att minska variabiliteten i både <span className="text-gray-900 dark:text-white font-bold">INPUT</span> (Material, Metod) och <span className="text-gray-900 dark:text-white font-bold">PROCESSEN</span> för att garantera <span className="text-gray-900 dark:text-white font-bold">OUTPUT</span>."
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CARD 1: DEFINITIONER */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
              <GitCommit size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Definitioner</h3>
              <p className="text-xs text-gray-500 font-mono">CL vs CPE & Kategorier</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { type: 'CL', label: 'Centerline', desc: 'Justerbara processparametrar som övervakas mot standard (Tryck, temp, hastighet).', color: 'text-blue-600 dark:text-blue-300' },
                { type: 'CPE', label: 'Critical Physical Element', desc: 'Fysiska referenspunkter i utrustningen (Knivavstånd, givarpositioner).', color: 'text-orange-600 dark:text-orange-300' },
                { type: 'Static', label: 'Static CL', desc: 'Inställningar som görs vid stillastående eller omställning (Mekaniska stopp).', color: 'text-gray-600 dark:text-gray-300' },
                { type: 'Dynamic', label: 'Dynamic CL', desc: 'Parametrar som kontrolleras och följs upp under drift (Flöden, PLC-värden).', color: 'text-cyan-600 dark:text-cyan-300' },
                { type: 'Setpoint', label: 'Setpoint (Program)', desc: 'Receptstyrda värden i HMI/PLC. Skall alltid vara uppdaterade och synkade med fysisk miljö.', color: 'text-purple-600 dark:text-purple-300' },
                { type: 'Condition', label: 'Condition (Skick)', desc: 'Säkerställs under Service Window. CIL-rutiner initierar aktiviteter till renoveringar.', color: 'text-green-600 dark:text-green-300' }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-3 h-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02]">
                  <div className={`text-[10px] font-black px-2 py-1 rounded bg-white dark:bg-black/40 shadow-sm ${item.color} w-fit text-center shrink-0 tracking-widest uppercase`}>{item.type}</div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white mb-1">{item.label}</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: ROLLER & ANSVAR (RACI) - HORIZONTAL */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Roller & Ansvar (RACI)</h3>
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
              <div key={i} className="group flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-200 dark:border-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <div className="p-2 bg-gray-200 dark:bg-gray-900 rounded-lg text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors w-fit">
                  <item.icon size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-2 tracking-wider">{item.role}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 3: ARBETSCYKELN (4 STEG) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Tagg-Systemet (Arbetscykeln)</h3>
              <p className="text-xs text-gray-500 font-mono">Process vid avvikelse från standard</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>
            
            {[
              { num: 1, title: 'Identifiera', desc: 'Dokumentera VAD som ändrades och till vilket värde.', color: 'bg-blue-600', sub: 'Operatör', subColor: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30' },
              { num: 2, title: 'Varför', desc: 'Dokumentera orsaken (t.ex. förändrat råmaterial eller mekaniskt slitage).', color: 'bg-amber-600', sub: 'Operatör / LTL', subColor: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30' },
              { num: 3, title: 'Tagga', desc: 'Ansvarar för att visualisera taggen för LTL och PE för att säkerställa eskalering.', color: 'bg-red-600', sub: 'Team Leader', subColor: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' },
              { num: 4, title: 'Standardisering', desc: 'Analysera om standarden behöver uppdateras permanent eller om maskinen kräver underhåll.', color: 'bg-green-600', sub: 'PE / LTL', subColor: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30' }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-800/20 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-lg font-black text-white shadow-lg ring-4 ring-white dark:ring-gray-900`}>{step.num}</div>
                <div>
                  <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase mb-2 tracking-wider">{step.title}</h4>
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed px-1 font-medium">
                    {step.desc}
                  </p>
                </div>
                <div className={`text-[9px] ${step.subColor} font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-sm`}>{step.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CARD 4: KRITIKALITET & AVVIKELSER */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Kritikalitet & Avvikelser</h3>
              <p className="text-xs text-gray-500 font-mono">Hantering av "Out of Standard"</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* P1 */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-6 rounded-2xl space-y-4 relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-red-500/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
                <h4 className="text-red-700 dark:text-red-400 font-black text-sm uppercase tracking-tighter">P1: KRITISK</h4>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-red-800/70 dark:text-red-200/60 leading-relaxed italic font-medium">Haveri- & Kvalitetsrisk. Fokus på krascher i 360°-cykeln.</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-red-700 dark:text-red-400 uppercase text-[10px]">Def:</strong> Fel leder garanterat till stopp eller krasch.</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-red-700 dark:text-red-400 uppercase text-[10px]">Åtgärd:</strong> Maskinen <span className="text-red-600 dark:text-red-400 font-bold underline decoration-2 underline-offset-2">SKALL stoppas omedelbart</span>.</p>
                </div>
                <div className="pt-3 mt-3 border-t border-red-200 dark:border-red-800/30">
                  <p className="text-[10px] text-red-700 dark:text-red-400 font-black uppercase mb-1">CIL-koppling:</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">Alltid CIL-säkrade för att garantera inställningen.</p>
                </div>
              </div>
            </div>
            {/* P2 */}
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 p-6 rounded-2xl space-y-4 transition-all hover:shadow-lg hover:shadow-orange-500/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                <h4 className="text-orange-700 dark:text-orange-400 font-black text-sm uppercase tracking-tighter">P2: VIKTIG</h4>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-orange-800/70 dark:text-orange-200/60 leading-relaxed italic font-medium">Produktivitet & Slitage. Påverkar grundkondition.</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-orange-700 dark:text-orange-400 uppercase text-[10px]">Def:</strong> Påverkar stabilitet, spill eller orsakar slitage.</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-orange-700 dark:text-orange-400 uppercase text-[10px]">Åtgärd:</strong> Återställ senast vid nästa planerade stopp.</p>
                </div>
                <div className="pt-3 mt-3 border-t border-orange-200 dark:border-orange-800/30">
                  <p className="text-[10px] text-orange-700 dark:text-orange-400 font-black uppercase mb-1">CIL-koppling:</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">Identifiera glapp innan Centerline-värdet tappas.</p>
                </div>
              </div>
            </div>
            {/* P3 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 p-6 rounded-2xl space-y-4 transition-all hover:shadow-lg hover:shadow-blue-500/5">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <h4 className="text-blue-700 dark:text-blue-400 font-black text-sm uppercase tracking-tighter">P3: STANDARD</h4>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-blue-800/70 dark:text-blue-200/60 leading-relaxed italic font-medium">Processoptimering. Eliminera variation.</p>
                <div className="space-y-2">
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-blue-700 dark:text-blue-400 uppercase text-[10px]">Def:</strong> Parametrar som optimerar processen.</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed"><strong className="text-blue-700 dark:text-blue-400 uppercase text-[10px]">Åtgärd:</strong> Justeras tillbaka till standard vid upptäckt.</p>
                </div>
                <div className="pt-3 mt-3 border-t border-blue-200 dark:border-blue-800/30">
                  <p className="text-[10px] text-blue-700 dark:text-blue-400 font-black uppercase mb-1">CIL-koppling:</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">Ingen separat eskalering krävs vid efterlevnad.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 5: STYRNING (GOVERNANCE) - HORIZONTAL */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl shadow-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors md:col-span-2">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wide">Styrning (Governance)</h3>
              <p className="text-xs text-gray-500 font-mono">Uppföljning & Styrning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"></span>
                Daglig Styrning
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                Team Leader (TL) följer upp antal <strong className="text-red-600 dark:text-red-400">Röda Taggar</strong> (P1) och <strong className="text-orange-600 dark:text-orange-400">Gula Taggar</strong> (P2). 
                Status på återställning till standard rapporteras och verifieras dagligen.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-200 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <h4 className="text-gray-900 dark:text-white font-black text-xs uppercase mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></span>
                Veckovis Core Team
              </h4>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                PE och LTL analyserar återkommande avvikelser för att skilja på maskinproblem (LTL) och parameteroptimering (PE). 
                <strong className="text-gray-900 dark:text-white uppercase font-black">Line Leader (LL)</strong> beslutar om prioritering av resurser.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Guide;
