
import React from 'react';
import { MachinePoint, PointStatus, Criticality } from '../types';
import { Search, AlertTriangle, CheckCircle2, Tag, Filter, ChevronDown } from 'lucide-react';
import { CRITICALITY_COLORS } from '../constants';

interface ParameterTableProps {
  points: MachinePoint[];
  sections: string[];
  onPointSelect: (point: MachinePoint) => void;
  onUpdatePoint: (point: MachinePoint) => void;
  getQrUrl: (id: string, size?: number) => string;
}

const ParameterTable: React.FC<ParameterTableProps> = ({ points, sections, onPointSelect, onUpdatePoint, getQrUrl }) => {
  const [filter, setFilter] = React.useState('');
  const [sectionFilter, setSectionFilter] = React.useState<string | 'All'>('All');
  const [statusFilter, setStatusFilter] = React.useState<PointStatus | 'All'>('All');

  const filteredPoints = points.filter(p => {
    const matchesText = p.name.toLowerCase().includes(filter.toLowerCase()) || p.id.toLowerCase().includes(filter.toLowerCase());
    const matchesSection = sectionFilter === 'All' || p.section === sectionFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesText && matchesSection && matchesStatus;
  });

  const handleStatusToggle = (e: React.MouseEvent, point: MachinePoint, newStatus: PointStatus) => {
    e.stopPropagation();
    onUpdatePoint({ ...point, status: newStatus, lastChecked: new Date().toISOString() });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col h-full print:bg-white print:border-black print:rounded-none print:shadow-none transition-colors duration-300">
      
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row gap-4 justify-between bg-gray-50 dark:bg-gray-900/50 print:hidden">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Sök parameter..." 
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative group">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Filter size={14} className="text-gray-500 dark:text-gray-400" />
              <select 
                className="bg-transparent text-gray-900 dark:text-white text-xs focus:outline-none appearance-none pr-6 cursor-pointer font-bold"
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
              >
                <option value="All" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Alla Sektioner</option>
                {sections.map(s => <option key={s} value={s} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>

          <div className="relative group">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <Tag size={14} className="text-gray-500 dark:text-gray-400" />
              <select 
                className="bg-transparent text-gray-900 dark:text-white text-xs focus:outline-none appearance-none pr-6 cursor-pointer font-bold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Alla Status</option>
                {Object.values(PointStatus).map(s => <option key={s} value={s} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-2 px-6 py-3 bg-gray-50 dark:bg-gray-900 text-[10px] uppercase font-black text-gray-500 tracking-widest border-b border-gray-200 dark:border-gray-700 print:bg-gray-100 print:text-black print:border-black">
        <div className="col-span-1">Nr</div>
        <div className="col-span-4 print:col-span-5">Parameter & Kritikalitet</div>
        <div className="col-span-3 text-center print:hidden">Status / Åtgärd</div>
        <div className="col-span-2 text-right print:col-span-3 print:text-right">Värde</div>
        <div className="col-span-2 text-right pr-4">QR</div>
        <div className="hidden print:block col-span-1 text-right italic font-normal">Sign.</div>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-gray-200 dark:divide-gray-700 print:divide-black print:overflow-visible">
        {filteredPoints.map((point) => (
          <div 
            key={point.id} 
            onClick={() => onPointSelect(point)}
            className={`grid grid-cols-12 gap-2 px-6 py-4 items-center hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer group transition-colors print:text-black print:py-5 print:break-inside-avoid ${point.status === PointStatus.TAGGED_RED ? 'bg-red-500/5 dark:bg-red-900/10' : point.status === PointStatus.TAGGED_YELLOW ? 'bg-orange-500/5 dark:bg-orange-900/10' : ''}`}
          >
            <div className="col-span-1 font-mono text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-white font-bold print:text-black print:text-xl print:italic">{point.number}</div>
            <div className="col-span-4 print:col-span-5 space-y-2">
              <div>
                <div className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors leading-tight print:text-black print:text-lg">{point.name}</div>
                <div className="text-[10px] text-gray-500 italic mt-0.5 print:text-gray-600">{point.measureMethod}</div>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <span className={`w-2 h-2 rounded-full ${CRITICALITY_COLORS[point.criticality]}`}></span>
                <span className="text-[9px] text-gray-500 font-bold uppercase">{point.criticality.split(':')[0]}</span>
              </div>
            </div>
            
            <div className="col-span-3 flex flex-col items-center gap-2 print:hidden">
              {point.status && point.status !== PointStatus.OK ? (
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter ${
                  point.status === PointStatus.TAGGED_RED ? 'bg-red-600 text-white' : 
                  point.status === PointStatus.TAGGED_YELLOW ? 'bg-orange-500 text-white' : 
                  'bg-yellow-600 text-white'
                }`}>
                  <AlertTriangle size={10} /> {point.status}
                </div>
              ) : (
                <div className="flex items-center gap-1 text-green-500 text-[9px] font-bold uppercase">
                  <CheckCircle2 size={12} /> OK
                </div>
              )}
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleStatusToggle(e, point, PointStatus.OK)}
                  className="p-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded hover:bg-green-600 hover:text-white transition-colors"
                  title="Markera som OK"
                >
                  <CheckCircle2 size={14} />
                </button>
                <button 
                  onClick={(e) => handleStatusToggle(e, point, PointStatus.TAGGED_YELLOW)}
                  className="p-1 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-500 hover:text-white transition-colors"
                  title="Sätt Gul Tagg (P2)"
                >
                  <Tag size={14} />
                </button>
                <button 
                  onClick={(e) => handleStatusToggle(e, point, PointStatus.TAGGED_RED)}
                  className="p-1 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
                  title="Sätt Röd Tagg (P1)"
                >
                  <AlertTriangle size={14} />
                </button>
              </div>
            </div>

            <div className="col-span-2 text-right print:col-span-3">
              <div className="font-mono text-green-600 dark:text-green-400 font-black text-xl leading-none print:text-black print:text-2xl">{point.targetValue}</div>
              <div className="text-[10px] text-gray-500 font-bold italic print:text-gray-700">Tol: {point.tolerance}</div>
            </div>

            <div className="col-span-2 flex justify-end pr-2">
               <div className="bg-white p-2 rounded shadow-2xl group-hover:scale-[2.5] transition-transform origin-right z-20 print:shadow-none print:border print:border-black print:p-1">
                 <img src={getQrUrl(point.id, 200)} alt="QR" className="w-8 h-8 block print:w-14 print:h-14" />
               </div>
            </div>

            <div className="hidden print:block col-span-1 border-b border-gray-300 h-8 ml-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParameterTable;

