import React, { useState, useRef } from 'react';
import { MachinePoint, Criticality } from '../types';
import { AlertTriangle, CheckCircle, Video, BookOpen, AlertOctagon, Edit2, Upload, Save, Link, PenBox, Zap } from 'lucide-react';

interface PointDetailProps {
  point: MachinePoint;
  onUpdate: (point: MachinePoint) => void;
  onEdit: () => void;
  onClose: () => void;
}

const PointDetail: React.FC<PointDetailProps> = ({ point, onUpdate, onEdit, onClose }) => {
  // Image Editing State
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(point.imagePlaceholder);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveImage = () => {
    onUpdate({
      ...point,
      imagePlaceholder: imageUrlInput
    });
    setIsEditingImage(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isCritical = point.criticality === Criticality.CRITICAL || point.criticality === Criticality.HIGH;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-600 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header - CLEANED UP */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900">
          <div>
            <div className="flex items-center gap-3">
               <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm font-mono">{point.id}</span>
               <h2 className="text-2xl font-bold text-white">{point.name}</h2>
            </div>
            <p className="text-gray-400 mt-1">{point.zone} &bull; Punkt #{point.number}</p>
          </div>
          {/* Status indicator instead of buttons */}
          <div className="flex items-center gap-2">
            {isCritical && (
              <span className="px-3 py-1 bg-red-900/50 text-red-200 text-xs font-bold uppercase rounded border border-red-800 flex items-center gap-2">
                <AlertOctagon size={14} />
                Kritisk Punkt
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Main Layout: Image & Data */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            
            {/* Visuals - ENLARGED */}
            <div className="lg:col-span-3 space-y-4">
              <div className="relative aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-gray-600 group shadow-2xl">
                <img src={isEditingImage ? imageUrlInput : point.imagePlaceholder} alt={point.name} className="w-full h-full object-cover transition-opacity" />
                
                {!isEditingImage && (
                  <button 
                    onClick={() => { setIsEditingImage(true); setImageUrlInput(point.imagePlaceholder); }}
                    className="absolute top-4 right-4 p-3 bg-black/60 hover:bg-blue-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
                    title="Byt bild"
                  >
                    <Edit2 size={20} />
                  </button>
                )}
              </div>

              {/* Edit Mode Interface */}
              {isEditingImage ? (
                <div className="bg-gray-700/50 p-4 rounded-xl space-y-3 border border-gray-600">
                  <h4 className="font-bold text-gray-300 text-sm">Byt Referensbild</h4>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                       <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                       <input 
                        type="text" 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Klistra in bild-URL..." 
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 pl-8 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white" title="Ladda upp">
                      <Upload size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingImage(false)} className="px-3 py-1 text-sm text-gray-400 hover:text-white">Avbryt</button>
                    <button onClick={handleSaveImage} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white text-sm font-bold">
                      <Save size={14} /> Spara
                    </button>
                  </div>
                </div>
              ) : (
                <button className="w-full py-4 bg-gray-900/50 hover:bg-gray-700 rounded-xl flex items-center justify-center gap-3 transition-all border border-gray-700 group">
                  <Video size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-gray-300">Spela upp instruktionsfilm (Kommer snart)</span>
                </button>
              )}
            </div>

            {/* Data & Risk - REARRANGED */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900/80 p-6 rounded-2xl border border-gray-700 shadow-inner">
                <div className="space-y-6">
                  <div>
                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Målvärde (Centerline)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-green-400 font-mono tracking-tighter">{point.targetValue}</span>
                      <span className="text-gray-600 font-bold italic text-sm">Target</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-800">
                    <div>
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-1">Tolerans</span>
                      <span className="text-gray-200 font-bold text-lg">{point.tolerance || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-1">Mätmetod</span>
                      <span className="text-gray-200 font-bold text-lg">{point.measureMethod}</span>
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

              {isCritical && (
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