
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
  theme?: 'dark' | 'light';
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
  editMode = false,
  theme = 'dark'
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
      className={`relative w-full aspect-[2/1] bg-white dark:bg-gray-950 rounded-[2rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl print-map-container ${onMapClick ? 'cursor-crosshair' : ''} ${editMode ? 'ring-2 ring-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''} transition-colors duration-300`}
    >
      {/* Background Image or SVG Grid */}
      <div className="absolute inset-0 z-0">
        {customMapUrl ? (
          <img 
            src={customMapUrl} 
            alt="Machine Layout" 
            className="w-full h-full object-contain opacity-60 dark:opacity-40 print:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.03] print:opacity-20 pointer-events-none z-0" 
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

      <svg 
        className="absolute inset-0 w-full h-full z-10" 
        viewBox="0 0 1000 500" 
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {/* Main Axis Line - Standardized position */}
          {!customMapUrl && (
            <line 
              x1="0" y1="250" x2="1000" y2="250" 
              stroke={theme === 'dark' ? '#1e293b' : '#e2e8f0'} 
              strokeWidth="2" 
              strokeDasharray="10,5"
              vectorEffect="non-scaling-stroke"
            />
          )}
          
          {/* Render Dynamic Modules */}
          {layout.map((mod) => {
              const showFill = mod.hasFill === true;
              const fillColor = editMode ? `${mod.color}20` : `${mod.color}10`;
              const fontSize = (mod.fontSize || 2) * 10;
              
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
                    x={mod.x * 10} 
                    y={mod.y * 5} 
                    width={mod.width * 10} 
                    height={mod.height * 5} 
                    fill={showFill ? fillColor : "none"} 
                    stroke={mod.color} 
                    strokeWidth={editMode ? "4" : "2"} 
                    rx="4" 
                    vectorEffect="non-scaling-stroke"
                    className={`transition-all duration-300 print:fill-transparent print:stroke-black print:stroke-[1px] ${editMode ? 'group-hover:stroke-white group-hover:stroke-[3px]' : ''}`}
                  />
                  <text 
                    x={mod.x * 10 + (mod.width * 10) / 2} 
                    y={mod.y * 5 + (mod.height * 5) / 2 + fontSize * 0.35} 
                    textAnchor="middle" 
                    fill={mod.color === '#ffffff' ? (theme === 'dark' ? '#ffffff' : '#111827') : mod.color} 
                    style={{ fontSize: `${fontSize}px` }}
                    fontWeight="900"
                    className="uppercase tracking-tighter print:fill-black pointer-events-none italic select-none"
                  >
                    {mod.wrapText ? (
                      mod.label.split(' ').map((line, i, arr) => (
                        <tspan 
                          key={i} 
                          x={mod.x * 10 + (mod.width * 10) / 2} 
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

          {/* Render Points */}
          {visiblePoints.map((point) => {
            const isSelected = point.id === selectedPointId;
            const isCritical = point.criticality === Criticality.P1;
            const color = isCritical ? '#ef4444' : (point.criticality === Criticality.P2 ? '#f97316' : '#3b82f6');
            
            return (
              <g 
                key={point.id}
                className="cursor-pointer pointer-events-auto group"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPointClick) onPointClick(point);
                }}
              >
                {/* Invisible larger hit area to make it easier to click */}
                <circle 
                  cx={point.coordinates.x * 10} 
                  cy={point.coordinates.y * 5} 
                  r="25" 
                  fill="transparent" 
                />

                {/* Outer ring for selected/critical */}
                {(isSelected || isCritical) && (
                  <circle 
                    cx={point.coordinates.x * 10} 
                    cy={point.coordinates.y * 5} 
                    r={isSelected ? 22 : 18} 
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray={isSelected ? "none" : "4,2"}
                    style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                    className={isCritical ? "animate-pulse" : ""}
                  />
                )}
                
                <circle 
                  cx={point.coordinates.x * 10} 
                  cy={point.coordinates.y * 5} 
                  r={isSelected ? 16 : 12} 
                  fill={color}
                  stroke="white"
                  strokeWidth="2"
                  style={{ transformOrigin: 'center', transformBox: 'fill-box' }}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                <text 
                  x={point.coordinates.x * 10} 
                  y={point.coordinates.y * 5 + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="900"
                  className="italic pointer-events-none select-none"
                >
                  {point.number}
                </text>
              </g>
            );
          })}
          {/* Add/Preview Point Marker */}
          {previewPoint && (
            <g className="animate-pulse">
              <circle 
                cx={previewPoint.coordinates.x * 10} 
                cy={previewPoint.coordinates.y * 5} 
                r="20" 
                fill="rgba(59, 130, 246, 0.4)" 
                stroke="#60a5fa" 
                strokeWidth="5" 
                strokeDasharray="10 5"
              />
              <line 
                x1={previewPoint.coordinates.x * 10 - 30} y1={previewPoint.coordinates.y * 5} 
                x2={previewPoint.coordinates.x * 10 + 30} y2={previewPoint.coordinates.y * 5} 
                stroke="#93c5fd" strokeWidth="3" 
              />
              <line 
                x1={previewPoint.coordinates.x * 10} y1={previewPoint.coordinates.y * 5 - 30} 
                x2={previewPoint.coordinates.x * 10} y2={previewPoint.coordinates.y * 5 + 30} 
                stroke="#93c5fd" strokeWidth="3" 
              />
            </g>
          )}
        </g>
      </svg>

      {/* Render Points (Overlay for interaction/animations if needed, but SVG is primary now) */}
      <div className="absolute inset-0 pointer-events-none hidden md:block print:hidden">
        {/* We keep this for the pulse animation and move icon which are hard in SVG */}
        {visiblePoints.map((point) => {
          const isSelected = point.id === selectedPointId;
          const isCritical = point.criticality === Criticality.P1;
          if (!isSelected && !isCritical) return null;
          
          return (
            <div 
              key={`overlay-${point.id}`}
              className={`absolute flex items-center justify-center w-8 h-8 rounded-full pointer-events-none z-20`}
              style={{ 
                left: `${point.coordinates.x}%`, 
                top: `${point.coordinates.y}%`, 
                transform: 'translate(-50%, -50%)',
              }}
            >
              {isCritical && (
                <div className="absolute -inset-1.5 rounded-full border-2 border-red-500/50 animate-ping"></div>
              )}
              {editMode && isSelected && (
                <div className="absolute -top-3 -right-3 bg-blue-500 text-white rounded-full p-1 shadow-lg border border-white/20 pointer-events-auto cursor-move">
                  <Move size={10} />
                </div>
              )}
            </div>
          );
        })}

        {/* Preview Label (Still easier in HTML for text positioning) */}
        {previewPoint && (
           <div 
              className={`absolute z-50 pointer-events-none`}
              style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%`, transform: 'translate(-50%, 20px)' }}
            >
              <div className="bg-blue-600 text-[10px] text-white px-2 py-0.5 rounded-full font-black border border-blue-400 whitespace-nowrap shadow-xl">
                PLACERA: {Math.round(previewPoint.coordinates.x)}% / {Math.round(previewPoint.coordinates.y)}%
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MachineMap;
