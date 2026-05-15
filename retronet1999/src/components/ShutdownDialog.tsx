import React, { useState } from 'react';
import { Power, RotateCw, Moon, LogOut } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

const ShutdownDialog: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const { setPhase, logout, saveSnapshot } = useSystem();
  const [action, setAction] = useState<'shutdown' | 'restart' | 'sleep' | 'logoff'>('shutdown');
  const [shutdownPhase, setShutdownPhase] = useState<'dialog' | 'saving' | 'bios'>('dialog');
  const [biosLine, setBiosLine] = useState(0);

  const shutdownMessages = [
    'Saving your settings...',
    'Closing all programs...',
    'Flushing disk cache...',
    'Preparing to shut down...',
  ];

  const biosShutdown = [
    'Shutting down RetroNet OS...',
    'Saving registry hive...',
    'Unmounting drives...',
    'Releasing IRQ channels...',
    'Powering down CPU...',
    '',
    'It is now safe to turn off your computer.',
  ];

  const biosRestart = [
    'Restarting RetroNet OS...',
    'Saving state...',
    'Unmounting drives...',
    'Resetting hardware...',
    '',
    'System will restart in 3 seconds...',
  ];

  const handleExecute = () => {
    if (action === 'logoff') {
      logout();
      return;
    }
    if (action === 'sleep') {
      setPhase('sleep');
      return;
    }

    // For shutdown and restart, clear the booted flag so a refresh goes to boot screen
    sessionStorage.removeItem('retronet1999:booted');
    sessionStorage.removeItem('retronet1999:current-user');
    
    setShutdownPhase('saving');
    
    // Saving phase
    setTimeout(() => {
      setShutdownPhase('bios');
      
      // BIOS shutdown messages
      const messages = action === 'restart' ? biosRestart : biosShutdown;
      let line = 0;
      const interval = setInterval(() => {
        line++;
        setBiosLine(line);
        if (line >= messages.length) {
          clearInterval(interval);
          if (action === 'restart') {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
          // For shutdown, just leave the "safe to turn off" message
        }
      }, 600);
    }, 2500);
  };

  // Saving phase
  if (shutdownPhase === 'saving') {
    return (
      <div className="fixed inset-0 z-[60000] bg-[#000080] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-xl font-sans mb-4">Windows is shutting down...</div>
          <div className="text-blue-200 text-sm font-sans">
            {shutdownMessages.map((msg, i) => (
              <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.5}s` }}>{msg}</div>
            ))}
          </div>
          <div className="mt-8 w-48 h-3 bg-black/30 border border-blue-300 mx-auto p-[1px]">
            <div className="h-full bg-white animate-[pulse_1s_infinite] w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  // BIOS shutdown
  if (shutdownPhase === 'bios') {
    const messages = action === 'restart' ? biosRestart : biosShutdown;
    return (
      <div className="fixed inset-0 z-[60000] bg-black text-amber-400 font-mono text-sm p-8">
        {messages.slice(0, biosLine).map((line, i) => (
          <div key={i} className={i === messages.length - 1 && action !== 'restart' ? 'text-white font-bold mt-4' : ''}>{line}</div>
        ))}
        {action !== 'restart' && biosLine >= messages.length && (
          <div className="mt-8 text-gray-500 text-xs animate-pulse">
            (Close this tab or refresh to restart)
          </div>
        )}
      </div>
    );
  }

  // Dialog
  return (
    <div className="fixed inset-0 z-[60000] bg-black/50 flex items-center justify-center">
      <div className="win95-window w-[350px]">
        <div className="win95-titlebar h-7 flex items-center px-2 gap-1">
          <Power size={12} />
          <span>Shut Down RetroNet</span>
        </div>
        <div className="p-4 bg-[#c0c0c0] font-sans text-xs">
          <div className="flex gap-4 mb-4">
            <div className="w-12 h-12 bg-[#000080] rounded flex items-center justify-center">
              <Power size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold mb-2">What do you want the computer to do?</div>
              <div className="flex flex-col gap-1">
                {[
                  { value: 'shutdown' as const, label: 'Shut down', icon: <Power size={12} /> },
                  { value: 'restart' as const, label: 'Restart', icon: <RotateCw size={12} /> },
                  { value: 'sleep' as const, label: 'Stand by', icon: <Moon size={12} /> },
                  { value: 'logoff' as const, label: 'Log off current user', icon: <LogOut size={12} /> },
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 p-1 rounded">
                    <input
                      type="radio"
                      name="shutdown-action"
                      checked={action === opt.value}
                      onChange={() => setAction(opt.value)}
                    />
                    {opt.icon}
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-400 pt-3">
            <button className="win95-button px-4 py-1 font-bold" onClick={handleExecute}>
              OK
            </button>
            <button className="win95-button px-4 py-1" onClick={onCancel}>
              Cancel
            </button>
            <button className="win95-button px-4 py-1" onClick={() => {
              saveSnapshot('Auto-save before shutdown');
              handleExecute();
            }}>
              Save & {action === 'restart' ? 'Restart' : 'Shutdown'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShutdownDialog;
