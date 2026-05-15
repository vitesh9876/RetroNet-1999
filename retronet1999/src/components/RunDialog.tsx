import { useState } from 'react';
import Window from './Window';
import { Play, Search } from 'lucide-react';
import { CommonWindowProps } from '../types';

interface RunDialogProps extends CommonWindowProps {
  onRun: (command: string) => void;
}

const HISTORY = ['browser', 'terminal', 'explorer', 'notepad', 'paint', 'calc', 'sysinfo', 'control', 'antivirus', 'cdrom'];

const RunDialog: React.FC<RunDialogProps> = ({ onRun, ...props }) => {
  const [command, setCommand] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!command.trim()) return;
    onRun(command);
    props.onClose();
  };

  return (
    <Window title="Run" icon={<Play size={14} />} width={380} height={200} {...props}>
      <form onSubmit={submit} className="h-full bg-[#c0c0c0] p-4 font-sans text-xs flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white win95-window shadow-inner flex items-center justify-center p-1 border-2 border-retro-border-dark flex-shrink-0">
            <Play size={24} className="text-blue-800" />
          </div>
          <div className="flex flex-col gap-2">
            <p className="leading-tight text-[11px]">Type the name of a program, folder, document, or Internet resource, and RetroNet will open it for you.</p>
            <div className="flex items-center gap-2 relative">
              <span className="w-10">Open:</span>
              <div className="flex-1 flex win95-window shadow-inner bg-white h-6 relative">
                <input
                  autoFocus
                  className="flex-1 px-2 outline-none text-xs bg-transparent"
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                />
                <button 
                  type="button" 
                  className="w-5 flex items-center justify-center border-l border-gray-400 hover:bg-gray-100"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  <div className="border-t-[4px] border-t-black border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent" />
                </button>

                {showHistory && (
                  <div className="absolute top-full left-0 right-0 bg-white win95-window z-50 shadow-lg border-2 border-retro-border-dark overflow-auto max-h-32">
                    {HISTORY.map(h => (
                      <button key={h} type="button" className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white" onClick={() => { setCommand(h); setShowHistory(false); }}>{h}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-auto">
          <button type="submit" className="win95-button px-6 py-1 font-bold">OK</button>
          <button type="button" className="win95-button px-6 py-1" onClick={props.onClose}>Cancel</button>
          <button type="button" className="win95-button px-6 py-1 flex items-center gap-1"><Search size={10} /> Browse...</button>
        </div>
      </form>
    </Window>
  );
};

export default RunDialog;
