
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
import { Map, List, Settings, Activity, Printer, ChevronLeft, ChevronRight, Plus, Edit3, BookOpen, Square, Crosshair, Image as ImageIcon, Sun, Moon } from 'lucide-react';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'phasing' | 'guide'>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_collapsed');
      // Default to collapsed on mobile/small screens, but respect preference on desktop
      return saved === 'false' ? false : true;
    }
    return true;
  });
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });
  const [isDesignMode, setIsDesignMode] = useState(false);
  
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);
  const [editingModule, setEditingModule] = useState<MachineModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  const [points, setPoints] = useState<MachinePoint[]>([]);
  const [layout, setLayout] = useState<MachineModule[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        console.warn("Supabase client not initialized. Using local defaults.");
        setPoints(MACHINE_POINTS);
        setLayout(DEFAULT_MACHINE_LAYOUT);
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('app_state')
          .select('*');
        
        if (error) throw error;

        const pointsData = data?.find(item => item.key === 'points')?.value;
        const layoutData = data?.find(item => item.key === 'layout')?.value;
        
        if (pointsData) {
          setPoints(pointsData);
        } else {
          setPoints(MACHINE_POINTS);
        }
        
        if (layoutData) {
          setLayout(layoutData);
        } else {
          setLayout(DEFAULT_MACHINE_LAYOUT);
        }
      } catch (error) {
        console.error("Failed to fetch data from Supabase:", error);
        // Fallback to constants if fetch fails
        setPoints(MACHINE_POINTS);
        setLayout(DEFAULT_MACHINE_LAYOUT);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const [customMapUrl, setCustomMapUrl] = useState<string | null>(() => localStorage.getItem('centerline_map_url'));
  const [publicBaseUrl, setPublicBaseUrl] = useState<string>(() => localStorage.getItem('centerline_public_url') || '');

  // Save points to Supabase
  const savePoints = async (newPoints: MachinePoint[]) => {
    if (!supabase) {
      alert("Supabase är inte konfigurerat. Kan inte spara.");
      return;
    }
    
    const previousPoints = [...points];
    setPoints(newPoints);
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const { error } = await supabase
        .from('app_state')
        .upsert({ key: 'points', value: newPoints });
      
      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error: any) {
      console.error("Failed to save points to Supabase:", error);
      setPoints(previousPoints); // Rollback
      setSaveStatus('error');
      alert(`Kunde inte spara punkter: ${error.message || 'Okänt fel'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Save layout to Supabase
  const saveLayout = async (newLayout: MachineModule[]) => {
    if (!supabase) {
      alert("Supabase är inte konfigurerat. Kan inte spara.");
      return;
    }
    
    const previousLayout = [...layout];
    setLayout(newLayout);
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const { error } = await supabase
        .from('app_state')
        .upsert({ key: 'layout', value: newLayout });
      
      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error: any) {
      console.error("Failed to save layout to Supabase:", error);
      setLayout(previousLayout); // Rollback
      setSaveStatus('error');
      alert(`Kunde inte spara layout: ${error.message || 'Okänt fel'}`);
    } finally {
      setIsSaving(false);
    }
  };

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
    localStorage.setItem('sidebar_collapsed', isSidebarCollapsed.toString());
    
    // Theme handling
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Map URL handling
    try {
      if (customMapUrl) {
        localStorage.setItem('centerline_map_url', customMapUrl);
      } else {
        localStorage.removeItem('centerline_map_url');
      }
    } catch (e) {
      console.error("Failed to save map url to local storage:", e);
      alert("Bilden är för stor för att sparas i webbläsaren. Vänligen använd en mindre bild (under 5MB).");
      setCustomMapUrl(null);
    }
    
    localStorage.setItem('centerline_public_url', publicBaseUrl);
  }, [isSidebarCollapsed, customMapUrl, publicBaseUrl, theme]);

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
    saveLayout(layout.map(m => m.id === updatedMod.id ? updatedMod : m));
    setEditingModule(null);
  };

  const handleModuleDelete = (id: string) => {
    if (confirm("Är du säker på att du vill ta bort denna maskinenhet?")) {
      saveLayout(layout.filter(m => m.id !== id));
      setEditingModule(null);
    }
  };

  const handleMapClick = (x: number, y: number) => {
    if (isDesignMode && selectedPoint) {
      const updatedPoints = points.map(p => 
        p.id === selectedPoint.id ? { ...p, coordinates: { x, y } } : p
      );
      savePoints(updatedPoints);
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

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center w-full h-full ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Laddar Systemdata...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-row w-full h-full ${theme === 'dark' ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'} overflow-hidden font-sans print:bg-white print:text-black print:overflow-visible transition-colors duration-300`}>
      
      {/* Sidebar / Mobile Nav */}
      <aside className={`
        fixed bottom-0 left-0 right-0 h-16 ${theme === 'dark' ? 'bg-black border-gray-900' : 'bg-white border-gray-200'} border-t flex flex-row justify-around items-center z-40 print:hidden
        md:relative md:h-auto md:w-64 md:border-r md:border-t-0 md:flex-col md:justify-between md:items-stretch
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'}
        transition-all duration-300 shadow-2xl
      `}>
        <div className="hidden md:block">
          <div className={`h-20 flex items-center px-5 border-b ${theme === 'dark' ? 'border-gray-900' : 'border-gray-200'} relative`}>
             <div className="flex items-center overflow-hidden">
               <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl italic shadow-lg shrink-0 text-white">C</div>
               {!isSidebarCollapsed && <span className={`ml-3 font-black text-xl italic uppercase tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Centerline</span>}
             </div>
             
             <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                }} 
                className={`absolute -right-3.5 top-7 w-7 h-7 ${theme === 'dark' ? 'bg-gray-800 text-gray-400 hover:text-white border-gray-700' : 'bg-white text-gray-500 hover:text-gray-900 border-gray-200'} rounded-full border shadow-xl flex items-center justify-center z-[60] transition-all hover:scale-110 active:scale-90 cursor-pointer group`}
                title={isSidebarCollapsed ? "Öppna meny" : "Stäng meny"}
              >
               <div className="transition-transform duration-300 group-hover:scale-110">
                 {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
               </div>
             </button>
          </div>
          
          <nav className="p-3 space-y-2 mt-4">
            {[
              { id: 'overview', icon: Map, label: 'Karta' },
              { id: 'phasing', icon: Activity, label: 'Synk' },
              { id: 'guide', icon: BookOpen, label: 'Guide' }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : (theme === 'dark' ? 'text-gray-500 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100')}`}
              >
                <tab.icon size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{tab.label}</span>}
              </button>
            ))}
            
            <div className={`pt-4 mt-4 border-t ${theme === 'dark' ? 'border-gray-900' : 'border-gray-200'} space-y-2`}>
              <button 
                onClick={() => { setIsDesignMode(!isDesignMode); setSelectedPoint(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isDesignMode ? 'bg-amber-600 text-black shadow-lg' : (theme === 'dark' ? 'text-gray-500 hover:bg-gray-900' : 'text-gray-600 hover:bg-gray-100')}`}
              >
                <Edit3 size={20} className="shrink-0" />
                {!isSidebarCollapsed && <span className="font-bold">{isDesignMode ? 'Lås Layout' : 'Redigera'}</span>}
              </button>
              
              <button 
                onClick={handlePrint} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${theme === 'dark' ? 'text-gray-500 hover:bg-gray-900 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
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
             <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="flex flex-col items-center justify-center min-w-[50px] p-1 rounded-lg text-gray-500"
                title={theme === 'dark' ? "Byt till ljust tema" : "Byt till mörkt tema"}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-[9px] font-bold mt-1">{theme === 'dark' ? 'Ljust' : 'Mörkt'}</span>
             </button>
             <button onClick={() => setIsSettingsOpen(true)} className="flex flex-col items-center justify-center min-w-[50px] p-1 rounded-lg text-gray-500">
                <Settings size={20} />
                <span className="text-[9px] font-bold mt-1">Inställn.</span>
             </button>
        </nav>

        <div className={`hidden md:block p-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
           <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              title={theme === 'dark' ? "Byt till ljust tema" : "Byt till mörkt tema"}
           >
              {theme === 'dark' ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
              {!isSidebarCollapsed && <span className="font-bold">{theme === 'dark' ? 'Ljust tema' : 'Mörkt tema'}</span>}
           </button>
           <button onClick={() => setIsSettingsOpen(true)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
              <Settings size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="font-bold">Inställningar</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 flex flex-col min-w-0 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'} overflow-y-auto relative print:bg-white print:overflow-visible pb-20 md:pb-0 transition-colors duration-300`}>
        <div className="max-w-6xl mx-auto w-full p-6 lg:p-10 space-y-8 print:max-w-none print:p-0">
          
          <header className={`flex justify-between items-end border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} pb-6 print:border-black print:mb-10`}>
            <div>
              <h1 className={`text-3xl font-black uppercase italic tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-gray-900'} print:text-black print:text-4xl`}>CENTERLINE: TP-24</h1>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1 print:text-black print:text-xs italic">Systemdokumentation för optimerad produktion</p>
            </div>
            
            <div className="hidden print:block text-right">
              <p className="text-sm font-black text-black uppercase tracking-widest">{currentPrintDate}</p>
            </div>

            {/* Save Status Indicator */}
            {!isLoading && saveStatus !== 'idle' && (
              <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className={`px-4 py-2 rounded-full shadow-2xl border flex items-center gap-3 ${
                  saveStatus === 'saving' ? 'bg-blue-600 border-blue-500 text-white' :
                  saveStatus === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
                  'bg-red-600 border-red-500 text-white'
                }`}>
                  {saveStatus === 'saving' && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {saveStatus === 'success' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {saveStatus === 'saving' ? 'Sparar...' : saveStatus === 'success' ? 'Sparat!' : 'Fel vid sparning'}
                  </span>
                </div>
              </div>
            )}
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
                    className={`flex items-center gap-2 px-4 py-2 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-300'} rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all`}
                  >
                    <ImageIcon size={14} /> Ändra Bakgrundsbild
                  </button>
                </div>
              )}
              <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-[2.5rem] p-2 border shadow-2xl print:border-2 print:border-black print:p-0 print:rounded-none relative overflow-hidden print:bg-white transition-colors duration-300`}>
                <MachineMap 
                  points={points} 
                  layout={layout}
                  onPointClick={handlePointClick}
                  onModuleClick={isDesignMode ? setEditingModule : undefined}
                  onMapClick={isDesignMode ? handleMapClick : undefined}
                  selectedPointId={selectedPoint?.id}
                  customMapUrl={customMapUrl}
                  editMode={isDesignMode}
                  theme={theme}
                />
              </div>
            </section>
                
            {/* UNIFIERAD PARAMETERTABELL (Ersätter Checklistan) */}
            <section className={`${activeTab === 'overview' ? 'block' : 'print:block hidden'} print:mt-10`}>
              <ParameterTable 
                points={points} 
                sections={layout.map(m => m.label)}
                onPointSelect={setSelectedPoint} 
                onUpdatePoint={(p) => savePoints(points.map(x => x.id === p.id ? p : x))}
                getQrUrl={getQrCodeUrl} 
              />
            </section>

            {/* Skärm-specifika flikar */}
            <div className="print:hidden">
              {activeTab === 'phasing' && <PhasingGauge currentDegree={0} points={points} theme={theme} />}
              {activeTab === 'guide' && <Guide theme={theme} />}
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
          onSave={(p) => { savePoints([...points, p]); setIsAddingPoint(false); }} 
          onCancel={() => setIsAddingPoint(false)} 
          theme={theme}
        />
      )}
      {editingPoint && (
        <AddPointForm 
          existingPoints={points} 
          layout={layout} 
          initialData={editingPoint} 
          onSave={(p) => { 
            savePoints(points.map(x => x.id === editingPoint.id ? p : x)); 
            setEditingPoint(null); 
            setSelectedPoint(p); 
          }} 
          onCancel={() => { setEditingPoint(null); setSelectedPoint(editingPoint); }} 
          theme={theme}
        />
      )}
      {editingModule && (
        <ModuleEditor 
          module={editingModule}
          onSave={handleModuleUpdate}
          onDelete={handleModuleDelete}
          onClose={() => setEditingModule(null)}
          theme={theme}
        />
      )}
      {isSettingsOpen && (
        <SettingsModal 
          currentMapUrl={customMapUrl} 
          currentPublicUrl={publicBaseUrl}
          onSave={(s) => { setCustomMapUrl(s.mapUrl); setPublicBaseUrl(s.publicUrl); }} 
          onClose={() => setIsSettingsOpen(false)} 
          theme={theme}
        />
      )}
      {selectedPoint && !editingPoint && !isDesignMode && (
        <PointDetail 
          point={selectedPoint} 
          onUpdate={(p) => savePoints(points.map(x => x.id === p.id ? p : x))} 
          onEdit={() => { setEditingPoint(selectedPoint); setSelectedPoint(null); }} 
          onClose={() => setSelectedPoint(null)} 
          theme={theme}
        />
      )}
    </div>
  );
};

export default App;
