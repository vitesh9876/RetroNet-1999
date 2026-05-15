import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';
import { Palette, Pen, Eraser, Square, Circle, Type, Save, Trash2, Undo2, Redo2, Download } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

type Tool = 'pen' | 'eraser' | 'rect' | 'circle' | 'fill' | 'text';

const Paint: React.FC<CommonWindowProps> = (props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<Tool>('pen');
  const [brushSize, setBrushSize] = useState(2);
  const [fileName, setFileName] = useState('MyDrawing.bmp');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const { saveFile } = useFileSystem();
  const { addNotification } = useSystem();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory();
      }
    }
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const data = canvas.toDataURL();
      setHistory(prev => {
        const next = [...prev.slice(0, historyIndex + 1), data];
        return next.slice(-20); // Keep last 20 steps
      });
      setHistoryIndex(prev => Math.min(prev + 1, 19));
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      loadFromHistory(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      loadFromHistory(history[newIndex]);
    }
  };

  const loadFromHistory = (data: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = data;
  };

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setStartPos(pos);
    setIsDrawing(true);

    if (tool === 'fill') {
      floodFill(Math.round(pos.x), Math.round(pos.y), color);
      saveToHistory();
      setIsDrawing(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);

    if (tool === 'pen' || tool === 'eraser') {
      ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'rect' || tool === 'circle') {
      // Preview shape
      loadFromHistory(history[historyIndex]);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else {
        const radius = Math.sqrt(Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2));
        ctx.beginPath();
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      saveToHistory();
      setIsDrawing(false);
    }
  };

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const stack = [[startX, startY]];
    
    // Parse hex color to RGBA
    const r = parseInt(fillColor.slice(1, 3), 16);
    const g = parseInt(fillColor.slice(3, 5), 16);
    const b = parseInt(fillColor.slice(5, 7), 16);
    
    const targetIdx = (startY * canvas.width + startX) * 4;
    const targetR = data[targetIdx];
    const targetG = data[targetIdx + 1];
    const targetB = data[targetIdx + 2];
    const targetA = data[targetIdx + 3];

    if (targetR === r && targetG === g && targetB === b && targetA === 255) return;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const idx = (y * canvas.width + x) * 4;

      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      if (data[idx] !== targetR || data[idx+1] !== targetG || data[idx+2] !== targetB || data[idx+3] !== targetA) continue;

      data[idx] = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const savePainting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveFile(fileName, canvas.toDataURL('image/png'), 'bmp', 'C:\\Documents');
    addNotification({ title: 'Paint', message: `Saved ${fileName} to Documents`, type: 'success' });
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const colors = [
    '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
    '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
    '#ff8040', '#ff80ff', '#80ff00', '#00ff80', '#0080ff', '#8000ff', '#ff0080', '#408080'
  ];

  return (
    <Window title={`${fileName} - Paint`} icon={<Palette size={14} />} width={650} height={480} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs">
        {/* Menu */}
        <div className="flex gap-4 px-2 py-0.5 border-b border-gray-400 text-[10px]">
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Edit</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">View</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Image</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 p-1 border-b border-gray-400">
          <button className="win95-button p-1 flex items-center gap-1" onClick={savePainting} title="Save to Filesystem"><Save size={14} /></button>
          <button className="win95-button p-1 flex items-center gap-1" onClick={exportAsImage} title="Export to Computer"><Download size={14} /></button>
          <div className="border-r border-gray-400 h-5 mx-1" />
          <button className="win95-button p-1" onClick={undo} disabled={historyIndex <= 0} title="Undo"><Undo2 size={14} /></button>
          <button className="win95-button p-1" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo"><Redo2 size={14} /></button>
          <div className="border-r border-gray-400 h-5 mx-1" />
          <button className="win95-button p-1" onClick={clearCanvas} title="Clear Canvas"><Trash2 size={14} /></button>
          <div className="flex-1" />
          <input className="win95-window shadow-inner bg-white h-6 px-1 text-xs outline-none w-32" value={fileName} onChange={e => setFileName(e.target.value)} />
        </div>

        <div className="flex flex-1 p-1 gap-1 overflow-hidden">
          {/* Tool Palette */}
          <div className="w-10 flex flex-col gap-0.5 pr-1 py-1">
            <div className="grid grid-cols-2 gap-0.5">
              {[
                { id: 'pen', icon: <Pen size={12} />, title: 'Pencil' },
                { id: 'eraser', icon: <Eraser size={12} />, title: 'Eraser' },
                { id: 'fill', icon: <Palette size={12} />, title: 'Fill' },
                { id: 'text', icon: <Type size={12} />, title: 'Text' },
                { id: 'rect', icon: <Square size={12} />, title: 'Rectangle' },
                { id: 'circle', icon: <Circle size={12} />, title: 'Circle' },
              ].map(t => (
                <button 
                  key={t.id}
                  className={`win95-button p-1 flex items-center justify-center ${tool === t.id ? 'shadow-inner bg-gray-300' : ''}`}
                  onClick={() => setTool(t.id as Tool)}
                  title={t.title}
                >
                  {t.icon}
                </button>
              ))}
            </div>

            <div className="mt-4 border-2 border-gray-400 p-1 bg-white flex flex-col gap-2">
              <div className="text-[8px] text-center font-bold">SIZE</div>
              {[2, 5, 8, 12, 20].map(s => (
                <button 
                  key={s}
                  className={`w-full h-4 flex items-center justify-center hover:bg-blue-100 ${brushSize === s ? 'bg-blue-200 ring-1 ring-blue-600' : ''}`}
                  onClick={() => setBrushSize(s)}
                >
                  <div className="bg-black rounded-full" style={{ width: s/2, height: s/2 }} />
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-600 p-4 overflow-auto flex items-center justify-center border-2 border-retro-border-dark shadow-inner">
            <canvas 
              ref={canvasRef}
              width={800}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="bg-white shadow-2xl cursor-crosshair"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        {/* Status & Color Palette */}
        <div className="p-2 border-t border-gray-400 flex flex-col gap-2 bg-[#c0c0c0]">
          <div className="flex gap-2 items-center">
            <div className="win95-window shadow-inner bg-white w-10 h-10 p-1 flex items-center justify-center border-2 border-retro-border-dark">
              <div className="w-full h-full border border-gray-400" style={{ backgroundColor: color }} />
            </div>
            <div className="grid grid-cols-12 gap-0.5">
              {colors.map(c => (
                <button 
                  key={c}
                  className={`w-4 h-4 border border-gray-600 hover:scale-110 transition-transform ${color === c ? 'ring-2 ring-blue-600 z-10' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between text-[10px] opacity-70">
            <span>For Help, click Help Topics on the Help Menu.</span>
            <div className="flex gap-4">
              <span>Tool: {tool.toUpperCase()}</span>
              <span>Size: {brushSize}px</span>
              <span>800x600px</span>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Paint;
