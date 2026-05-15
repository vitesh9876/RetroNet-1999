import React, { useState, useEffect } from 'react';
import Window from './Window';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { CommonWindowProps } from '../types';

const MediaPlayer: React.FC<CommonWindowProps> = ({ 
  onClose, onMinimize, onMaximize, isMaximized, onFocus, isActive, zIndex 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Eiffel 65 - Blue (Da Ba Dee)');
  const [progress, setProgress] = useState(35);
  const [audio] = useState(new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'));
  const tracks = ['Eiffel 65 - Blue (Da Ba Dee)', 'Darude - Sandstorm', 'Aqua - Barbie Girl'];
  
  const togglePlay = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.log("Audio play blocked:", e));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, [audio]);

  return (
    <Window 
      title="WinRetro Media Player" 
      icon={<Music size={14} />} 
      width={400} 
      height={300}
      onClose={onClose}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      isMaximized={isMaximized}
      onFocus={onFocus}
      isActive={isActive}
      zIndex={zIndex}
      initialX={300}
      initialY={200}
    >
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs p-2 gap-2">
        {/* Visualizer Area */}
        <div className="flex-1 bg-black rounded border-2 border-retro-border-dark flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center gap-1">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 bg-green-500 transition-all duration-100 ${isPlaying ? 'animate-bounce' : 'h-4'}`}
                style={{ 
                  height: isPlaying ? `${Math.random() * 80 + 20}%` : '20%',
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
          <span className="absolute bottom-2 left-2 text-[#00ff00] font-mono text-[10px]">
            {isPlaying ? 'PLAYING' : 'STOPPED'}
          </span>
        </div>

        {/* Track Info */}
        <div className="win95-window shadow-inner bg-black p-2 text-lime-400 font-pixel text-[10px] truncate">
          {currentTrack}
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-1">
          <div className="h-4 win95-window shadow-inner bg-gray-200 p-0.5">
            <div 
              className="h-full bg-blue-800 transition-all" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px]">
            <span>1:24</span>
            <span>4:39</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button className="win95-button p-2" onClick={() => setProgress(0)}><SkipBack size={16} /></button>
            <button className="win95-button p-2" onClick={togglePlay}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button className="win95-button p-2" onClick={() => setCurrentTrack(tracks[(tracks.indexOf(currentTrack) + 1) % tracks.length])}><SkipForward size={16} /></button>
          </div>
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-gray-600" />
            <div className="w-20 h-2 win95-window shadow-inner bg-gray-200">
              <div className="h-full bg-gray-400 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default MediaPlayer;
