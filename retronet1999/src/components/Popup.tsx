import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface PopupProps {
  id: number;
  title: string;
  image?: string;
  text: string;
  onClose: (id: number) => void;
  x: number;
  y: number;
}

const Popup: React.FC<PopupProps> = ({ id, title, text, onClose, x, y }) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        x: [0, -2, 2, -2, 0], // Shake effect
      }}
      transition={{ 
        scale: { duration: 0.2 },
        x: { repeat: Infinity, duration: 0.1, repeatType: "mirror" } 
      }}
      className="fixed win95-window w-64 z-[200] pointer-events-auto shadow-2xl"
      style={{ left: x, top: y }}
    >
      <div className="win95-titlebar h-5 text-[10px] bg-gradient-to-r from-red-800 to-red-500">
        <span className="flex items-center gap-1"><AlertTriangle size={10} /> {title}</span>
        <button onClick={() => onClose(id)} className="win95-button w-4 h-4 p-0 flex items-center justify-center bg-[#c0c0c0] text-black">
          <X size={10} />
        </button>
      </div>
      <div className="p-4 bg-[#ffffd0] flex flex-col items-center gap-3 text-center border-b-2 border-red-500">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
          <AlertTriangle size={28} className="text-red-600" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-black uppercase">{text}</p>
          <p className="text-[9px] text-red-700 mt-1 italic">Click OK to resolve this issue!</p>
        </div>
        <div className="flex gap-2 w-full">
          <button 
            onClick={() => onClose(id)}
            className="win95-button flex-1 py-1 font-bold bg-[#c0c0c0]"
          >
            OK
          </button>
          <button 
            onClick={() => window.open('https://www.google.com', '_blank')}
            className="win95-button flex-1 py-1 bg-[#c0c0c0]"
          >
            Claim
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Popup;
