import React, { useEffect, useState } from 'react';
import { useSystem } from '../contexts/SystemContext';

const SleepScreen: React.FC = () => {
  const { phase, setPhase } = useSystem();
  const [showWake, setShowWake] = useState(false);

  useEffect(() => {
    if (phase !== 'sleep') return;
    const timer = setTimeout(() => setShowWake(true), 1000);
    const handler = () => {
      if (showWake) setPhase('desktop');
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('click', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handler);
      window.removeEventListener('click', handler);
    };
  }, [phase, showWake]);

  if (phase !== 'sleep') return null;

  return (
    <div className="fixed inset-0 z-[60000] bg-black flex items-center justify-center cursor-none">
      {showWake && (
        <div className="text-white/20 text-xs font-mono animate-pulse">
          Press any key or click to wake...
        </div>
      )}
    </div>
  );
};

export default SleepScreen;
