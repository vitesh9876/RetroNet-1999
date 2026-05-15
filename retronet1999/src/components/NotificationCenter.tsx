import React, { useEffect, useState } from 'react';
import { Bell, X, Info, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useSystem, Notification } from '../contexts/SystemContext';

const NotificationCenter: React.FC = () => {
  const { notifications, dismissNotification, clearNotifications } = useSystem();
  const [isOpen, setIsOpen] = useState(false);
  const [toasts, setToasts] = useState<Notification[]>([]);

  const unread = notifications.filter(n => !n.read).length;

  // Show toast for new notifications
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[notifications.length - 1];
    if (!latest.read) {
      setToasts(prev => [...prev, latest]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== latest.id));
      }, 5000);
    }
  }, [notifications.length]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info size={14} className="text-blue-500" />;
      case 'warning': return <AlertTriangle size={14} className="text-yellow-500" />;
      case 'error': return <AlertOctagon size={14} className="text-red-500" />;
      case 'success': return <CheckCircle2 size={14} className="text-green-500" />;
    }
  };

  return (
    <>
      {/* Toast popups - old Windows style */}
      <div className="fixed bottom-12 right-2 z-[9999] flex flex-col gap-1 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="win95-window p-2 w-64 animate-[slideUp_0.3s_ease-out] pointer-events-auto"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            <div className="flex items-start gap-2 text-[10px] font-sans">
              {getIcon(toast.type)}
              <div className="flex-1 min-w-0">
                <div className="font-bold truncate">{toast.title}</div>
                <div className="text-gray-600 truncate">{toast.message}</div>
              </div>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="hover:text-red-500">
                <X size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notification bell in tray */}
      <button
        className="relative flex items-center justify-center hover:bg-black/10 rounded p-0.5"
        onClick={() => setIsOpen(!isOpen)}
        title={`${unread} unread notification(s)`}
      >
        <Bell size={14} strokeWidth={3} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[7px] rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {isOpen && (
        <div className="fixed bottom-12 right-2 z-[10000] win95-window w-72 max-h-[400px] flex flex-col">
          <div className="win95-titlebar h-6 flex items-center justify-between px-2">
            <span className="text-[10px]">Notification Center</span>
            <button onClick={() => setIsOpen(false)} className="window-control window-control-close win95-button w-4 h-4 flex items-center justify-center">
              <span className="text-[10px]">X</span>
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-[10px] text-gray-500 font-sans">
                No notifications
              </div>
            ) : (
              notifications.slice().reverse().map(n => (
                <div
                  key={n.id}
                  className={`p-2 border-b border-gray-200 text-[10px] font-sans flex items-start gap-2 cursor-pointer hover:bg-blue-50 ${!n.read ? 'bg-yellow-50' : ''}`}
                  onClick={() => dismissNotification(n.id)}
                >
                  {getIcon(n.type)}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold">{n.title}</div>
                    <div className="text-gray-600">{n.message}</div>
                    <div className="text-gray-400 mt-0.5">{new Date(n.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-1 bg-[#c0c0c0] border-t border-gray-400 flex justify-end">
              <button className="win95-button px-2 py-0.5 text-[10px] font-sans" onClick={clearNotifications}>
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default NotificationCenter;
