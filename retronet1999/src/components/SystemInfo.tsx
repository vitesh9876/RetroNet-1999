import { useEffect, useState } from 'react';
import Window from './Window';
import { Cpu, HardDrive, MemoryStick, MonitorCog, CheckCircle2, Circle, Star, Info } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

const SystemInfo: React.FC<CommonWindowProps> = (props) => {
  const { files } = useFileSystem();
  const { theme, refreshRate, crt, missions, easterEggsFound } = useSystem();
  const [tick, setTick] = useState(0);
  const [activeTab, setActiveTab] = useState<'resources' | 'system' | 'missions' | 'credits'>('resources');

  useEffect(() => {
    const timer = window.setInterval(() => setTick(value => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const cpu = 12 + Math.round(Math.abs(Math.sin(tick / 2)) * 65);
  const memory = 48 + Math.round(Math.abs(Math.cos(tick / 3)) * 25);
  const disk = Math.min(98, 5 + files.length * 2);

  const missionList = Object.entries(missions).map(([id, completed]) => ({
    id,
    label: id.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
    completed
  }));

  return (
    <Window title="System Properties" icon={<MonitorCog size={14} />} width={500} height={420} {...props}>
      <div className="h-full bg-[#c0c0c0] p-1 font-sans text-xs text-black flex flex-col">
        {/* Tabs */}
        <div className="flex gap-1 px-1 mb-[-1px] z-10">
          {[
            { id: 'system', label: 'General' },
            { id: 'resources', label: 'Performance' },
            { id: 'missions', label: 'Missions' },
            { id: 'credits', label: 'Credits' },
          ].map(t => (
            <button 
              key={t.id}
              className={`px-3 py-1 border-t-2 border-l-2 border-r-2 rounded-t-sm ${activeTab === t.id ? 'bg-[#c0c0c0] border-white font-bold' : 'bg-[#e0e0e0] border-gray-400 mt-1'}`}
              onClick={() => setActiveTab(t.id as any)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 win95-window shadow-inner border-2 border-white p-4 overflow-auto flex flex-col gap-4">
          {activeTab === 'system' && (
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center mb-6">
                <div className="w-16 h-16 bg-blue-800 rounded flex items-center justify-center text-white text-3xl font-bold italic shadow-inner">RN</div>
                <div>
                  <h2 className="text-xl font-bold italic">RetroNet 1999</h2>
                  <p className="text-xs">Service Pack 2.1 (Build 2222)</p>
                  
                  <div className="mt-4">
                    <div className="font-bold">Registered to:</div>
                    <div className="ml-4">
                      <div>Vitesh Pallapothu</div>
                      <div>RetroNet OS Development Team</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-400 pt-2 flex flex-col gap-1">
                <p className="font-bold">Computer:</p>
                <div className="ml-4 flex flex-col gap-0.5">
                  <p>Intel Pentium III Processor</p>
                  <p>500 MHz (Virtual Core)</p>
                  <p>64.0 MB of RAM</p>
                  <p>8.4 GB Virtual Hard Disk</p>
                </div>
              </div>

              <div className="border-t border-gray-400 pt-2 flex flex-col gap-1">
                <p className="font-bold">Environment:</p>
                <div className="ml-4 flex flex-col gap-0.5">
                  <p>Theme: <span className="capitalize">{theme}</span></p>
                  <p>Display: {refreshRate}Hz with {crt.enabled ? 'CRT Simulation' : 'Flat Panel'}</p>
                  <p>Browser: Retro Internet Explorer 5.0</p>
                  <p>Uptime: {Math.floor(tick / 60)}m {tick % 60}s</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="flex flex-col gap-4">
              {[
                { label: 'CPU Usage', value: cpu, icon: <Cpu size={16} />, color: 'bg-green-600' },
                { label: 'Memory Usage', value: memory, icon: <MemoryStick size={16} />, color: 'bg-blue-600' },
                { label: 'Disk Usage', value: disk, icon: <HardDrive size={16} />, color: 'bg-yellow-600' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 font-bold">{item.icon}{item.label}</div>
                  <div className="h-6 win95-window shadow-inner bg-gray-200 p-[2px] flex items-center">
                    <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span>0%</span>
                    <span>{item.value}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}

              <div className="mt-4 win95-window bg-black p-2 h-24 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <svg className="absolute inset-0 w-full h-full">
                  <path 
                    d={`M 0 50 ${[...Array(10)].map((_, i) => `L ${i * 50} ${50 + Math.sin((tick + i) / 2) * 20}`).join(' ')}`}
                    fill="none" 
                    stroke="#00ff00" 
                    strokeWidth="1"
                    className="animate-pulse"
                  />
                </svg>
                <span className="absolute top-1 left-2 text-[8px] text-green-500 font-mono">LIVE PERFORMANCE TRACKING</span>
              </div>
            </div>
          )}

          {activeTab === 'missions' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="font-bold text-sm border-b border-gray-400 pb-1">Current Objectives</p>
                <div className="grid grid-cols-1 gap-1">
                  {missionList.map(m => (
                    <div key={m.id} className="flex items-center gap-2">
                      {m.completed ? <CheckCircle2 size={14} className="text-green-600" /> : <Circle size={14} className="text-gray-400" />}
                      <span className={m.completed ? 'line-through text-gray-500' : 'font-bold'}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold text-sm border-b border-gray-400 pb-1">Easter Eggs Found</p>
                <div className="flex flex-wrap gap-2">
                  {easterEggsFound.length === 0 ? (
                    <p className="italic text-gray-400">Keep exploring to find secrets!</p>
                  ) : (
                    easterEggsFound.map(egg => (
                      <div key={egg} className="bg-yellow-100 border border-yellow-400 px-2 py-1 rounded-full flex items-center gap-1 text-[10px]">
                        <Star size={10} className="text-yellow-600 fill-yellow-600" />
                        <span className="capitalize">{egg.replace('_', ' ')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-auto bg-blue-50 border border-blue-200 p-2 flex items-center gap-2">
                <Info size={16} className="text-blue-600" />
                <p className="text-[10px]">Complete missions to unlock hidden system features and secret files.</p>
              </div>
            </div>
          )}

          {activeTab === 'credits' && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full flex items-center justify-center text-white text-4xl mb-4 shadow-lg border-4 border-white">
                VP
              </div>
              <h2 className="text-xl font-bold mb-1">RetroNet 1999</h2>
              <p className="text-sm text-gray-600 mb-6 italic">"Relive the Golden Era of the Web"</p>
              
              <div className="win95-window shadow-inner bg-white p-4 w-full border-2 border-gray-300">
                <p className="font-bold text-blue-900 mb-2">Created & Authored by:</p>
                <p className="text-lg font-serif mb-1">Vitesh Pallapothu</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Lead Developer & Visionary</p>
                
                <div className="border-t border-gray-200 pt-3 flex flex-col gap-1 text-[9px] text-gray-600">
                  <p>© 2024 Vitesh Pallapothu Projects</p>
                  <p>All Rights Reserved. Simulated in 1999.</p>
                </div>
              </div>

              <div className="mt-4 text-[10px] text-gray-400">
                Developed with passion for Retro-Aesthetics and Interactive Storytelling.
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-2 gap-2">
          <button className="win95-button px-6 py-1" onClick={props.onClose}>OK</button>
          <button className="win95-button px-6 py-1" onClick={props.onClose}>Cancel</button>
        </div>
      </div>
    </Window>
  );
};

export default SystemInfo;
