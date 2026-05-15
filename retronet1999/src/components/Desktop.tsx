import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Folder, Music, Terminal, Settings, Palette, FileText, HardDrive, Activity, Calculator, MonitorCog, Play, Shield, Disc, Trash2, RotateCw, HelpCircle } from 'lucide-react';
import { useFileSystem } from '../contexts/FileSystemContext';

interface DesktopIconProps {
  icon: React.ReactNode;
  label: string;
  onDoubleClick: () => void;
  hidden?: boolean;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ icon, label, onDoubleClick, hidden }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [displayName, setDisplayName] = useState(label);

  if (hidden) return null;

  return (
    <motion.div 
      drag
      dragMomentum={false}
      className="desktop-icon flex flex-col items-center gap-1 w-20 p-2 cursor-pointer group active:bg-blue-800/50 z-10"
      onDoubleClick={onDoubleClick}
      whileHover={{ y: -2 }}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsRenaming(true);
      }}
    >
      <div className="desktop-icon-glyph text-white group-hover:scale-110 transition-transform pointer-events-none">
        {icon}
      </div>
      {isRenaming ? (
        <input
          className="text-[10px] text-white bg-black/50 border border-white/30 text-center w-full outline-none px-1"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          onBlur={() => setIsRenaming(false)}
          onKeyDown={e => { if (e.key === 'Enter') setIsRenaming(false); }}
          autoFocus
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <span className="desktop-icon-label text-[10px] text-white text-center font-sans select-none pointer-events-none">
          {displayName}
        </span>
      )}
    </motion.div>
  );
};

const Desktop: React.FC<{ 
  children?: React.ReactNode;
  onOpenApp: (type: string) => void;
  onTriggerVirus: () => void;
}> = ({ children, onOpenApp, onTriggerVirus }) => {
  const { recycleBin } = useFileSystem();

  const icons = [
    { icon: <HelpCircle size={32} className="text-purple-300" />, label: 'System Tour', action: 'tour' },
    { icon: <Globe size={32} className="text-blue-200" />, label: 'My Browser', action: 'browser' },
    { icon: <Folder size={32} className="text-yellow-400" />, label: 'My Documents', action: 'explorer' },
    { icon: <Mail size={32} className="text-white" />, label: 'Email', action: 'email' },
    { icon: <Terminal size={32} className="text-green-400" />, label: 'Terminal', action: 'terminal' },
    { icon: <FileText size={32} className="text-yellow-100" />, label: 'Notepad', action: 'notepad' },
    { icon: <Palette size={32} className="text-pink-400" />, label: 'Paint 98', action: 'paint' },
    { icon: <Calculator size={32} className="text-gray-100" />, label: 'Calculator', action: 'calculator' },
    { icon: <HardDrive size={32} className="text-red-500" />, label: 'Minesweeper', action: 'minesweeper' },
    { icon: <Music size={32} className="text-green-400" />, label: 'Napster', action: 'napster' },
    { icon: <Activity size={32} className="text-orange-400" />, label: 'Retro Radio', action: 'winamp' },
    { icon: <Music size={32} className="text-purple-400" />, label: 'Media Player', action: 'media' },
    { icon: <Mail size={32} className="text-white" />, label: 'Messenger', action: 'messenger' },
    { icon: <Settings size={32} className="text-gray-400" />, label: 'Control Panel', action: 'settings' },
    { icon: <MonitorCog size={32} className="text-cyan-200" />, label: 'System Info', action: 'sysinfo' },
    { icon: <Shield size={32} className="text-green-300" />, label: 'AntiVirus', action: 'antivirus' },
    { icon: <Disc size={32} className="text-yellow-300" />, label: 'CD-ROM Install', action: 'cdrom' },
    { icon: <RotateCw size={32} className="text-blue-300" />, label: 'System Restore', action: 'restore' },
    { icon: <Play size={32} className="text-lime-300" />, label: 'Run...', action: 'run' },
    { icon: <Trash2 size={32} className={recycleBin.length > 0 ? "text-yellow-400" : "text-gray-400"} />, label: `Recycle Bin (${recycleBin.length})`, action: 'recyclebin' },
    { icon: <div className="w-8 h-8 border-2 border-red-500 rounded-sm flex items-center justify-center text-[10px] font-bold text-red-500">!!!</div>, label: 'FREE_MONEY.exe', action: 'virus' },
  ];

  return (
    <div className="fixed inset-0 p-4 flex flex-col flex-wrap gap-3 content-start pb-12 z-[1]">
      <div className="desktop-brand pointer-events-none absolute right-6 top-5 text-right font-sans">
        <div className="text-white/80 text-[10px] tracking-[3px] uppercase">Personal VM</div>
        <div className="text-white text-xl font-bold drop-shadow">RetroNet 1999</div>
      </div>

      {icons.map(ic => (
        <DesktopIcon
          key={ic.action}
          icon={ic.icon}
          label={ic.label}
          onDoubleClick={() => ic.action === 'virus' ? onTriggerVirus() : onOpenApp(ic.action)}
        />
      ))}
      
      {children}
    </div>
  );
};

export default Desktop;
