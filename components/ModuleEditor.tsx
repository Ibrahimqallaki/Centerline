
import React from 'react';
import { MachineModule } from '../types';
import { X, Save, Trash2, Move, Palette, Square, CheckSquare } from 'lucide-react';

interface ModuleEditorProps {
  module: MachineModule;
  onSave: (module: MachineModule) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({ module, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = React.useState<MachineModule>({
    hasFill: false, // Ändrat till false som standard
    ...module
  });

  const handleChange = (field: keyof MachineModule, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adjustValue = (field: 'x' | 'y' | 'width' | 'height', delta: number) => {
    setFormData(prev => ({ ...prev, [field]: Math.max(0, Math.min(100, (prev[field] as number) + delta)) }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-800 w-full max-w-md rounded-2xl border border-gray-600 shadow-2xl flex flex-col animate-in zoom-in duration-200">
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
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest">Position (X / Y)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4 font-mono">X:</span>
                <input type="number" value={formData.x} onChange={(e) => handleChange('x', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('x', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('x', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4 font-mono">Y:</span>
                <input type="number" value={formData.y} onChange={(e) => handleChange('y', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('y', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('y', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest italic font-mono">Storlek (B / H)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4 font-mono">B:</span>
                <input type="number" value={formData.width} onChange={(e) => handleChange('width', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('width', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('width', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4 font-mono">H:</span>
                <input type="number" value={formData.height} onChange={(e) => handleChange('height', Number(e.target.value))} className="w-16 bg-gray-900 border border-gray-600 rounded p-1 text-white text-sm" />
                <button onClick={() => adjustValue('height', -1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">-</button>
                <button onClick={() => adjustValue('height', 1)} className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white">+</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-300">Fyllnad</label>
                <p className="text-[9px] text-gray-500 uppercase">Bakgrundsfärg</p>
              </div>
              <button 
                type="button"
                onClick={() => handleChange('hasFill', !formData.hasFill)}
                className={`p-1.5 rounded-lg transition-colors ${formData.hasFill ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {formData.hasFill ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-300">Radbryt</label>
                <p className="text-[9px] text-gray-500 uppercase">Textomfång</p>
              </div>
              <button 
                type="button"
                onClick={() => handleChange('wrapText', !formData.wrapText)}
                className={`p-1.5 rounded-lg transition-colors ${formData.wrapText ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
              >
                {formData.wrapText ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest italic">Textstorlek</label>
            <div className="flex items-center gap-4 bg-gray-900/50 p-3 rounded-xl border border-gray-700">
              <input 
                type="range" 
                min="0.5" 
                max="5" 
                step="0.1" 
                value={formData.fontSize || 2} 
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="flex-1 accent-blue-500"
              />
              <span className="text-xs font-mono text-blue-400 w-8 text-right">{formData.fontSize || 2}</span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-500 mb-2 uppercase tracking-widest"><Palette size={10} className="inline mr-1" /> Temafärg</label>
            <div className="flex flex-wrap gap-2">
              {['#3b82f6', '#6366f1', '#eab308', '#f97316', '#ec4899', '#a855f7', '#10b981', '#ef4444', '#ffffff', '#4b5563'].map(c => (
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
            <button onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest">Avbryt</button>
            <button onClick={() => onSave(formData)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-blue-900/40 uppercase text-xs tracking-widest transition-all active:scale-95">
              <Save size={16} /> Spara
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;
