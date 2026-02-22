import React, { useState, useRef } from 'react';
import { MachinePoint, Criticality } from '../types';
import { generateSOPContent } from '../services/geminiService';
import { AlertTriangle, CheckCircle, RefreshCw, Video, BookOpen, AlertOctagon, Edit2, Upload, Save, Link, PenBox } from 'lucide-react';

interface PointDetailProps {
  point: MachinePoint;
  onUpdate: (point: MachinePoint) => void;
  onEdit: () => void;
  onClose: () => void;
}

const PointDetail: React.FC<PointDetailProps> = ({ point, onUpdate, onEdit, onClose }) => {
  const [sopText, setSopText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  // Image Editing State
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState(point.imagePlaceholder);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateSOP = async () => {
    setLoading(true);
    const text = await generateSOPContent(point);
    setSopText(text);
    setLoading(false);
  };

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
          
          {/* Top Grid: Values & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Visuals */}
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-gray-600 group">
                <img src={isEditingImage ? imageUrlInput : point.imagePlaceholder} alt={point.name} className="w-full h-full object-cover transition-opacity" />
                
                {!isEditingImage && (
                  <button 
                    onClick={() => { setIsEditingImage(true); setImageUrlInput(point.imagePlaceholder); }}
                    className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Byt bild"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              {/* Edit Mode Interface */}
              {isEditingImage ? (
                <div className="bg-gray-700/50 p-4 rounded-lg space-y-3 border border-gray-600">
                  <h4 className="font-bold text-gray-300 text-sm">Byt Referensbild</h4>
                  
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                       <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                       <input 
                        type="text" 
                        value={imageUrlInput} 
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Klistra in bild-URL..." 
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 pl-8 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white" title="Ladda upp">
                      <Upload size={18} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingImage(false)} className="px-3 py-1 text-sm text-gray-400 hover:text-white">Avbryt</button>
                    <button onClick={handleSaveImage} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white text-sm font-bold">
                      <Save size={14} /> Spara
                    </button>
                  </div>
                </div>
              ) : (
                <button className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2 transition-colors border border-gray-600">
                  <Video size={20} />
                  <span>Spela upp instruktionsfilm (10s)</span>
                </button>
              )}
            </div>

            {/* Data & Risk */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                <div className="flex justify-between items-end mb-4">
                   <span className="text-gray-400 text-sm uppercase tracking-wider">Målvärde (Centerline)</span>
                   <span className="text-3xl font-bold text-green-400 font-mono">{point.targetValue}</span>
                </div>
                <div className="w-full h-px bg-gray-700 mb-4"></div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                     <span className="text-gray-500 block">Tolerans</span>
                     <span className="text-gray-200">{point.tolerance}</span>
                   </div>
                   <div>
                     <span className="text-gray-500 block">Mätmetod</span>
                     <span className="text-gray-200">{point.measureMethod}</span>
                   </div>
                   {point.phaseAngle !== undefined && (
                     <div className="col-span-2 mt-2 pt-2 border-t border-gray-800 flex justify-between items-center">
                       <span className="text-gray-500">Fasningsvinkel</span>
                       <span className="text-cyan-400 font-mono font-bold">{point.phaseAngle}°</span>
                     </div>
                   )}
                </div>
              </div>

              {isCritical && (
                <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-xl flex items-start gap-4">
                  <AlertOctagon className="text-red-500 shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="font-bold text-red-400">Hög Risk / Kraschvarning</h4>
                    <p className="text-red-200/80 text-sm mt-1">
                      Felaktig inställning här kan leda till allvarlig maskinskada i formverktyget. 
                      Säkerställ att maskinen är i nödstopp innan justering.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI SOP Section */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold flex items-center gap-2">
                 <CheckCircle className="text-blue-500" />
                 AI Operatörsstöd (SOP)
               </h3>
               {!sopText && (
                 <button 
                  onClick={handleGenerateSOP}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
                 >
                   {loading ? <RefreshCw className="animate-spin" /> : <BookOpen size={18} />}
                   {loading ? "Genererar..." : "Generera Instruktion"}
                 </button>
               )}
            </div>

            {sopText ? (
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 prose prose-invert max-w-none">
                 <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed">{sopText}</pre>
                 <button 
                  onClick={() => setSopText('')}
                  className="mt-4 text-sm text-blue-400 hover:underline"
                 >
                   Regenerera
                 </button>
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-xl p-8 text-center text-gray-500">
                <p>Klicka på knappen ovan för att generera en situationsanpassad checklista för denna punkt.</p>
              </div>
            )}
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