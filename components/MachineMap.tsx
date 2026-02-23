
import React, { useRef } from 'react';
import { MachinePoint, MachineModule, Criticality } from '../types';
import { CRITICALITY_COLORS, DEFAULT_MACHINE_LAYOUT } from '../constants';
import { Edit3, Move, Crosshair } from 'lucide-react';

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
      className={`relative w-full aspect-[2/1] bg-gray-950 rounded-[2rem] border border-gray-800 overflow-hidden shadow-2xl print-map-container ${onMapClick ? 'cursor-crosshair' : ''} ${editMode ? 'ring-2 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}
    >
      {/* Background Image or SVG Grid */}
      <div className="absolute inset-0 z-0">
        {customMapUrl ? (
          <img 
            src={customMapUrl} 
            alt="Machine Layout" 
            className="w-full h-full object-contain p-4 opacity-40 print:opacity-60"
          />
        ) : (
          <div className="absolute inset-0 opacity-[0.03] print:opacity-10 pointer-events-none z-0" 
               style={{ 
                 backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
                 backgroundSize: '30px 30px' 
               }}>
          </div>
        )}
      </div>

      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        {editMode && (
          <div className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1 w-fit"><Edit3 size={10}/> DESIGNLÄGE</div>
        )}
        {editMode && selectedPointId && (
          <div className="mt-2 text-[10px] bg-amber-500 text-black px-3 py-1 rounded-full font-black flex items-center gap-1 border border-amber-400 shadow-lg w-fit">
            <Crosshair size={12} className="animate-spin-slow" /> KLICKA PÅ KARTAN FÖR ATT FLYTTA PUNKTEN
          </div>
        )}
      </div>

      <svg className="absolute inset-0 w-full h-full z-5" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
        <g transform="translate(0, 0)">
          {/* Main Axis Line - Only show if no custom map */}
          {!customMapUrl && <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.2" />}
          
          {/* Render Dynamic Modules */}
          {layout.map((mod) => {
              const showFill = mod.hasFill === true; // Default nu till false om ej specificerat som true
              const fillColor = editMode ? `${mod.color}15` : `${mod.color}08`;
              
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
                    strokeWidth={editMode ? "0.8" : "0.5"} 
                    strokeDasharray={showFill ? "" : "1 0.5"} // Subtilare streckning för genomskinliga rutor
                    rx="0.5" 
                    className={`transition-all duration-300 print:fill-white print:stroke-black ${editMode ? 'group-hover:stroke-white group-hover:stroke-[1px]' : ''}`}
                  />
                  <text 
                    x={mod.x + mod.width / 2} 
                    y={mod.y + mod.height / 2 + (mod.fontSize || 2) * 0.3} 
                    textAnchor="middle" 
                    fill={mod.color === '#ffffff' ? '#ffffff' : mod.color} 
                    stroke="black"
                    strokeWidth="0.05"
                    paintOrder="stroke"
                    fontSize={mod.fontSize || Math.max(1.5, Math.min(mod.width * 0.25, mod.height * 0.6, 3.5))} 
                    fontWeight="900"
                    className="uppercase tracking-wider print:fill-black pointer-events-none italic"
                  >
                    {mod.wrapText ? (
                      mod.label.split(' ').map((line, i, arr) => (
                        <tspan 
                          key={i} 
                          x={mod.x + mod.width / 2} 
                          dy={i === 0 ? `-${(arr.length - 1) * 0.5}em` : '1.1em'}
                        >
                          {line}
                        </tspan>
                      ))
                    ) : mod.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

      {/* Render Points */}
      <div className="absolute inset-0 pointer-events-none">
        {visiblePoints.map((point) => {
          const isSelected = point.id === selectedPointId;
          const isCritical = point.criticality === Criticality.CRITICAL;
          
          return (
            <div 
              key={point.id}
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-xl cursor-pointer pointer-events-auto transition-all duration-200 z-20 
                ${CRITICALITY_COLORS[point.criticality]} 
                ${isSelected ? 'scale-125 z-40 ring-[6px] ring-blue-500/30 border-blue-400' : 'hover:scale-110'} 
                ${editMode && !isSelected ? 'opacity-40 hover:opacity-100' : ''}`}
              style={{ 
                left: `${point.coordinates.x}%`, 
                top: `${point.coordinates.y}%`, 
                transform: 'translate(-50%, -50%)',
                boxShadow: isSelected ? '0 0 20px rgba(59,130,246,0.6)' : '0 4px 10px rgba(0,0,0,0.5)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (onPointClick) onPointClick(point);
              }}
            >
              <span className="text-xs font-black text-white italic drop-shadow-md">{point.number}</span>
              {isCritical && (
                <div className="absolute -inset-1.5 rounded-full border-2 border-red-500/50 animate-ping pointer-events-none"></div>
              )}
              {editMode && isSelected && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg border border-white/20">
                  <Move size={10} />
                </div>
              )}
            </div>
          );
        })}

        {/* Add/Preview Point Marker */}
        {previewPoint && (
           <div 
              className={`absolute flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-blue-400 shadow-2xl z-50 animate-pulse bg-blue-900/40`}
              style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Crosshair size={20} className="text-blue-300" />
              <div className="absolute -bottom-8 bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full font-black border border-blue-400 whitespace-nowrap">
                PLACERA: {Math.round(previewPoint.coordinates.x)}% / {Math.round(previewPoint.coordinates.y)}%
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MachineMap;
