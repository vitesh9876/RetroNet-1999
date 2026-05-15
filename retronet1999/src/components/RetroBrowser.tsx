import React, { useState } from 'react';
import Window from './Window';
import { Globe, ArrowLeft, ArrowRight, RotateCw, Home, Search, Star, Download, X, Plus, Code } from 'lucide-react';
import { FAKE_SITES } from '../retro_sites/siteData';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

interface BrowserProps {
  onClose: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isMaximized?: boolean;
  onFocus?: () => void;
  isActive?: boolean;
  zIndex?: number;
}

interface BrowserTab {
  id: string;
  url: string;
  title: string;
  site: { title: string; bg: string; content: string };
  history: string[];
  historyIndex: number;
}

interface DownloadItem {
  id: string;
  name: string;
  progress: number;
  done: boolean;
}

const HOME_URL = 'http://www.geocities.com/area51/vault/9902/index.html';

const resolveSite = (targetUrl: string) => {
  const l = targetUrl.toLowerCase();
  if (l.includes('matrix')) return FAKE_SITES.matrix_fan;
  if (l.includes('google') || l.includes('search')) return FAKE_SITES.google;
  if (l.includes('download') || l.includes('tucows')) return FAKE_SITES.tucows;
  if (l.includes('guestbook')) return FAKE_SITES.guestbook;
  if (l.includes('webring')) return FAKE_SITES.webring;
  if (l.includes('angelfire') || l.includes('pets')) return FAKE_SITES.angelfire;
  if (l.includes('404') || l.includes('missing')) return FAKE_SITES.notFound;
  if (l.includes('yahoo')) return FAKE_SITES.yahoo;
  return FAKE_SITES.geocities_ufo;
};

const RetroBrowser: React.FC<BrowserProps> = ({ onClose, onMinimize, onMaximize, isMaximized, onFocus, isActive, zIndex }) => {
  const defaultTab = (): BrowserTab => ({ id: `tab-${Date.now()}`, url: HOME_URL, title: 'Home', site: FAKE_SITES.geocities_ufo, history: [HOME_URL], historyIndex: 0 });
  const [tabs, setTabs] = useState<BrowserTab[]>([defaultTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [urlInput, setUrlInput] = useState(HOME_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState<'history' | 'bookmarks' | 'downloads' | 'source' | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('retronet1999:bookmarks') || '[]'); } catch { return []; } });
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const { saveFile } = useFileSystem();
  const { addNotification, slowNetwork } = useSystem();
  const contentRef = React.useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  React.useEffect(() => {
    if (!contentRef.current || !slowNetwork) return;
    const imgs = contentRef.current.querySelectorAll('img');
    imgs.forEach(img => {
      img.classList.add('slow-load-img');
    });
  }, [activeTab.site.content, slowNetwork]);

  const updateTab = (id: string, updates: Partial<BrowserTab>) => {
    setTabs(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const navigateTo = (targetUrl: string, tabId?: string) => {
    const tid = tabId || activeTabId;
    const tab = tabs.find(t => t.id === tid)!;
    setUrlInput(targetUrl);
    setIsLoading(true);
    setTimeout(() => {
      const site = resolveSite(targetUrl);
      const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), targetUrl];
      updateTab(tid, { url: targetUrl, title: site.title, site, history: newHistory, historyIndex: newHistory.length - 1 });
      setIsLoading(false);
    }, 500 + Math.random() * 800);
  };

  const addTab = () => {
    const t = defaultTab();
    setTabs(prev => [...prev, t]);
    setActiveTabId(t.id);
    setUrlInput(HOME_URL);
  };

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) { setActiveTabId(newTabs[0].id); setUrlInput(newTabs[0].url); }
  };

  const switchTab = (id: string) => {
    setActiveTabId(id);
    const t = tabs.find(tt => tt.id === id);
    if (t) setUrlInput(t.url);
  };

  const downloadFile = () => {
    const name = activeTab.site.title.includes('TUCOWS') ? 'RetroZip21.zip' : `${activeTab.site.title.replace(/[^a-z0-9]/gi, '_')}.html`;
    const dl: DownloadItem = { id: `dl-${Date.now()}`, name, progress: 0, done: false };
    setDownloads(prev => [...prev, dl]);
    setShowSidebar('downloads');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        clearInterval(iv);
        setDownloads(prev => prev.map(d => d.id === dl.id ? { ...d, progress: 100, done: true } : d));
        saveFile(name, activeTab.site.content, name.endsWith('.zip') ? 'zip' : 'html', 'C:\\Documents\\Downloads');
        addNotification({ title: 'Download Complete', message: `${name} saved to Downloads`, type: 'success' });
      } else {
        setDownloads(prev => prev.map(d => d.id === dl.id ? { ...d, progress: Math.min(p, 100) } : d));
      }
    }, 300);
  };

  return (
    <Window title={`${activeTab.title} - RetroNet Navigator`} icon={<Globe size={14} />} onClose={onClose} onMinimize={onMinimize} onMaximize={onMaximize} isMaximized={isMaximized} onFocus={onFocus} isActive={isActive} zIndex={zIndex} width={780} height={580}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans">
        {/* Menu bar */}
        <div className="flex gap-2 text-[10px] px-2 py-0.5 border-b border-gray-400">
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Edit</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowSidebar(showSidebar === 'source' ? null : 'source')}>View Source</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowSidebar(showSidebar === 'bookmarks' ? null : 'bookmarks')}>Bookmarks</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowSidebar(showSidebar === 'history' ? null : 'history')}>History</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowSidebar(showSidebar === 'downloads' ? null : 'downloads')}>Downloads ({downloads.filter(d => !d.done).length})</span>
        </div>

        {/* Tabs */}
        <div className="flex items-center bg-[#d4d4d4] border-b border-gray-400 px-1 gap-0.5 overflow-x-auto">
          {tabs.map(t => (
            <div key={t.id} className={`flex items-center gap-1 px-2 py-1 text-[10px] cursor-pointer border border-b-0 max-w-[140px] ${t.id === activeTabId ? 'bg-white border-gray-400 -mb-[1px] z-10' : 'bg-[#c0c0c0] border-transparent hover:bg-[#d0d0d0]'}`} onClick={() => switchTab(t.id)}>
              <span className="truncate flex-1">{t.title}</span>
              {tabs.length > 1 && <button className="hover:text-red-500" onClick={(e) => { e.stopPropagation(); closeTab(t.id); }}><X size={8} /></button>}
            </div>
          ))}
          <button className="p-1 hover:bg-gray-300 rounded" onClick={addTab} title="New Tab"><Plus size={10} /></button>
        </div>

        {/* Toolbar */}
        <div className="flex gap-1 p-1 items-center border-b border-gray-400">
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => { if (activeTab.historyIndex > 0) { const i = activeTab.historyIndex - 1; updateTab(activeTabId, { historyIndex: i }); navigateTo(activeTab.history[i]); } }}><ArrowLeft size={14} /><span className="text-[7px]">Back</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => { if (activeTab.historyIndex < activeTab.history.length - 1) { const i = activeTab.historyIndex + 1; updateTab(activeTabId, { historyIndex: i }); navigateTo(activeTab.history[i]); } }}><ArrowRight size={14} /><span className="text-[7px]">Fwd</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => navigateTo(activeTab.url)}><RotateCw size={14} /><span className="text-[7px]">Reload</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => navigateTo(HOME_URL)}><Home size={14} /><span className="text-[7px]">Home</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => navigateTo('http://www.google.com')}><Search size={14} /><span className="text-[7px]">Search</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => { const next = bookmarks.includes(activeTab.url) ? bookmarks : [...bookmarks, activeTab.url]; setBookmarks(next); localStorage.setItem('retronet1999:bookmarks', JSON.stringify(next)); addNotification({ title: 'Bookmark Added', message: activeTab.url, type: 'info' }); }}><Star size={14} /><span className="text-[7px]">Mark</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={downloadFile}><Download size={14} /><span className="text-[7px]">Save</span></button>
          <button className="win95-button p-1 flex flex-col items-center w-10" onClick={() => setShowSidebar(showSidebar === 'source' ? null : 'source')}><Code size={14} /><span className="text-[7px]">Source</span></button>
          <div className="flex-1" />
          <div className={isLoading ? 'w-7 h-7 bg-blue-800 rounded-sm animate-spin' : 'w-7 h-7 bg-blue-800 rounded-sm'} />
        </div>

        {/* URL bar */}
        <form onSubmit={(e) => { e.preventDefault(); navigateTo(urlInput); }} className="flex items-center gap-2 px-1 py-1 border-b border-gray-400">
          <span className="text-[10px] font-bold">NetSite:</span>
          <input type="text" className="flex-1 win95-window shadow-inner px-1 h-5 text-xs outline-none bg-white" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
        </form>

        {/* Banner ad */}
        <div className="bg-white border-b border-gray-300 text-center py-1 overflow-hidden">
          <div className="text-[10px] animate-[marquee_20s_linear_infinite] whitespace-nowrap inline-block pl-[100%]">
            <span className="text-red-600 font-bold">🔥 FREE!! 🔥</span> Click here for 1000 FREE hours of AOL! ★ ★ ★ Congratulations! You are the 1,000,000th visitor! ★ ★ ★ <span className="text-blue-600 font-bold">Download Bonzi Buddy NOW!</span> ★ ★ ★ MAKE $$$ FAST working from home!
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {showSidebar && (
            <div className="w-52 bg-[#f0f0f0] border-r border-gray-500 p-2 overflow-auto text-[10px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold capitalize">{showSidebar}</span>
                <button onClick={() => setShowSidebar(null)}><X size={10} /></button>
              </div>
              {showSidebar === 'history' && activeTab.history.map((item, i) => (
                <button key={`${item}-${i}`} className="block text-left w-full hover:bg-blue-100 p-1 break-all" onClick={() => navigateTo(item)}>{item}</button>
              ))}
              {showSidebar === 'bookmarks' && (
                <>
                  {bookmarks.length === 0 ? <div className="text-gray-500 italic">No bookmarks yet</div> : bookmarks.map((b, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <button className="flex-1 text-left hover:bg-blue-100 p-1 break-all truncate" onClick={() => navigateTo(b)}>{b}</button>
                      <button className="text-red-400 hover:text-red-600" onClick={() => { const n = bookmarks.filter((_, j) => j !== i); setBookmarks(n); localStorage.setItem('retronet1999:bookmarks', JSON.stringify(n)); }}><X size={8} /></button>
                    </div>
                  ))}
                </>
              )}
              {showSidebar === 'downloads' && (
                downloads.length === 0 ? <div className="text-gray-500 italic">No downloads</div> : downloads.map(d => (
                  <div key={d.id} className="mb-2 border border-gray-300 p-1 bg-white">
                    <div className="truncate font-bold">{d.name}</div>
                    <div className="h-2 bg-gray-200 mt-1"><div className="h-full bg-blue-600 transition-all" style={{ width: `${d.progress}%` }} /></div>
                    <div className="text-right mt-0.5">{d.done ? '✅ Complete' : `${Math.floor(d.progress)}%`}</div>
                  </div>
                ))
              )}
              {showSidebar === 'source' && (
                <pre className="bg-black text-green-400 p-2 font-mono text-[8px] overflow-auto whitespace-pre-wrap flex-1">{activeTab.site.content}</pre>
              )}
            </div>
          )}
          <div className="flex-1 bg-white overflow-auto relative" style={{ backgroundColor: activeTab.site.bg?.startsWith('#') ? activeTab.site.bg : 'transparent', backgroundImage: activeTab.site.bg?.startsWith('#') ? undefined : `url(${activeTab.site.bg})`, backgroundRepeat: 'repeat' }}>
            {isLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-48 h-4 win95-window shadow-inner bg-gray-200 p-0.5"><div className="h-full bg-blue-800 animate-[pulse_1s_infinite] w-1/2" /></div>
                  <span className="text-xs font-bold animate-pulse">Contacting host...</span>
                </div>
              </div>
            )}
            <div ref={contentRef} dangerouslySetInnerHTML={{ __html: activeTab.site.content }} />
          </div>
        </div>

        {/* Status */}
        <div className="h-5 flex items-center px-1 text-[10px] border-t border-retro-border-dark opacity-80">
          <Globe size={10} className="mr-1" />
          <span className="flex-1">{isLoading ? 'Document: Loading' : 'Document: Done'} | Created by Vitesh Pallapothu</span>
          <span className="border-l border-gray-400 px-1">Tabs: {tabs.length}</span>
          <span className="border-l border-gray-400 px-1">Build: 1999.4.10</span>
        </div>
      </div>
    </Window>
  );
};

export default RetroBrowser;
