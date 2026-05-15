import React, { useEffect, useState } from 'react';
import { useSystem } from '../contexts/SystemContext';

const BSODScreen: React.FC = () => {
  const { phase, setPhase, bsodMessage, setBootProfile } = useSystem();
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    if (phase !== 'bsod') return;
    const timer = setTimeout(() => setShowRecovery(true), 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'bsod') return;
    const handler = (e: KeyboardEvent) => {
      if (showRecovery) {
        if (e.ctrlKey && e.altKey && e.key === 'Delete') {
          sessionStorage.removeItem('retronet1999:booted');
          sessionStorage.removeItem('retronet1999:current-user');
          window.location.reload();
        } else {
          // Any other key -> Safe Mode recovery
          setBootProfile('safe_mode');
          setPhase('booting');
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, showRecovery]);

  if (phase !== 'bsod') return null;

  return (
    <div className="fixed inset-0 z-[70000] bg-[#0000AA] text-white font-mono text-sm p-12 flex flex-col">
      <div className="text-center mb-8">
        <div className="inline-block bg-[#AAAAAA] text-[#0000AA] px-6 py-1 font-bold text-lg">
          RetroNet 1999
        </div>
      </div>

      <div className="leading-6 max-w-2xl mx-auto">
        <pre className="whitespace-pre-wrap">{bsodMessage}</pre>
      </div>

      {showRecovery && (
        <div className="mt-8 max-w-2xl mx-auto animate-pulse">
          <div className="text-yellow-300">
            Press any key to attempt recovery via Safe Mode.
          </div>
          <div className="text-gray-400 mt-2 text-xs">
            Press CTRL+ALT+DEL to restart your computer.
          </div>
        </div>
      )}

      {/* Fake error codes at bottom */}
      <div className="mt-auto text-[10px] text-gray-500 max-w-2xl mx-auto">
        <div>*** STOP: 0x0000000E (0xC0000005, 0x804E518E, 0x00000000, 0x00000000)</div>
        <div>*** Ntfs.sys - Address 804E518E base at 80400000, DateStamp 371d4f00</div>
      </div>
    </div>
  );
};

export default BSODScreen;
