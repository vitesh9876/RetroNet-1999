import React, { useState, useEffect } from 'react';
import Window from './Window';
import { HardDrive, Play, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { CommonWindowProps } from '../types';

const Defrag: React.FC<CommonWindowProps> = (props) => {
  const [grid, setGrid] = useState<string[]>([]);
  const [isDefragging, setIsDefragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, setStats] = useState({ clusters: 1024, fragmented: 12.4, free: 35.1 });

  // Initialize grid with random data types
  useEffect(() => {
    const newGrid: string[] = [];
    for (let i = 0; i < 400; i++) {
      const r = Math.random();
      if (r < 0.35) newGrid.push('free'); // White
      else if (r < 0.55) newGrid.push('used'); // Blue
      else if (r < 0.70) newGrid.push('fragmented'); // Red
      else if (r < 0.85) newGrid.push('system'); // Green
      else newGrid.push('unmovable'); // Dark Gray
    }
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    if (!isDefragging) return;

    const timer = setInterval(() => {
      setGrid(prev => {
        const next = [...prev];
        // Find a fragmented block and "move" it
        const fragIdx = next.findIndex((c, i) => c === 'fragmented' && i > progress * 4);
        if (fragIdx !== -1) {
          next[fragIdx] = 'used';
          // Occasionally swap with free space
          const freeIdx = next.findIndex(c => c === 'free');
          if (freeIdx !== -1) {
            [next[fragIdx], next[freeIdx]] = [next[freeIdx], next[fragIdx]];
          }
        }
        return next;
      });

      setProgress(p => {
        if (p >= 100) {
          setIsDefragging(false);
          setStats(s => ({ ...s, fragmented: 0.1 }));
          return 100;
        }
        return p + 0.5;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isDefragging, progress]);

  const getColor = (type: string) => {
    switch (type) {
      case 'free': return '#ffffff';
      case 'used': return '#000080';
      case 'fragmented': return '#ff0000';
      case 'system': return '#008000';
      case 'unmovable': return '#808080';
      default: return '#ffffff';
    }
  };

  return (
    <Window title="Disk Defragmenter" icon={<HardDrive size={14} />} width={450} height={400} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] p-4 font-sans">
        <div className="win95-window p-3 mb-4 bg-white flex gap-4 items-center">
          <HardDrive size={32} className="text-gray-600" />
          <div className="flex-1">
            <div className="text-sm font-bold">Drive C: (Local Disk)</div>
            <div className="text-xs text-gray-600">Capacity: 2.1 GB | Free Space: 740 MB</div>
          </div>
          <div className="flex flex-col gap-1">
            <button 
              disabled={isDefragging}
              onClick={() => { setIsDefragging(true); setProgress(0); }}
              className="win95-button flex items-center gap-1 text-[10px] py-1"
            >
              <Play size={10} /> Defragment
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="win95-button flex items-center gap-1 text-[10px] py-1"
            >
              <RefreshCcw size={10} /> Analyze
            </button>
          </div>
        </div>

        <div className="flex-1 win95-window bg-black p-1 mb-3 overflow-hidden">
          <div className="grid grid-cols-20 gap-[1px] h-full">
            {grid.map((type, i) => (
              <div 
                key={i} 
                className="w-full h-full"
                style={{ 
                  backgroundColor: getColor(type),
                  boxShadow: 'inset 1px 1px rgba(255,255,255,0.2), inset -1px -1px rgba(0,0,0,0.2)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="win95-window p-2 text-[10px] flex justify-between items-center">
          <div className="flex gap-3">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-800" /> Used</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600" /> Frag</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-white border border-gray-400" /> Free</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-700" /> Sys</div>
          </div>
          <div className="font-bold">{Math.floor(progress)}% Complete</div>
        </div>

        {progress === 100 && (
          <div className="mt-2 flex items-center gap-2 text-green-700 font-bold text-xs animate-bounce">
            <CheckCircle2 size={14} /> Defragmentation complete! Your system is now optimized.
          </div>
        )}
        
        {isDefragging && (
          <div className="mt-2 h-2 border border-gray-400 bg-white p-[1px]">
            <div className="h-full bg-blue-800" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Window>
  );
};

export default Defrag;
