
import React from 'react';
import { MachinePoint } from '../types';
import { CRITICALITY_COLORS } from '../constants';

interface MachineMapProps {
  points: MachinePoint[];
  onPointClick: (point: MachinePoint) => void;
  selectedPointId?: string;
  previewPoint?: MachinePoint; 
  customMapUrl?: string | null;
}

const MachineMap: React.FC<MachineMapProps> = ({ points, onPointClick, selectedPointId, previewPoint, customMapUrl }) => {
  const visiblePoints = points.filter(p => p.visibleOnMap !== false);

  return (
    <div className="relative w-full aspect-[2/1] bg-gray-950 rounded-t-3xl border-b-4 border-gray-800 overflow-hidden shadow-2xl print-map-container group">
      {/* Blueprint Grid background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
             backgroundSize: '32px 32px' 
           }}>
      </div>

      <div className="absolute top-6 left-8 z-10 opacity-40 pointer-events-none">
        <h2 className="text-3xl font-black text-blue-500 tracking-tighter uppercase italic">TP-24 Layout</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">System Ready // Live Visualizer</p>
        </div>
      </div>

      {customMapUrl ? (
        <img 
          src={customMapUrl} 
          alt="Machine Layout" 
          className="absolute inset-0 w-full h-full object-contain opacity-90"
        />
      ) : (
        /* High-Contrast Machine Schematic */
        <svg className="absolute inset-0 w-full h-full p-12" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main Conveyor Line - Neon Blue */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#1e40af" strokeWidth="1.5" strokeDasharray="2 1" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" filter="url(#glow)" />
          
          {/* Machine Modules - Better visibility */}
          <g filter="url(#glow)">
            {/* Infeed */}
            <rect x="2" y="20" width="12" height="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.5" rx="1" />
            <text x="8" y="18" fill="#3b82f6" fontSize="1.5" textAnchor="middle" fontWeight="bold">INMATNING</text>

            {/* Separation */}
            <rect x="18" y="20" width="10" height="10" fill="#1e293b" stroke="#6366f1" strokeWidth="0.5" rx="1" />
            <text x="23" y="18" fill="#6366f1" fontSize="1.5" textAnchor="middle" fontWeight="bold">SEPARERING</text>

            {/* Cardboard unit */}
            <rect x="35" y="32" width="15" height="12" fill="#1e293b" stroke="#eab308" strokeWidth="0.5" rx="1" />
            <text x="42.5" y="47" fill="#eab308" fontSize="1.5" textAnchor="middle" fontWeight="bold">KARTONG</text>

            {/* Tooling / Forming */}
            <rect x="45" y="10" width="18" height="30" fill="#1e293b" stroke="#f97316" strokeWidth="0.5" rx="2" />
            <text x="54" y="8" fill="#f97316" fontSize="1.5" textAnchor="middle" fontWeight="bold">FORMVERKTYG</text>

            {/* Shrink tunnel / Film */}
            <rect x="68" y="15" width="16" height="20" fill="#1e293b" stroke="#ec4899" strokeWidth="0.5" rx="1" />
            <text x="76" y="13" fill="#ec4899" fontSize="1.5" textAnchor="middle" fontWeight="bold">KRYMPFILM</text>

            {/* Discharge */}
            <rect x="88" y="20" width="10" height="10" fill="#1e293b" stroke="#a855f7" strokeWidth="0.5" rx="1" />
            <text x="93" y="18" fill="#a855f7" fontSize="1.5" textAnchor="middle" fontWeight="bold">UTMATNING</text>
          </g>

          {/* Flow Indicator Arrows */}
          <path d="M 14 25 L 18 25" stroke="#3b82f6" strokeWidth="0.3" markerEnd="url(#arrow-blue)" />
          <path d="M 63 25 L 68 25" stroke="#3b82f6" strokeWidth="0.3" markerEnd="url(#arrow-blue)" />

          <defs>
            <marker id="arrow-blue" markerWidth="3" markerHeight="3" refX="1.5" refY="1.5" orient="auto">
              <path d="M 0 0 L 3 1.5 L 0 3 z" fill="#3b82f6" />
            </marker>
          </defs>
        </svg>
      )}

      {/* Interactive Points */}
      {visiblePoints.map((point) => (
        <button
          key={point.id}
          onClick={() => onPointClick(point)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white transition-all duration-300 hover:scale-125 z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]
            ${point.id === selectedPointId ? 'ring-4 ring-white scale-125 z-30 shadow-blue-500/50' : 'ring-1 ring-white/20'}
            ${CRITICALITY_COLORS[point.criticality]}
          `}
          style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
        >
          {point.number}
        </button>
      ))}
      
      {/* Preview Point */}
      {previewPoint && previewPoint.visibleOnMap && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white z-40 shadow-2xl ring-4 ring-white animate-pulse bg-blue-600"
          style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%` }}
        >
          {previewPoint.number}
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-8 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-[9px] font-bold flex gap-4 pointer-events-none uppercase tracking-widest text-gray-400">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-gray-600 rounded-sm"></span> Låg</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-yellow-600 rounded-sm"></span> Medium</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-orange-600 rounded-sm"></span> Hög</div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-600 rounded-sm animate-pulse"></span> Kraschrisk</div>
      </div>
    </div>
  );
};

export default MachineMap;
