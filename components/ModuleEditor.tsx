
import React from 'react';
import { MachineModule } from '../types';
import { X, Save, Trash2, Move, Maximize, Palette } from 'lucide-react';

interface ModuleEditorProps {
  module: MachineModule;
  onSave: (module: MachineModule) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({ module, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = React.useState<MachineModule>(module);

  const handleChange = (field: keyof MachineModule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adjustValue = (field: 'x' | 'y' | 'width' | 'height', delta: number) => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, Math.min(100, (prev[field] as number) + delta)) }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-600 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-gray-700 bg-gray-900 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 italic">
            <Move size={18} className="text-blue-500" /> Redigera Maskindel
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-1 uppercase tracking-widest">Namn på enhet</label>
            <input 
              type="text" 
              value={formData.label} 
              onChange={(e) => handleChange('label', e.target.value)} 
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Position (X / Y)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">X:</span>
                <input type="number" value={formData.x} onChange={(e) => handleChange('x', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('x', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('x', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">Y:</span>
                <input type="number" value={formData.y} onChange={(e) => handleChange('y', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('y', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('y', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest italic">Storlek (B / H)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">B:</span>
                <input type="number" value={formData.width} onChange={(e) => handleChange('width', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('width', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('width', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">H:</span>
                <input type="number" value={formData.height} onChange={(e) => handleChange('height', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('height', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('height', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest"><Palette size={10} className="inline mr-1" /> Temafärg</label>
            <div className="flex gap-2">
              {['#3b82f6', '#6366f1', '#eab308', '#f97316', '#ec4899', '#a855f7', '#10b981', '#ef4444'].map(c => (
                <button 
                  key={c}
                  type="button"
                  onClick={() => handleChange('color', c)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${formData.color === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-700 bg-gray-900 flex justify-between rounded-b-2xl">
          <button onClick={() => onDelete(formData.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm font-bold uppercase">
            <Trash2 size={16} /> Radera
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-bold uppercase text-xs">Avbryt</button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40 uppercase text-xs">
              <Save size={16} /> Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;
