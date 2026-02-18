import React, { useState, useEffect, useCallback } from 'react';
import { MACHINE_POINTS, DEFAULT_MACHINE_LAYOUT } from './constants';
import { MachinePoint, MachineModule } from './types';
import MachineMap from './components/MachineMap';
import ParameterTable from './components/ParameterTable';
import PointDetail from './components/PointDetail';
import PhasingGauge from './components/PhasingGauge';
import AddPointForm from './components/AddPointForm';
import SettingsModal from './components/SettingsModal';
import { Map, List, Settings, Activity, Globe, ArrowRight, Cloud, Printer, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'phasing'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  
  // Modals & States
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);
  
  // Storage logic
  const [points, setPoints] = useState<MachinePoint[]>(() => {
    try {
      const saved = localStorage.getItem('centerline_points');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return MACHINE_POINTS;
  });

  const [layout, setLayout] = useState<MachineModule[]>(() => {
    try {
      const saved = localStorage.getItem('centerline_layout');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_MACHINE_LAYOUT;
  });

  const [customMapUrl, setCustomMapUrl] = useState<string | null>(() => localStorage.getItem('centerline_map_url'));
  const [publicBaseUrl, setPublicBaseUrl] = useState<string>(() => localStorage.getItem('centerline_public_url') || '');

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('centerline_points', JSON.stringify(points));
    localStorage.setItem('centerline_layout', JSON.stringify(layout));
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed.toString());
  }, [points, layout, isSidebarCollapsed]);

  const getQrCodeUrl = useCallback((pointId: string, size: number = 200) => {
    const isCloud = window.location.hostname !== 'localhost';
    const base = isCloud ? window.location.origin : (publicBaseUrl || window.location.origin);
    const targetUrl = `${base.replace(/\/$/, "")}/?p=${pointId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=4&ecc=M&format=svg`;
  }, [publicBaseUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-row w-full h-full bg-gray-950 text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar - Collapsible */}
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-64'} bg-black border-r border-gray-900 flex-shrink-0 flex flex-col justify-between transition-all duration-300 print:hidden shadow-2xl z-30`}>
        <div>
          <div className={`h-20 flex items-center px-5 border-b border-gray-900 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
             <div className="flex items-center overflow-hidden">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl italic shadow-lg shrink-0">C</div>
               {!isSidebarCollapsed && <span className="ml-3 font-black text-xl italic uppercase tracking-tighter whitespace-nowrap">Centerline</span>}
             </div>
             <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className={`p-2 text-gray-500 hover:text-white transition-colors ${isSidebarCollapsed ? 'absolute -right-3 top-7 bg-blue-600 text-white rounded-full border border-blue-400 shadow-lg p-1' : ''}`}
                title={isSidebarCollapsed ? "Expandera" : "Fäll in"}
              >
               {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
             </button>
          </div>
          
          <nav className="p-3 space-y-2 mt-4">
            {[
              { id: 'overview', icon: Map, label: 'Karta' },
              { id: 'table', icon: List, label: 'Lista' },
              { id: 'phasing', icon: Activity, label: 'Synk' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-900'}`}
                title={isSidebarCollapsed ? tab.label : ''}
              >
                <tab.icon size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{tab.label}</span>}
              </button>
            ))}
            
            <div className="pt-4 border-t border-gray-800 mt-4">
              <button 
                onClick={() => setIsAddingPoint(true)} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 hover:text-white border border-gray-800 transition-all overflow-hidden group"
              >
                <Plus size={20} className="shrink-0 group-hover:rotate-90 transition-transform" />
                {!isSidebarCollapsed && <span className="font-bold text-sm uppercase whitespace-nowrap">Ny Punkt</span>}
              </button>
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-gray-800">
           <button 
            onClick={() => setIsSettingsOpen(true)} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors"
            title={isSidebarCollapsed ? "Inställningar" : ""}
           >
              <Settings size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="font-bold">Inställningar</span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto w-full p-6 lg:p-10 space-y-8">
          
          <header className="flex justify-between items-center print:border-b print:pb-4 print:border-gray-300">
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white">Centerline TP-24</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 print:text-black">Optimering & Kraschprevention</p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
               <button 
                onClick={handlePrint} 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 font-bold text-xs uppercase transition-all"
               >
                 <Printer size={16} /> Skriv ut rapport
               </button>
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-900/20 rounded-xl border border-blue-800/50">
                  <Cloud size={14} className="text-blue-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System Live</span>
               </div>
            </div>
          </header>

          <div className="space-y-10">
            {activeTab === 'overview' && (
              <>
                <div className="bg-gray-900 rounded-[2.5rem] p-2 border border-gray-800 shadow-2xl print:shadow-none print:border-none print:p-0">
                  <MachineMap 
                    points={points} 
                    layout={layout}
                    onPointClick={setSelectedPoint}
                    selectedPointId={selectedPoint?.id}
                    customMapUrl={customMapUrl}
                  />
                </div>
                
                <div className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden print:border-gray-200">
                  <div className="grid grid-cols-12 px-8 py-5 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800 print:bg-gray-100 print:text-black">
                    <div className="col-span-1">#</div>
                    <div className="col-span-7">Beskrivning</div>
                    <div className="col-span-2 text-right">Målvärde</div>
                    <div className="col-span-2 text-center print:hidden">QR</div>
                  </div>
                  <div className="divide-y divide-gray-800/50 print:divide-gray-200">
                    {points.sort((a,b) => a.number - b.number).map((point) => (
                      <div 
                        key={point.id} 
                        onClick={() => setSelectedPoint(point)} 
                        className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-600/5 cursor-pointer transition-colors print:text-black print:hover:bg-transparent"
                      >
                        <div className="col-span-1 font-black italic text-xl text-gray-600 print:text-black">{point.number}</div>
                        <div className="col-span-7">
                          <div className="font-bold text-gray-200 text-lg print:text-black">{point.name}</div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest print:text-gray-400">{point.zone}</div>
                        </div>
                        <div className="col-span-2 font-mono text-2xl font-black text-green-500 text-right print:text-black">{point.targetValue}</div>
                        <div className="col-span-2 flex justify-center print:hidden">
                          <div className="bg-white p-1 rounded shadow-md group-hover:scale-[3] transition-transform origin-center">
                            <img src={getQrCodeUrl(point.id, 60)} alt="QR" className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'table' && (
              <ParameterTable points={points} onPointSelect={setSelectedPoint} getQrUrl={getQrCodeUrl} />
            )}

            {activeTab === 'phasing' && (
              <PhasingGauge currentDegree={0} points={points} />
            )}
          </div>
        </div>
      </main>

      {/* Overlays */}
      {isAddingPoint && (
        <AddPointForm 
          existingPoints={points} 
          layout={layout} 
          onSave={(p) => { setPoints([...points, p]); setIsAddingPoint(false); }} 
          onCancel={() => setIsAddingPoint(false)} 
        />
      )}
      {editingPoint && (
        <AddPointForm 
          existingPoints={points} 
          layout={layout} 
          initialData={editingPoint} 
          onSave={(p) => { setPoints(points.map(x => x.id === p.id ? p : x)); setEditingPoint(null); setSelectedPoint(p); }} 
          onCancel={() => { setEditingPoint(null); setSelectedPoint(editingPoint); }} 
        />
      )}
      {isSettingsOpen && (
        <SettingsModal 
          currentMapUrl={customMapUrl} 
          currentPublicUrl={publicBaseUrl}
          onSave={(s) => { setCustomMapUrl(s.mapUrl); setPublicBaseUrl(s.publicUrl); }} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
      {selectedPoint && !editingPoint && (
        <PointDetail 
          point={selectedPoint} 
          onUpdate={(p) => setPoints(points.map(x => x.id === p.id ? p : x))} 
          onEdit={() => { setEditingPoint(selectedPoint); setSelectedPoint(null); }} 
          onClose={() => setSelectedPoint(null)} 
        />
      )}
    </div>
  );
};

export default App;