import React, { useState, useEffect } from 'react';
import Window from './Window';
import { Search, Download, Music, Send, Activity, User } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

interface Transfer {
  id: string;
  name: string;
  size: string;
  progress: number;
  speed: string;
  status: 'downloading' | 'complete' | 'error';
}

const Napster: React.FC<CommonWindowProps> = (props) => {
  const { saveFile } = useFileSystem();
  const { addNotification, triggerBSOD } = useSystem();
  const [activeTab, setActiveTab] = useState<'search' | 'transfers' | 'chat'>('search');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  const songs = [
    { title: 'Eiffel 65 - Blue (Da Ba Dee).mp3', size: '3.4 MB', bitrate: '128', pings: '42ms' },
    { title: 'Britney Spears - ...Baby One More Time.mp3', size: '4.1 MB', bitrate: '128', pings: '56ms' },
    { title: 'Backstreet Boys - I Want It That Way.mp3', size: '3.8 MB', bitrate: '128', pings: '38ms' },
    { title: 'Ricky Martin - Livin\' La Vida Loca.mp3', size: '4.5 MB', bitrate: '128', pings: '110ms' },
    { title: 'Santana - Smooth ft. Rob Thomas.mp3', size: '5.2 MB', bitrate: '128', pings: '62ms' },
    { title: 'FREE_MONEY_GENERATOR.exe', size: '1.2 MB', bitrate: 'N/A', pings: '12ms' },
    { title: 'ILOVEYOU.vbs', size: '15 KB', bitrate: 'N/A', pings: '5ms' },
  ];

  const handleSearch = () => {
    setResults(songs.filter(s => s.title.toLowerCase().includes(search.toLowerCase())));
  };

  const startDownload = (song: any) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newTransfer: Transfer = {
      id,
      name: song.title,
      size: song.size,
      progress: 0,
      speed: '0.0 KB/s',
      status: 'downloading'
    };
    setTransfers(prev => [newTransfer, ...prev]);
    setActiveTab('transfers');
    addNotification({ title: 'Napster', message: `Starting download: ${song.title}`, type: 'info' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTransfers(prev => prev.map(t => {
        if (t.status !== 'downloading') return t;
        const newProgress = t.progress + Math.random() * 5;
        if (newProgress >= 100) {
          // Finish download
          saveFile(t.name, `Content of ${t.name}`, (t.name.split('.').pop() || 'mp3') as any, 'C:\\Documents\\Downloads');
          addNotification({ title: 'Download Complete', message: `${t.name} has been saved to Downloads.`, type: 'success' });
          if (t.name === 'ILOVEYOU.vbs') {
            setTimeout(() => triggerBSOD(), 2000);
          }
          return { ...t, progress: 100, status: 'complete', speed: '0.0 KB/s' };
        }
        return { ...t, progress: newProgress, speed: `${(Math.random() * 4 + 1).toFixed(1)} KB/s` };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Window title="Napster Beta v2.0" icon={<Music size={14} />} width={600} height={450} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs">
        {/* Header */}
        <div className="bg-[#006600] p-2 text-white flex items-center justify-between border-b-2 border-green-900">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1"><Music size={18} className="text-green-800" /></div>
            <span className="font-bold italic text-xl tracking-tighter">napster</span>
          </div>
          <div className="flex gap-4 text-[10px] items-center">
            <span className="flex items-center gap-1"><User size={10} /> 14,209 Users</span>
            <span className="flex items-center gap-1"><Activity size={10} /> 1.4M Files</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex bg-[#c0c0c0] border-b border-gray-400 p-1 gap-1">
          <button className={`win95-button px-4 py-1 flex items-center gap-1 ${activeTab === 'search' ? 'shadow-inner bg-gray-300 font-bold' : ''}`} onClick={() => setActiveTab('search')}><Search size={12} /> Search</button>
          <button className={`win95-button px-4 py-1 flex items-center gap-1 ${activeTab === 'transfers' ? 'shadow-inner bg-gray-300 font-bold' : ''}`} onClick={() => setActiveTab('transfers')}><Download size={12} /> Transfers ({transfers.filter(t => t.status === 'downloading').length})</button>
          <button className={`win95-button px-4 py-1 flex items-center gap-1 ${activeTab === 'chat' ? 'shadow-inner bg-gray-300 font-bold' : ''}`} onClick={() => setActiveTab('chat')}><Send size={12} /> Chat</button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col p-2 bg-white m-1 win95-window shadow-inner">
          {activeTab === 'search' && (
            <>
              <div className="flex gap-2 mb-2 items-center">
                <input 
                  className="flex-1 win95-window shadow-inner p-1 h-7 outline-none" 
                  placeholder="Enter song name..." 
                  value={search} 
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button className="win95-button px-6 py-1" onClick={handleSearch}>Find It!</button>
              </div>
              <div className="flex-1 overflow-auto border border-gray-300">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#c0c0c0] sticky top-0 border-b border-gray-400">
                    <tr><th className="p-1">Filename</th><th className="p-1 w-16">Size</th><th className="p-1 w-12">Bitrate</th><th className="p-1 w-12">Ping</th></tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No search results. Try "Blue" or "Britney".</td></tr>
                    ) : results.map((song, i) => (
                      <tr key={i} className="hover:bg-blue-800 hover:text-white cursor-pointer group" onDoubleClick={() => startDownload(song)}>
                        <td className="p-1 flex items-center gap-1 truncate"><Music size={10} className="group-hover:text-white text-blue-800" /> {song.title}</td>
                        <td className="p-1">{song.size}</td>
                        <td className="p-1">{song.bitrate}</td>
                        <td className="p-1 text-green-600 font-bold">{song.pings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'transfers' && (
            <div className="flex-1 overflow-auto border border-gray-300">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#c0c0c0] sticky top-0 border-b border-gray-400">
                  <tr><th className="p-1">Filename</th><th className="p-1 w-16">Status</th><th className="p-1 w-24">Progress</th><th className="p-1 w-16">Speed</th></tr>
                </thead>
                <tbody>
                  {transfers.length === 0 ? (
                    <tr><td colSpan={4} className="p-4 text-center text-gray-400 italic">No active transfers.</td></tr>
                  ) : transfers.map(t => (
                    <tr key={t.id} className="border-b border-gray-100">
                      <td className="p-1 truncate font-bold">{t.name}</td>
                      <td className={`p-1 capitalize ${t.status === 'complete' ? 'text-green-600 font-bold' : ''}`}>{t.status}</td>
                      <td className="p-1">
                        <div className="w-full h-3 win95-window shadow-inner bg-gray-200 p-[1px] relative overflow-hidden">
                          <div className="h-full bg-blue-800" style={{ width: `${t.progress}%` }} />
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white mix-blend-difference">{Math.floor(t.progress)}%</span>
                        </div>
                      </td>
                      <td className="p-1 text-right">{t.speed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-full bg-gray-50 p-2 border border-gray-300">
              <div className="flex-1 overflow-auto flex flex-col gap-1 p-2 bg-white win95-window shadow-inner mb-2">
                <div className="text-blue-800">*** Joined channel #Alternative-90s</div>
                <div className="text-gray-500 font-bold">CoolHacker99: <span className="font-normal text-black">anyone have that new metallica song?</span></div>
                <div className="text-gray-500 font-bold">Lars_U: <span className="font-normal text-black font-bold text-red-600">STOP DOWNLOADING OUR MUSIC!!!</span></div>
                <div className="text-gray-500 font-bold">RetroFan: <span className="font-normal text-black">lol shut up lars</span></div>
              </div>
              <div className="flex gap-1">
                <input className="flex-1 win95-window shadow-inner p-1 h-7 outline-none" placeholder="Chat here..." />
                <button className="win95-button px-4">Send</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#c0c0c0] border-t border-gray-400 p-1 flex justify-between items-center text-[9px] px-2">
          <div className="flex gap-2">
            <span className="text-gray-600">Server: US-EAST-RETRO</span>
            <span className="text-green-700 font-bold">🟢 Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">DOWNLOAD DIR:</span>
            <span className="bg-white border border-gray-300 px-1">C:\Documents\Downloads</span>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Napster;
