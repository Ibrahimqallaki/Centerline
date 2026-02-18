
import React, { useState, useEffect, useCallback } from 'react';
import { MACHINE_POINTS } from './constants';
import { MachinePoint } from './types';
import MachineMap from './components/MachineMap';
import ParameterTable from './components/ParameterTable';
import PointDetail from './components/PointDetail';
import PhasingGauge from './components/PhasingGauge';
import AddPointForm from './components/AddPointForm';
import SettingsModal from './components/SettingsModal';
import { Map, List, Settings, Activity, Globe, ArrowRight, Cloud } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'table' | 'phasing'>('overview');
  
  // Modals & States
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);
  
  // Points logic
  const [points, setPoints] = useState<MachinePoint[]>(() => {
    try {
      const saved = localStorage.getItem('centerline_points');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return MACHINE_POINTS.map(p => ({ ...p, visibleOnMap: true }));
  });

  const [customMapUrl, setCustomMapUrl] = useState<string | null>(() => localStorage.getItem('centerline_map_url'));
  const [publicBaseUrl, setPublicBaseUrl] = useState<string>(() => localStorage.getItem('centerline_public_url') || '');

  // Environment detection
  const isCloudDeployment = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  const effectiveBaseUrl = isCloudDeployment ? window.location.origin : (publicBaseUrl || window.location.origin);
  const showSetupWizard = !isCloudDeployment && (!publicBaseUrl || publicBaseUrl.includes('localhost'));

  /**
   * Generates a QR code for mobile users.
   */
  const getQrCodeUrl = useCallback((pointId: string, size: number = 200) => {
    try {
      const base = effectiveBaseUrl.replace(/\/$/, "");
      const targetUrl = `${base}/?p=${pointId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=4&ecc=M&format=svg`;
    } catch (e) {
      return '';
    }
  }, [effectiveBaseUrl]);

  // Handle URL Parameters (Deep Linking)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p') || params.get('point');
    if (pointId) {
      const found = points.find(p => p.id === pointId || p.number.toString() === pointId);
      if (found) {
        setSelectedPoint(found);
        // Clear query param but stay on current URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [points]);

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem('centerline_points', JSON.stringify(points));
    if (customMapUrl) localStorage.setItem('centerline_map_url', customMapUrl);
    if (publicBaseUrl) localStorage.setItem('centerline_public_url', publicBaseUrl);
  }, [points, customMapUrl, publicBaseUrl]);

  return (
    <div className="flex flex-row w-full h-full bg-gray-950 text-gray-100 overflow-hidden font-sans print:bg-white print:text-black">
      
      {/* Sidebar - Always visible on desktop */}
      <aside className="w-16 lg:w-64 bg-black border-r border-gray-900 flex-shrink-0 flex flex-col justify-between z-30 print:hidden">
        <div>
          <div className="h-16 lg:h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-900">
             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl text-white italic shadow-lg">C</div>
             <span className="ml-3 font-black text-xl hidden lg:block tracking-tighter uppercase italic">Centerline</span>
          </div>
          
          <nav className="p-3 space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-900'}`}>
              <Map size={20} /> <span className="hidden lg:block font-bold">Översikt</span>
            </button>
            <button onClick={() => setActiveTab('table')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'table' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-900'}`}>
              <List size={20} /> <span className="hidden lg:block font-bold">Punktlista</span>
            </button>
            <button onClick={() => setActiveTab('phasing')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'phasing' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-900'}`}>
              <Activity size={20} /> <span className="hidden lg:block font-bold">Synk</span>
            </button>
          </nav>
        </div>

        <div className="p-3 border-t border-gray-800">
           <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-white transition-colors relative">
              <Settings size={20} /> 
              <span className="hidden lg:block font-bold">Inställningar</span>
              {showSetupWizard && <span className="absolute top-3 right-3 lg:right-auto lg:left-[190px] w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-950 overflow-hidden relative">
        
        {/* Setup Wizard Overlay (Local only) */}
        {showSetupWizard && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/30">
                <Globe size={40} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Konfigurera IP</h2>
              <p className="text-gray-400 text-sm">För att kunna använda mobiler lokalt måste du ange din dators IP-adress i inställningarna.</p>
              <button onClick={() => setIsSettingsOpen(true)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                Inställningar <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <header className="flex justify-between items-center">
              <h2 className="text-2xl lg:text-3xl font-black uppercase italic tracking-tighter">Centerline TP-24</h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 rounded-xl border border-gray-800">
                 <Cloud size={14} className={isCloudDeployment ? 'text-blue-500 animate-pulse' : 'text-gray-600'} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                   {isCloudDeployment ? 'Vercel Online' : 'Local Node'}
                 </span>
              </div>
            </header>

            {/* TAB CONTENT */}
            <div className="min-h-0">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <MachineMap 
                    points={points} 
                    onPointClick={setSelectedPoint}
                    selectedPointId={selectedPoint?.id}
                    customMapUrl={customMapUrl}
                  />
                  
                  <div className="bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                      <div className="col-span-1">Nr</div>
                      <div className="col-span-7">Beskrivning</div>
                      <div className="col-span-2 text-right">Mål</div>
                      <div className="col-span-2 text-center">QR</div>
                    </div>
                    <div className="divide-y divide-gray-800/50">
                      {points.sort((a,b) => a.number - b.number).map((point) => (
                        <div 
                          key={point.id} 
                          onClick={() => setSelectedPoint(point)} 
                          className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-blue-600/5 cursor-pointer group transition-colors border-l-4 border-l-transparent hover:border-l-blue-600"
                        >
                          <div className="col-span-1 font-black text-gray-600 group-hover:text-blue-400 italic text-xl">{point.number}</div>
                          <div className="col-span-7">
                            <div className="font-bold text-gray-200 group-hover:text-white">{point.name}</div>
                            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{point.zone}</div>
                          </div>
                          <div className="col-span-2 font-mono text-xl font-black text-green-500 text-right">{point.targetValue}</div>
                          <div className="col-span-2 flex justify-center">
                            <div className="p-1 bg-white rounded shadow-lg group-hover:scale-[4] transition-transform origin-right z-20">
                              <img src={getQrCodeUrl(point.id, 100)} alt="QR" className="w-8 h-8 block" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'table' && (
                <ParameterTable points={points} onPointSelect={setSelectedPoint} getQrUrl={getQrCodeUrl} />
              )}

              {activeTab === 'phasing' && (
                <PhasingGauge currentDegree={0} points={points} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals & Overlays */}
      {isAddingPoint && <AddPointForm existingPoints={points} onSave={(p) => { setPoints([...points, p]); setIsAddingPoint(false); }} onCancel={() => setIsAddingPoint(false)} />}
      {editingPoint && <AddPointForm existingPoints={points} initialData={editingPoint} onSave={(p) => { setPoints(points.map(x => x.id === p.id ? p : x)); setEditingPoint(null); setSelectedPoint(p); }} onCancel={() => { setEditingPoint(null); setSelectedPoint(editingPoint); }} />}
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
