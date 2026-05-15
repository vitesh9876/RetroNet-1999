import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Info, AlertCircle, HelpCircle } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

const DesktopAssistant: React.FC = () => {
  const { missions, isAdminMode } = useSystem();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState('');
  const [lastMessageTime, setLastMessageTime] = useState(0);

  const tips = [
    "It looks like you're trying to find the admin password. Have you checked the README.txt file?",
    "Did you know? You can press 'B' anytime for a 'Boss Key' spreadsheet!",
    "Winamp really whips the llama's ass!",
    "If the system feels slow, try increasing the Refresh Rate in the Control Panel.",
    "Be careful with Napster downloads! Some files might contain viruses.",
    "The terminal command 'COLOR MATRIX' is quite a secret...",
    "You can drag icons around the desktop to organize your space.",
    "Right-click on files in the Explorer to see their properties!",
    "Stuck? Try typing 'HELP' in the MS-DOS Prompt.",
  ];

  useEffect(() => {
    // Initial delay
    const initialTimer = setTimeout(() => {
      setMessage("Hi! I'm RetroBot. Need help with your 1999 experience?");
      setShow(true);
    }, 15000);

    // Random tips every minute
    const tipInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setMessage(randomTip);
        setShow(true);
      }
    }, 60000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(tipInterval);
    };
  }, []);

  if (!show) return (
    <button 
      onClick={() => { setMessage(tips[Math.floor(Math.random() * tips.length)]); setShow(true); }}
      className="fixed bottom-14 right-4 z-[100] w-10 h-10 bg-[#c0c0c0] border-2 border-white border-b-black border-r-black flex items-center justify-center shadow-md hover:bg-gray-100"
    >
      <HelpCircle size={20} className="text-blue-800" />
    </button>
  );

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-14 right-4 z-[1000] w-64 win95-window p-0 overflow-hidden"
      >
        <div className="win95-titlebar h-6 flex items-center px-2">
          <span className="flex-1 flex items-center gap-1 text-[10px]"><MessageSquare size={10} /> RetroBot Assistant</span>
          <button onClick={() => setShow(false)} className="win95-button w-4 h-4 p-0 flex items-center justify-center bg-[#c0c0c0] text-black"><X size={10} /></button>
        </div>
        <div className="p-3 bg-[#ffffd0] flex gap-3 items-start border-b border-gray-400">
          <div className="shrink-0 w-12 h-12 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-2xl animate-bounce">
            🤖
          </div>
          <div className="flex-1">
            <p className="text-[11px] leading-tight text-black font-sans">
              {message}
            </p>
          </div>
        </div>
        <div className="p-2 bg-[#c0c0c0] flex justify-end gap-2">
          <button onClick={() => setShow(false)} className="win95-button px-3 py-0.5 text-[10px]">Thanks!</button>
          <button onClick={() => { setShow(false); setTimeout(() => { setMessage(tips[Math.floor(Math.random() * tips.length)]); setShow(true); }, 500); }} className="win95-button px-3 py-0.5 text-[10px]">Tell me more</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DesktopAssistant;
