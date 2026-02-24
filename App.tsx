
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
import Guide from './components/Guide';
import { Map, List, Settings, Activity, Printer, ChevronLeft, ChevronRight, Plus, Edit3, BookOpen, Square, Crosshair, Image as ImageIcon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'phasing' | 'guide'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');
  const [isDesignMode, setIsDesignMode] = useState(false);
  
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);
  const [editingModule, setEditingModule] = useState<MachineModule | null>(null);
  
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

  // Handle deep-linking via QR codes (?p=ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p');
    if (pointId && points.length > 0) {
      const point = points.find(p => p.id === pointId);
      if (point) {
        setSelectedPoint(point);
        // Clean up URL without reloading to keep it tidy
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [points]);

  useEffect(() => {
    localStorage.setItem('centerline_points', JSON.stringify(points));
    localStorage.setItem('centerline_layout', JSON.stringify(layout));
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed.toString());
    if (customMapUrl) {
      localStorage.setItem('centerline_map_url', customMapUrl);
    } else {
      localStorage.removeItem('centerline_map_url');
    }
    localStorage.setItem('centerline_public_url', publicBaseUrl);
  }, [points, layout, isSidebarCollapsed, customMapUrl, publicBaseUrl]);

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

  const handleMapClick = (x: number, y: number) => {
    if (isDesignMode && selectedPoint) {
      const updatedPoints = points.map(p => 
        p.id === selectedPoint.id ? { ...p, coordinates: { x, y } } : p
      );
      setPoints(updatedPoints);
      setSelectedPoint({ ...selectedPoint, coordinates: { x, y } });
    }
  };

  const handlePointClick = (point: MachinePoint) => {
    if (isDesignMode) {
      setSelectedPoint(point.id === selectedPoint?.id ? null : point);
    } else {
      setSelectedPoint(point);
    }
  };

  const currentPrintDate = new Date().toLocaleString('sv-SE', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <div className="flex flex-row w-full h-full bg-gray-950 text-gray-100 overflow-hidden font-sans print:bg-white print:text-black print:overflow-visible">
      
      {/* Sidebar / Mobile Nav */}
      <aside className={`
        fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-900 flex flex-row justify-around items-center z-40 print:hidden
        md:relative md:h-auto md:w-64 md:border-r md:border-t-0 md:flex-col md:justify-between md:items-stretch
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        transition-all duration-300 shadow-2xl
      `}>
        <div className="hidden md:block">
          <div className={`h-20 flex items-center px-5 border-b border-gray-900 ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
             <div className="flex items-center overflow-hidden">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl italic shadow-lg shrink-0 text-white">C</div>
               {!isSidebarCollapsed && <span className="ml-3 font-black text-xl italic uppercase tracking-tighter text-white">Centerline</span>}
             </div>
             
             <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                className={`flex items-center justify-center transition-all duration-300 z-40
                  ${isSidebarCollapsed 
                    ? 'absolute -right-3 top-7 w-6 h-6 bg-gray-800 text-gray-400 hover:text-white rounded-full border border-gray-700 shadow-xl' 
                    : 'p-2 text-gray-500 hover:text-white'}`}
              >
               {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={18} />}
             </button>
          </div>
          
          <nav className="p-3 space-y-2 mt-4">
            {[
              { id: 'overview', icon: Map, label: 'Karta' },
              { id: 'table', icon: List, label: 'Lista' },
              { id: 'phasing', icon: Activity, label: 'Synk' },
              { id: 'guide', icon: BookOpen, label: 'Guide' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-900'}`}
              >
                <tab.icon size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{tab.label}</span>}
              </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-gray-900 space-y-2">
              <button 
                onClick={() => { setIsDesignMode(!isDesignMode); setSelectedPoint(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDesignMode ? 'bg-amber-600 text-black shadow-lg' : 'text-gray-500 hover:bg-gray-900'}`}
              >
                <Edit3 size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{isDesignMode ? 'Lås Layout' : 'Redigera'}</span>}
              </button>
              
              <button 
                onClick={handlePrint} 
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-900 hover:text-white transition-all"
              >
                <Printer size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">Skriv ut / PDF</span>}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden w-full justify-around items-center h-full px-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', icon: Map, label: 'Karta' },
              { id: 'table', icon: List, label: 'Lista' },
              { id: 'phasing', icon: Activity, label: 'Synk' },
              { id: 'guide', icon: BookOpen, label: 'Guide' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex flex-col items-center justify-center min-w-[50px] p-1 rounded-lg transition-all ${activeTab === tab.id ? 'text-blue-500' : 'text-gray-500'}`}
              >
                <tab.icon size={20} />
                <span className="text-[9px] font-bold mt-1">{tab.label}</span>
              </button>
            ))}
             <button 
                onClick={handlePrint} 
                className="flex flex-col items-center justify-center min-w-[50px] p-1 rounded-lg text-gray-500"
              >
                <Printer size={20} />
                <span className="text-[9px] font-bold mt-1">Print</span>
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center justify-center min-w-[50px] p-1 rounded-lg text-gray-500">
                <Settings size={20} />
                <span className="text-[9px] font-bold mt-1">Inställn.</span>
             </button>
        </nav>

        <div className="hidden md:block p-3 border-t border-gray-800">
           <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors">
              <Settings size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="font-bold">Inställningar</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-y-auto relative print:bg-white print:overflow-visible pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto w-full p-6 lg:p-10 space-y-8 print:max-w-none print:p-0">
          
          <header className="flex justify-between items-end border-b border-gray-800 pb-6 print:border-black print:mb-10">
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-white print:text-black print:text-4xl">CENTERLINE: TP-24</h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 print:text-black print:text-xs italic">Systemdokumentation för optimerad produktion</p>
            </div>
            
            <div className="hidden print:block text-right">
              <p className="text-sm font-black text-black uppercase tracking-widest">{currentPrintDate}</p>
            </div>
          </header>

          <div className="space-y-12 print:space-y-10">
            {/* MASKINSKISS */}
            <section className={`${activeTab === 'overview' ? 'block' : 'print:block hidden'} print:break-inside-avoid`}>
              {isDesignMode && (
                <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-top duration-300">
                  <button 
                    onClick={() => {
                      const newId = `m${Date.now()}`;
                      const newModule: MachineModule = {
                        id: newId,
                        label: 'NY ENHET',
                        x: 40,
                        y: 20,
                        width: 15,
                        height: 10,
                        color: '#3b82f6',
                        hasFill: false,
                        fontSize: 2,
                        wrapText: false
                      };
                      setLayout([...layout, newModule]);
                      setEditingModule(newModule);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
                  >
                    <Square size={14} /> Lägg till Maskindel
                  </button>
                  <button 
                    onClick={() => setIsAddingPoint(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all"
                  >
                    <Crosshair size={14} /> Lägg till Punkt
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-black text-[10px] uppercase tracking-widest border border-gray-700 transition-all"
                  >
                    <ImageIcon size={14} /> Ändra Bakgrundsbild
                  </button>
                </div>
              )}
              <div className="bg-gray-900 rounded-[2.5rem] p-2 border border-gray-800 shadow-2xl print:border-2 print:border-black print:p-0 print:rounded-none relative overflow-hidden print:bg-white">
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
            </section>
                
            {/* CHECKLISTA - Visas alltid vid utskrift oavsett flik */}
            <section className={`${(activeTab !== 'phasing' && activeTab !== 'guide') ? 'block' : 'print:block hidden'} print:mt-10`}>
              <div className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden print:border-2 print:border-black print:rounded-none print:bg-white">
                <div className="grid grid-cols-12 px-8 py-5 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] border-b border-gray-800 print:bg-gray-100 print:text-black print:border-black">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4 md:col-span-5 print:col-span-4">Beskrivning</div>
                  <div className="col-span-3 md:col-span-4 print:col-span-3 text-right">Målvärde & Tolerans</div>
                  <div className="col-span-2 text-center print:block">QR</div>
                  <div className="col-span-2 text-right italic font-normal print:block hidden">Signatur</div>
                </div>
                <div className="divide-y divide-gray-800/50 print:divide-black">
                  {[...points].sort((a,b) => a.number - b.number).map((point) => (
                    <div 
                      key={point.id} 
                      onClick={() => setSelectedPoint(point)} 
                      className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-600/5 cursor-pointer transition-all print:text-black print:py-5 print:break-inside-avoid"
                    >
                      <div className="col-span-1 font-black italic text-xl text-gray-700 print:text-black">{point.number}</div>
                      <div className="col-span-4 md:col-span-5 print:col-span-4">
                        <div className="font-bold text-gray-200 text-lg print:text-black leading-tight">{point.name}</div>
                        <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest print:text-gray-500">{point.measureMethod}</div>
                      </div>
                      <div className="col-span-3 md:col-span-4 print:col-span-3 text-right">
                        <span className="font-mono text-2xl font-black text-green-500 print:text-black">{point.targetValue}</span>
                        <span className="block text-[10px] text-gray-500 font-bold print:text-gray-700 italic">Tol: {point.tolerance}</span>
                      </div>
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="bg-white p-1 rounded shadow-md group-hover:scale-110 transition-transform print:shadow-none print:border print:border-black">
                          <img src={getQrCodeUrl(point.id, 60)} alt="QR" className="w-8 h-8" />
                        </div>
                      </div>

                      <div className="hidden print:block col-span-2 border-b border-gray-300 h-8 ml-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Skärm-specifika flikar */}
            <div className="print:hidden">
              {activeTab === 'table' && <ParameterTable points={points} onPointSelect={setSelectedPoint} getQrUrl={getQrCodeUrl} />}
              {activeTab === 'phasing' && <PhasingGauge currentDegree={0} points={points} />}
              {activeTab === 'guide' && <Guide />}
            </div>
          </div>

          {/* SIGNATURFÄLT - Hamnar alltid i slutet av dokumentet vid utskrift */}
          <footer className="print-only mt-20 pt-10 border-t-2 border-black">
            <div className="grid grid-cols-2 gap-20">
              <div>
                <p className="text-sm font-bold uppercase mb-12">Utförd av (Operatör):</p>
                <div className="border-b-2 border-black w-full h-px"></div>
                <p className="mt-2 text-[8pt] italic text-gray-500">Namnförtydligande & Datum</p>
              </div>
              <div>
                <p className="text-sm font-bold uppercase mb-12">Godkänd av (Team Leader):</p>
                <div className="border-b-2 border-black w-full h-px"></div>
                <p className="mt-2 text-[8pt] italic text-gray-500">Namnförtydligande & Datum</p>
              </div>
            </div>
            <p className="mt-16 text-center text-[7pt] text-gray-400 uppercase tracking-widest">
              Centerline Pro System - Sida 1 av 1
            </p>
          </footer>
        </div>
      </main>

      {/* Modaler & Overlays */}
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
          onSave={(p) => { 
            setPoints(points.map(x => x.id === editingPoint.id ? p : x)); 
            setEditingPoint(null); 
            setSelectedPoint(p); 
          }} 
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
