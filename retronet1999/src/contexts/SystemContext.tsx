import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type SystemTheme = 'classic' | 'xp_luna' | 'matrix' | 'vaporwave' | 'cyberpunk' | 'pink' | 'midnight' | 'terminal';

export type BootProfile = 'retronet1999' | 'office_pc' | 'hacker_mode' | 'safe_mode' | 'corrupted_disk';

export type SystemPhase = 'boot_select' | 'booting' | 'login' | 'desktop' | 'shutdown' | 'restart' | 'bsod' | 'sleep';

export interface UserAccount {
  username: string;
  password: string;
  hint: string;
  avatar: string;
  isAdmin: boolean;
}

export interface CRTSettings {
  enabled: boolean;
  scanlines: boolean;
  flicker: boolean;
  vhs: boolean;
  blur: number;
  scanlineIntensity: number;
  flickerIntensity: number;
  bloom: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  read: boolean;
}

export interface SystemSnapshot {
  id: string;
  name: string;
  date: string;
  filesSnapshot: string;
  settingsSnapshot: string;
}

export interface MissionProgress {
  findAdminPassword: boolean;
  repairModem: boolean;
  recoverEmail: boolean;
  installSoftware: boolean;
  defeatVirus: boolean;
  createWebsite: boolean;
  monitorMaintenance: boolean;
  activeDesktopSetup: boolean;
  beatRetroMaze: boolean;
}

export interface TrayState {
  network: 'connected' | 'disconnected' | 'connecting';
  disk: 'idle' | 'active' | 'error';
  sound: 'on' | 'muted';
  battery: number;
  mail: 'none' | 'unread' | 'read';
}

interface SystemState {
  theme: SystemTheme;
  wallpaper: string;
  refreshRate: number;
  crt: CRTSettings;
  phase: SystemPhase;
  bootProfile: BootProfile;
  currentUser: UserAccount | null;
  users: UserAccount[];
  loginAttempts: number;
  isLocked: boolean;
  notifications: Notification[];
  snapshots: SystemSnapshot[];
  missions: MissionProgress;
  tray: TrayState;
  isAdminMode: boolean;
  virusActive: boolean;
  wallpaperSlideshow: boolean;
  slideshowInterval: number;
  systemTime: Date;
  timeZone: string;
  soundEnabled: boolean;
  volume: number;
  easterEggsFound: string[];
  setTheme: (theme: SystemTheme) => void;
  setWallpaper: (wp: string) => void;
  setRefreshRate: (rate: number) => void;
  updateCRT: (settings: Partial<CRTSettings>) => void;
  setPhase: (phase: SystemPhase) => void;
  setBootProfile: (profile: BootProfile) => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
  saveSnapshot: (name: string) => void;
  restoreSnapshot: (id: string) => void;
  deleteSnapshot: (id: string) => void;
  completeMission: (key: keyof MissionProgress) => void;
  updateTray: (updates: Partial<TrayState>) => void;
  setAdminMode: (v: boolean) => void;
  setVirusActive: (v: boolean) => void;
  triggerBSOD: (message?: string) => void;
  bsodMessage: string;
  setSystemTime: (d: Date) => void;
  setTimeZone: (tz: string) => void;
  setSoundEnabled: (v: boolean) => void;
  setVolume: (v: number) => void;
  discoverEasterEgg: (id: string) => void;
  setWallpaperSlideshow: (v: boolean) => void;
  setSlideshowInterval: (v: number) => void;
  playSound: (type: 'click' | 'open' | 'close' | 'error' | 'startup' | 'shutdown' | 'degauss' | 'dialup') => void;
  triggerDegauss: () => void;
  degaussing: boolean;
  slowNetwork: boolean;
  setSlowNetwork: (v: boolean) => void;
  activeDesktopUrl: string | null;
  setActiveDesktopUrl: (v: string | null) => void;
}

const defaultCRT: CRTSettings = {
  enabled: true,
  scanlines: true,
  flicker: true,
  vhs: true,
  blur: 0.5,
  scanlineIntensity: 0.25,
  flickerIntensity: 0.15,
  bloom: 0.5
};

const defaultUsers: UserAccount[] = [
  { username: 'retro_user_99', password: 'password', hint: 'It\'s the most common one...', avatar: '👤', isAdmin: false },
  { username: 'Administrator', password: 'RETROKING99', hint: 'Check the documents folder', avatar: '🔑', isAdmin: true },
  { username: 'Guest', password: '', hint: 'No password needed', avatar: '👻', isAdmin: false },
];

const defaultMissions: MissionProgress = {
  findAdminPassword: false,
  repairModem: false,
  recoverEmail: false,
  installSoftware: false,
  defeatVirus: false,
  createWebsite: false,
  monitorMaintenance: false,
  activeDesktopSetup: false,
  beatRetroMaze: false,
};

const defaultTray: TrayState = {
  network: 'disconnected',
  disk: 'idle',
  sound: 'on',
  battery: 87,
  mail: 'unread',
};

const STORAGE_KEY = 'retronet1999:system-settings';
const SNAPSHOTS_KEY = 'retronet1999:snapshots';
const MISSIONS_KEY = 'retronet1999:missions';
const EGGS_KEY = 'retronet1999:easter-eggs';

const SystemContext = createContext<SystemState | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<SystemTheme>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').theme ?? 'classic';
    } catch {
      return 'classic';
    }
  });
  const [wallpaper, setWallpaper] = useState<string>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').wallpaper ?? 'var(--theme-wallpaper)';
    } catch {
      return 'var(--theme-wallpaper)';
    }
  });
  const [refreshRate, setRefreshRate] = useState<number>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').refreshRate ?? 60;
    } catch {
      return 60;
    }
  });
  const [crt, setCRT] = useState<CRTSettings>(() => {
    try {
      return { ...defaultCRT, ...(JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').crt ?? {}) };
    } catch {
      return defaultCRT;
    }
  });

  const [phase, setPhase] = useState<SystemPhase>(() => {
    return sessionStorage.getItem('retronet1999:booted') === 'yes' ? 'desktop' : 'boot_select';
  });
  const [bootProfile, setBootProfile] = useState<BootProfile>('retronet1999');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = sessionStorage.getItem('retronet1999:current-user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [users] = useState<UserAccount[]>(defaultUsers);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [missions, setMissions] = useState<MissionProgress>(() => {
    try {
      return { ...defaultMissions, ...(JSON.parse(localStorage.getItem(MISSIONS_KEY) || '{}')) };
    } catch {
      return defaultMissions;
    }
  });
  const [tray, setTray] = useState<TrayState>(defaultTray);
  const [isAdminMode, setAdminMode] = useState(false);
  const [virusActive, setVirusActive] = useState(false);
  const [bsodMessage, setBsodMessage] = useState('');
  const [systemTime, setSystemTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState('EST (UTC-5)');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(75);
  const [easterEggsFound, setEasterEggsFound] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(EGGS_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [wallpaperSlideshow, setWallpaperSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(30);
  const [degaussing, setDegaussing] = useState(false);
  const [slowNetwork, setSlowNetwork] = useState(true);
  const [activeDesktopUrl, setActiveDesktopUrl] = useState<string | null>(null);

  const updateCRT = (settings: Partial<CRTSettings>) => {
    setCRT(prev => ({ ...prev, ...settings }));
  };

  const updateTray = (updates: Partial<TrayState>) => {
    setTray(prev => ({ ...prev, ...updates }));
  };

  const addNotification = useCallback((n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [...prev, {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      read: false,
    }]);
  }, []);

  const playSound = useCallback((type: 'click' | 'open' | 'close' | 'error' | 'startup' | 'shutdown' | 'degauss' | 'dialup') => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const v = volume / 100;
      gain.gain.setValueAtTime(0, ctx.currentTime);

      if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(v * 0.1, ctx.currentTime + 0.01);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'open') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(v * 0.2, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'close') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(v * 0.2, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(v * 0.3, ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'startup') {
        [440, 554, 659].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
          g.gain.linearRampToValueAtTime(v * 0.2, ctx.currentTime + i * 0.1 + 0.05);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.1 + 0.4);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      } else if (type === 'shutdown') {
        [659, 554, 440].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
          g.gain.setValueAtTime(0, ctx.currentTime + i * 0.1);
          g.gain.linearRampToValueAtTime(v * 0.2, ctx.currentTime + i * 0.1 + 0.05);
          g.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.1 + 0.4);
          o.start(ctx.currentTime + i * 0.1);
          o.stop(ctx.currentTime + i * 0.1 + 0.4);
        });
      } else if (type === 'degauss') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(60, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 1.5);
        gain.gain.linearRampToValueAtTime(v * 0.5, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
      } else if (type === 'dialup') {
        const now = ctx.currentTime;
        [440, 480, 440, 480, 440].forEach((f, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.frequency.setValueAtTime(f, now + i * 0.15);
          g.gain.setValueAtTime(0, now + i * 0.15);
          g.gain.linearRampToValueAtTime(v * 0.1, now + i * 0.15 + 0.02);
          g.gain.linearRampToValueAtTime(0, now + i * 0.15 + 0.1);
          o.start(now + i * 0.15);
          o.stop(now + i * 0.15 + 0.1);
        });
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noise.connect(noiseGain); noiseGain.connect(ctx.destination);
        noiseGain.gain.setValueAtTime(0, now + 1);
        noiseGain.gain.linearRampToValueAtTime(v * 0.15, now + 1.2);
        noiseGain.gain.linearRampToValueAtTime(v * 0.05, now + 2.5);
        noiseGain.gain.linearRampToValueAtTime(0, now + 3);
        noise.start(now + 1);
        noise.stop(now + 3);
        const beep = ctx.createOscillator();
        const bg = ctx.createGain();
        beep.connect(bg); bg.connect(ctx.destination);
        beep.frequency.setValueAtTime(1200, now + 2);
        bg.gain.setValueAtTime(0, now + 2);
        bg.gain.linearRampToValueAtTime(v * 0.1, now + 2.1);
        bg.gain.linearRampToValueAtTime(0, now + 2.8);
        beep.start(now + 2);
        beep.stop(now + 2.8);
      }
    } catch (e) { console.error('Audio fail', e); }
  }, [soundEnabled, volume]);

  const completeMission = useCallback((key: keyof MissionProgress) => {
    setMissions(prev => {
      if (prev[key]) return prev;
      return { ...prev, [key]: true };
    });
    addNotification({
      title: '🏆 Mission Complete!',
      message: `Objective completed: ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
      type: 'success'
    });
  }, [addNotification]);

  const triggerDegauss = useCallback(() => {
    if (degaussing) return;
    setDegaussing(true);
    playSound('degauss');
    completeMission('monitorMaintenance');
    setTimeout(() => setDegaussing(false), 2000);
  }, [degaussing, playSound, completeMission]);

  const triggerBSOD = useCallback((message?: string) => {
    setBsodMessage(message || 'A fatal exception 0E has occurred at 0028:C0034B03.\nThe current application will be terminated.\n\nPress any key to attempt recovery via Safe Mode.\nPress CTRL+ALT+DEL to restart your computer.');
    setPhase('bsod');
  }, []);

  const discoverEasterEgg = useCallback((id: string) => {
    setEasterEggsFound(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    addNotification({
      title: '🥚 Easter Egg Found!',
      message: `You discovered: ${id}`,
      type: 'success'
    });
  }, [addNotification]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const saveSnapshot = useCallback((name: string) => {
    const snap: SystemSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      date: new Date().toLocaleString(),
      filesSnapshot: localStorage.getItem('retronet1999:file-system') || '[]',
      settingsSnapshot: localStorage.getItem(STORAGE_KEY) || '{}',
    };
    setSnapshots(prev => [...prev, snap]);
    addNotification({ title: 'System Restore', message: `Snapshot "${name}" created successfully.`, type: 'success' });
  }, [addNotification]);

  const restoreSnapshot = useCallback((id: string) => {
    const snap = snapshots.find(s => s.id === id);
    if (!snap) return;
    localStorage.setItem('retronet1999:file-system', snap.filesSnapshot);
    localStorage.setItem(STORAGE_KEY, snap.settingsSnapshot);
    addNotification({ title: 'System Restore', message: `Restored to "${snap.name}". Reloading...`, type: 'info' });
    setTimeout(() => window.location.reload(), 1500);
  }, [snapshots, addNotification]);

  const deleteSnapshot = useCallback((id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  }, []);

  const login = useCallback((username: string, password: string): boolean => {
    if (isLocked) return false;
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      setLoginAttempts(0);
      setPhase('desktop');
      sessionStorage.setItem('retronet1999:booted', 'yes');
      return true;
    }
    setLoginAttempts(prev => prev + 1);
    return false;
  }, [users, isLocked]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setPhase('login');
    sessionStorage.removeItem('retronet1999:current-user');
    sessionStorage.removeItem('retronet1999:booted');
  }, []);

  // Persist settings
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, wallpaper, refreshRate, crt }));
  }, [theme, wallpaper, refreshRate, crt]);

  useEffect(() => {
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(snapshots));
  }, [snapshots]);

  useEffect(() => {
    localStorage.setItem(MISSIONS_KEY, JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem(EGGS_KEY, JSON.stringify(easterEggsFound));
  }, [easterEggsFound]);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('retronet1999:current-user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // System clock
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lockout timer
  useEffect(() => {
    if (loginAttempts >= 3) {
      setIsLocked(true);
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [loginAttempts]);

  // Wallpaper slideshow
  useEffect(() => {
    if (!wallpaperSlideshow) return;
    const wallpapers = [
      'var(--theme-wallpaper)',
      '#008080',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    ];
    let idx = 0;
    const timer = setInterval(() => {
      idx = (idx + 1) % wallpapers.length;
      setWallpaper(wallpapers[idx]);
    }, slideshowInterval * 1000);
    return () => clearInterval(timer);
  }, [wallpaperSlideshow, slideshowInterval]);

  useEffect(() => {
    if (activeDesktopUrl) completeMission('activeDesktopSetup');
  }, [activeDesktopUrl, completeMission]);

  // Apply theme variables to root
  useEffect(() => {
    const root = document.documentElement;
    const palettes: Record<SystemTheme, Record<string, string>> = {
      classic: {
        '--color-retro-bg': '#008080',
        '--color-retro-panel': '#c0c0c0',
        '--color-retro-lime': '#00ff00',
        '--color-retro-title': 'linear-gradient(90deg, #000080, #1084d0)',
        '--color-retro-text': '#000000',
        '--color-retro-input-bg': '#ffffff',
        '--color-retro-input-text': '#000000',
        '--theme-cursor': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyVjE4TDUuNSAxNC41TDggMjBMMTAgMTguNUw3LjUgMTNMTEyIDEzTDIgMloiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg"), auto',
        '--theme-cursor-pointer': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMEM5IDguMzQzMTUgMTAuMzQzMSA3IDEyIDdDMTMuNjU2OSA3IDE1IDguMzQzMTUgMTUgMTBWMTRNMTUgMTBDMTUgOC4zNDMxNSAxNi4zNDMxIDcgMTggN0MxOS42NTY5IDcgMjEgOC4zNDMxNSAyMSAxMFYxNEMyMSAxNi4yMDkxIDE5LjIwOTEgMTggMTcgMThIMTBDOC44OTU0MyAxOCA4IDE3LjEwNDYgOCAxNlY2QzggNC4zNDMxNSA5LjM0MzE1IDMgMTEgM0MxMi42NTY5IDMgMTQgNC4zNDMxNSAxNCA2VjEwIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0id2hpdGUiLz48L3N2Zz4"), pointer',
        '--theme-wallpaper': 'radial-gradient(circle at 20% 15%, rgba(255,255,255,.12), transparent 24%), linear-gradient(135deg, #007c7c, #004f6b 58%, #022b40)',
        '--theme-accent': '#00ffff',
        '--theme-accent-2': '#ffcc00',
        '--theme-glow': 'rgba(0, 255, 255, .28)',
        '--theme-grid': 'rgba(255,255,255,.11)',
        '--theme-taskbar': 'linear-gradient(180deg, #d8d8d8, #a8a8a8)',
      },
      xp_luna: {
        '--color-retro-bg': '#5a7edc',
        '--color-retro-panel': '#ebe9ed',
        '--color-retro-lime': '#39ff14',
        '--color-retro-title': 'linear-gradient(90deg, #0053e1, #1d82ff)',
        '--color-retro-text': '#000000',
        '--color-retro-input-bg': '#ffffff',
        '--color-retro-input-text': '#000000',
        '--theme-cursor': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyVjE4TDUuNSAxNC41TDggMjBMMTAgMTguNUw3LjUgMTNMTEyIDEzTDIgMloiIGZpbGw9IndoaXRlIiBzdHJva2U9IiMwMDUzZTEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+"), auto',
        '--theme-cursor-pointer': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMEM5IDguMzQzMTUgMTAuMzQzMSA3IDEyIDdDMTMuNjU2OSA3IDE1IDguMzQzMTUgMTUgMTBWMTRNMTUgMTBDMTUgOC4zNDMxNSAxNi4zNDMxIDcgMTggN0MxOS42NTY5IDcgMjEgOC4zNDMxNSAyMSAxMFYxNEMyMSAxNi4yMDkxIDE5LjIwOTEgMTggMTcgMThIMTBDOC44OTU0MyAxOCA4IDE3LjEwNDYgOCAxNlY2QzggNC4zNDMxNSA5LjM0MzE1IDMgMTEgM0MxMi42NTY5IDMgMTQgNC4zNDMxNSAxNCA2VjEwIiBzdHJva2U9IiMwMDUzZTEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg"), pointer',
        '--theme-wallpaper': 'radial-gradient(circle at 35% 20%, #89b8ff, transparent 22%), linear-gradient(135deg, #245fd6, #47a34a 75%)',
        '--theme-accent': '#1d82ff',
        '--theme-accent-2': '#62d84e',
        '--theme-glow': 'rgba(29, 130, 255, .35)',
        '--theme-grid': 'rgba(255,255,255,.12)',
        '--theme-taskbar': 'linear-gradient(180deg, #3e9bff, #0053e1)',
      },
      matrix: {
        '--color-retro-bg': '#000000',
        '--color-retro-panel': '#001100',
        '--color-retro-lime': '#00ff41',
        '--color-retro-title': 'linear-gradient(90deg, #003300, #008800)',
        '--color-retro-text': '#00ff41',
        '--color-retro-input-bg': '#001a00',
        '--color-retro-input-text': '#00ff41',
        '--theme-cursor': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyVjE4TDUuNSAxNC41TDggMjBMMTAgMTguNUw3LjUgMTNMTEyIDEzTDIgMloiIGZpbGw9ImJsYWNrIiBzdHJva2U9IiMwMGZmNDEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+"), auto',
        '--theme-cursor-pointer': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMEM5IDguMzQzMTUgMTAuMzQzMSA3IDEyIDdDMTMuNjU2OSA3IDE1IDguMzQzMTUgMTUgMTBWMTRNMTUgMTBDMTUgOC4zNDMxNSAxNi4zNDMxIDcgMTggN0MxOS42NTY5IDcgMjEgOC4zNDMxNSAyMSAxMFYxNEMyMSAxNi4yMDkxIDE5LjIwOTEgMTggMTcgMThIMTBDOC44OTU0MyAxOCA4IDE3LjEwNDYgOCAxNlY2QzggNC4zNDMxNSA5LjM0MzE1IDMgMTEgM0MxMi42NTY5IDMgMTQgNC4zNDMxNSAxNCA2VjEwIiBzdHJva2U9IiMwMGZmNDEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJibGFjayIvPjwvc3ZnPg"), pointer',
        '--theme-wallpaper': 'radial-gradient(circle at 50% 15%, rgba(0,255,65,.18), transparent 25%), linear-gradient(135deg, #000, #001f0a 65%, #020402)',
        '--theme-accent': '#00ff41',
        '--theme-accent-2': '#94ffb5',
        '--theme-glow': 'rgba(0, 255, 65, .42)',
        '--theme-grid': 'rgba(0,255,65,.16)',
        '--theme-taskbar': 'linear-gradient(180deg, #023d16, #001707)',
      },
      vaporwave: {
        '--color-retro-bg': '#2d0a4e',
        '--color-retro-panel': '#ff71ce',
        '--color-retro-lime': '#01cdfe',
        '--color-retro-title': 'linear-gradient(90deg, #b967ff, #01cdfe)',
        '--color-retro-text': '#000000',
        '--color-retro-input-bg': '#ffffff',
        '--color-retro-input-text': '#000000',
        '--theme-cursor': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyVjE4TDUuNSAxNC41TDggMjBMMTAgMTguNUw3LjUgMTNMTEyIDEzTDIgMloiIGZpbGw9IiNmZjcxY2UiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+"), auto',
        '--theme-cursor-pointer': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMEM5IDguMzQzMTUgMTAuMzQzMSA3IDEyIDdDMTMuNjU2OSA3IDE1IDguMzQzMTUgMTUgMTBWMTRNMTUgMTBDMTUgOC4zNDMxNSAxNi4zNDMxIDcgMTggN0MxOS42NTY5IDcgMjEgOC4zNDMxNSAyMSAxMFYxNEMyMSAxNi4yMDkxIDE5LjIwOTEgMTggMTcgMThIMTBDOC44OTU0MyAxOCA4IDE3LjEwNDYgOCAxNlY2QzggNC4zNDMxNSA5LjM0MzE1IDMgMTEgM0MxMi42NTY5IDMgMTQgNC4zNDMxNSAxNCA2VjEwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgZmlsbD0iI2ZmNzFjZSIvPjwvc3ZnPg"), pointer',
        '--theme-wallpaper': 'linear-gradient(180deg, rgba(255,113,206,.55), transparent 34%), radial-gradient(circle at 65% 25%, rgba(1,205,254,.55), transparent 18%), linear-gradient(135deg, #2d0a4e, #09133f 75%)',
        '--theme-accent': '#01cdfe',
        '--theme-accent-2': '#fffb96',
        '--theme-glow': 'rgba(255, 113, 206, .42)',
        '--theme-grid': 'rgba(1,205,254,.18)',
        '--theme-taskbar': 'linear-gradient(180deg, #ff71ce, #9a5cff)',
      },
      cyberpunk: {
        '--color-retro-bg': '#000000',
        '--color-retro-panel': '#fcee0a',
        '--color-retro-lime': '#00ffff',
        '--color-retro-title': 'linear-gradient(90deg, #fcee0a, #ff003c)',
        '--color-retro-text': '#000000',
        '--color-retro-input-bg': '#fcee0a',
        '--color-retro-input-text': '#000000',
        '--theme-cursor': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMiAyVjE4TDUuNSAxNC41TDggMjBMMTAgMTguNUw3LjUgMTNMTEyIDEzTDIgMloiIGZpbGw9ImJsYWNrIiBzdHJva2U9IiNmY2VlMGEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+"), auto',
        '--theme-cursor-pointer': 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNOSAxMEM5IDguMzQzMTUgMTAuMzQzMSA3IDEyIDdDMTMuNjU2OSA3IDE1IDguMzQzMTUgMTUgMTBWMTRNMTUgMTBDMTUgOC4zNDMxNSAxNi4zNDMxIDcgMTggN0MxOS42NTY5IDcgMjEgOC4zNDMxNSAyMSAxMFYxNEMyMSAxNi4yMDkxIDE5LjIwOTEgMTggMTcgMThIMTBDOC44OTU0MyAxOCA4IDE3LjEwNDYgOCAxNlY2QzggNC4zNDMxNSA5LjM0MzE1IDMgMTEgM0MxMi42NTY5IDMgMTQgNC4zNDMxNSAxNCA2VjEwIiBzdHJva2U9IiNmY2VlMGEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJibGFjayIvPjwvc3ZnPg"), pointer',
        '--theme-wallpaper': 'radial-gradient(circle at 78% 18%, rgba(255,0,60,.46), transparent 20%), linear-gradient(135deg, #0d0d0d, #222100 65%, #050505)',
        '--theme-accent': '#00ffff',
        '--theme-accent-2': '#ff003c',
        '--theme-glow': 'rgba(252, 238, 10, .34)',
        '--theme-grid': 'rgba(252,238,10,.16)',
        '--theme-taskbar': 'linear-gradient(180deg, #fcee0a, #a99f00)',
      },
      pink: {
        '--color-retro-bg': '#ffc0cb',
        '--color-retro-panel': '#ffe4e1',
        '--color-retro-lime': '#ff69b4',
        '--color-retro-title': 'linear-gradient(90deg, #ff1493, #ff69b4)',
        '--color-retro-text': '#000000',
        '--theme-wallpaper': 'radial-gradient(circle at 25% 25%, rgba(255,255,255,.65), transparent 20%), linear-gradient(135deg, #ffc0cb, #ff7ab8 65%, #7fc7ff)',
        '--theme-accent': '#ff1493',
        '--theme-accent-2': '#2f8dff',
        '--theme-glow': 'rgba(255, 20, 147, .32)',
        '--theme-grid': 'rgba(255,255,255,.2)',
        '--theme-taskbar': 'linear-gradient(180deg, #ffe4e1, #ff9ac6)',
      },
      midnight: {
        '--color-retro-bg': '#080c1a',
        '--color-retro-panel': '#bcc6d8',
        '--color-retro-lime': '#7dd3fc',
        '--color-retro-title': 'linear-gradient(90deg, #151b54, #5b21b6, #0891b2)',
        '--color-retro-text': '#101423',
        '--theme-wallpaper': 'radial-gradient(circle at 70% 20%, rgba(125,211,252,.33), transparent 18%), radial-gradient(circle at 25% 75%, rgba(168,85,247,.24), transparent 22%), linear-gradient(135deg, #080c1a, #172554 62%, #111827)',
        '--theme-accent': '#7dd3fc',
        '--theme-accent-2': '#c084fc',
        '--theme-glow': 'rgba(125, 211, 252, .34)',
        '--theme-grid': 'rgba(125,211,252,.13)',
        '--theme-taskbar': 'linear-gradient(180deg, #c7d2fe, #7dd3fc)',
      },
      terminal: {
        '--color-retro-bg': '#031309',
        '--color-retro-panel': '#061f10',
        '--color-retro-lime': '#9dffb0',
        '--color-retro-title': 'linear-gradient(90deg, #062b14, #16a34a)',
        '--color-retro-text': '#9dffb0',
        '--theme-wallpaper': 'linear-gradient(135deg, #010804, #042514 70%, #000)',
        '--theme-accent': '#22c55e',
        '--theme-accent-2': '#bbf7d0',
        '--theme-glow': 'rgba(34, 197, 94, .38)',
        '--theme-grid': 'rgba(34,197,94,.17)',
        '--theme-taskbar': 'linear-gradient(180deg, #0f3d20, #031309)',
      }
    };

    const palette = palettes[theme];
    Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    <SystemContext.Provider value={{
      theme, wallpaper, refreshRate, crt, phase, bootProfile, currentUser, users,
      loginAttempts, isLocked, notifications, snapshots, missions, tray,
      isAdminMode, virusActive, wallpaperSlideshow, slideshowInterval,
      systemTime, timeZone, soundEnabled, volume, easterEggsFound, bsodMessage,
      setTheme, setWallpaper, setRefreshRate, updateCRT, setPhase, setBootProfile,
      login, logout, addNotification, dismissNotification, clearNotifications,
      saveSnapshot, restoreSnapshot, deleteSnapshot, completeMission, updateTray,
      setAdminMode, setVirusActive, triggerBSOD, setSystemTime, setTimeZone,
      setSoundEnabled, setVolume, discoverEasterEgg, setWallpaperSlideshow, setSlideshowInterval,
      playSound, triggerDegauss, degaussing, slowNetwork, setSlowNetwork, activeDesktopUrl, setActiveDesktopUrl
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within SystemProvider');
  return context;
};
