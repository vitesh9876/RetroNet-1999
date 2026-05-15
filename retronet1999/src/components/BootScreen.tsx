import React, { useEffect, useState } from 'react';
import { Monitor, HardDrive, Shield, Skull, Briefcase } from 'lucide-react';
import { useSystem, BootProfile } from '../contexts/SystemContext';

const profiles: { id: BootProfile; name: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { id: 'retronet1999', name: 'RetroNet 1999', icon: <Monitor size={20} />, desc: 'Standard boot – full desktop experience', color: '#00ff00' },
  { id: 'office_pc', name: 'Office PC', icon: <Briefcase size={20} />, desc: 'Minimal programs, business wallpaper', color: '#5b9bd5' },
  { id: 'hacker_mode', name: 'Hacker Mode', icon: <Skull size={20} />, desc: 'Matrix theme, terminal focus, admin tools', color: '#00ff41' },
  { id: 'safe_mode', name: 'Safe Mode', icon: <Shield size={20} />, desc: 'Minimal drivers, repair tools active', color: '#ffcc00' },
  { id: 'corrupted_disk', name: 'Corrupted Disk', icon: <HardDrive size={20} />, desc: '⚠ WARNING: Filesystem errors detected', color: '#ff3333' },
];

const bootLines: Record<BootProfile, string[]> = {
  retronet1999: [
    'RetroBIOS v4.10.1999',
    'Memory Test: 65536K OK',
    'Detecting IDE Primary Master ... RETRONET_OS.DSK',
    'Loading HIMEM.SYS',
    'Loading EMM386.EXE',
    'Initializing dial-up adapter',
    'Loading RetroNet Desktop Shell v4.10',
    'Mounting virtual drives ...',
    'Starting RetroNet 1999 shell',
  ],
  office_pc: [
    'RetroBIOS v4.10.1999 - CORPORATE EDITION',
    'Memory Test: 65536K OK',
    'Detecting IDE Primary Master ... OFFICE_PC.DSK',
    'Loading corporate network drivers',
    'Connecting to DOMAIN\\RETRONET_OFFICE',
    'Loading Microsoft Office 97 components',
    'Starting Office Desktop Shell',
  ],
  hacker_mode: [
    '> BIOS OVERRIDE DETECTED',
    '> Bypassing memory check...',
    '> Loading custom kernel module...',
    '> Injecting root shell...',
    '> Mounting encrypted partitions...',
    '> Loading packet sniffer...',
    '> Network adapter: PROMISCUOUS MODE',
    '> ALL SYSTEMS COMPROMISED',
    '> Welcome, Operator.',
  ],
  safe_mode: [
    'RetroBIOS v4.10.1999',
    'Memory Test: 65536K OK',
    '',
    '*** SAFE MODE ***',
    'Loading minimal drivers...',
    'VGA driver: Standard VGA 640x480',
    'Skipping network adapter',
    'Skipping sound card',
    'Loading Safe Mode shell',
    'System Repair Tools available',
  ],
  corrupted_disk: [
    'RetroBIOS v4.10.1999',
    'Memory Test: 65536K OK',
    'Detecting IDE Primary Master ... ERROR',
    '',
    '*** WARNING: DISK READ ERROR ***',
    'Sector 0x003F corrupted',
    'Attempting recovery...',
    'CHKDSK /F running...',
    '12 lost clusters found in 3 chains.',
    'Converting lost chains to files...',
    'Partial recovery complete.',
    'WARNING: Some files may be corrupted!',
    'Loading shell with limited functionality...',
  ],
};

const biosMessages = [
  'Award Modular BIOS v4.51PG, An Energy Star Ally',
  'Copyright (C) 1984-99, Award Software, Inc.',
  '',
  'RetroNet M/B-7VIA Rev: 2.0 01/01/1999',
  'Intel Pentium III 450MHz Processor',
  '',
];

const BootScreen: React.FC = () => {
  const { phase, setPhase, bootProfile, setBootProfile, setTheme, addNotification } = useSystem();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [progress, setProgress] = useState(8);
  const [showBios, setShowBios] = useState(true);

  // BIOS splash
  useEffect(() => {
    if (phase !== 'boot_select') return;
    const timer = setTimeout(() => setShowBios(false), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Boot sequence
  useEffect(() => {
    if (phase !== 'booting') return;

    const lines = bootLines[bootProfile];
    const lineTimer = window.setInterval(() => {
      setLineCount(c => Math.min(lines.length, c + 1));
    }, 300);
    const progressTimer = window.setInterval(() => {
      setProgress(v => Math.min(100, v + 7));
    }, 200);
    const doneTimer = window.setTimeout(() => {
      // Apply theme based on profile
      if (bootProfile === 'hacker_mode') setTheme('matrix');
      else if (bootProfile === 'office_pc') setTheme('xp_luna');
      else if (bootProfile === 'safe_mode') setTheme('classic');
      else if (bootProfile === 'corrupted_disk') {
        setTheme('cyberpunk');
        addNotification({ title: '⚠ Disk Warning', message: 'Some files may be corrupted. Run CHKDSK to verify.', type: 'warning' });
      }
      setPhase('login');
    }, lines.length * 300 + 1200);

    return () => {
      clearInterval(lineTimer);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  }, [phase, bootProfile]);

  // Keyboard navigation for boot selection
  useEffect(() => {
    if (phase !== 'boot_select' || showBios) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') setSelectedIndex(prev => (prev > 0 ? prev - 1 : profiles.length - 1));
      if (e.key === 'ArrowDown') setSelectedIndex(prev => (prev < profiles.length - 1 ? prev + 1 : 0));
      if (e.key === 'Enter') {
        const p = profiles[selectedIndex];
        setBootProfile(p.id);
        setLineCount(0);
        setProgress(8);
        setPhase('booting');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, showBios, selectedIndex, setBootProfile, setPhase]);

  // Boot selection screen
  if (phase === 'boot_select') {
    if (showBios) {
      return (
        <div className="fixed inset-0 z-[50000] bg-black text-gray-300 font-mono text-sm p-8">
          {biosMessages.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
          <div className="mt-4 text-yellow-400 animate-pulse">Press DEL to enter SETUP, F8 for Boot Menu...</div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-[50000] bg-black text-white font-mono flex flex-col items-center justify-center">
        <div className="border border-gray-600 p-6 w-[500px] max-w-[90vw] bg-black shadow-[0_0_50px_rgba(0,0,0,1)]">
          <div className="text-center mb-6">
            <div className="text-cyan-400 text-lg font-bold mb-1">RetroNet 1999 Boot Manager</div>
            <div className="text-gray-400 text-[10px]">Created by Vitesh Pallapothu</div>
            <div className="text-gray-500 text-xs mt-2">Select an operating system to start:</div>
          </div>

          <div className="flex flex-col gap-1 mb-6">
            {profiles.map((p, i) => (
              <button
                key={p.id}
                className={`flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors outline-none ${
                  selectedIndex === i 
                    ? 'bg-gray-200 text-black' 
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
                onClick={() => setSelectedIndex(i)}
                onDoubleClick={() => {
                  setBootProfile(p.id);
                  setLineCount(0);
                  setProgress(8);
                  setPhase('booting');
                }}
              >
                <span style={{ color: p.color }}>{p.icon}</span>
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-[10px] opacity-60">{p.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              className="border border-gray-600 px-4 py-1 text-sm hover:bg-gray-800 text-cyan-400"
              onClick={() => {
                setBootProfile(profiles[selectedIndex].id);
                setLineCount(0);
                setProgress(8);
                setPhase('booting');
              }}
            >
              Boot Selected
            </button>
          </div>

          <div className="text-center mt-4 text-[10px] text-gray-600">
            Use ↑↓ to select, Enter to boot. Double-click profile to quick-boot.
          </div>
        </div>
      </div>
    );
  }

  // Booting screen
  if (phase === 'booting') {
    const lines = bootLines[bootProfile];
    return (
      <div className="fixed inset-0 z-[50000] boot-screen text-green-300 font-mono p-8 flex flex-col">
        <div className="flex items-center gap-3 text-white mb-8">
          <Monitor size={34} />
          <div>
            <div className="text-2xl font-bold tracking-[4px]">RetroNet 1999</div>
            <div className="text-xs text-green-300">
              {bootProfile === 'safe_mode' ? '*** SAFE MODE ***' : 
               bootProfile === 'hacker_mode' ? '> OPERATOR SESSION' :
               bootProfile === 'corrupted_disk' ? '⚠ RECOVERY MODE' :
               'Personal Virtual Machine Environment'}
            </div>
          </div>
        </div>

        <div className="flex-1 text-sm leading-7">
          {lines.slice(0, lineCount).map((line, i) => (
            <div key={i} className={line.startsWith('***') || line.startsWith('⚠') ? 'text-yellow-400' : line.startsWith('>') ? 'text-cyan-400' : ''}>{line}</div>
          ))}
          <span className="inline-block w-2 h-4 bg-green-300 align-middle animate-pulse" />
        </div>

        <div className="win95-window bg-black/60 p-3 text-xs text-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-2"><HardDrive size={14} /> Boot disk activity</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="h-4 border border-green-700 bg-black p-[2px]">
            <div className="h-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,.8)] transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BootScreen;
