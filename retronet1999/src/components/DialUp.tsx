import React, { useState, useEffect } from 'react';
import Window from './Window';
import { Phone, Info, Zap, Globe, Activity } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

interface DialUpProps {
  onConnect: () => void;
  onClose: () => void;
}

const DialUp: React.FC<DialUpProps> = ({ onConnect, onClose }) => {
  const { addNotification, updateTray, playSound } = useSystem();
  const [status, setStatus] = useState<'idle' | 'dialing' | 'handshake' | 'verifying' | 'connected'>('idle');
  const [progress, setProgress] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    speed: '0 bps',
    duration: '00:00:00'
  });

  const handleConnect = () => {
    setStatus('dialing');
    playSound('dialup');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 5;
      if (p > 30 && status === 'dialing') setStatus('handshake');
      if (p > 70 && status === 'handshake') setStatus('verifying');
      
      if (p >= 100) {
        clearInterval(interval);
        setStatus('connected');
        updateTray({ network: 'connected' });
        addNotification({ title: 'Dial-up Networking', message: 'Connected to RetroNet ISP at 56.0 Kbps', type: 'success' });
        setTimeout(() => {
          setShowStats(true);
        }, 1000);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  useEffect(() => {
    if (status === 'connected' && showStats) {
      const timer = setInterval(() => {
        setStats(prev => ({
          ...prev,
          sent: prev.sent + Math.floor(Math.random() * 1024),
          received: prev.received + Math.floor(Math.random() * 5120),
          speed: `${(Math.random() * 5 + 50).toFixed(1)} Kbps`
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, showStats]);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (showStats) {
    return (
      <Window title="Connected to RetroNet" icon={<Zap size={14} />} width={320} height={300} onClose={onConnect} initialX={window.innerWidth / 2 - 160} initialY={window.innerHeight / 2 - 150}>
        <div className="p-4 flex flex-col gap-4 font-sans text-xs bg-[#c0c0c0] h-full">
          <div className="flex gap-4 items-center border-b border-gray-400 pb-2">
            <div className="w-12 h-12 bg-blue-800 rounded-sm flex items-center justify-center text-white">
              <Globe size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-sm">Connected at 56,000 bps</div>
              <div className="text-gray-600">Duration: 00:00:42</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-white win95-window shadow-inner p-3">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1"><Activity size={12} /> Activity:</span>
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${Math.random() > 0.5 ? 'bg-green-500' : 'bg-green-900'}`} />
                <div className={`w-2 h-2 rounded-full ${Math.random() > 0.3 ? 'bg-yellow-500' : 'bg-yellow-900'}`} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-1 mt-2 border-t border-gray-100 pt-2">
              <span className="text-gray-500 uppercase text-[9px]">Sent:</span>
              <span className="text-right font-bold">{formatBytes(stats.sent)}</span>
              <span className="text-gray-500 uppercase text-[9px]">Received:</span>
              <span className="text-right font-bold">{formatBytes(stats.received)}</span>
              <span className="text-gray-500 uppercase text-[9px]">Speed:</span>
              <span className="text-right font-bold text-green-700">{stats.speed}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-auto">
            <button className="win95-button px-4 py-1" onClick={onConnect}>OK</button>
            <button className="win95-button px-4 py-1" onClick={() => { updateTray({ network: 'disconnected' }); onClose(); }}>Disconnect</button>
          </div>
        </div>
      </Window>
    );
  }

  return (
    <Window title="Connect RetroNet" icon={<Phone size={14} />} width={350} height={300} onClose={onClose} initialX={window.innerWidth / 2 - 175} initialY={window.innerHeight / 2 - 150}>
      <div className="p-4 flex flex-col gap-4 font-sans text-xs bg-[#c0c0c0] h-full">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-gray-400 border-2 border-retro-border-dark flex items-center justify-center">
            <Phone size={32} className={status !== 'idle' ? 'animate-bounce text-blue-800' : 'text-gray-700'} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="font-bold">User name:</div>
            <input type="text" className="win95-window shadow-inner px-1 h-5 outline-none bg-white" defaultValue="retro_user_99" disabled={status !== 'idle'} />
            <div className="font-bold mt-1">Password:</div>
            <input type="password" className="win95-window shadow-inner px-1 h-5 outline-none bg-white" defaultValue="********" disabled={status !== 'idle'} />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="font-bold">Phone number:</div>
          <div className="flex gap-2">
            <input type="text" className="win95-window shadow-inner px-1 h-5 w-16 outline-none bg-white text-center" defaultValue="0" disabled={status !== 'idle'} />
            <input type="text" className="win95-window shadow-inner px-1 h-5 flex-1 outline-none bg-white" defaultValue="555-0199-RETRO" disabled={status !== 'idle'} />
          </div>
        </div>

        <div className="win95-window shadow-inner bg-white/50 p-2 min-h-[60px] flex flex-col justify-center gap-1">
          {status === 'idle' ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Info size={14} />
              <span>Click Connect to start the dial-up sequence.</span>
            </div>
          ) : (
            <>
              <div className="flex justify-between font-bold text-[10px]">
                <span>
                  {status === 'dialing' && 'Dialing 555-0199...'}
                  {status === 'handshake' && 'Establishing handshake...'}
                  {status === 'verifying' && 'Verifying username and password...'}
                  {status === 'connected' && 'Authenticated! Connecting...'}
                </span>
                <span>{Math.floor(progress)}%</span>
              </div>
              <div className="w-full h-4 win95-window shadow-inner bg-gray-200 overflow-hidden p-0.5">
                <div className="h-full bg-[#000080] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-auto">
          <button className="win95-button px-4 py-1 font-bold" onClick={handleConnect} disabled={status !== 'idle'}>Connect</button>
          <button className="win95-button px-4 py-1" onClick={onClose}>Cancel</button>
          <button className="win95-button px-4 py-1" disabled={status !== 'idle'}>Properties</button>
        </div>
      </div>
    </Window>
  );
};

export default DialUp;
