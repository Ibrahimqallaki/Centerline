
import React from 'react';
import { MachinePoint, Zone } from '../types';
import { Search, AlertTriangle } from 'lucide-react';
import { ZONE_COLORS } from '../constants';

interface ParameterTableProps {
  points: MachinePoint[];
  onPointSelect: (point: MachinePoint) => void;
  getQrUrl: (id: string, size?: number) => string;
}

const ParameterTable: React.FC<ParameterTableProps> = ({ points, onPointSelect, getQrUrl }) => {
  const [filter, setFilter] = React.useState('');
  const [zoneFilter, setZoneFilter] = React.useState<Zone | 'All'>('All');

  const filteredPoints = points.filter(p => {
    const matchesText = p.name.toLowerCase().includes(filter.toLowerCase()) || p.id.toLowerCase().includes(filter.toLowerCase());
    const matchesZone = zoneFilter === 'All' || p.zone === zoneFilter;
    return matchesText && matchesZone;
  });

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden flex flex-col h-full">
      
      <div className="p-4 border-b border-gray-700 flex flex-col sm:flex-row gap-4 justify-between bg-gray-900/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Sök parameter..." 
            className="w-full bg-gray-800 border border-gray-700 text-white pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <select 
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded"
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value as any)}
        >
          <option value="All">Alla Zoner</option>
          {Object.values(Zone).map(z => <option key={z} value={z}>{z}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-900 text-[10px] uppercase font-black text-gray-500 tracking-widest">
        <div className="col-span-1">Nr</div>
        <div className="col-span-4">Parameter</div>
        <div className="col-span-2">Zon</div>
        <div className="col-span-3 text-right">Värde & Tol.</div>
        <div className="col-span-2 text-center">QR</div>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-gray-700">
        {filteredPoints.map((point) => (
          <div 
            key={point.id} 
            onClick={() => onPointSelect(point)}
            className="grid grid-cols-12 gap-2 px-6 py-4 items-center hover:bg-gray-700/50 cursor-pointer group"
          >
            <div className="col-span-1 font-mono text-gray-500 group-hover:text-white font-bold">{point.number}</div>
            <div className="col-span-4">
              <div className="font-bold text-gray-200 group-hover:text-blue-300 transition-colors leading-tight">{point.name}</div>
              <div className="text-[10px] text-gray-500 italic mt-0.5">{point.measureMethod}</div>
            </div>
            <div className="col-span-2">
               <span className={`text-[9px] px-2 py-0.5 rounded border border-opacity-30 font-bold whitespace-nowrap ${ZONE_COLORS[point.zone]}`}>
                 {point.zone}
               </span>
            </div>
            <div className="col-span-3 text-right">
              <div className="font-mono text-green-400 font-black text-xl leading-none">{point.targetValue}</div>
              <div className="flex justify-end items-center gap-2">
                {point.phaseAngle !== undefined && (
                  <span className="text-[9px] bg-cyan-900/30 text-cyan-400 px-1 rounded border border-cyan-800/50 font-mono">
                    {point.phaseAngle}°
                  </span>
                )}
                <div className="text-[10px] text-gray-500 font-bold italic">Tol: {point.tolerance}</div>
              </div>
            </div>
            <div className="col-span-2 flex justify-center">
               <div className="bg-white p-2 rounded shadow-2xl group-hover:scale-[2.5] transition-transform origin-right z-20">
                 <img src={getQrUrl(point.id, 120)} alt="QR" className="w-8 h-8 block" />
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterTable;
