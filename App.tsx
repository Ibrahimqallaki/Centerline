
import React, { useState, useEffect, useCallback } from 'react';
import { MACHINE_POINTS, ZONE_COLORS } from './constants';
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
  
  // Modals
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingPoint, setEditingPoint] = useState<MachinePoint | null>(null);
  
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

  // Settings logic
  const [customMapUrl, setCustomMapUrl] = useState<string | null>(() => localStorage.getItem('centerline_map_url'));
  const [publicBaseUrl, setPublicBaseUrl] = useState<string>(() => localStorage.getItem('centerline_public_url') || '');
  const [selectedPoint, setSelectedPoint] = useState<MachinePoint | null>(null);

  // Environment detection
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isCloudDeployment = !isLocalhost;
  
  const effectiveBaseUrl = isCloudDeployment ? window.location.origin : (publicBaseUrl || window.location.origin);
  const showSetupWizard = isLocalhost && (!publicBaseUrl || publicBaseUrl.includes('localhost'));

  /**
   * Generates a QR code for mobile users.
   */
  const getQrCodeUrl = useCallback((pointId: string, size: number = 400) => {
    try {
      const base = effectiveBaseUrl.replace(/\/$/, "");
      const targetUrl = `${base}/?p=${pointId}`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(targetUrl)}&margin=8&ecc=H&format=svg`;
    } catch (e) {
      return '';
    }
  }, [effectiveBaseUrl]);

  // Deep Link handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pointId = params.get('p') || params.get('point');
    
    if (pointId) {
      const found = points.find(p => p.id === pointId || p.number.toString() === pointId);
      if (found) {
        setSelectedPoint(found);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [points]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('centerline_points', JSON.stringify(points));
    if (customMapUrl) localStorage.setItem('centerline_map_url', customMapUrl);
    if (publicBaseUrl) localStorage.setItem('centerline_public_url', publicBaseUrl);
  }, [points, customMapUrl, publicBaseUrl]);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden font-sans print:hidden">
      
      {/* Sidebar */}
      <aside className="w-16 lg:w-64 bg-black border-r border-gray-900 flex-shrink-0 flex flex-col justify-between z-20">
        <div>
          <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-900">
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

        <div className="p-3 border-t border-gray-800 space-y-2">
           <button onClick={() => setIsSettingsOpen(true)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${showSetupWizard ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'text-gray-500 hover:text-white'}`}>
              <Settings size={20} /> <span className="hidden lg:block font-bold">Inställningar</span>
              {showSetupWizard && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-black animate-pulse"></span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-950 overflow-hidden relative">
        
        {/* SETUP WIZARD (Localhost only) */}
        {showSetupWizard && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl">
            <div className="max-w-xl w-full bg-gray-900 border border-gray-700 rounded-[2.5rem] p-12 shadow-2xl text-center space-y-8">
              <div className="w-24 h-24 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto border border-blue-500/30">
                <Globe size={48} className="text-blue-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Lokal Konfiguration</h2>
                <p className="text-gray-400 text-base leading-relaxed">
                  Ange din IP-adress för att aktivera QR-koderna lokalt.
                </p>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3"
              >
                Gå till inställningar <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Centerline TP-24</h2>
              <div className="flex items-center gap-3">
                {isCloudDeployment ? (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/30 border border-blue-500/50 text-blue-400 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <Cloud size={14} className="animate-pulse" />
                    System Online
                  </div>
                ) : (
                  !showSetupWizard && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 border border-green-800 text-green-400 rounded-full text-[10px] font-black uppercase">
                      Lokal IP: {publicBaseUrl}
                    </div>
                  )
                )}
              </div>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-10">
                <MachineMap 
                  points={points} 
                  onPointClick={setSelectedPoint}
                  selectedPointId={selectedPoint?.id}
                  customMapUrl={customMapUrl}
                />
                
                <div className="bg-gray-900 rounded-[2rem] border border-gray-800 shadow-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-4 px-10 py-5 bg-black/40 text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-800">
                    <div className="col-span-1">Nr</div>
                    <div className="col-span-6">Beskrivning</div>
                    <div className="col-span-3 text-right">Målvärde</div>
                    <div className="col-span-2 text-center">QR</div>
                  </div>
                  <div className="divide-y divide-gray-800/50">
                    {points.sort((a,b) => a.number - b.number).map((point) => (
                      <div key={point.id} onClick={() => setSelectedPoint(point)} className="grid grid-cols-12 gap-4 px-10 py-8 items-center hover:bg-blue-600/5 cursor-pointer group transition-all border-l-4 border-l-transparent hover:border-l-blue-600">
                        <div className="col-span-1 font-black text-gray-600 group-hover:text-blue-400 italic text-2xl">{point.number}</div>
                        <div className="col-span-6">
                          <div className="font-bold text-lg text-gray-200 group-hover:text-white">{point.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">{point.zone}</div>
                        </div>
                        <div className="col-span-3 font-mono text-3xl font-black text-green-500 text-right">{point.targetValue}</div>
                        <div className="col-span-2 flex justify-center">
                          <div className="p-2 bg-white rounded-xl shadow-2xl group-hover:scale-[3.5] group-hover:-translate-x-16 transition-transform z-30 origin-center border border-gray-200">
                            <img src={getQrCodeUrl(point.id, 100)} alt="QR" className="w-10 h-10 block" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'table' && <ParameterTable points={points} onPointSelect={setSelectedPoint} getQrUrl={getQrCodeUrl} />}
            {activeTab === 'phasing' && <PhasingGauge currentDegree={0} points={points} />}
          </div>
        </div>
      </main>

      {/* Modals */}
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
