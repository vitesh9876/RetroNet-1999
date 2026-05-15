import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Screensaver: React.FC<{ type: 'matrix' | 'pipes' | 'starfield', onClose: () => void }> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKey = () => onClose();
    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousedown', handleKey);
    window.addEventListener('mousemove', (e) => {
      if (Math.abs(e.movementX) > 5 || Math.abs(e.movementY) > 5) onClose();
    });
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousedown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[30000] bg-black flex items-center justify-center overflow-hidden cursor-none">
      {type === 'starfield' && (
        <div className="starfield-container w-full h-full relative">
          {[...Array(150)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: '50vw', y: '50vh', opacity: 0 }}
              animate={{ 
                scale: [0, 2, 4], 
                x: ['50vw', `${50 + (Math.random() - 0.5) * 400}vw`],
                y: ['50vh', `${50 + (Math.random() - 0.5) * 400}vh`],
                opacity: [0, 1, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "easeIn"
              }}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"
            />
          ))}
        </div>
      )}
      
      {type === 'matrix' && (
        <div className="w-full h-full flex justify-around opacity-80 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="flex flex-col gap-0 leading-none">
              <motion.div
                initial={{ y: -1000 }}
                animate={{ y: 2000 }}
                transition={{ duration: Math.random() * 4 + 2, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
                className="flex flex-col"
              >
                {[...Array(30)].map((_, j) => (
                  <span 
                    key={j} 
                    className="text-green-500 font-mono text-lg shadow-[0_0_5px_rgba(0,255,0,0.5)]"
                    style={{ opacity: j === 29 ? 1 : 0.3 + (j / 30) }}
                  >
                    {String.fromCharCode(0x30A0 + Math.random() * 96)}
                  </span>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}

      {type === 'pipes' && (
        <div className="absolute inset-0 overflow-hidden perspective-1000">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-gradient-to-r from-gray-400 via-gray-200 to-gray-500 shadow-xl"
              initial={{ 
                x: Math.random() * 100 + 'vw', 
                y: Math.random() * 100 + 'vh', 
                width: 20, 
                height: 20,
                rotateX: 0,
                rotateY: 0
              }}
              animate={{ 
                width: [20, 300, 300, 20],
                height: [20, 20, 300, 300],
                x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
                y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ borderRadius: '10px' }}
            />
          ))}
          <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]" />
        </div>
      )}

      <div className="absolute bottom-10 right-10 text-white/40 font-sans text-xs tracking-widest animate-pulse uppercase">
        RetroNet OS - {type}
      </div>
    </div>
  );
};

export default Screensaver;
