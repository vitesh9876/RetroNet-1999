import React from 'react';
import { Globe, Mail, Folder, Music, Terminal, Settings, Power, User, Palette, FileText, Calculator, MonitorCog, Grid3X3, Play, Shield, Disc, RotateCw, LogOut, MessageSquare, HardDrive, Database, Gamepad2, PlayCircle, Code, HelpCircle } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (appName: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onOpenApp }) => {
  const { currentUser, isAdminMode } = useSystem();

  const menuSections = [
    {
      title: 'Internet',
      items: [
        { icon: <Globe size={18} />, label: 'Retro Browser', action: 'browser' },
        { icon: <Mail size={18} />, label: 'Retro Messenger', action: 'messenger' },
        { icon: <MessageSquare size={18} />, label: 'mIRC Client', action: 'mirc' },
        { icon: <Mail size={18} />, label: 'Email Inbox', action: 'email' },
      ],
    },
    {
      title: 'Games',
      items: [
        { icon: <Gamepad2 size={14} />, label: 'Retro-Maze 3D', action: 'retromaze' },
        { icon: <PlayCircle size={14} />, label: 'Minesweeper', action: 'minesweeper' },
      ],
    },
    {
      title: 'Programs',
      items: [
        { icon: <Folder size={18} />, label: 'My Documents', action: 'explorer' },
        { icon: <FileText size={18} />, label: 'Notepad', action: 'notepad' },
        { icon: <Palette size={18} />, label: 'Paint 98', action: 'paint' },
        { icon: <Calculator size={18} />, label: 'Calculator', action: 'calculator' },
        { icon: <Code size={18} />, label: 'Web Studio', action: 'webstudio' },
        { icon: <Music size={18} />, label: 'Media Player', action: 'media' },
      ],
    },
    {
      title: 'System',
      items: [
        { icon: <Terminal size={18} />, label: 'MS-DOS Prompt', action: 'terminal' },
        { icon: <MonitorCog size={18} />, label: 'System Monitor', action: 'sysinfo' },
        { icon: <HelpCircle size={18} />, label: 'System Tour', action: 'tour' },
        { icon: <Settings size={18} />, label: 'Control Panel', action: 'settings' },
        { icon: <HardDrive size={18} />, label: 'Disk Defragmenter', action: 'defrag' },
        { icon: <Database size={18} />, label: 'Registry Editor', action: 'regedit' },
        { icon: <RotateCw size={18} />, label: 'System Restore', action: 'restore' },
        { icon: <Shield size={18} />, label: 'AntiVirus Scanner', action: 'antivirus' },
        { icon: <Play size={18} />, label: 'Run...', action: 'run' },
      ],
    },
  ];

  return (
    <div className="start-menu fixed bottom-11 left-0 w-72 win95-window z-[100] flex" onClick={e => e.stopPropagation()}>
      {/* Sidebar */}
      <div className="start-menu-rail w-10 flex flex-col-reverse items-center py-4 gap-2">
        <span className="[writing-mode:vertical-lr] rotate-180 font-bold text-white tracking-widest text-lg opacity-40">
          RetroNet 99
        </span>
        <span className="[writing-mode:vertical-lr] rotate-180 text-[8px] text-white/30 uppercase tracking-[2px] mb-2 font-pixel">
          By Vitesh Pallapothu
        </span>
      </div>

      {/* Menu Content */}
      <div className="flex-1 py-1">
        <div className="px-3 py-2 flex items-center gap-2 start-user text-white mb-1">
          <User size={14} />
          <div>
            <span className="font-bold text-[10px]">{currentUser?.username || 'User'}</span>
            {isAdminMode && <span className="text-[7px] ml-1 text-yellow-300 font-sans">[ADMIN]</span>}
          </div>
        </div>
        
        {menuSections.map(section => (
          <div key={section.title} className="start-section">
            <div className="px-3 pt-1 pb-0.5 text-[8px] uppercase tracking-[1px] opacity-60 font-sans">{section.title}</div>
            {section.items.map(item => (
              <div key={item.action} className="start-menu-item px-3 py-1 flex items-center gap-2 cursor-pointer text-[10px] font-sans" onClick={() => { onOpenApp(item.action); onClose(); }}>
                <div className="w-4 h-4 flex items-center justify-center opacity-80">{item.icon}</div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="h-[1px] bg-white border-b border-retro-border-dark my-1 mx-1" />
        <div className="start-menu-item px-3 py-1 flex items-center gap-2 cursor-pointer text-[10px] font-sans" onClick={() => { onOpenApp('logoff'); onClose(); }}>
          <LogOut size={14} /><span>Log Off</span>
        </div>
        <div className="start-menu-item px-3 py-1 flex items-center gap-2 cursor-pointer text-[10px] font-sans font-bold" onClick={() => { onOpenApp('shutdown'); onClose(); }}>
          <Power size={14} /><span>Shut Down...</span>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
