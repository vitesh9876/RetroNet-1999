import React, { useState } from 'react';
import Window from './Window';
import { Shield, Bug, CheckCircle } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useSystem } from '../contexts/SystemContext';

const VirusScanner: React.FC<CommonWindowProps> = (props) => {
  const { virusActive, setVirusActive, completeMission, addNotification } = useSystem();
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'found' | 'clean' | 'repairing'>('idle');
  const [progress, setProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  const paths = ['C:\\', 'C:\\Documents', 'C:\\System', 'C:\\Program Files', 'C:\\Documents\\Downloads', 'C:\\Documents\\My Pictures', 'C:\\Documents\\Games'];

  const startScan = () => {
    setPhase('scanning');
    setProgress(0);
    setScanLog([]);
    let p = 0;
    let pathIdx = 0;
    const iv = setInterval(() => {
      p += Math.random() * 8;
      if (pathIdx < paths.length && p > (pathIdx + 1) * (100 / paths.length)) {
        setScanLog(prev => [...prev, `Scanning ${paths[pathIdx]}... OK`]);
        pathIdx++;
      }
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        if (virusActive) {
          setScanLog(prev => [...prev, '', '⚠ THREAT DETECTED!', 'Name: ILOVEYOU.VBS (LOVE-LETTER worm)', 'Location: C:\\System\\ILOVEYOU.VBS', 'Risk Level: HIGH']);
          setPhase('found');
        } else {
          setScanLog(prev => [...prev, '', '✅ No threats found. System is clean.']);
          setPhase('clean');
        }
      }
      setProgress(Math.min(100, p));
    }, 200);
  };

  const repairSystem = () => {
    setPhase('repairing');
    setScanLog(prev => [...prev, '', 'Quarantining ILOVEYOU.VBS...', 'Removing registry entries...', 'Restoring damaged files...']);
    setTimeout(() => {
      setVirusActive(false);
      completeMission('defeatVirus');
      setScanLog(prev => [...prev, '✅ Virus removed successfully!', 'System has been cleaned.']);
      setPhase('clean');
      addNotification({ title: '🛡 Virus Removed', message: 'ILOVEYOU.VBS has been quarantined and removed.', type: 'success' });
    }, 3000);
  };

  return (
    <Window title="RetroNet AntiVirus" icon={<Shield size={14} />} width={450} height={380} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs p-3 gap-2">
        <div className="flex items-center gap-3 border-b border-gray-400 pb-2">
          <Shield size={32} className="text-green-600" />
          <div>
            <div className="font-bold text-sm">RetroNet AntiVirus Scanner</div>
            <div className="text-gray-600">Version 1.0 - Virus Definitions: 1999.05.13</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold">System Status:</span>
          {virusActive ? (
            <span className="text-red-600 flex items-center gap-1"><Bug size={12} /> INFECTED</span>
          ) : (
            <span className="text-green-600 flex items-center gap-1"><CheckCircle size={12} /> CLEAN</span>
          )}
        </div>

        {/* Progress */}
        {(phase === 'scanning' || phase === 'repairing') && (
          <div>
            <div className="flex justify-between mb-1">
              <span>{phase === 'scanning' ? 'Scanning...' : 'Repairing...'}</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            <div className="h-4 win95-window shadow-inner bg-gray-200 p-0.5">
              <div className="h-full bg-green-600 transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Log */}
        <div className="flex-1 win95-window shadow-inner bg-white p-2 overflow-auto font-mono text-[10px]">
          {scanLog.length === 0 ? (
            <div className="text-gray-500 italic">Click "Scan Now" to begin a full system scan.</div>
          ) : scanLog.map((line, i) => (
            <div key={i} className={line.includes('⚠') || line.includes('THREAT') ? 'text-red-600 font-bold' : line.includes('✅') ? 'text-green-600 font-bold' : ''}>{line}</div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          {phase === 'found' && (
            <button className="win95-button px-4 py-1 font-bold text-red-600" onClick={repairSystem}>
              🛡 Remove Threat
            </button>
          )}
          <button className="win95-button px-4 py-1" onClick={startScan} disabled={phase === 'scanning' || phase === 'repairing'}>
            {phase === 'scanning' ? 'Scanning...' : 'Scan Now'}
          </button>
        </div>
      </div>
    </Window>
  );
};

export default VirusScanner;
