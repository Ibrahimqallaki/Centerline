import React from 'react';
import { MachinePoint, Criticality, PointStatus } from '../types';
import { AlertTriangle, Video, AlertOctagon, PenBox, Zap, Tag, CheckCircle2 } from 'lucide-react';

interface PointDetailProps {
  point: MachinePoint;
  onUpdate: (point: MachinePoint) => void;
  onEdit: () => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

const PointDetail: React.FC<PointDetailProps> = ({ point, onUpdate, onEdit, onClose, theme = 'dark' }) => {
  const handleStatusChange = (newStatus: PointStatus) => {
    onUpdate({ ...point, status: newStatus, lastChecked: new Date().toISOString() });
  };

  const isP1 = point.criticality === Criticality.P1;
  const isP2 = point.criticality === Criticality.P2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} w-full max-w-5xl max-h-[95vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-colors duration-300`}>
        
        {/* Header - CLEANED UP */}
        <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
          <div>
            <div className="flex items-center gap-3">
               <span className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} px-2 py-1 rounded text-sm font-mono`}>{point.id}</span>
               <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{point.name}</h2>
            </div>
            <p className="text-gray-400 mt-1">{point.section} &bull; Punkt #{point.number}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <div className={`flex ${theme === 'dark' ? 'bg-gray-950 border-gray-700' : 'bg-gray-100 border-gray-200'} p-1 rounded-xl border`}>
              <button 
                onClick={() => handleStatusChange(PointStatus.OK)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${point.status === PointStatus.OK || !point.status ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <CheckCircle2 size={14} /> OK
              </button>
              <button 
                onClick={() => handleStatusChange(PointStatus.TAGGED_YELLOW)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${point.status === PointStatus.TAGGED_YELLOW ? 'bg-orange-500 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Tag size={14} /> Gul Tagg (P2)
              </button>
              <button 
                onClick={() => handleStatusChange(PointStatus.TAGGED_RED)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${point.status === PointStatus.TAGGED_RED ? 'bg-red-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <AlertTriangle size={14} /> Röd Tagg (P1)
              </button>
            </div>

            <div className="h-8 w-px bg-gray-700 mx-2"></div>

            {isP1 && (
              <span className="px-3 py-1 bg-red-900/50 text-red-200 text-xs font-bold uppercase rounded border border-red-800 flex items-center gap-2">
                <AlertOctagon size={14} />
                P1: Kritisk
              </span>
            )}
            {isP2 && (
              <span className="px-3 py-1 bg-orange-900/50 text-orange-200 text-xs font-bold uppercase rounded border border-orange-800 flex items-center gap-2">
                <Tag size={14} />
                P2: Viktig
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Main Layout: Image & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Visuals - TWO IMAGES */}
            <div className="lg:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Image 1 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">1. Översikt</label>
                  <div className={`relative aspect-[4/3] ${theme === 'dark' ? 'bg-black border-gray-600' : 'bg-gray-200 border-gray-300'} rounded-2xl overflow-hidden border group shadow-xl transition-colors duration-300`}>
                    <img src={point.imagePlaceholder} alt="Overview" className="w-full h-full object-cover" />
                  </div>
                </div>

                {/* Image 2 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2. Detalj / Inställning</label>
                  <div className={`relative aspect-[4/3] ${theme === 'dark' ? 'bg-black border-gray-600' : 'bg-gray-200 border-gray-300'} rounded-2xl overflow-hidden border group shadow-xl transition-colors duration-300`}>
                    {point.imagePlaceholder2 ? (
                      <img src={point.imagePlaceholder2} alt="Detail" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-gray-700' : 'bg-gray-100 text-gray-400'} italic text-sm`}>Ingen detaljbild</div>
                    )}
                  </div>
                </div>
              </div>

              <button className={`w-full py-4 ${theme === 'dark' ? 'bg-gray-900/50 hover:bg-gray-700 border-gray-700' : 'bg-gray-100 hover:bg-gray-200 border-gray-200'} rounded-xl flex items-center justify-center gap-3 transition-all border group`}>
                <Video size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className={`font-bold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Spela upp instruktionsfilm (Kommer snart)</span>
              </button>
            </div>

            {/* Data & Risk - REARRANGED */}
            <div className="lg:col-span-4 space-y-6">
              <div className={`${theme === 'dark' ? 'bg-gray-900/80 border-gray-700' : 'bg-gray-50 border-gray-200'} p-6 rounded-2xl border shadow-inner`}>
                <div className="space-y-6">
                  <div>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Målvärde (Centerline)</span>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-black ${theme === 'dark' ? 'text-green-400' : 'text-green-600'} font-mono tracking-tighter`}>{point.targetValue}</span>
                      <span className="text-gray-600 font-bold italic text-sm">Target</span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 gap-6 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <div>
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-1">Tolerans</span>
                      <span className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{point.tolerance || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-1">Mätmetod</span>
                      <span className={`font-bold text-lg ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>{point.measureMethod}</span>
                    </div>
                  </div>

                  {point.phaseAngle !== undefined && (
                    <div className="pt-6 border-t border-gray-800">
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-1">Fasningsvinkel</span>
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full" style={{ width: `${(point.phaseAngle / 360) * 100}%` }}></div>
                        </div>
                        <span className="text-cyan-400 font-mono font-black text-xl">{point.phaseAngle}°</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {isP1 && (
                <div className="bg-red-950/30 border border-red-500/30 p-5 rounded-2xl flex items-start gap-4 shadow-lg shadow-red-900/10">
                  <AlertOctagon className="text-red-500 shrink-0 mt-1" size={28} />
                  <div>
                    <h4 className="font-black text-red-400 uppercase text-xs tracking-widest mb-1">Hög Risk / Kraschvarning</h4>
                    <p className="text-red-200/70 text-sm leading-relaxed">
                      Felaktig inställning här kan leda till allvarlig maskinskada i formverktyget. 
                      Säkerställ att maskinen är i nödstopp innan justering.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Support Placeholder */}
          <div className="pt-8 border-t border-gray-700">
            <div className="bg-gray-900/40 border border-dashed border-gray-700 rounded-2xl p-8 text-center">
              <div className="flex flex-col items-center gap-3 text-gray-500">
                <Zap size={32} className="opacity-20" />
                <p className="font-bold italic">AI-stöd kan läggas till om så önskas</p>
                <p className="text-xs max-w-md mx-auto opacity-60">
                  Systemet är förberett för integration med Gemini AI för att generera situationsanpassade instruktioner och felsökningsstöd.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - ACTIONS MOVED HERE */}
        <div className="p-4 border-t border-gray-700 bg-gray-900 flex justify-between items-center gap-4">
          <button 
             onClick={onEdit} 
             className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 rounded-lg transition-colors font-medium text-sm group"
             title="Redigera värden"
          >
             <PenBox size={18} className="text-gray-400 group-hover:text-white" />
             Redigera Punkt
          </button>

          <button 
            onClick={onClose} 
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/50"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointDetail;