
import React, { useState, useEffect, useCallback } from 'react';
import { MACHINE_POINTS, DEFAULT_MACHINE_LAYOUT } from './constants';
import { MachinePoint, MachineModule } from './types';
import MachineMap from './components/MachineMap';
import ParameterTable from './components/ParameterTable';
import PointDetail from './components/PointDetail';
import PhasingGauge from './components/PhasingGauge';
import AddPointForm from './components/AddPointForm';
import SettingsModal from './components/SettingsModal';
import ModuleEditor from './components/ModuleEditor';
import { Map, List, Settings, Activity, Cloud, Printer, ChevronLeft, ChevronRight, Plus, Edit3, BoxSelect, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'phasing'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  const [isDesignMode, setIsDesignMode] = useState(false);
  
  // Modals & States
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);
  const [editingModule, setEditingModule] = useState<MachineModule | null>(null);
  
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

  const handleModuleUpdate = (updatedMod: MachineModule) => {
    setLayout(layout.map(m => m.id === updatedMod.id ? updatedMod : m));
    setEditingModule(null);
  };

  const handleModuleDelete = (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna maskinenhet?")) {
      setLayout(layout.filter(m => m.id !== id));
      setEditingModule(null);
    }
  };

  const addNewModule = () => {
    const newId = `m${layout.length + 1}_${Date.now()}`;
    const newMod: MachineModule = {
      id: newId,
      label: 'NY ENHET',
      x: 10,
      y: 10,
      width: 15,
      height: 10,
      color: '#3b82f6',
      hasFill: false
    };
    setLayout([...layout, newMod]);
    setEditingModule(newMod);
  };

  const handleMapClick = (x: number, y: number) => {
    if (isDesignMode && selectedPoint) {
      // Reposition the selected point
      const updatedPoints = points.map(p => 
        p.id === selectedPoint.id 
          ? { ...p, coordinates: { x, y } } 
          : p
      );
      setPoints(updatedPoints);
      setSelectedPoint({ ...selectedPoint, coordinates: { x, y } });
    }
  };

  const handlePointClick = (point: MachinePoint) => {
    if (isDesignMode) {
      // Toggle selection for moving
      setSelectedPoint(point.id === selectedPoint?.id ? null : point);
    } else {
      setSelectedPoint(point);
    }
  };

  const currentPrintDate = new Date().toLocaleString('sv-SE', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="flex flex-row w-full h-full bg-gray-950 text-gray-100 overflow-hidden font-sans">
      
      {/* Sidebar */}
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:bg-gray-900'}`}
                title={isSidebarCollapsed ? tab.label : ''}
              >
                <tab.icon size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{tab.label}</span>}
              </button>
            ))}
            
            <div className="pt-4 border-t border-gray-800 mt-4 space-y-2">
              <button 
                onClick={() => setIsAddingPoint(true)} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900 text-gray-300 hover:text-white border border-gray-800 transition-all overflow-hidden group"
              >
                <Plus size={20} className="shrink-0 group-hover:rotate-90 transition-transform" />
                {!isSidebarCollapsed && <span className="font-bold text-sm uppercase whitespace-nowrap">Ny Punkt</span>}
              </button>

              {isDesignMode && (
                <button 
                  onClick={addNewModule} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-900/20 text-blue-300 hover:text-white border border-blue-800/50 transition-all overflow-hidden group"
                >
                  <BoxSelect size={20} className="shrink-0" />
                  {!isSidebarCollapsed && <span className="font-bold text-sm uppercase whitespace-nowrap">Ny Modul</span>}
                </button>
              )}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-y-auto relative">
        <div className="max-w-6xl mx-auto w-full p-6 lg:p-10 space-y-8 print:max-w-none print:p-0">
          
          <header className="flex justify-between items-center print:border-b-2 print:border-black print:mb-8 print:pb-4">
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white print:text-black print:text-4xl">CENTERLINE RAPPORT: TP-24</h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 print:text-black print:text-sm">Optimering & Fas-Synkronisering | SMI LSK Series</p>
            </div>
            <div className="flex items-center gap-3 print:hidden">
               <button 
                onClick={() => { setIsDesignMode(!isDesignMode); setSelectedPoint(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${isDesignMode ? 'bg-amber-600 text-black border-amber-400 shadow-lg shadow-amber-900/50' : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white'}`}
               >
                 <Edit3 size={14} /> {isDesignMode ? 'Avsluta Designläge' : 'Aktivera Designläge'}
               </button>
               <button 
                onClick={handlePrint} 
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl border border-blue-400 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40"
               >
                 <Printer size={16} /> Skriv ut A3 / PDF
               </button>
            </div>
            <div className="hidden print:block text-right">
              <p className="text-xs font-bold uppercase text-black">Utskrivet den</p>
              <p className="text-sm font-black text-black">{currentPrintDate}</p>
            </div>
          </header>

          <div className="space-y-10">
            {/* Overview / Map (Alltid med vid utskrift) */}
            <section className={`${activeTab === 'overview' ? 'block' : 'print:block hidden'} space-y-4`}>
                <div className="bg-gray-900 rounded-[2.5rem] p-2 border border-gray-800 shadow-2xl print:shadow-none print:border-2 print:border-black print:p-0 print:rounded-none relative overflow-hidden">
                  <MachineMap 
                    points={points} 
                    layout={layout}
                    onPointClick={handlePointClick}
                    onModuleClick={isDesignMode ? setEditingModule : undefined}
                    onMapClick={isDesignMode ? handleMapClick : undefined}
                    selectedPointId={selectedPoint?.id}
                    customMapUrl={customMapUrl}
                    editMode={isDesignMode}
                  />
                </div>
                
                {!isDesignMode && (
                   <div className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden print:border-2 print:border-black print:rounded-none">
                    <div className="grid grid-cols-12 px-8 py-5 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 print:bg-gray-100 print:text-black print:border-black">
                      <div className="col-span-1">#</div>
                      <div className="col-span-7">Kontrollpunkt</div>
                      <div className="col-span-2 text-right">Centerline</div>
                      <div className="col-span-2 text-center print:hidden">System</div>
                      <div className="hidden print:block col-span-2 text-right italic font-normal">Kontroll / Signatur</div>
                    </div>
                    <div className="divide-y divide-gray-800/50 print:divide-black">
                      {points.sort((a,b) => a.number - b.number).map((point) => (
                        <div 
                          key={point.id} 
                          onClick={() => setSelectedPoint(point)} 
                          className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-600/5 cursor-pointer transition-all print:text-black print:hover:bg-transparent group"
                        >
                          <div className="col-span-1 font-black italic text-xl text-gray-700 group-hover:text-blue-500 transition-colors print:text-black">{point.number}</div>
                          <div className="col-span-7">
                            <div className="font-bold text-gray-200 text-lg group-hover:text-white print:text-black">{point.name}</div>
                            <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest print:text-gray-400">{point.zone}</div>
                          </div>
                          <div className="col-span-2 font-mono text-2xl font-black text-green-500 text-right print:text-black">{point.targetValue}</div>
                          <div className="col-span-2 flex justify-center print:hidden">
                            <div className="bg-white p-1 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                              <img src={getQrCodeUrl(point.id, 60)} alt="QR" className="w-8 h-8" />
                            </div>
                          </div>
                          <div className="hidden print:block col-span-2 border-l border-gray-300 h-8 ml-4"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </section>

            {activeTab === 'table' && !isDesignMode && (
              <ParameterTable points={points} onPointSelect={setSelectedPoint} getQrUrl={getQrCodeUrl} />
            )}

            {activeTab === 'phasing' && !isDesignMode && (
              <PhasingGauge currentDegree={0} points={points} />
            )}
          </div>

          {/* Rapport-fot för utskrift */}
          <footer className="print-footer space-y-6">
            <div className="grid grid-cols-2 gap-20">
              <div className="border-t border-black pt-2">
                <p className="text-[10pt] font-bold">Utförd av:</p>
                <div className="h-12"></div>
                <p className="text-[8pt] text-gray-600 italic">Namnförtydligande</p>
              </div>
              <div className="border-t border-black pt-2">
                <p className="text-[10pt] font-bold">Godkänd av (Team Leader):</p>
                <div className="h-12"></div>
                <p className="text-[8pt] text-gray-600 italic">Signatur & Datum</p>
              </div>
            </div>
            <p className="text-[8pt] text-center text-gray-500 pt-10">
              Centerline Pro System - Genererad Rapport - Sida 1 av 1
            </p>
          </footer>
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
      {editingModule && (
        <ModuleEditor 
          module={editingModule}
          onSave={handleModuleUpdate}
          onDelete={handleModuleDelete}
          onClose={() => setEditingModule(null)}
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
      {selectedPoint && !editingPoint && !isDesignMode && (
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
