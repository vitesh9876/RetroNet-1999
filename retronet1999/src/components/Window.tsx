import React from 'react';
import { motion, useDragControls } from 'framer-motion';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onFocus?: () => void;
  isActive?: boolean;
  zIndex?: number;
  icon?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  initialX?: number;
  initialY?: number;
}

const Window: React.FC<WindowProps> = ({ 
  title, 
  children, 
  onClose, 
  onMinimize,
  onMaximize,
  isMaximized = false,
  onFocus,
  isActive = false,
  zIndex = 10,
  icon,
  width = 600,
  height = 400,
  initialX = 100,
  initialY = 100
}) => {
  const dragControls = useDragControls();

  return (
    <motion.div
      drag={!isMaximized}
      dragMomentum={false}
      dragListener={false}
      dragControls={dragControls}
      initial={isMaximized ? { x: 0, y: 0, width: '100%', height: 'calc(100% - 40px)' } : { x: initialX, y: initialY, scale: 0.95, opacity: 0 }}
      animate={isMaximized ? { x: 0, y: 0, width: '100%', height: 'calc(100% - 40px)', scale: 1, opacity: 1 } : { x: initialX, y: initialY, scale: 1, opacity: 1, width, height }}
      onMouseDown={onFocus}
      className={`absolute win95-window app-window flex flex-col pointer-events-auto ${isActive ? 'app-window-active z-[50]' : ''}`}
      style={{ zIndex }}
    >
      {/* Title bar */}
      <div 
        className={`win95-titlebar cursor-move select-none h-7 flex-shrink-0 flex items-center justify-between px-1`}
        style={{ 
          background: isActive ? 'var(--color-retro-title)' : '#808080',
          color: isActive ? 'white' : '#c0c0c0'
        }}
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center gap-1">
          {icon && <div className="w-3 h-3">{icon}</div>}
          <span className="truncate">{title}</span>
        </div>
        <div className="flex gap-1">
          <button onClick={onMinimize} className="window-control win95-button" aria-label="Minimize">
            <span>_</span>
          </button>
          <button onClick={onMaximize} className="window-control win95-button" aria-label="Maximize">
            <span>{isMaximized ? '❐' : '□'}</span>
          </button>
          <button 
            className="window-control window-control-close win95-button"
            onClick={onClose}
            aria-label="Close"
          >
            <span>X</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="window-content flex-1 bg-white overflow-auto border-t border-retro-border-darker shadow-inner">
        {children}
      </div>

      {/* Status Bar */}
      <div className="window-status h-5 win95-window border-t-0 flex items-center px-1 text-[10px] font-sans">
        <div className="flex-1 border-r border-retro-border-dark pr-2">Ready</div>
        <div className="w-20 border-r border-retro-border-dark px-2">1 item(s)</div>
        <div className="w-16 px-2">Local</div>
      </div>
    </motion.div>
  );
};

export default Window;
