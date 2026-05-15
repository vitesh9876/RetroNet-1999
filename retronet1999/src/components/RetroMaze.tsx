import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';
import { Gamepad2 } from 'lucide-react';

// const MAP_SIZE = 12;
const MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const RetroMaze: React.FC<any> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pos, setPos] = useState({ x: 1.5, y: 1.5, dir: 0 });
  const [keys, setKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key]: true }));
    const handleUp = (e: KeyboardEvent) => setKeys(prev => ({ ...prev, [e.key]: false }));
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos(prev => {
        let { x, y, dir } = prev;
        const moveSpeed = 0.08;
        const rotSpeed = 0.05;

        if (keys['ArrowLeft']) dir -= rotSpeed;
        if (keys['ArrowRight']) dir += rotSpeed;
        
        let newX = x;
        let newY = y;
        if (keys['ArrowUp']) {
          newX += Math.cos(dir) * moveSpeed;
          newY += Math.sin(dir) * moveSpeed;
        }
        if (keys['ArrowDown']) {
          newX -= Math.cos(dir) * moveSpeed;
          newY -= Math.sin(dir) * moveSpeed;
        }

        // Collision
        if (MAP[Math.floor(newY)][Math.floor(newX)] === 0) {
          x = newX;
          y = newY;
        }

        return { x, y, dir };
      });
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [keys]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const FOV = Math.PI / 3;

    // Render floor and ceiling
    ctx.fillStyle = '#333'; ctx.fillRect(0, 0, W, H / 2);
    ctx.fillStyle = '#666'; ctx.fillRect(0, H / 2, W, H / 2);

    // Raycasting
    for (let i = 0; i < W; i++) {
      const rayDir = pos.dir - FOV / 2 + (i / W) * FOV;
      let dist = 0;
      let hit = false;
      const step = 0.02;

      while (!hit && dist < 15) {
        dist += step;
        const rx = pos.x + Math.cos(rayDir) * dist;
        const ry = pos.y + Math.sin(rayDir) * dist;
        if (MAP[Math.floor(ry)][Math.floor(rx)] === 1) hit = true;
      }

      const wallH = H / (dist * Math.cos(rayDir - pos.dir));
      const color = 255 - dist * 15;
      ctx.fillStyle = `rgb(${color}, ${color}, ${color * 0.8})`;
      ctx.fillRect(i, H / 2 - wallH / 2, 1, wallH);
    }
  }, [pos]);

  return (
    <Window title="Retro-Maze 3D" icon={<Gamepad2 size={14} />} {...props} width={400} height={350}>
      <div className="flex flex-col h-full bg-black text-white font-sans overflow-hidden">
        <div className="p-2 bg-[#c0c0c0] text-black border-b-2 border-gray-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 size={16} />
            <span className="font-bold">E1M1: The Retro Corridors</span>
          </div>
          <div className="text-[10px] font-mono bg-black text-green-400 px-2">FPS: 30</div>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center p-4">
          <canvas 
            ref={canvasRef} 
            width={320} 
            height={200} 
            className="w-full aspect-[16/10] border-4 border-gray-600 shadow-[0_0_20px_rgba(0,0,0,1)] bg-gray-900"
          />
          <div className="absolute bottom-6 left-6 opacity-30 pointer-events-none">
            <div className="text-[8px] flex flex-col gap-1">
              <div className="flex justify-center"><div className="border border-white p-1">↑</div></div>
              <div className="flex gap-1"><div className="border border-white p-1">←</div><div className="border border-white p-1">↓</div><div className="border border-white p-1">→</div></div>
            </div>
          </div>
        </div>

        <div className="p-2 bg-[#000080] text-[10px] flex justify-between items-center">
          <span className="text-white font-bold">HEALTH: 100%</span>
          <span className="text-white font-bold">ARMOR: 50%</span>
          <span className="text-blue-200">CREATED BY VITESH PALLAPOTHU</span>
        </div>
      </div>
    </Window>
  );
};

export default RetroMaze;
