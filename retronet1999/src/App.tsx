import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import "./App.css";
import CRTFilter from "./effects/CRTFilter";
import Desktop from "./components/Desktop";
import Taskbar from "./components/Taskbar";
import RetroBrowser from "./components/RetroBrowser";
import Messenger from "./components/Messenger";
import FileExplorer from "./components/FileExplorer";
import MediaPlayer from "./components/MediaPlayer";
import Terminal from "./components/Terminal";
import DialUp from "./components/DialUp";
import Popup from "./components/Popup";
import ControlPanel from "./components/ControlPanel";
import Paint from "./components/Paint";
import Notepad from "./components/Notepad";
import Screensaver from "./components/Screensaver";
import RetroEmail from "./components/RetroEmail";
import Minesweeper from "./components/Minesweeper";
import Napster from "./components/Napster";
import Winamp from "./components/Winamp";
import BootScreen from "./components/BootScreen";
import LoginScreen from "./components/LoginScreen";
import ShutdownDialog from "./components/ShutdownDialog";
import BSODScreen from "./components/BSODScreen";
import SleepScreen from "./components/SleepScreen";
import Calculator from "./components/Calculator";
import SystemInfo from "./components/SystemInfo";
import RunDialog from "./components/RunDialog";
import SystemRestore from "./components/SystemRestore";
import DesktopAssistant from "./components/DesktopAssistant";
import Defrag from "./components/Defrag";
import IRCClient from "./components/IRCClient";
import Regedit from "./components/Regedit";
import RetroMaze from "./components/RetroMaze";
import WebStudio from "./components/WebStudio";
import VirusScanner from "./components/VirusScanner";
import CDRomWizard from "./components/CDRomWizard";
import RetroTour from "./components/RetroTour";
import { useFileSystem } from "./contexts/FileSystemContext";
import { useSystem } from "./contexts/SystemContext";

interface WindowState {
  id: string;
  type: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface PopupState {
  id: number;
  title: string;
  text: string;
  x: number;
  y: number;
}

function App() {
  const { wallpaper, refreshRate, crt, phase, setVirusActive, addNotification, updateTray, discoverEasterEgg, logout, playSound, degaussing, activeDesktopUrl } = useSystem();
  const { files, deleteFile, saveTextFile } = useFileSystem();
  const [activeScreensaver, setActiveScreensaver] = useState<'matrix' | 'pipes' | 'starfield' | null>(null);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showDialUp, setShowDialUp] = useState(false);
  const [popups, setPopups] = useState<PopupState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [showBossKey, setShowBossKey] = useState(false);
  const [hddActive, setHddActive] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const [notepadInit, setNotepadInit] = useState<{ content: string; name: string } | null>(null);

  const saveFile = (name: string, content: string) => {
    const saved = saveTextFile(name, content);
    addNotification({ title: 'File Saved', message: `${saved.name} saved to ${saved.path}`, type: 'success' });
  };

  const runCommand = (command: string) => {
    const normalized = command.trim().toLowerCase();
    const aliases: Record<string, string> = {
      browser: 'browser', iexplore: 'browser', cmd: 'terminal', command: 'terminal',
      explorer: 'explorer', notepad: 'notepad', paint: 'paint', mspaint: 'paint',
      calc: 'calculator', calculator: 'calculator', sysinfo: 'sysinfo', msinfo32: 'sysinfo',
      control: 'settings', email: 'email', winamp: 'winamp', antivirus: 'antivirus',
      cdrom: 'cdrom', restore: 'restore',
    };
    if (aliases[normalized]) { openApp(aliases[normalized]); return; }
    addNotification({ title: 'Run', message: `Cannot find '${command}'.`, type: 'error' });
  };

  const openApp = (type: string) => {
    playSound('open');
    if (type === 'shutdown') { setShowShutdown(true); return; }
    if (type === 'logoff') { logout(); return; }
    if (type === 'help') { addNotification({ title: 'Help', message: 'Check README.txt for mission briefing!', type: 'info' }); return; }
    if (type === 'virus') { triggerVirus(); return; }
    if (type === 'recyclebin') { openApp('explorer'); return; }
    if (type === 'dialup') { setShowDialUp(true); return; }

    const existing = windows.find(w => w.type === type);
    if (existing) {
      if (existing.isMinimized) toggleMinimize(existing.id);
      focusWindow(existing.id);
      return;
    }

    const id = `${type}-${Date.now()}`;
    setWindows(prev => [...prev, { id, type, isMinimized: false, isMaximized: false, zIndex: nextZIndex }]);
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w));
    setActiveWindowId(id);
    setNextZIndex(prev => prev + 1);
  };

  const triggerVirus = () => {
    setVirusActive(true);
    const newPopups: PopupState[] = [];
    for (let i = 0; i < 5; i++) {
      newPopups.push({
        id: Date.now() + i,
        title: ["!!! SYSTEM ALERT !!!", "YOU WON!!!", "⚠ WARNING ⚠", "FREE PRIZE!", "CRITICAL ERROR"][i],
        text: ["YOU HAVE WON $1,000,000!!!", "Click here for FREE iPod!", "Your system has been INFECTED!", "Download Bonzi Buddy NOW!", "Send this to 10 friends or ELSE!"][i],
        x: Math.random() * (window.innerWidth - 250),
        y: Math.random() * (window.innerHeight - 200),
      });
    }
    setPopups(prev => [...prev, ...newPopups]);
    addNotification({ title: '⚠ Virus Detected!', message: 'LOVE-LETTER worm is active! Run AntiVirus to clean.', type: 'error' });
  };

  const closePopup = (id: number) => setPopups(prev => prev.filter(p => p.id !== id));

  const openNotepadWithContent = (content: string, name: string) => {
    setNotepadInit({ content, name });
    openApp('notepad');
  };

  // Connect -> open browser
  useEffect(() => {
    if (isConnected) {
      updateTray({ network: 'connected' });
      setTimeout(() => openApp('browser'), 500);
    }
  }, [isConnected]);

  // Boss key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'b' && !e.ctrlKey && !e.altKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        setShowBossKey(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // HDD activity
  useEffect(() => {
    setHddActive(true);
    updateTray({ disk: 'active' });
    const timer = setTimeout(() => { setHddActive(false); updateTray({ disk: 'idle' }); }, 300);
    return () => clearTimeout(timer);
  }, [windows, files]);

  // Easter egg: specific date
  useEffect(() => {
    const now = new Date();
    if (now.getMonth() === 0 && now.getDate() === 1) discoverEasterEgg('new_year');
    if (now.getMonth() === 11 && now.getDate() === 25) discoverEasterEgg('christmas');
  }, []);

  // Show dial-up on first desktop entry
  useEffect(() => {
    if (phase === 'desktop' && !isConnected) {
      setShowDialUp(true);
    }
  }, [phase]);

  // Don't render desktop if not in desktop phase
  if (phase !== 'desktop') {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        <BootScreen />
        <LoginScreen />
        <BSODScreen />
        <SleepScreen />
        <CRTFilter />
      </div>
    );
  }

  const commonProps = (win: WindowState) => ({
    onClose: () => closeWindow(win.id),
    onMinimize: () => toggleMinimize(win.id),
    onMaximize: () => toggleMaximize(win.id),
    isMaximized: win.isMaximized,
    zIndex: win.zIndex,
    onFocus: () => focusWindow(win.id),
    isActive: activeWindowId === win.id,
  });

  const renderWindow = (win: WindowState) => {
    if (win.isMinimized) return null;
    const p = commonProps(win);
    switch (win.type) {
      case 'browser': return <RetroBrowser key={win.id} {...p} />;
      case 'messenger': return <Messenger key={win.id} {...p} />;
      case 'explorer': return <FileExplorer key={win.id} {...p} files={files} onDeleteFile={deleteFile} onTriggerVirus={triggerVirus} onOpenNotepad={openNotepadWithContent} />;
      case 'media': return <MediaPlayer key={win.id} {...p} />;
      case 'terminal': return <Terminal key={win.id} {...p} onTriggerVirus={triggerVirus} />;
      case 'settings': return <ControlPanel key={win.id} {...p} onStartScreensaver={setActiveScreensaver} />;
      case 'paint': return <Paint key={win.id} {...p} />;
      case 'notepad': return <Notepad key={win.id} {...p} onSave={(c: string, n?: string) => saveFile(n || 'Note.txt', c)} initialContent={notepadInit?.content} initialName={notepadInit?.name} />;
      case 'email': return <RetroEmail key={win.id} {...p} />;
      case 'minesweeper': return <Minesweeper key={win.id} {...p} />;
      case 'napster': return <Napster key={win.id} {...p} />;
      case 'winamp': return <Winamp key={win.id} {...p} />;
      case 'calculator': return <Calculator key={win.id} {...p} />;
      case 'sysinfo': return <SystemInfo key={win.id} {...p} />;
      case 'run': return <RunDialog key={win.id} {...p} onRun={runCommand} />;
      case 'antivirus': return <VirusScanner key={win.id} {...p} />;
      case 'cdrom': return <CDRomWizard key={win.id} {...p} />;
      case 'restore': return <SystemRestore key={win.id} {...p} />;
      case 'defrag': return <Defrag key={win.id} {...p} />;
      case 'mirc': return <IRCClient key={win.id} {...p} />;
      case 'regedit': return <Regedit key={win.id} {...p} />;
      case 'retromaze': return <RetroMaze key={win.id} {...p} />;
      case 'webstudio': return <WebStudio key={win.id} {...p} />;
      case 'tour': return <RetroTour key={win.id} {...p} />;
      default: return null;
    }
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden transition-all duration-700 ${degaussing ? 'animate-degauss grayscale invert' : ''}`} style={{ 
      background: wallpaper || 'var(--theme-wallpaper)', 
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      '--crt-content-blur': `${crt.enabled ? crt.blur : 0}px`,
      '--refresh-rate': `${refreshRate}`,
    } as CSSProperties}>
      
      {/* Active Desktop Layer */}
      {activeDesktopUrl && phase === 'desktop' && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <iframe 
            src={activeDesktopUrl} 
            className="w-full h-full border-0" 
            title="Active Desktop"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white text-[8px] px-2 py-0.5 rounded font-sans uppercase tracking-widest">
            Active Desktop Item
          </div>
        </div>
      )}
      <div className="desktop-ambient pointer-events-none fixed inset-0 z-[0]" />
      
      {activeScreensaver && <Screensaver type={activeScreensaver} onClose={() => setActiveScreensaver(null)} />}
      
      {refreshRate < 60 && (
        <div className="refresh-rate-overlay fixed inset-0 pointer-events-none z-[20000]"
          style={{ animationDuration: `${Math.max(0.03, 1 / refreshRate)}s`, opacity: Math.min(0.45, (60 - refreshRate) / 110) }}
        />
      )}

      <Desktop onOpenApp={openApp} onTriggerVirus={triggerVirus}>
        {showDialUp && !isConnected && (
          <DialUp onConnect={() => { setIsConnected(true); setShowDialUp(false); }} onClose={() => setShowDialUp(false)} />
        )}
        {windows.map(renderWindow)}
        {popups.map(popup => <Popup key={popup.id} {...popup} onClose={closePopup} />)}
      </Desktop>
      
      <Taskbar 
        onOpenApp={openApp} 
        activeApps={windows.map(w => w.type)} 
        hddActive={hddActive}
        onCloseWindow={type => { const w = windows.find(w => w.type === type); if (w) closeWindow(w.id); }}
        onToggleWindow={type => {
          const w = windows.find(w => w.type === type);
          if (w) { if (w.isMinimized || activeWindowId !== w.id) focusWindow(w.id); else toggleMinimize(w.id); }
        }}
      />

      {showShutdown && <ShutdownDialog onCancel={() => setShowShutdown(false)} />}

      {showBossKey && (
        <div className="fixed inset-0 z-[100000] bg-white p-10 flex flex-col font-sans overflow-auto">
          <h1 className="text-xl font-bold mb-4">Q3 Earnings Projection - CONFIDENTIAL</h1>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead><tr className="bg-gray-100"><th>Region</th><th>Sales</th><th>Growth</th><th>Status</th></tr></thead>
            <tbody>
              {[...Array(20)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td>Region {i}</td><td>${Math.floor(Math.random()*10000)}</td><td>+4.2%</td><td className="text-green-600">ON TRACK</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-gray-400">Press 'B' to resume work...</div>
        </div>
      )}

      <BSODScreen />
      <SleepScreen />
      <DesktopAssistant />
      <CRTFilter />
    </div>
  );
}

export default App;
