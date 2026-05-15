import React, { useState, useEffect, useCallback } from 'react';
import Window from './Window';
import { ShieldCheck, Bomb, Smile, Frown, Flag, Trophy } from 'lucide-react';
import { CommonWindowProps } from '../types';

type Difficulty = 'beginner' | 'intermediate' | 'expert';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

const Minesweeper: React.FC<CommonWindowProps> = (props) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [minesLeft, setMinesLeft] = useState(10);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const configs = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
  };

  const initGrid = useCallback((diff: Difficulty = difficulty) => {
    const { rows, cols, mines } = configs[diff];
    const newGrid: Cell[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    // Place mines
    let placed = 0;
    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (newGrid[r][c].isMine) continue;
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (r + dr >= 0 && r + dr < rows && c + dc >= 0 && c + dc < cols) {
              if (newGrid[r + dr][c + dc].isMine) count++;
            }
          }
        }
        newGrid[r][c].neighborMines = count;
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWon(false);
    setMinesLeft(mines);
    setSeconds(0);
    setIsActive(false);
  }, [difficulty]);

  useEffect(() => initGrid(), [initGrid]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && !gameOver && !won) {
      interval = setInterval(() => setSeconds(s => Math.min(s + 1, 999)), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, gameOver, won]);

  const reveal = (r: number, c: number) => {
    if (gameOver || won || grid[r][c].isFlagged || grid[r][c].isRevealed) return;
    
    if (!isActive) setIsActive(true);

    const newGrid = [...grid.map(row => [...row])];
    
    if (newGrid[r][c].isMine) {
      setGameOver(true);
      newGrid.forEach(row => row.forEach(cell => { if (cell.isMine) cell.isRevealed = true; }));
    } else {
      const floodReveal = (row: number, col: number) => {
        if (row < 0 || row >= newGrid.length || col < 0 || col >= newGrid[0].length || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              floodReveal(row + dr, col + dc);
            }
          }
        }
      };
      floodReveal(r, c);
      
      // Check win
      const { rows, cols, mines } = configs[difficulty];
      let revealedCount = 0;
      newGrid.forEach(row => row.forEach(cell => { if (cell.isRevealed) revealedCount++; }));
      if (revealedCount === rows * cols - mines) {
        setWon(true);
        setMinesLeft(0);
      }
    }
    setGrid(newGrid);
  };

  const handleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || won || grid[r][c].isRevealed) return;
    const newGrid = [...grid.map(row => [...row])];
    const isFlagged = !newGrid[r][c].isFlagged;
    newGrid[r][c].isFlagged = isFlagged;
    setGrid(newGrid);
    setMinesLeft(prev => isFlagged ? prev - 1 : prev + 1);
  };

  return (
    <Window title="Minesweeper" icon={<ShieldCheck size={14} />} width={difficulty === 'expert' ? 620 : difficulty === 'intermediate' ? 340 : 220} height={difficulty === 'expert' ? 440 : difficulty === 'intermediate' ? 440 : 320} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] p-1 font-sans text-xs select-none">
        {/* Menu */}
        <div className="flex gap-4 px-2 py-0.5 border-b border-gray-400 mb-2 text-[10px]">
          <div className="relative group">
            <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Game</span>
            <div className="hidden group-hover:block absolute top-full left-0 bg-[#c0c0c0] win95-window z-50 py-1 min-w-[100px] shadow-lg">
              <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => initGrid()}>New</button>
              <div className="border-t border-gray-400 my-1" />
              <button className={`w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white ${difficulty === 'beginner' ? 'font-bold' : ''}`} onClick={() => { setDifficulty('beginner'); initGrid('beginner'); }}>Beginner</button>
              <button className={`w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white ${difficulty === 'intermediate' ? 'font-bold' : ''}`} onClick={() => { setDifficulty('intermediate'); initGrid('intermediate'); }}>Intermediate</button>
              <button className={`w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white ${difficulty === 'expert' ? 'font-bold' : ''}`} onClick={() => { setDifficulty('expert'); initGrid('expert'); }}>Expert</button>
            </div>
          </div>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        <div className="flex flex-col gap-2 p-2 win95-window shadow-inner bg-[#c0c0c0] border-t-2 border-l-2 border-white">
          {/* Dashboard */}
          <div className="win95-window shadow-inner border-2 border-retro-border-dark flex justify-between items-center px-4 py-1 bg-retro-panel">
            <div className="bg-black text-red-600 font-mono text-2xl px-1 border border-gray-600 w-12 text-center leading-none h-8 flex items-center justify-center">
              {minesLeft.toString().padStart(3, '0')}
            </div>
            <button className="win95-button p-1 flex items-center justify-center w-8 h-8" onClick={() => initGrid()}>
              {won ? <Trophy size={20} className="text-yellow-600" /> : gameOver ? <Frown size={20} className="text-red-600" /> : <Smile size={20} className="text-yellow-600" />}
            </button>
            <div className="bg-black text-red-600 font-mono text-2xl px-1 border border-gray-600 w-12 text-center leading-none h-8 flex items-center justify-center">
              {seconds.toString().padStart(3, '0')}
            </div>
          </div>

          {/* Board */}
          <div className="win95-window shadow-inner border-t-2 border-l-2 border-retro-border-dark bg-[#808080] p-[2px] flex justify-center">
            <div 
              className="grid gap-0" 
              style={{ gridTemplateColumns: `repeat(${configs[difficulty].cols}, minmax(16px, 1fr))` }}
            >
              {grid.map((row, r) => row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`}
                  onClick={() => reveal(r, c)}
                  onContextMenu={(e) => handleRightClick(e, r, c)}
                  className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border text-[10px] font-bold
                    ${cell.isRevealed 
                      ? 'bg-[#c0c0c0] border-[#808080] border-t-transparent border-l-transparent shadow-none' 
                      : 'win95-button bg-[#c0c0c0]'}`}
                >
                  {cell.isRevealed && cell.isMine && <Bomb size={12} className="text-black" fill="black" />}
                  {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && (
                    <span style={{ color: ['#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000', '#808080'][cell.neighborMines-1] }}>
                      {cell.neighborMines}
                    </span>
                  )}
                  {!cell.isRevealed && cell.isFlagged && <Flag size={10} className="text-red-600" fill="red" />}
                </div>
              )))}
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Minesweeper;
