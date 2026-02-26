import React, { useState, useRef } from 'react';
import { MachinePoint, Criticality, PointStatus } from '../types';
import { AlertTriangle, CheckCircle, Video, BookOpen, AlertOctagon, Edit2, Upload, Save, Link, PenBox, Zap, Image as ImageIcon, Tag, CheckCircle2 } from 'lucide-react';

interface PointDetailProps {
  point: MachinePoint;
  onUpdate: (point: MachinePoint) => void;
  onEdit: () => void;
  onClose: () => void;
}

const PointDetail: React.FC<PointDetailProps> = ({ point, onUpdate, onEdit, onClose }) => {
  // Image Editing State
  const [isEditingImage, setIsEditingImage] = useState<'img1' | 'img2' | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveImage = () => {
    if (isEditingImage === 'img1') {
      onUpdate({ ...point, imagePlaceholder: imageUrlInput });
    } else if (isEditingImage === 'img2') {
      onUpdate({ ...point, imagePlaceholder2: imageUrlInput });
    }
    setIsEditingImage(null);
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

  const handleStatusChange = (newStatus: PointStatus) => {
    onUpdate({ ...point, status: newStatus, lastChecked: new Date().toISOString() });
  };

  const isP1 = point.criticality === Criticality.P1;
  const isP2 = point.criticality === Criticality.P2;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:hidden">
      <div className="bg-gray-800 w-full max-w-5xl max-h-[95vh] rounded-2xl border border-gray-600 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header - CLEANED UP */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900">
          <div>
            <div className="flex items-center gap-3">
               <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-sm font-mono">{point.id}</span>
               <h2 className="text-2xl font-bold text-white">{point.name}</h2>
            </div>
            <p className="text-gray-400 mt-1">{point.zone} &bull; Punkt #{point.number}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Selector */}
            <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-700">
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
                  <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-gray-600 group shadow-xl">
                    <img src={isEditingImage === 'img1' ? imageUrlInput : point.imagePlaceholder} alt="Overview" className="w-full h-full object-cover" />
                    {!isEditingImage && (
                      <button 
                        onClick={() => { setIsEditingImage('img1'); setImageUrlInput(point.imagePlaceholder); }}
                        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Image 2 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2. Detalj / Inställning</label>
                  <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden border border-gray-600 group shadow-xl">
                    {point.imagePlaceholder2 || isEditingImage === 'img2' ? (
                      <img src={isEditingImage === 'img2' ? imageUrlInput : point.imagePlaceholder2} alt="Detail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-700 italic text-sm">Ingen detaljbild</div>
                    )}
                    {!isEditingImage && (
                      <button 
                        onClick={() => { setIsEditingImage('img2'); setImageUrlInput(point.imagePlaceholder2 || ''); }}
                        className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Mode Interface */}
              {isEditingImage && (
                <div className="bg-blue-900/20 p-4 rounded-xl space-y-3 border border-blue-500/30 animate-in slide-in-from-top duration-200">
                  <h4 className="font-bold text-blue-300 text-sm flex items-center gap-2">
                    <ImageIcon size={16} /> Byt {isEditingImage === 'img1' ? 'Översiktsbild' : 'Detaljbild'}
                  </h4>
                  
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
                    <button onClick={() => setIsEditingImage(null)} className="px-3 py-1 text-sm text-gray-400 hover:text-white">Avbryt</button>
                    <button onClick={handleSaveImage} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-sm font-bold">
                      <Save size={14} /> Spara ändring
                    </button>
                  </div>
                </div>
              )}

              <button className="w-full py-4 bg-gray-900/50 hover:bg-gray-700 rounded-xl flex items-center justify-center gap-3 transition-all border border-gray-700 group">
                <Video size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-gray-300">Spela upp instruktionsfilm (Kommer snart)</span>
              </button>
            </div>

            {/* Data & Risk - REARRANGED */}
            <div className="lg:col-span-4 space-y-6">
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