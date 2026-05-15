import React, { useState } from 'react';
import StartMenu from './StartMenu';
import NotificationCenter from './NotificationCenter';
import { Wifi, WifiOff, Volume2, VolumeX, Battery, X, Folder, Terminal, Calculator, Play, Mail, MailOpen } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

interface TaskbarProps {
  onOpenApp: (appName: string) => void;
  onToggleWindow: (appName: string) => void;
  onCloseWindow: (appName: string) => void;
  activeApps: string[];
  hddActive?: boolean;
}

const Marquee = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`overflow-hidden whitespace-nowrap ${className}`}>
    <div className="inline-block animate-[marquee_20s_linear_infinite] pl-[100%]">{children}</div>
  </div>
);

const Taskbar: React.FC<TaskbarProps> = ({ onOpenApp, onToggleWindow, onCloseWindow, activeApps, hddActive }) => {
  const { systemTime, tray, soundEnabled, timeZone, playSound } = useSystem();
  const [isStartOpen, setIsStartOpen] = useState(false);

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const handleStartToggle = () => {
    playSound('click');
    setIsStartOpen(!isStartOpen);
  };

  return (
    <>
      {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} onOpenApp={onOpenApp} />}
      
      <div className="taskbar-shell fixed bottom-0 left-0 right-0 h-11 win95-window flex items-center px-1 z-[101]">
        <button
          className={`start-button win95-button flex items-center gap-1 px-3 py-0.5 font-sans font-bold text-sm h-9 mr-2 flex-shrink-0 ${isStartOpen ? 'shadow-inner bg-[#d0d0d0]' : ''}`}
          onClick={handleStartToggle}
        >
          <img src="/tauri.svg" alt="start" className="w-4 h-4" />
          <span>Start</span>
        </button>

        <div className="quick-launch flex items-center gap-1 h-9 mr-2 pr-2 border-r border-black/30">
          <button className="win95-button h-7 w-8 flex items-center justify-center" title="My Documents" onClick={() => onOpenApp('explorer')}><Folder size={14} /></button>
          <button className="win95-button h-7 w-8 flex items-center justify-center" title="Terminal" onClick={() => onOpenApp('terminal')}><Terminal size={14} /></button>
          <button className="win95-button h-7 w-8 flex items-center justify-center" title="Calculator" onClick={() => onOpenApp('calculator')}><Calculator size={14} /></button>
          <button className="win95-button h-7 w-8 flex items-center justify-center" title="Run" onClick={() => onOpenApp('run')}><Play size={14} /></button>
        </div>

        <div className="flex-1 flex gap-1 h-full py-1 overflow-hidden">
          {activeApps.map(app => (
            <div key={app} className="taskbar-app win95-button bg-retro-panel px-2 flex items-center justify-between text-[10px] min-w-[100px] max-w-[140px] border-b-2 border-r-2 border-white border-t-2 border-l-2 border-retro-border-darker shadow-inner cursor-pointer group" onClick={() => onToggleWindow(app)}>
              <span className="font-sans font-bold capitalize truncate mr-1">{app.replace('_', ' ')}</span>
              <button className="hover:bg-red-500 hover:text-white p-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => { e.stopPropagation(); onCloseWindow(app); }}><X size={10} /></button>
            </div>
          ))}
          
          <div className="taskbar-ticker flex-1 px-4 flex items-center mx-2 overflow-hidden h-full">
            <Marquee className="text-[10px] font-pixel">
              Welcome to RetroNet 1999! *** New Virus "LOVE-LETTER" spreading across the web! *** Buy low, sell high on Pets.com! *** Try the CD-ROM Install Wizard! ***
            </Marquee>
          </div>
        </div>

        <div className="system-tray win95-window shadow-inner border-t-retro-border-dark border-l-retro-border-dark border-b-white border-r-white px-2 py-1 flex items-center gap-2 h-8 ml-1">
          {/* HDD Light */}
          <div className="flex flex-col items-center gap-[1px]">
            <span className="text-[6px] uppercase opacity-50">HDD</span>
            <div className={`w-2 h-1.5 rounded-[1px] shadow-sm transition-colors ${hddActive ? 'bg-red-500 shadow-red-500/50' : 'bg-red-900/30'}`} />
          </div>
          
          <div className="flex gap-1.5 items-center text-black/70">
            {tray.network === 'connected' ? <Wifi size={13} strokeWidth={3} /> : <WifiOff size={13} strokeWidth={3} className="text-red-500" />}
            {soundEnabled ? <Volume2 size={13} strokeWidth={3} /> : <VolumeX size={13} strokeWidth={3} className="text-red-500" />}
            <div className="relative">
              <Battery size={13} strokeWidth={3} />
              <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold">{tray.battery}</span>
            </div>
            {tray.mail === 'unread' ? <MailOpen size={13} strokeWidth={3} className="text-yellow-600" /> : <Mail size={13} strokeWidth={3} />}
          </div>

          <NotificationCenter />

          <div className="border-l border-retro-border-dark pl-2 flex flex-col items-end">
            <span className="font-sans text-[10px] font-bold">{formatTime(systemTime)}</span>
            <span className="font-sans text-[7px] text-gray-500">{timeZone.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
