
import React, { useState } from 'react';
import { MachinePoint, Criticality, MachineModule } from '../types';
import { X, Save, MapPin, Eye, EyeOff, MousePointer2, Upload } from 'lucide-react';
import MachineMap from './MachineMap';

interface AddPointFormProps {
  existingPoints: MachinePoint[];
  initialData?: MachinePoint;
  layout?: MachineModule[];
  onSave: (point: MachinePoint) => void;
  onCancel: () => void;
  theme?: 'dark' | 'light';
}

const AddPointForm: React.FC<AddPointFormProps> = ({ existingPoints, initialData, layout, onSave, onCancel, theme = 'dark' }) => {
  const isEditing = !!initialData;
  const nextNumber = existingPoints.length > 0 ? Math.max(...existingPoints.map(p => p.number)) + 1 : 1;

  const [formData, setFormData] = useState<Partial<MachinePoint>>({
    number: initialData?.number ?? nextNumber,
    id: initialData?.id ?? `P-${nextNumber < 10 ? '0' + nextNumber : nextNumber}`,
    name: initialData?.name ?? '',
    section: initialData?.section ?? (layout && layout.length > 0 ? layout[0].label : ''),
    description: initialData?.description ?? '',
    targetValue: initialData?.targetValue ?? '',
    tolerance: initialData?.tolerance ?? '',
    measureMethod: initialData?.measureMethod ?? '',
    criticality: initialData?.criticality ?? Criticality.P2,
    imagePlaceholder: initialData?.imagePlaceholder ?? 'https://picsum.photos/400/300?grayscale',
    imagePlaceholder2: initialData?.imagePlaceholder2 ?? '',
    coordinates: initialData?.coordinates ?? { x: 50, y: 50 },
    visibleOnMap: initialData?.visibleOnMap ?? true,
    phaseAngle: initialData?.phaseAngle
  });

  const [phaseAngleStr, setPhaseAngleStr] = useState<string>(initialData?.phaseAngle?.toString() ?? '');

  const handleChange = (field: keyof MachinePoint, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: 'imagePlaceholder' | 'imagePlaceholder2', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoordinateChange = (x: number, y: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: { x, y }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetValue || !formData.measureMethod) {
      alert("Vänligen fyll i alla obligatoriska fält (Namn, Målvärde, Mätmetod)");
      return;
    }
    const finalPoint: MachinePoint = { ...formData as MachinePoint, phaseAngle: phaseAngleStr ? parseFloat(phaseAngleStr) : undefined };
    onSave(finalPoint);
  };

  const previewPoint = { ...formData as MachinePoint, id: isEditing ? formData.id! : 'PREVIEW' };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'} w-full max-w-4xl max-h-[90vh] rounded-2xl border shadow-2xl flex flex-col transition-colors duration-300`}>
        
        <div className={`flex justify-between items-center p-6 border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'} rounded-t-2xl`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-2`}>
            {isEditing ? 'Redigera punkt' : 'Lägg till ny kontrollpunkt'}
            <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-400 bg-gray-800 border-gray-700' : 'text-gray-500 bg-gray-100 border-gray-200'} px-2 py-1 rounded border`}>#{formData.number}</span>
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2">Grundinformation</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Nummer</label>
                    <input type="number" value={formData.number} onChange={(e) => handleChange('number', parseInt(e.target.value))} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">ID</label>
                    <input type="text" value={formData.id} onChange={(e) => handleChange('id', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white font-mono" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Benämning *</label>
                  <input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" required />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Sektion (Maskindel)</label>
                   <select value={formData.section} onChange={(e) => handleChange('section', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white">
                     <option value="">Välj sektion...</option>
                     {layout?.map(m => <option key={m.id} value={m.label}>{m.label}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-green-400 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2">Värden</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Målvärde *</label>
                    <input type="text" value={formData.targetValue} onChange={(e) => handleChange('targetValue', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-green-400 font-bold" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Tolerans</label>
                    <input type="text" value={formData.tolerance} onChange={(e) => handleChange('tolerance', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Mätmetod *</label>
                  <input type="text" value={formData.measureMethod} onChange={(e) => handleChange('measureMethod', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" required />
                </div>
                 <div>
                   <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase">Kritikalitet</label>
                   <select value={formData.criticality} onChange={(e) => handleChange('criticality', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white">
                     {Object.values(Criticality).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] font-black text-cyan-400 mb-1 uppercase">Fasningsvinkel (0-360°)</label>
                   <div className="flex items-center gap-2">
                     <input 
                       type="number" 
                       min="0" 
                       max="360" 
                       value={phaseAngleStr} 
                       onChange={(e) => setPhaseAngleStr(e.target.value)} 
                       placeholder="t.ex. 180"
                       className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-cyan-400 font-mono" 
                     />
                     <span className="text-gray-500 font-bold">°</span>
                   </div>
                   <p className="text-[9px] text-gray-600 mt-1 italic">Lämna tomt om punkten inte är synk-beroende.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
              <h3 className="text-pink-400 font-bold uppercase text-xs tracking-widest border-b border-gray-700 pb-2">Bilder & Referenser</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase">Referensbild 1 (Översikt)</label>
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative group">
                    <img src={formData.imagePlaceholder} className="w-full h-full object-cover" alt="Preview 1" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => document.getElementById('file-upload-1')?.click()} className="p-2 bg-blue-600 rounded-lg text-white"><Upload size={18} /></button>
                    </div>
                    <input id="file-upload-1" type="file" className="hidden" onChange={(e) => handleFileUpload('imagePlaceholder', e)} accept="image/*" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.imagePlaceholder} 
                    onChange={(e) => handleChange('imagePlaceholder', e.target.value)}
                    placeholder="Bild-URL 1..." 
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-white" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 uppercase">Referensbild 2 (Detalj/Inställning)</label>
                  <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-700 relative group">
                    {formData.imagePlaceholder2 ? (
                      <img src={formData.imagePlaceholder2} className="w-full h-full object-cover" alt="Preview 2" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700 italic text-xs">Ingen bild vald</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => document.getElementById('file-upload-2')?.click()} className="p-2 bg-blue-600 rounded-lg text-white"><Upload size={18} /></button>
                    </div>
                    <input id="file-upload-2" type="file" className="hidden" onChange={(e) => handleFileUpload('imagePlaceholder2', e)} accept="image/*" />
                  </div>
                  <input 
                    type="text" 
                    value={formData.imagePlaceholder2 || ''} 
                    onChange={(e) => handleChange('imagePlaceholder2', e.target.value)}
                    placeholder="Bild-URL 2..." 
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-xs text-white" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-700">
               <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-bold uppercase text-xs tracking-widest">Positionering</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black">
                    <MousePointer2 size={12} className="text-blue-500" /> Klicka på kartan för att placera
                  </div>
               </div>

               {formData.visibleOnMap && (
                 <div className="bg-gray-900 p-2 rounded-xl border border-gray-700 overflow-hidden">
                    <MachineMap 
                      points={existingPoints} 
                      layout={layout}
                      previewPoint={previewPoint} 
                      onMapClick={handleCoordinateChange}
                    />
                 </div>
               )}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button type="button" onClick={onCancel} className="px-6 py-3 text-gray-400 hover:text-white font-bold">Avbryt</button>
              <button type="submit" className="px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-green-900/40">
                <Save size={20} /> {isEditing ? 'Uppdatera' : 'Spara'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPointForm;
