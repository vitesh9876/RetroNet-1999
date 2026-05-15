import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../contexts/SystemContext';

interface RetroImageProps {
  src: string;
  alt: string;
  className?: string;
}

const RetroImage: React.FC<RetroImageProps> = ({ src, alt, className }) => {
  const { slowNetwork } = useSystem();
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!slowNetwork) {
      setIsLoaded(true);
      setLoadProgress(100);
      return;
    }

    setIsLoaded(false);
    setLoadProgress(0);

    const timer = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsLoaded(true);
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [src, slowNetwork]);

  return (
    <div className={`relative overflow-hidden bg-gray-200 border border-gray-400 ${className}`}>
      {/* The actual image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          clipPath: slowNetwork ? `inset(0 0 ${100 - loadProgress}% 0)` : 'none'
        }}
      />
      
      {/* Loading overlay for slow network */}
      {slowNetwork && !isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-white/80 px-2 py-1 border border-gray-400 text-[9px] font-sans">
            Loading... {Math.floor(loadProgress)}%
          </div>
        </div>
      )}
      
      {/* Interlaced scanlines during load */}
      {slowNetwork && !isLoaded && (
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 2px'
          }}
        />
      )}
    </div>
  );
};

export default RetroImage;
