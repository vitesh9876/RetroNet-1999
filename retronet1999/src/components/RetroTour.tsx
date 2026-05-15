import React, { useState } from 'react';
import Window from './Window';
import { HelpCircle, Monitor, Shield, Layout, Zap, Coffee, ChevronRight, ChevronLeft, Play, Info } from 'lucide-react';
import { CommonWindowProps } from '../types';

const tourSteps = [
  {
    id: 'welcome',
    title: 'Welcome to RetroNet 1999',
    icon: <Coffee size={48} className="text-blue-600" />,
    content: (
      <div className="flex flex-col gap-4">
        <p className="text-sm">Welcome to your new virtual workstation. RetroNet 1999 is a high-fidelity simulation of the golden era of computing.</p>
        <div className="win95-window shadow-inner bg-white p-4 italic text-gray-600">
          "Relive the pixels, the sounds, and the excitement of the early web."
        </div>
        <p>This tour will guide you through the key features of your simulated OS.</p>
      </div>
    )
  },
  {
    id: 'desktop',
    title: 'The Desktop Environment',
    icon: <Monitor size={48} className="text-green-600" />,
    content: (
      <div className="flex flex-col gap-4">
        <p>Your desktop is fully interactive. Double-click icons to launch apps, or right-click to view properties.</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Active Desktop:</strong> Set live URLs as your wallpaper.</li>
          <li><strong>CRT Simulation:</strong> Adjust scanlines and flicker in the Display properties.</li>
          <li><strong>Themes:</strong> Switch between Classic, XP, Matrix, Vaporwave, and more.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'apps',
    title: 'Internet & Applications',
    icon: <Zap size={48} className="text-yellow-500" />,
    content: (
      <div className="flex flex-col gap-4">
        <p>Experience the web as it was in 1999.</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="win95-window p-2 bg-white flex flex-col items-center">
            <span className="font-bold">Retro Browser</span>
            <span className="text-[10px]">Surf Geocities & Yahoo</span>
          </div>
          <div className="win95-window p-2 bg-white flex flex-col items-center">
            <span className="font-bold">Messenger</span>
            <span className="text-[10px]">Chat with CoolHacker99</span>
          </div>
          <div className="win95-window p-2 bg-white flex flex-col items-center">
            <span className="font-bold">Web Studio</span>
            <span className="text-[10px]">Build your own page</span>
          </div>
          <div className="win95-window p-2 bg-white flex flex-col items-center">
            <span className="font-bold">Media Player</span>
            <span className="text-[10px]">Play classic tunes</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security & Maintenance',
    icon: <Shield size={48} className="text-red-600" />,
    content: (
      <div className="flex flex-col gap-4">
        <p>Keep your system running smoothly.</p>
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-red-100 rounded-lg"><Shield size={24} className="text-red-600" /></div>
          <div>
            <div className="font-bold">AntiVirus Scanner</div>
            <p className="text-[10px]">Scan for the LOVE-LETTER worm and other 90s threats.</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="p-3 bg-blue-100 rounded-lg"><Zap size={24} className="text-blue-600" /></div>
          <div>
            <div className="font-bold">System Restore</div>
            <p className="text-[10px]">Take snapshots and travel back in time if things go wrong.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'missions',
    title: 'Missions & Secrets',
    icon: <HelpCircle size={48} className="text-purple-600" />,
    content: (
      <div className="flex flex-col gap-4">
        <p>RetroNet 1999 is filled with secrets. Can you find them all?</p>
        <div className="win95-window shadow-inner bg-blue-900 text-white p-3 font-mono text-[10px]">
          &gt; MISSION: Defeat the Virus<br />
          &gt; MISSION: Repair the Modem<br />
          &gt; MISSION: Find Admin Password<br />
          &gt; ???: Secret Matrix Mode
        </div>
        <p>Check the "Missions" tab in System Properties to track your progress.</p>
      </div>
    )
  },
  {
    id: 'credits',
    title: 'Project Credits',
    icon: <Info size={48} className="text-indigo-600" />,
    content: (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-20 h-20 bg-blue-800 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg border-4 border-white">VP</div>
        <div>
          <h3 className="text-lg font-bold">Vitesh Pallapothu</h3>
          <p className="text-sm text-gray-600 italic">Creator & Lead Developer</p>
        </div>
        <div className="text-[10px] text-gray-500 mt-4 max-w-[200px]">
          Thank you for exploring RetroNet 1999. More updates and features coming soon!
        </div>
      </div>
    )
  }
];

const RetroTour: React.FC<CommonWindowProps> = (props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = tourSteps[currentStep];

  return (
    <Window title="Welcome to RetroNet Tour" icon={<HelpCircle size={14} />} width={550} height={400} {...props}>
      <div className="flex h-full bg-[#c0c0c0] font-sans text-xs overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-40 border-r-2 border-gray-400 bg-[#808080] p-1 flex flex-col gap-1">
          {tourSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(i)}
              className={`text-left px-3 py-2 flex items-center gap-2 transition-colors ${
                currentStep === i 
                  ? 'bg-[#000080] text-white font-bold' 
                  : 'text-gray-200 hover:bg-[#606060]'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
              {s.title.split(' ')[0]}...
            </button>
          ))}
          <div className="mt-auto p-4 flex flex-col items-center">
            <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center mb-2">
              <Play size={20} className="text-white/50" />
            </div>
            <span className="text-[8px] text-white/40 uppercase tracking-widest">Tutorial Mode</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="flex-1 p-8 overflow-auto flex flex-col items-center">
            <div className="mb-6 transform hover:scale-110 transition-transform duration-500">
              {step.icon}
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900 border-b-2 border-blue-100 pb-2 w-full text-center">
              {step.title}
            </h2>
            <div className="w-full">
              {step.content}
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 bg-[#c0c0c0] border-t-2 border-gray-400 flex justify-between items-center">
            <div className="flex gap-1">
              {[...Array(tourSteps.length)].map((_, i) => (
                <div key={i} className={`w-2 h-2 border border-gray-500 ${currentStep === i ? 'bg-blue-600' : 'bg-white'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                className="win95-button px-4 py-1 flex items-center gap-1"
                disabled={currentStep === 0}
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button 
                className="win95-button px-4 py-1 font-bold flex items-center gap-1"
                onClick={() => {
                  if (currentStep < tourSteps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                  } else {
                    props.onClose();
                  }
                }}
              >
                {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default RetroTour;
