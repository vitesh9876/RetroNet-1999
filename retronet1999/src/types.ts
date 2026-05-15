export interface CommonWindowProps {
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onFocus?: () => void;
  isActive?: boolean;
  zIndex?: number;
}
