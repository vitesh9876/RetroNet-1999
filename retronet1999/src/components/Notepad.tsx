import React, { useState } from 'react';
import Window from './Window';
import { FileText, Save, FolderOpen, File, Search } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';

interface NotepadProps extends CommonWindowProps {
  onSave: (content: string, name?: string) => void;
  initialContent?: string;
  initialName?: string;
}

const Notepad: React.FC<NotepadProps> = ({ onSave, initialContent, initialName, ...props }) => {
  const [content, setContent] = useState(initialContent || '');
  const [fileName, setFileName] = useState(initialName || 'Note.txt');
  const [showFind, setShowFind] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [recentFiles, setRecentFiles] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('retronet1999:notepad-recent') || '[]'); } catch { return []; }
  });
  const [showRecent, setShowRecent] = useState(false);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [wordWrap, setWordWrap] = useState(true);
  const { files, readTextFile } = useFileSystem();

  const handleSave = () => {
    onSave(content, fileName);
    const recent = [fileName, ...recentFiles.filter(r => r !== fileName)].slice(0, 8);
    setRecentFiles(recent);
    localStorage.setItem('retronet1999:notepad-recent', JSON.stringify(recent));
  };

  const handleOpen = (name: string) => {
    const text = readTextFile(name, 'C:\\Documents');
    if (text !== null) { setContent(text); setFileName(name); setShowRecent(false); setShowMenu(null); }
    else alert(`Cannot open ${name}`);
  };

  const handleFind = () => {
    if (!findText) return;
    const idx = content.toLowerCase().indexOf(findText.toLowerCase());
    if (idx >= 0) {
      const ta = document.getElementById('notepad-textarea') as HTMLTextAreaElement;
      if (ta) { ta.focus(); ta.setSelectionRange(idx, idx + findText.length); }
    } else alert(`Cannot find "${findText}"`);
  };

  const handleReplace = () => {
    if (!findText) return;
    setContent(content.replace(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), replaceText));
  };

  const handleReplaceAll = () => {
    if (!findText) return;
    setContent(content.split(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')).join(replaceText));
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <Window title={`${fileName} - Notepad`} icon={<FileText size={14} />} width={520} height={420} {...props}>
      <div className="flex flex-col h-full bg-white font-mono text-sm">
        {/* Menu Bar */}
        <div className="bg-[#c0c0c0] flex gap-4 px-2 py-0.5 border-b border-gray-400 text-xs relative">
          <div className="relative">
            <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1" onClick={() => setShowMenu(showMenu === 'file' ? null : 'file')}>File</span>
            {showMenu === 'file' && (
              <div className="absolute top-full left-0 bg-[#c0c0c0] win95-window z-50 min-w-[160px] py-1 text-[10px]">
                <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2" onClick={() => { setContent(''); setFileName('Untitled.txt'); setShowMenu(null); }}><File size={10} /> New</button>
                <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2" onClick={() => { setShowRecent(true); setShowMenu(null); }}><FolderOpen size={10} /> Open...</button>
                <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2" onClick={() => { handleSave(); setShowMenu(null); }}><Save size={10} /> Save</button>
                <div className="border-t border-gray-400 my-1" />
                <div className="px-4 py-1 text-gray-500">Recent Files:</div>
                {recentFiles.map((r, i) => (
                  <button key={i} className="w-full text-left px-6 py-0.5 hover:bg-[#000080] hover:text-white truncate" onClick={() => { handleOpen(r); setShowMenu(null); }}>{r}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1" onClick={() => setShowMenu(showMenu === 'edit' ? null : 'edit')}>Edit</span>
            {showMenu === 'edit' && (
              <div className="absolute top-full left-0 bg-[#c0c0c0] win95-window z-50 min-w-[140px] py-1 text-[10px]">
                <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => { setWordWrap(!wordWrap); setShowMenu(null); }}>Word Wrap: {wordWrap ? 'On' : 'Off'}</button>
                <button className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white" onClick={() => { setContent(''); setShowMenu(null); }}>Select All + Delete</button>
              </div>
            )}
          </div>
          <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1" onClick={() => { setShowFind(!showFind); setShowMenu(null); }}>Search</span>
          <span className="cursor-pointer hover:bg-[#000080] hover:text-white px-1">Help</span>
        </div>
        
        {/* Toolbar */}
        <div className="bg-[#c0c0c0] flex gap-1 p-1 border-b border-gray-400 items-center">
          <button className="win95-button p-1" onClick={() => { setContent(''); setFileName('Untitled.txt'); }} title="New"><File size={14} /></button>
          <button className="win95-button p-1" onClick={() => setShowRecent(true)} title="Open"><FolderOpen size={14} /></button>
          <button className="win95-button p-1" onClick={handleSave} title="Save"><Save size={14} /></button>
          <div className="border-r border-gray-400 h-5 mx-1" />
          <button className="win95-button p-1" onClick={() => setShowFind(!showFind)} title="Find/Replace"><Search size={14} /></button>
          <div className="flex-1" />
          <input className="win95-window shadow-inner bg-white px-1 h-6 text-xs outline-none w-32" value={fileName} onChange={e => setFileName(e.target.value)} aria-label="File name" />
        </div>

        {/* Find/Replace bar */}
        {showFind && (
          <div className="bg-[#e0e0e0] flex items-center gap-1 p-1 border-b border-gray-400 text-[10px]">
            <span>Find:</span>
            <input className="win95-window shadow-inner bg-white px-1 h-5 text-xs outline-none w-24" value={findText} onChange={e => setFindText(e.target.value)} />
            <button className="win95-button px-2 py-0.5" onClick={handleFind}>Find</button>
            <span className="ml-2">Replace:</span>
            <input className="win95-window shadow-inner bg-white px-1 h-5 text-xs outline-none w-24" value={replaceText} onChange={e => setReplaceText(e.target.value)} />
            <button className="win95-button px-2 py-0.5" onClick={handleReplace}>Replace</button>
            <button className="win95-button px-2 py-0.5" onClick={handleReplaceAll}>All</button>
          </div>
        )}

        <textarea id="notepad-textarea" className={`flex-1 p-2 outline-none selection:bg-[#000080] selection:text-white text-xs ${wordWrap ? '' : 'whitespace-pre overflow-x-auto'}`} value={content} onChange={e => setContent(e.target.value)} spellCheck={false} autoFocus style={{ resize: 'none' }} />

        {/* Status bar */}
        <div className="bg-[#c0c0c0] border-t border-gray-400 px-2 py-0.5 flex justify-between text-[10px]">
          <span>Ln {lineCount}, Col {charCount > 0 ? 1 : 0}</span>
          <span>{charCount} characters</span>
          <span>{wordWrap ? 'Wrap: On' : 'Wrap: Off'}</span>
        </div>

        {/* Open file dialog */}
        {showRecent && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]" onClick={() => setShowRecent(false)}>
            <div className="win95-window w-64" onClick={e => e.stopPropagation()}>
              <div className="win95-titlebar h-6 px-2 flex items-center"><span className="text-[10px]">Open File</span></div>
              <div className="p-2 bg-[#c0c0c0] text-[10px] max-h-48 overflow-auto">
                {files.filter(f => f.type !== 'folder' && f.content).map(f => (
                  <button key={f.id} className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-1" onClick={() => { setContent(f.content || ''); setFileName(f.name); setShowRecent(false); }}>
                    <FileText size={10} /> {f.name} <span className="text-gray-500 ml-auto">{f.path}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
};

export default Notepad;
