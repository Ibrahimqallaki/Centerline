import React from 'react';
import { MachinePoint } from '../types';
import { CRITICALITY_COLORS } from '../constants';

interface MachineMapProps {
  points: MachinePoint[];
  onPointClick: (point: MachinePoint) => void;
  selectedPointId?: string;
  previewPoint?: MachinePoint; // For the "Add Point" mode to show preview
  customMapUrl?: string | null; // New prop for custom background
}

const MachineMap: React.FC<MachineMapProps> = ({ points, onPointClick, selectedPointId, previewPoint, customMapUrl }) => {
  // Determine which points to render (filter out hidden ones)
  const visiblePoints = points.filter(p => p.visibleOnMap !== false);

  return (
    <div className="relative w-full aspect-[2/1] bg-gray-800 rounded-t-xl border-b-4 border-gray-600 overflow-hidden shadow-inner print-map-container group print:bg-white print:border-none print:shadow-none">
      {/* Background Grid - Hidden on Print */}
      <div className="absolute inset-0 opacity-10 no-print pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#4b5563 1px, transparent 1px), linear-gradient(90deg, #4b5563 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="absolute top-4 left-4 z-0 opacity-20 print:opacity-100 pointer-events-none">
        <h2 className="text-4xl font-bold text-white print:text-black tracking-tighter mix-blend-overlay">TP-24 CENTERLINE</h2>
        <p className="text-sm font-mono mt-1 print:text-black mix-blend-overlay">STANDARD OPERATING PROCEDURE: A3-VISUAL</p>
      </div>

      {/* RENDER EITHER CUSTOM IMAGE OR DEFAULT SVG */}
      {customMapUrl ? (
        <img 
          src={customMapUrl} 
          alt="Machine Layout" 
          className="absolute inset-0 w-full h-full object-fill opacity-80 print:opacity-100"
        />
      ) : (
        /* Schematic Machine Drawing (SVG) */
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 80" preserveAspectRatio="none">
          
          {/* Main Line */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#374151" strokeWidth="2" className="print:stroke-black" />
          
          {/* 1. Infeed */}
          <rect x="2" y="45" width="10" height="10" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="7" y="43" fill="#60a5fa" fontSize="2" textAnchor="middle" className="print:fill-black">INMATNING</text>

          {/* 2. Separation */}
          <rect x="15" y="45" width="10" height="10" fill="none" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="20" y="43" fill="#818cf8" fontSize="2" textAnchor="middle" className="print:fill-black">SEPARERING</text>

          {/* 3. Guides */}
          <rect x="28" y="30" width="10" height="25" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="33" y="28" fill="#22d3ee" fontSize="2" textAnchor="middle" className="print:fill-black">GEJDRAR</text>

          {/* 4. Cardboard */}
          <rect x="35" y="60" width="15" height="15" fill="none" stroke="#facc15" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="42.5" y="78" fill="#facc15" fontSize="2" textAnchor="middle" className="print:fill-black">KARTONG</text>

          {/* 5. Forming */}
          <rect x="45" y="25" width="15" height="50" fill="none" stroke="#fb923c" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="52.5" y="22" fill="#fb923c" fontSize="2" textAnchor="middle" className="print:fill-black">FORMNING</text>

          {/* 6. Shrink Film */}
          <rect x="65" y="15" width="15" height="60" fill="none" stroke="#f472b6" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="72.5" y="12" fill="#f472b6" fontSize="2" textAnchor="middle" className="print:fill-black">FILM</text>

          {/* 7. Discharge */}
          <rect x="85" y="45" width="15" height="10" fill="none" stroke="#c084fc" strokeWidth="0.5" strokeDasharray="2" className="print:stroke-black" />
          <text x="92.5" y="43" fill="#c084fc" fontSize="2" textAnchor="middle" className="print:fill-black">UTMATNING</text>

          {/* Flow Arrows */}
          <path d="M 12 50 L 15 50" stroke="#4b5563" strokeWidth="0.5" markerEnd="url(#arrow)" className="print:stroke-black" />
          <path d="M 25 50 L 28 50" stroke="#4b5563" strokeWidth="0.5" markerEnd="url(#arrow)" className="print:stroke-black" />
          <path d="M 60 50 L 65 50" stroke="#4b5563" strokeWidth="0.5" markerEnd="url(#arrow)" className="print:stroke-black" />

          <defs>
            <marker id="arrow" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto">
              <path d="M 0 0 L 4 2 L 0 4 z" fill="#4b5563" className="print:fill-black" />
            </marker>
          </defs>
        </svg>
      )}

      {/* Interactive Points (Screen Only) */}
      {visiblePoints.map((point) => (
        <button
          key={point.id}
          onClick={() => onPointClick(point)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white transition-all duration-300 hover:scale-125 z-10 shadow-lg no-print
            ${point.id === selectedPointId ? 'ring-4 ring-white scale-125 z-20' : 'ring-2 ring-gray-900'}
            ${CRITICALITY_COLORS[point.criticality]}
          `}
          style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
        >
          {point.number}
        </button>
      ))}
      
      {/* Preview Point (When adding new) */}
      {previewPoint && previewPoint.visibleOnMap && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white z-30 shadow-lg ring-4 ring-white animate-pulse bg-blue-600 no-print"
          style={{ left: `${previewPoint.coordinates.x}%`, top: `${previewPoint.coordinates.y}%` }}
        >
          {previewPoint.number}
        </div>
      )}

      {/* PRINT-ONLY POINTS (High Contrast, Scaled) */}
      {visiblePoints.map((point) => (
        <div
          key={`print-${point.id}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full hidden print:flex items-center justify-center text-[10px] font-bold text-white border border-black z-10 bg-black"
          style={{ left: `${point.coordinates.x}%`, top: `${point.coordinates.y}%` }}
        >
          {point.number}
        </div>
      ))}

      {/* Legend Overlay (Screen Only) */}
      <div className="absolute bottom-2 right-2 bg-gray-900/90 px-3 py-1 rounded border border-gray-700 text-[10px] flex gap-3 pointer-events-auto no-print">
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-600 rounded-full"></span> Låg</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-600 rounded-full"></span> Medium</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-600 rounded-full"></span> Hög</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span> Kritisk</div>
      </div>
    </div>
  );
};

export default MachineMap;