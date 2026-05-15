import React, { useState } from 'react';
import Window from './Window';
import { Settings, Monitor, Palette, Volume2, ShieldCheck, Zap, Clock, User, Wifi, Accessibility } from 'lucide-react';
import { useSystem, SystemTheme } from '../contexts/SystemContext';
import { CommonWindowProps } from '../types';

interface ControlPanelProps extends CommonWindowProps {
  onStartScreensaver?: (type: 'matrix' | 'pipes' | 'starfield') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ onStartScreensaver, ...props }) => {
  const { theme, setTheme, crt, updateCRT, refreshRate, setRefreshRate, wallpaper, setWallpaper, systemTime, timeZone, setTimeZone, soundEnabled, setSoundEnabled, volume, setVolume, currentUser, users, missions, isAdminMode, easterEggsFound, wallpaperSlideshow, setWallpaperSlideshow, slideshowInterval, setSlideshowInterval, tray, updateTray, triggerDegauss, degaussing, activeDesktopUrl, setActiveDesktopUrl, slowNetwork, setSlowNetwork } = useSystem();
  const [activeTab, setActiveTab] = useState<'display' | 'crt' | 'theme' | 'screensaver' | 'sound' | 'datetime' | 'users' | 'network' | 'accessibility'>('display');

  const themes: { id: SystemTheme; name: string; preview: string; accent: string; description: string }[] = [
    { id: 'classic', name: 'Windows Classic', preview: '#008080', accent: '#c0c0c0', description: 'Sharp office desktop with teal glass.' },
    { id: 'xp_luna', name: 'XP Luna', preview: '#245fd6', accent: '#62d84e', description: 'Glossy early-2000s blue & green.' },
    { id: 'matrix', name: 'Matrix Terminal', preview: '#000000', accent: '#00ff41', description: 'Green code glow, hacker room.' },
    { id: 'vaporwave', name: 'Vaporwave Night', preview: '#9a5cff', accent: '#01cdfe', description: 'Pink neon, cyan highlights.' },
    { id: 'cyberpunk', name: 'Cyberpunk Yellow', preview: '#fcee0a', accent: '#ff003c', description: 'Warning yellow with red edges.' },
    { id: 'pink', name: 'Retro Pink', preview: '#ffc0cb', accent: '#ff1493', description: 'Soft glossy pink candy.' },
    { id: 'midnight', name: 'Midnight Glass', preview: '#172554', accent: '#7dd3fc', description: 'Deep blue with cold neon.' },
    { id: 'terminal', name: 'Green Phosphor', preview: '#031309', accent: '#22c55e', description: 'Old terminal phosphor.' },
  ];

  const wallpapers = [
    { name: 'Theme Default', value: 'var(--theme-wallpaper)' },
    { name: 'Teal Classic', value: '#008080' },
    { name: 'Deep Space', value: 'linear-gradient(135deg, #0c0c1d, #1a1a3e 50%, #0d0d2b)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { name: 'Black', value: '#000000' },
  ];

  const timeZones = ['EST (UTC-5)', 'CST (UTC-6)', 'MST (UTC-7)', 'PST (UTC-8)', 'GMT (UTC+0)', 'CET (UTC+1)', 'JST (UTC+9)', 'AEST (UTC+10)'];

  const tabs = [
    { id: 'display' as const, icon: <Monitor size={14} />, label: 'Display' },
    { id: 'crt' as const, icon: <Zap size={14} />, label: 'CRT Effects' },
    { id: 'theme' as const, icon: <Palette size={14} />, label: 'Themes' },
    { id: 'screensaver' as const, icon: <ShieldCheck size={14} />, label: 'Screensaver' },
    { id: 'sound' as const, icon: <Volume2 size={14} />, label: 'Sound' },
    { id: 'datetime' as const, icon: <Clock size={14} />, label: 'Date/Time' },
    { id: 'users' as const, icon: <User size={14} />, label: 'Users' },
    { id: 'network' as const, icon: <Wifi size={14} />, label: 'Network' },
    { id: 'accessibility' as const, icon: <Accessibility size={14} />, label: 'Access.' },
  ];

  return (
    <Window title="Control Panel" icon={<Settings size={14} />} width={640} height={480} {...props}>
      <div className="flex h-full bg-retro-panel font-sans text-xs text-retro-text">
        {/* Sidebar */}
        <div className="w-28 border-r border-retro-border-dark flex flex-col p-1 gap-0.5 bg-black/5 overflow-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-1 p-1 text-left text-[10px] ${activeTab === t.id ? 'bg-[#000080] text-white' : 'hover:bg-black/10'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 overflow-auto">
          {activeTab === 'display' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Wallpaper Settings</h3>
              <div className="grid grid-cols-2 gap-2">
                {wallpapers.map(wp => (
                  <button key={wp.name} onClick={() => setWallpaper(wp.value)} className={`p-2 border text-center text-[10px] ${wallpaper === wp.value ? 'bg-blue-200 border-blue-600' : 'bg-white border-gray-400'}`}>
                    <div className="w-full h-6 mb-1 border border-gray-300" style={{ background: wp.value }} />
                    {wp.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="checkbox" checked={wallpaperSlideshow} onChange={e => setWallpaperSlideshow(e.target.checked)} />
                <span>Wallpaper slideshow</span>
                {wallpaperSlideshow && (
                  <select className="win95-window p-0.5 bg-white text-[10px]" value={slideshowInterval} onChange={e => setSlideshowInterval(Number(e.target.value))}>
                    <option value={10}>10s</option><option value={30}>30s</option><option value={60}>60s</option><option value={300}>5min</option>
                  </select>
                )}
              </div>
              <h3 className="font-bold border-b border-gray-400 pb-1 mt-2">Refresh Rate</h3>
              <select value={refreshRate} onChange={e => setRefreshRate(Number(e.target.value))} className="win95-window p-1 bg-white">
                <option value={15}>15 Hz (Heavy Flicker)</option>
                <option value={30}>30 Hz (Retro Feel)</option>
                <option value={60}>60 Hz (Standard)</option>
                <option value={120}>120 Hz (Ultra Smooth)</option>
              </select>
            </div>
          )}

          {activeTab === 'crt' && (
            <div className="flex flex-col gap-2">
              <h3 className="font-bold border-b border-gray-400 pb-1">CRT Simulation</h3>
              {[
                { key: 'enabled', label: 'Enable Global CRT Filter' },
                { key: 'scanlines', label: 'Scanlines' },
                { key: 'flicker', label: 'Flickering' },
                { key: 'vhs', label: 'VHS Distortion Layer' },
              ].map(opt => (
                <label key={opt.key} className="flex items-center gap-2">
                  <input type="checkbox" checked={(crt as any)[opt.key]} onChange={e => updateCRT({ [opt.key]: e.target.checked })} /> {opt.label}
                </label>
              ))}
              <h3 className="font-bold border-b border-gray-400 pb-1 mt-2">Intensity</h3>
              {[
                { key: 'blur', label: 'Blur', max: 2, step: 0.1 },
                { key: 'scanlineIntensity', label: 'Scanlines', max: 1, step: 0.1 },
                { key: 'flickerIntensity', label: 'Flicker', max: 0.5, step: 0.05 },
                { key: 'bloom', label: 'Bloom', max: 2, step: 0.1 },
              ].map(s => (
                <div key={s.key} className="flex items-center gap-2">
                  <span className="w-20">{s.label}:</span>
                  <input type="range" min="0" max={s.max} step={s.step} value={(crt as any)[s.key]} onChange={e => updateCRT({ [s.key]: Number(e.target.value) })} className="flex-1" />
                  <span className="w-8 text-right">{(crt as any)[s.key]}</span>
                </div>
              ))}
              <div className="mt-4 p-3 win95-window bg-gray-200 border-2 shadow-inner">
                <div className="font-bold text-[10px] mb-1">Magnetic Field Discharge</div>
                <button 
                  className="win95-button w-full py-1 font-bold flex items-center justify-center gap-2 bg-[#d0d0d0]"
                  onClick={triggerDegauss}
                  disabled={degaussing}
                >
                  <Monitor size={12} />
                  {degaussing ? 'Degaussing...' : 'Degauss Monitor'}
                </button>
              </div>
              <div className="mt-2 p-3 win95-window bg-gray-200 border-2 shadow-inner">
                <div className="font-bold text-[10px] mb-1">Active Desktop</div>
                <label className="flex items-center gap-2 mb-2">
                  <input type="checkbox" checked={!!activeDesktopUrl} onChange={e => setActiveDesktopUrl(e.target.checked ? 'http://www.geocities.com/area51' : null)} /> 
                  <span className="text-[10px]">Show Web Content on Desktop</span>
                </label>
                {activeDesktopUrl && (
                  <input 
                    type="text" 
                    className="win95-window shadow-inner p-1 text-[9px] w-full bg-white"
                    value={activeDesktopUrl}
                    onChange={e => setActiveDesktopUrl(e.target.value)}
                    placeholder="URL (e.g. C:\Documents\Websites\index.html)"
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="grid grid-cols-2 gap-2">
              {themes.map(t => (
                <button key={t.id} onClick={() => { setTheme(t.id); setWallpaper('var(--theme-wallpaper)'); }} className={`theme-card flex flex-col items-start gap-1 p-2 border-2 text-left ${theme === t.id ? 'theme-card-active' : 'border-gray-300 bg-white hover:bg-gray-100'}`}>
                  <div className="w-full h-10 border border-black overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.preview}, ${t.accent})` }}>
                    <div className="h-2 mt-auto border-t border-white/40" style={{ backgroundColor: t.accent }} />
                  </div>
                  <span className="font-bold text-[10px]">{t.name}</span>
                  <span className="text-[9px] opacity-70">{t.description}</span>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'sound' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Sound Settings</h3>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={soundEnabled} onChange={e => { setSoundEnabled(e.target.checked); updateTray({ sound: e.target.checked ? 'on' : 'muted' }); }} /> Enable system sounds
              </label>
              <div className="flex items-center gap-2">
                <Volume2 size={14} />
                <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1" />
                <span>{volume}%</span>
              </div>
              <div className="win95-window shadow-inner bg-white p-2 text-[10px]">
                <div>Sound Card: Creative Labs Sound Blaster 16</div>
                <div>Driver: SB16.VXD v4.38</div>
                <div>IRQ: 5 | DMA: 1 | Base I/O: 220</div>
              </div>
            </div>
          )}

          {activeTab === 'datetime' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Date & Time</h3>
              <div className="text-2xl font-mono text-center p-2 win95-window shadow-inner bg-white">
                {systemTime.toLocaleTimeString()}
              </div>
              <div className="text-center text-sm">{systemTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <h3 className="font-bold border-b border-gray-400 pb-1 mt-2">Time Zone</h3>
              <select className="win95-window p-1 bg-white" value={timeZone} onChange={e => setTimeZone(e.target.value)}>
                {timeZones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">User Profiles</h3>
              <div className="text-[10px] mb-1">Current: <strong>{currentUser?.username || 'Not logged in'}</strong> {isAdminMode && <span className="text-red-600">[ADMIN]</span>}</div>
              {users.map(u => (
                <div key={u.username} className={`flex items-center gap-2 p-2 border ${u.username === currentUser?.username ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300'}`}>
                  <span className="text-2xl">{u.avatar}</span>
                  <div className="flex-1">
                    <div className="font-bold">{u.username}</div>
                    <div className="text-gray-500">{u.isAdmin ? 'Administrator' : 'Standard User'}</div>
                  </div>
                </div>
              ))}
              <h3 className="font-bold border-b border-gray-400 pb-1 mt-2">Mission Progress</h3>
              {Object.entries(missions).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className={v ? 'text-green-600' : 'text-gray-400'}>{v ? '✅' : '⬜'}</span>
                  <span className={v ? 'line-through text-gray-500' : ''}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                </div>
              ))}
              <div className="text-[10px] mt-1">Easter Eggs found: {easterEggsFound.length}</div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Network Configuration</h3>
              <div className="win95-window shadow-inner bg-white p-2 text-[10px]">
                <div>Status: {tray.network === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}</div>
                <div>Adapter: US Robotics 56K Faxmodem</div>
                <div>Speed: 33.6 Kbps</div>
                <div>IP Address: 10.0.0.99</div>
                <div>Subnet: 255.255.255.0</div>
                <div>Gateway: 10.0.0.1</div>
                <div>DNS: 10.0.0.1</div>
              </div>
              
              <div className="win95-window shadow-inner bg-white p-3 border-2">
                <div className="font-bold text-[10px] mb-2 flex items-center gap-2">
                  <Wifi size={14} /> Connection Speed Simulation
                </div>
                <label className="flex items-center gap-3 cursor-pointer p-1 hover:bg-blue-50">
                  <input 
                    type="checkbox" 
                    checked={slowNetwork} 
                    onChange={e => setSlowNetwork(e.target.checked)} 
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">Simulate 56K Modem</span>
                    <span className="text-[9px] text-gray-500">Limits image loading speed and adds interlacing</span>
                  </div>
                </label>
              </div>

              <div className="flex gap-2">
                <button className="win95-button px-3 py-1" onClick={() => updateTray({ network: tray.network === 'connected' ? 'disconnected' : 'connected' })}>
                  {tray.network === 'connected' ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Accessibility Options</h3>
              <p className="text-gray-600">Accessibility settings for RetroNet OS.</p>
              <div className="win95-window shadow-inner bg-white p-2 text-[10px] flex flex-col gap-1">
                <label className="flex items-center gap-2"><input type="checkbox" /> High Contrast Mode</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Large Fonts</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Sticky Keys</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Mouse Keys</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Show Sounds</label>
              </div>
            </div>
          )}

          {activeTab === 'screensaver' && (
            <div className="flex flex-col gap-3">
              <h3 className="font-bold border-b border-gray-400 pb-1">Screensaver</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['starfield', 'matrix', 'pipes'] as const).map(type => (
                  <button key={type} className="win95-button p-3 capitalize bg-white" onClick={() => onStartScreensaver?.(type)}>{type}</button>
                ))}
              </div>
              <div className="win95-window shadow-inner bg-black text-lime-400 p-4 h-24 font-mono text-xs">
                Preview monitor ready. Select a screensaver.
              </div>
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};

export default ControlPanel;
