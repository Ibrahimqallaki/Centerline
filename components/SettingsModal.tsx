import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Save, Image as ImageIcon, Link, Globe, CheckCircle2, Copy, Wifi, Info, Cloud, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  currentMapUrl: string | null;
  currentPublicUrl: string;
  onSave: (settings: { mapUrl: string | null; publicUrl: string }) => void;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentMapUrl, currentPublicUrl, onSave, onClose, theme = 'dark' }) => {
  const [mapUrl, setMapUrl] = useState<string | null>(currentMapUrl);
  const [publicUrl, setPublicUrl] = useState<string>(currentPublicUrl);
  const [urlPreview, setUrlPreview] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  useEffect(() => {
    let base = publicUrl.trim().replace(/\/$/, "");
    if (!base) base = window.location.origin;
    if (base && !base.startsWith('http')) base = 'http://' + base;
    
    // If we are on a real domain, preview that instead of the setting
    if (!isLocalhost) {
      setUrlPreview(window.location.origin);
    } else {
      setUrlPreview(base);
    }
  }, [publicUrl, isLocalhost]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(urlPreview);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleSave = () => {
    let finalUrl = publicUrl.trim().replace(/\/$/, "");
    if (finalUrl && !finalUrl.startsWith('http')) finalUrl = 'http://' + finalUrl;
    onSave({ mapUrl, publicUrl: finalUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} w-full max-w-4xl rounded-[2.5rem] border shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300 transition-colors`}>
        
        {/* Header */}
        <div className={`flex justify-between items-center p-8 ${theme === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'} border-b`}>
          <div>
            <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-900'} flex items-center gap-3 italic tracking-tighter uppercase`}>
              <Globe className="text-blue-500 w-8 h-8" /> Systeminställningar
            </h2>
            <p className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} text-sm mt-1`}>Konfigurera din industriella SOP-portal</p>
          </div>
          <button onClick={onClose} className={`p-3 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900'} rounded-full transition-all`}>
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-10 overflow-y-auto max-h-[70vh]">
          
          {/* STEP 1: NETWORK STATUS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              {!isLocalhost ? (
                /* CLOUD MODE VIEW */
                <div className="bg-blue-600/10 border-2 border-blue-500/30 p-8 rounded-3xl space-y-4">
                  <div className="flex items-center gap-3 text-blue-400 font-black uppercase tracking-widest text-sm">
                    <Cloud size={24} />
                    <span>Cloud Deployment Aktiv</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Appen körs på en publik webbadress. Du behöver inte ställa in någon IP-adress – systemet använder automatiskt <strong>{window.location.hostname}</strong> för alla QR-koder.
                  </p>
                  <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase pt-2">
                    <ShieldCheck size={16} />
                    Alla enheter på internet har åtkomst
                  </div>
                </div>
              ) : (
                /* LOCAL MODE VIEW */
                <div className={`space-y-4`}>
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Wifi size={14} /> Datorns IP (för lokalt Wi-Fi)
                  </label>
                  <div className="relative">
                    <Link className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} size={20} />
                    <input 
                      type="text" 
                      value={publicUrl}
                      onChange={(e) => setPublicUrl(e.target.value)}
                      placeholder="t.ex. 192.168.1.50"
                      className={`w-full ${theme === 'dark' ? 'bg-black border-gray-800 text-white' : 'bg-white border-gray-300 text-gray-900'} border-2 rounded-2xl px-6 pl-14 py-5 focus:border-blue-600 outline-none font-mono text-lg transition-all`}
                    />
                  </div>
                  <div className={`bg-amber-500/10 border ${theme === 'dark' ? 'border-amber-900/30 text-amber-400' : 'border-amber-200 text-amber-700'} p-4 rounded-xl text-[11px] leading-relaxed`}>
                    <div className="font-bold flex items-center gap-2 mb-1"><Info size={14}/> Lokal begränsning</div>
                    Eftersom du kör på localhost måste du ange din dators IP för att mobiler ska kunna se instruktionerna.
                  </div>
                </div>
              )}
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className={`${theme === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-[2rem] p-8 border flex flex-col items-center justify-center text-center space-y-6`}>
              <div className="space-y-2 w-full">
                <span className={`text-[10px] font-black ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'} uppercase tracking-widest`}>Aktiv länk för QR-koder</span>
                <div className={`${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-200'} p-4 rounded-xl border flex items-center justify-between`}>
                  <code className="text-blue-500 text-sm truncate font-mono">{urlPreview}</code>
                  <button onClick={handleCopyLink} className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-800 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'} rounded-lg transition-colors`}>
                    {copyFeedback ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-white p-5 rounded-2xl shadow-2xl">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(urlPreview)}&margin=4&ecc=H&format=svg`} 
                    alt="Test QR" 
                    className="w-32 h-32"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LAYOUT SETTINGS */}
          <div className={`pt-8 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} space-y-4`}>
            <h3 className={`text-lg font-black ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} uppercase tracking-widest flex items-center gap-2 italic`}>
              <ImageIcon size={20} /> Maskinritning (Layout)
            </h3>
            <div className={`flex gap-8 items-center ${theme === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'} p-8 rounded-[2rem] border`}>
               <div className={`w-56 aspect-video ${theme === 'dark' ? 'bg-gray-950 border-gray-800' : 'bg-gray-200 border-gray-300'} rounded-2xl overflow-hidden border flex items-center justify-center`}>
                  {mapUrl ? <img src={mapUrl} className="w-full h-full object-cover" /> : <ImageIcon className="opacity-10" size={48} />}
               </div>
               <div className="flex-1 space-y-4">
                 <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                   const f = e.target.files?.[0];
                   if (f) {
                     const r = new FileReader();
                     r.onload = () => setMapUrl(r.result as string);
                     r.readAsDataURL(f);
                   }
                 }} />
                 <button onClick={() => fileInputRef.current?.click()} className={`w-full py-4 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700' : 'bg-white hover:bg-gray-100 text-gray-900 border-gray-300'} rounded-2xl font-bold flex items-center justify-center gap-3 border transition-all`}>
                   <Upload size={20} /> Ladda upp ny layout-bild
                 </button>
                 {mapUrl && <button onClick={() => setMapUrl(null)} className="w-full text-xs text-red-500 font-bold uppercase tracking-widest hover:underline">Återställ till standard</button>}
               </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={`p-8 ${theme === 'dark' ? 'bg-black/40 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t flex justify-end gap-4`}>
          <button onClick={onClose} className={`px-8 py-4 ${theme === 'dark' ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'} font-bold transition-colors`}>Avbryt</button>
          <button onClick={handleSave} className="px-16 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-900/40 transition-all active:scale-95">
            Spara inställningar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;