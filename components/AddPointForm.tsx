import React, { useState, useEffect } from 'react';
import { MachinePoint, Zone, Criticality } from '../types';
import { X, Save, MapPin, Eye, EyeOff } from 'lucide-react';
import MachineMap from './MachineMap';

interface AddPointFormProps {
  existingPoints: MachinePoint[];
  initialData?: MachinePoint; // Optional: If provided, we are in Edit mode
  onSave: (point: MachinePoint) => void;
  onCancel: () => void;
}

const AddPointForm: React.FC<AddPointFormProps> = ({ existingPoints, initialData, onSave, onCancel }) => {
  const isEditing = !!initialData;

  // Suggest next number (only if adding new)
  const nextNumber = existingPoints.length > 0 
    ? Math.max(...existingPoints.map(p => p.number)) + 1 
    : 1;

  // Initial State
  const [formData, setFormData] = useState<Partial<MachinePoint>>({
    number: initialData?.number ?? nextNumber,
    id: initialData?.id ?? `P-${nextNumber < 10 ? '0' + nextNumber : nextNumber}`,
    name: initialData?.name ?? '',
    zone: initialData?.zone ?? Zone.INFEED,
    description: initialData?.description ?? '',
    targetValue: initialData?.targetValue ?? '',
    tolerance: initialData?.tolerance ?? '',
    measureMethod: initialData?.measureMethod ?? '',
    criticality: initialData?.criticality ?? Criticality.MEDIUM,
    imagePlaceholder: initialData?.imagePlaceholder ?? 'https://picsum.photos/400/300?grayscale',
    coordinates: initialData?.coordinates ?? { x: 50, y: 50 },
    visibleOnMap: initialData?.visibleOnMap ?? true,
    phaseAngle: initialData?.phaseAngle
  });

  const [phaseAngleStr, setPhaseAngleStr] = useState<string>(initialData?.phaseAngle?.toString() ?? '');

  // Handle Input Changes
  const handleChange = (field: keyof MachinePoint, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoordinateChange = (axis: 'x' | 'y', value: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates!,
        [axis]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.targetValue || !formData.measureMethod) {
      alert("Vänligen fyll i alla obligatoriska fält (Namn, Målvärde, Mätmetod)");
      return;
    }

    const finalPoint: MachinePoint = {
      ...formData as MachinePoint,
      phaseAngle: phaseAngleStr ? parseFloat(phaseAngleStr) : undefined
    };

    onSave(finalPoint);
  };

  // Preview Point for map
  const previewPoint = {
    ...formData as MachinePoint,
    id: isEditing ? formData.id! : 'PREVIEW',
    criticality: formData.criticality || Criticality.MEDIUM
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-600 shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-900 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            {isEditing ? 'Redigera punkt' : 'Lägg till ny kontrollpunkt'}
            <span className="text-sm font-normal text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
              Punkt #{formData.number}
            </span>
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white transition-colors">
            <X size={32} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-blue-400 font-bold uppercase text-sm tracking-wider border-b border-gray-700 pb-2">Grundinformation</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Nummer</label>
                    <input 
                      type="number" 
                      value={formData.number} 
                      onChange={(e) => handleChange('number', parseInt(e.target.value))}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">ID (Unikt)</label>
                    <input 
                      type="text" 
                      value={formData.id} 
                      onChange={(e) => handleChange('id', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Benämning *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="T.ex. Inmatning Kedjespännare"
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Zon</label>
                   <select 
                    value={formData.zone}
                    onChange={(e) => handleChange('zone', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                   >
                     {Object.values(Zone).map(z => <option key={z} value={z}>{z}</option>)}
                   </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-green-400 font-bold uppercase text-sm tracking-wider border-b border-gray-700 pb-2">Värden & Toleranser</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Målvärde (Centerline) *</label>
                    <input 
                      type="text" 
                      value={formData.targetValue} 
                      onChange={(e) => handleChange('targetValue', e.target.value)}
                      placeholder="T.ex. 150mm"
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-green-400 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Tolerans</label>
                    <input 
                      type="text" 
                      value={formData.tolerance} 
                      onChange={(e) => handleChange('tolerance', e.target.value)}
                      placeholder="T.ex. +/- 2mm"
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Mätmetod *</label>
                  <input 
                    type="text" 
                    value={formData.measureMethod} 
                    onChange={(e) => handleChange('measureMethod', e.target.value)}
                    placeholder="T.ex. Tumstock, Siko, Ögonmått"
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                    required
                  />
                </div>

                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Kritikalitet</label>
                   <select 
                    value={formData.criticality}
                    onChange={(e) => handleChange('criticality', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                   >
                     {Object.values(Criticality).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
              </div>
            </div>

            {/* 2. Visual Positioning */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
               <div className="flex justify-between items-center">
                  <h3 className="text-purple-400 font-bold uppercase text-sm tracking-wider">Positionering</h3>
                  <label className="flex items-center gap-3 cursor-pointer bg-gray-900 px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={formData.visibleOnMap}
                      onChange={(e) => handleChange('visibleOnMap', e.target.checked)}
                      className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-800"
                    />
                    <span className="flex items-center gap-2 text-sm font-bold text-gray-300">
                      {formData.visibleOnMap ? <Eye size={16} /> : <EyeOff size={16} />}
                      Visa på karta
                    </span>
                  </label>
               </div>

               {formData.visibleOnMap ? (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-gray-900 p-2 rounded-lg border border-gray-700">
                       <MachineMap points={existingPoints} onPointClick={() => {}} previewPoint={previewPoint} />
                    </div>
                    <div className="space-y-6 flex flex-col justify-center bg-gray-900 p-6 rounded-lg border border-gray-700">
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                           <MapPin size={18} />
                           <span className="text-sm">Justera position</span>
                        </div>
                        
                        <div>
                          <label className="flex justify-between text-xs text-gray-500 mb-1">
                             <span>Horisontell (X)</span>
                             <span className="text-white font-mono">{Math.round(formData.coordinates?.x || 0)}%</span>
                          </label>
                          <input 
                            type="range" min="0" max="100" 
                            value={formData.coordinates?.x} 
                            onChange={(e) => handleCoordinateChange('x', Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>

                        <div>
                          <label className="flex justify-between text-xs text-gray-500 mb-1">
                             <span>Vertikal (Y)</span>
                             <span className="text-white font-mono">{Math.round(formData.coordinates?.y || 0)}%</span>
                          </label>
                          <input 
                            type="range" min="0" max="100" 
                            value={formData.coordinates?.y} 
                            onChange={(e) => handleCoordinateChange('y', Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                        </div>
                        
                        <div className="text-xs text-gray-500 italic mt-4">
                           Dra i reglagen tills punkten (blå pulserande) hamnar rätt på ritningen.
                        </div>
                    </div>
                 </div>
               ) : (
                 <div className="p-8 bg-gray-900 border border-dashed border-gray-700 rounded-lg text-center text-gray-500">
                    Punkten kommer endast visas i listan, inte på kartan.
                 </div>
               )}
            </div>

            {/* 3. Extra Details */}
            <div className="space-y-4 pt-4 border-t border-gray-700">
                <h3 className="text-gray-400 font-bold uppercase text-sm tracking-wider">Övrigt</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Beskrivning</label>
                     <textarea 
                       value={formData.description}
                       onChange={(e) => handleChange('description', e.target.value)}
                       rows={3}
                       className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                     ></textarea>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1">Fasvinkel (0-360°) - Valfritt</label>
                     <input 
                       type="number" 
                       value={phaseAngleStr} 
                       onChange={(e) => setPhaseAngleStr(e.target.value)}
                       placeholder="Lämna tomt om ej relevant"
                       className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white"
                     />
                     <p className="text-xs text-gray-500 mt-1">Används för Synkroniserings-vyn.</p>
                   </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
              <button 
                type="button" 
                onClick={onCancel}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold"
              >
                Avbryt
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/50"
              >
                <Save size={20} />
                {isEditing ? 'Uppdatera Punkt' : 'Spara Ny Punkt'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPointForm;