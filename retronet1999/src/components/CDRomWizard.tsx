import React, { useState } from 'react';
import Window from './Window';
import { Disc, CheckCircle, ArrowRight } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

const apps = [
  { name: 'RetroZip 2.1', desc: 'Archive manager for ZIP files', size: '1.2 MB' },
  { name: 'WinAmp 2.0', desc: 'MP3 music player - It whips the llama\'s ass!', size: '3.1 MB' },
  { name: 'mIRC 5.71', desc: 'Internet Relay Chat client', size: '890 KB' },
  { name: 'ICQ 99b', desc: 'Instant messaging - Uh-Oh!', size: '4.2 MB' },
  { name: 'RealPlayer G2', desc: 'Streaming media player', size: '6.4 MB' },
  { name: 'Netscape Navigator 4.7', desc: 'Web browser', size: '12 MB' },
];

const CDRomWizard: React.FC<CommonWindowProps> = (props) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const { saveFile } = useFileSystem();
  const { completeMission, addNotification } = useSystem();

  const handleInstall = () => {
    setInstalling(true);
    setStep(3);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 12;
      if (p >= 100) {
        clearInterval(iv);
        setProgress(100);
        // Create files for installed apps
        selected.forEach(name => {
          saveFile(`${name.replace(/[\s.]/g, '_')}.exe`, `Installed: ${name}`, 'exe', 'C:\\Program Files');
        });
        completeMission('installSoftware');
        addNotification({ title: 'Installation Complete', message: `${selected.length} application(s) installed successfully.`, type: 'success' });
        setDone(true);
        setInstalling(false);
      }
      setProgress(Math.min(100, p));
    }, 200);
  };

  const toggleApp = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  return (
    <Window title="CD-ROM Install Wizard" icon={<Disc size={14} />} width={450} height={380} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs">
        {/* Header */}
        <div className="bg-[#000080] text-white p-3 flex items-center gap-3">
          <Disc size={28} />
          <div>
            <div className="font-bold text-sm">RetroNet Software Installer</div>
            <div className="text-blue-200 text-[10px]">Install from CD-ROM: RETRONET_APPS_1999</div>
          </div>
        </div>

        <div className="flex-1 p-3 overflow-auto">
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <div className="font-bold">Welcome to the RetroNet Software Installer!</div>
              <p>This wizard will install software from the RetroNet 1999 CD-ROM.</p>
              <div className="win95-window shadow-inner bg-white p-2 text-[10px]">
                <div>💿 CD-ROM Drive D: detected</div>
                <div>📀 Disc: RETRONET_APPS_1999</div>
                <div>📁 {apps.length} applications available</div>
              </div>
              <p className="text-gray-600">Click Next to select software to install.</p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-2">
              <div className="font-bold">Select software to install:</div>
              {apps.map(app => (
                <label key={app.name} className={`flex items-center gap-2 p-2 border ${selected.includes(app.name) ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'} cursor-pointer hover:bg-blue-50`}>
                  <input type="checkbox" checked={selected.includes(app.name)} onChange={() => toggleApp(app.name)} />
                  <div className="flex-1">
                    <div className="font-bold">{app.name}</div>
                    <div className="text-gray-600">{app.desc}</div>
                  </div>
                  <span className="text-gray-400">{app.size}</span>
                </label>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <div className="font-bold">Ready to install:</div>
              <div className="win95-window shadow-inner bg-white p-2">
                {selected.map(s => <div key={s} className="flex items-center gap-1"><CheckCircle size={10} className="text-green-600" /> {s}</div>)}
              </div>
              <div className="text-gray-600">Install location: C:\Program Files</div>
              <p>Click Install to begin installation.</p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              <div className="font-bold">{done ? 'Installation Complete!' : 'Installing software...'}</div>
              <div className="h-4 win95-window shadow-inner bg-gray-200 p-0.5">
                <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-center">{Math.floor(progress)}%</div>
              {done && (
                <div className="win95-window shadow-inner bg-white p-2 text-green-600 font-bold text-center">
                  ✅ All selected applications have been installed successfully!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-2 border-t border-gray-400">
          <button className="win95-button px-4 py-1" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0 || step === 3}>
            Back
          </button>
          <div className="flex gap-2">
            {step < 2 && (
              <button className="win95-button px-4 py-1" onClick={() => setStep(step + 1)} disabled={step === 1 && selected.length === 0}>
                Next <ArrowRight size={10} className="inline" />
              </button>
            )}
            {step === 2 && (
              <button className="win95-button px-4 py-1 font-bold" onClick={handleInstall}>
                Install
              </button>
            )}
            {done && (
              <button className="win95-button px-4 py-1" onClick={props.onClose}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};

export default CDRomWizard;
