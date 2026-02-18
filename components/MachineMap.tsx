
import React, { useRef } from 'react';
import { MachinePoint, MachineModule, Criticality } from '../types';
import { CRITICALITY_COLORS, DEFAULT_MACHINE_LAYOUT } from '../constants';
import { Edit3, Move } from 'lucide-react';

interface MachineMapProps {
  points: MachinePoint[];
  onPointClick?: (point: MachinePoint) => void;
  onMapClick?: (x: number, y: number) => void;
  onModuleClick?: (module: MachineModule) => void;
  selectedPointId?: string;
  previewPoint?: MachinePoint; 
  customMapUrl?: string | null;
  layout?: MachineModule[];
  editMode?: boolean;
}

const MachineMap: React.FC<MachineMapProps> = ({ 
  points, 
  onPointClick, 
  onMapClick,
  onModuleClick,
  selectedPointId, 
  previewPoint, 
  customMapUrl,
  layout = DEFAULT_MACHINE_LAYOUT,
  editMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const visiblePoints = points.filter(p => p.visibleOnMap !== false);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!onMapClick || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMapClick(x, y);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className={`relative w-full aspect-[2/1] bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl print-map-container ${onMapClick ? 'cursor-crosshair' : ''} ${editMode ? 'ring-2 ring-blue-500/50' : ''}`}
    >
      {/* Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        <h2 className="text-xl font-black text-blue-400 tracking-tighter uppercase italic print:text-black flex items-center gap-2">
          Layout: TP-24 Tray Packer
          {editMode && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1"><Edit3 size={10}/> DESIGNLÄGE</span>}
        </h2>
        {editMode && selectedPointId && (
          <div className="mt-2 text-[10px] bg-amber-600 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1 animate-bounce">
            <Move size={10} /> KLICKA PÅ KARTAN FÖR ATT FLYTTA PUNKTEN
          </div>
        )}
      </div>

      {customMapUrl ? (
        <img 
          src={customMapUrl} 
          alt="Machine Layout" 
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
      ) : (
        /* Dynamic SVG Machine Schematic */
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(0, 0)">
            {/* Conveyor Line */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.3" />
            
            {/* Render Dynamic Modules (Rutor/Stationer) */}
            {layout.map((mod) => {
              const showFill = mod.hasFill !== false; 
              const fillColor = editMode ? `${mod.color}22` : "#1e293b";
              
              return (
                <g 
                  key={mod.id} 
                  className={`${editMode ? 'cursor-pointer group' : ''}`}
                  onClick={(e) => {
                    if (editMode && onModuleClick) {
                      e.stopPropagation();
                      onModuleClick(mod);
                    }
                  }}
                >
                  <rect 
                    x={mod.x} 
                    y={mod.y} 
                    width={mod.width} 
                    height={mod.height} 
                    fill={showFill ? fillColor : "none"} 
                    stroke={mod.color} 
                    strokeWidth={editMode ? "1.2" : "0.8"} 
                    rx="1" 
                    className={`transition-all duration-200 print:fill-white print:stroke-black ${editMode ? 'group-hover:stroke-white' : ''}`}
                  />
                  <text 
                    x={mod.x + mod.width / 2} 
                    y={mod.y + mod.height / 2} 
                    textAnchor="middle" 
                    dominantBaseline="middle" 
                    fill={mod.color} 
                    fontSize="2" 
                    fontWeight="bold"
                    className="uppercase tracking-tighter print:fill-black pointer-events-none"
                    style={{ textShadow: showFill ? 'none' : '0 1px 2px rgba(0,0,0,0.8)' }}
                  >
                    {mod.label}
                  </text>
                  {editMode && (
                    <circle cx={mod.x} cy={mod.y} r="0.5" fill="white" />
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      )}

      {/* Render Points (Numbers) */}
      <div className="absolute inset-0 pointer-events-none">
        {visiblePoints.map((point) => {
          const isSelected = point.id === selectedPointId;
          const isCritical = point.criticality === Criticality.CRITICAL;
          
          return (
            <div 
              key={point.id}
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-xl cursor-pointer pointer-events-auto transition-all hover:scale-125 z-20 ${CRITICALITY_COLORS[point.criticality]} ${isSelected ? 'ring-4 ring-blue-400 scale-125 z-30' : ''}`}
              style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={(e) => {
                e.stopPropagation();
                if (onPointClick) onPointClick(point);
              }}
            >
              <span className="text-xs font-black text-white italic">{point.number}</span>
              {isCritical && (
                <div className="absolute -inset-1 rounded-full border border-red-500 animate-ping opacity-75"></div>
              )}
              {editMode && isSelected && (
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md">
                  <Move size={8} className="text-blue-600" />
                </div>
              )}
            </div>
          );
        })}

        {/* Preview Point (Moving when adding) */}
        {previewPoint && (
           <div 
              className={`absolute flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-white shadow-2xl z-40 animate-pulse bg-blue-600/50`}
              style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span className="text-sm font-black text-white">{previewPoint.number}</span>
              <div className="absolute -bottom-8 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded font-mono">
                X:{Math.round(previewPoint.coordinates.x)} Y:{Math.round(previewPoint.coordinates.y)}
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MachineMap;
