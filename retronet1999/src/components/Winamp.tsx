import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';
import { Play, Pause, SkipForward, SkipBack, Activity, Volume2 } from 'lucide-react';
import { CommonWindowProps } from '../types';

const Winamp: React.FC<CommonWindowProps> = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const vizCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = vizCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        const barCount = 14;
        const barWidth = canvas.width / barCount;
        for (let i = 0; i < barCount; i++) {
          const h = Math.random() * canvas.height * 0.8 + 5;
          const x = i * barWidth;
          
          ctx.fillStyle = i % 2 === 0 ? '#00ff00' : '#ffff00';
          if (h > canvas.height * 0.6) ctx.fillStyle = '#ff0000';
          ctx.fillRect(x + 1, canvas.height - h, barWidth - 2, h);
          ctx.fillStyle = '#fff';
          ctx.fillRect(x + 1, canvas.height - h - 2, barWidth - 2, 1);
        }
      } else {
        ctx.fillStyle = '#004400';
        ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
      }
      rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying]);

  const tracks = [
    { name: '90s Pop Hits - Radio.FM', duration: 185 },
    { name: 'Cyberpunk Synthwave - 1999.wav', duration: 240 },
    { name: 'Lofi Retro Beats (No Lyrics)', duration: 155 },
    { name: 'Dial-Up Sound Remix (Bass Boosted)', duration: 62 },
    { name: 'Eurodance Classics 24/7', duration: 210 },
  ];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime(t => {
          if (t >= tracks[currentTrackIndex].duration) {
            handleNext();
            return 0;
          }
          return t + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
    setCurrentTime(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((currentTrackIndex - 1 + tracks.length) % tracks.length);
    setCurrentTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Window title="Winamp 2.0" icon={<Activity size={14} />} width={320} height={isPlaylistOpen ? 450 : 220} {...props}>
      <div className="flex flex-col h-full bg-[#121212] font-mono text-[10px] text-[#00ff00] overflow-hidden select-none border-2 border-[#333]">
        {/* Main Interface (Top Section) */}
        <div className="winamp-top p-2 flex flex-col gap-1 bg-[#1d1d1d]">
          <div className="flex gap-2">
            <div className="bg-black border border-[#333] h-16 w-24 relative overflow-hidden flex items-end">
              <canvas 
                ref={vizCanvasRef}
                width={96}
                height={64}
                className="w-full h-full"
              />
              <span className="absolute top-0 right-1 text-[8px] opacity-50 text-[#00ff00]">56Kbps</span>
            </div>
            <div className="flex-1 flex flex-col justify-between bg-black border border-[#333] p-1">
              <div className="flex justify-between items-start">
                <span className="text-xl font-bold text-[#00ff00] tracking-tighter">
                  {isPlaying ? formatTime(currentTime) : '0:00'}
                </span>
                <span className="text-[8px] text-white opacity-40">STEREO</span>
              </div>
              <div className="h-4 bg-[#222] relative overflow-hidden flex items-center">
                <div className={`whitespace-nowrap px-1 text-white ${isPlaying ? 'animate-[marquee_15s_linear_infinite]' : ''}`}>
                   {tracks[currentTrackIndex].name} - 128kbps 44.1kHz
                </div>
              </div>
            </div>
          </div>

          {/* Volume & Balance Slider Bars */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Volume2 size={10} />
              <div className="flex-1 h-2 bg-black border border-[#333] relative">
                <div className="h-full bg-blue-600" style={{ width: `${volume}%` }} />
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume} 
                  onChange={e => setVolume(Number(e.target.value))}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[8px]">POS</span>
              <div className="flex-1 h-2 bg-black border border-[#333] relative">
                <div className="h-full bg-gray-600" style={{ width: `${(currentTime / tracks[currentTrackIndex].duration) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex justify-between items-center mt-2 px-1">
            <div className="flex gap-1">
              <button className="winamp-ctrl-btn p-1 border border-[#444] bg-[#222] hover:bg-[#333]" onClick={handlePrev}><SkipBack size={12} /></button>
              <button className={`winamp-ctrl-btn p-1 border border-[#444] ${isPlaying ? 'bg-[#004400] text-[#00ff00]' : 'bg-[#222]'}`} onClick={() => setIsPlaying(true)}><Play size={12} /></button>
              <button className={`winamp-ctrl-btn p-1 border border-[#444] ${!isPlaying ? 'bg-[#440000] text-[#ff0000]' : 'bg-[#222]'}`} onClick={() => setIsPlaying(false)}><Pause size={12} /></button>
              <button className="winamp-ctrl-btn p-1 border border-[#444] bg-[#222] hover:bg-[#333]" onClick={handleNext}><SkipForward size={12} /></button>
            </div>
            <div className="flex gap-1">
              <button className={`p-1 text-[8px] border border-[#444] ${isShuffle ? 'text-[#00ff00]' : 'text-gray-500'}`} onClick={() => setIsShuffle(!isShuffle)}>SHUF</button>
              <button className={`p-1 text-[8px] border border-[#444] ${isRepeat ? 'text-[#00ff00]' : 'text-gray-500'}`} onClick={() => setIsRepeat(!isRepeat)}>REP</button>
              <button className={`p-1 text-[8px] border border-[#444] ${isPlaylistOpen ? 'text-[#00ff00]' : 'text-gray-500'}`} onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}>PL</button>
            </div>
          </div>
        </div>

        {/* Playlist Editor */}
        {isPlaylistOpen && (
          <div className="flex-1 bg-black border-t-2 border-[#333] flex flex-col p-2">
            <div className="flex justify-between items-center border-b border-[#222] pb-1 mb-1">
              <span className="text-[#00ff00] font-bold text-[8px]">WINAMP PLAYLIST</span>
              <span className="text-gray-600 text-[8px]">TOTAL: {formatTime(tracks.reduce((acc, t) => acc + t.duration, 0))}</span>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-[#333]">
              {tracks.map((track, i) => (
                <div 
                  key={i}
                  className={`px-1 py-0.5 cursor-pointer flex justify-between ${currentTrackIndex === i ? 'bg-[#000080] text-white font-bold' : 'hover:bg-[#111] text-[#00bb00]'}`}
                  onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); setCurrentTime(0); }}
                >
                  <span className="truncate flex-1">{i+1}. {track.name}</span>
                  <span className="ml-2 opacity-60">{formatTime(track.duration)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-[#222]">
              <div className="flex gap-2">
                <button className="text-[8px] hover:text-white">ADD</button>
                <button className="text-[8px] hover:text-white">REM</button>
                <button className="text-[8px] hover:text-white">SEL</button>
              </div>
              <div className="text-[8px] opacity-40">128 KBPS</div>
            </div>
          </div>
        )}

        {/* Branding Footer */}
        <div className="p-1 bg-[#222] text-[7px] text-gray-500 text-center uppercase tracking-widest border-t border-black">
          WINAMP - It really whips the llama's ass!
        </div>
      </div>
    </Window>
  );
};

export default Winamp;
