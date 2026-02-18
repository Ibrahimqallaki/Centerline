
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
    <div className="relative w-full aspect-[2/1] bg-gray-900 rounded-t-3xl border-b-4 border-gray-800 overflow-hidden shadow-2xl print-map-container">
      {/* Blueprint Grid background - Mer synlig */}
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none z-0" 
           style={{ 
             backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="absolute top-6 left-8 z-10 pointer-events-none">
        <h2 className="text-2xl font-black text-blue-400 tracking-tighter uppercase italic">Maskinlayout TP-24</h2>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">Live Visualizer // Active</p>
        </div>
      </div>

      {customMapUrl ? (
        <img 
          src={customMapUrl} 
          alt="Machine Layout" 
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
      ) : (
        /* High-Visibility Machine Schematic - Ingen filter, bara ren vektor */
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
          <g transform="translate(5, 5) scale(0.9)">
            {/* Main Conveyor Line - Strong Blue */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
            
            {/* Infeed Module */}
            <rect x="0" y="15" width="12" height="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" rx="1" />
            <text x="6" y="13" fill="#60a5fa" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Inmatning</text>

            {/* Separation Module */}
            <rect x="18" y="15" width="12" height="10" fill="#1e293b" stroke="#6366f1" strokeWidth="1" rx="1" />
            <text x="24" y="13" fill="#818cf8" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Separering</text>

            {/* Cardboard Unit */}
            <rect x="35" y="28" width="15" height="10" fill="#1e293b" stroke="#eab308" strokeWidth="1" rx="1" />
            <text x="42.5" y="41" fill="#fbbf24" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Kartong</text>

            {/* Forming Tool */}
            <rect x="42" y="5" width="20" height="30" fill="#1e293b" stroke="#f97316" strokeWidth="1.5" rx="1" />
            <text x="52" y="3" fill="#fb923c" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Formverktyg</text>

            {/* Shrink / Film */}
            <rect x="68" y="10" width="16" height="20" fill="#1e293b" stroke="#ec4899" strokeWidth="1" rx="1" />
            <text x="76" y="8" fill="#f472b6" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Film/Krymp</text>

            {/* Discharge */}
            <rect x="88" y="15" width="12" height="10" fill="#1e293b" stroke="#a855f7" strokeWidth="1" rx="1" />
            <text x="94" y="13" fill="#c084fc" fontSize="2" textAnchor="middle" fontWeight="black" className="uppercase italic">Utmatning</text>
          </g>
        </svg>
      )}

      {/* Interactive Points */}
      {visiblePoints.map((point) => (
        <button
          key={point.id}
          onClick={() => onPointClick(point)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black text-white transition-all duration-200 hover:scale-125 z-20 shadow-2xl
            ${point.id === selectedPointId ? 'ring-4 ring-white scale-125 z-30' : 'ring-2 ring-white/10'}
            ${CRITICALITY_COLORS[point.criticality]}
          `}
          style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
        >
          {point.number}
        </button>
      ))}
      
      {/* Preview Point (When adding/editing) */}
      {previewPoint && previewPoint.visibleOnMap && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-white z-40 shadow-2xl ring-4 ring-white animate-pulse bg-blue-500"
          style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%` }}
        >
          {previewPoint.number}
        </div>
      )}

      {/* Simplified Legend */}
      <div className="absolute bottom-6 left-8 bg-black/80 px-4 py-2 rounded-xl border border-gray-700 text-[10px] font-black flex gap-4 pointer-events-none uppercase tracking-widest text-gray-400 shadow-xl">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-600 rounded-sm"></span> Medium</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-orange-600 rounded-sm"></span> Hög</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-600 rounded-sm"></span> Kraschrisk</div>
      </div>
    </div>
  );
};

export default MachineMap;
