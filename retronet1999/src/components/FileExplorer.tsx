import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';
import { Folder, File, FileText, Music, HardDrive, ArrowLeft, ArrowUp, Trash2, FolderPlus, Edit3, Copy, Scissors, Clipboard, Search, Grid, List, ChevronRight, ChevronDown, Info, Lock, EyeOff } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { FileItem, useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

interface FileExplorerProps extends CommonWindowProps {
  onTriggerVirus: () => void;
  files: FileItem[];
  onDeleteFile: (id: string) => void;
  onOpenNotepad?: (content: string, name: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onTriggerVirus, files, onDeleteFile, onOpenNotepad, ...props }) => {
  const { currentPath, setCurrentPath, getFilesAtPath, makeFolder, renameFile, clipboard, setClipboard, pasteClipboard, recycleBin, restoreFromBin, emptyRecycleBin, findFiles, getFileTree } = useFileSystem();
  const { addNotification, isAdminMode } = useSystem();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [showTree, setShowTree] = useState(true);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [showProperties, setShowProperties] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FileItem[] | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [pathHistory, setPathHistory] = useState<string[]>([currentPath]);
  const [pathIndex, setPathIndex] = useState(0);
  const renameRef = useRef<HTMLInputElement>(null);

  const visibleFiles = (searchResults || getFilesAtPath(currentPath)).filter(f => showHidden || !f.hidden);
  const tree = getFileTree();

  useEffect(() => {
    if (renamingId && renameRef.current) {
      renameRef.current.focus();
      renameRef.current.select();
    }
  }, [renamingId]);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSearchResults(null);
    const newHistory = [...pathHistory.slice(0, pathIndex + 1), path];
    setPathHistory(newHistory);
    setPathIndex(newHistory.length - 1);
    setSelectedFiles(new Set());
  };

  const goBack = () => {
    if (pathIndex > 0) {
      const newIndex = pathIndex - 1;
      setPathIndex(newIndex);
      setCurrentPath(pathHistory[newIndex]);
      setSearchResults(null);
    }
  };

  const goUp = () => {
    const parts = currentPath.split('\\');
    if (parts.length > 1) {
      parts.pop();
      navigateTo(parts.join('\\') || 'C:\\');
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchResults(findFiles(searchQuery));
    } else {
      setSearchResults(null);
    }
  };

  const toggleSelect = (id: string, multiSelect: boolean) => {
    setSelectedFiles(prev => {
      const next = new Set(multiSelect ? prev : []);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCopy = () => {
    const selected = files.find(f => selectedFiles.has(f.id));
    if (selected) {
      setClipboard({ file: selected, action: 'copy' });
      addNotification({ title: 'Clipboard', message: `Copied: ${selected.name}`, type: 'info' });
    }
  };

  const handleCut = () => {
    const selected = files.find(f => selectedFiles.has(f.id));
    if (selected) {
      setClipboard({ file: selected, action: 'cut' });
      addNotification({ title: 'Clipboard', message: `Cut: ${selected.name}`, type: 'info' });
    }
  };

  const handlePaste = () => {
    if (clipboard) {
      pasteClipboard(currentPath);
      addNotification({ title: 'Clipboard', message: `Pasted to ${currentPath}`, type: 'success' });
    }
  };

  const handleDelete = (id: string) => {
    const file = files.find(f => f.id === id);
    if (file?.permissions === 'locked' && !isAdminMode) {
      addNotification({ title: 'Access Denied', message: 'This file is locked. Admin access required.', type: 'error' });
      return;
    }
    onDeleteFile(id);
  };

  const startRename = (file: FileItem) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const finishRename = () => {
    if (renamingId && renameValue.trim()) {
      renameFile(renamingId, renameValue);
    }
    setRenamingId(null);
  };

  const getIcon = (type: string, size = 32) => {
    switch(type) {
      case 'folder': return <Folder size={size} className="text-yellow-400" />;
      case 'txt': return <FileText size={size} className="text-gray-600" />;
      case 'mp3': return <Music size={size} className="text-purple-400" />;
      case 'exe': return <HardDrive size={size} className="text-red-500 animate-pulse" />;
      case 'html': return <File size={size} className="text-blue-500" />;
      case 'bat': return <File size={size} className="text-green-600" />;
      case 'sys': case 'dll': return <File size={size} className="text-gray-400" />;
      case 'ini': case 'log': return <FileText size={size} className="text-gray-500" />;
      case 'bmp': return <File size={size} className="text-pink-500" />;
      case 'zip': return <File size={size} className="text-yellow-600" />;
      default: return <File size={size} className="text-gray-400" />;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const openFile = (file: FileItem) => {
    if (file.type === 'folder') {
      if (file.permissions === 'locked' && !isAdminMode) {
        const code = prompt('This folder is locked. Enter access code:');
        if (code !== 'RETROKING99' && code !== 'OPEN_SESAME') {
          addNotification({ title: 'Access Denied', message: 'Invalid access code.', type: 'error' });
          return;
        }
        addNotification({ title: 'Access Granted', message: `Unlocked: ${file.name}`, type: 'success' });
      }
      navigateTo(`${file.path}\\${file.name}`);
    } else if (file.type === 'exe') {
      onTriggerVirus();
    } else if (file.content && onOpenNotepad) {
      onOpenNotepad(file.content, file.name);
    } else if (file.content) {
      alert(`Content of ${file.name}:\n\n${file.content}`);
    } else if (file.type === 'mp3') {
      alert(`Playing ${file.name} in Retro Player.`);
    } else if (file.type === 'zip') {
      alert(`${file.name}\n\nRetroZip can preview this archive, but extraction support is coming in Service Pack 2.`);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c') handleCopy();
      if (e.ctrlKey && e.key === 'x') handleCut();
      if (e.ctrlKey && e.key === 'v') handlePaste();
      if (e.key === 'Delete') {
        selectedFiles.forEach(id => handleDelete(id));
      }
      if (e.ctrlKey && e.key === 'a') {
        setSelectedFiles(new Set(visibleFiles.map(f => f.id)));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedFiles, clipboard, visibleFiles]);

  return (
    <Window 
      title={showRecycleBin ? 'Recycle Bin' : `Exploring - ${currentPath}`} 
      icon={showRecycleBin ? <Trash2 size={14} /> : <Folder size={14} />} 
      width={700} 
      height={500}
      {...props}
    >
      <div className="flex flex-col h-full bg-retro-panel font-sans text-xs text-retro-text">
        {/* Menu Bar */}
        <div className="flex gap-4 px-2 py-0.5 border-b border-gray-400 text-[10px] bg-black/5">
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={handleCopy}>Edit</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowTree(!showTree)}>View</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowHidden(!showHidden)}>
            {showHidden ? '👁 Hidden' : '👁‍🗨 Hidden'}
          </span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer" onClick={() => setShowRecycleBin(!showRecycleBin)}>
            🗑 Recycle Bin ({recycleBin.length})
          </span>
        </div>

        {/* Toolbar */}
        <div className="bg-[#c0c0c0] p-1 flex items-center gap-1 border-b border-gray-400">
          <button className="win95-button p-1" onClick={goBack} title="Back"><ArrowLeft size={12} /></button>
          <button className="win95-button p-1" onClick={goUp} title="Up"><ArrowUp size={12} /></button>
          <div className="border-r border-gray-400 h-5 mx-1" />
          <button className="win95-button p-1" onClick={() => makeFolder(`New Folder`, currentPath)} title="New Folder"><FolderPlus size={12} /></button>
          <button className="win95-button p-1" onClick={handleCopy} title="Copy" disabled={selectedFiles.size === 0}><Copy size={12} /></button>
          <button className="win95-button p-1" onClick={handleCut} title="Cut" disabled={selectedFiles.size === 0}><Scissors size={12} /></button>
          <button className="win95-button p-1" onClick={handlePaste} title="Paste" disabled={!clipboard}><Clipboard size={12} /></button>
          <div className="border-r border-gray-400 h-5 mx-1" />
          <button className={`win95-button p-1 ${viewMode === 'grid' ? 'shadow-inner bg-gray-300' : ''}`} onClick={() => setViewMode('grid')} title="Icons"><Grid size={12} /></button>
          <button className={`win95-button p-1 ${viewMode === 'list' ? 'shadow-inner bg-gray-300' : ''}`} onClick={() => setViewMode('list')} title="Details"><List size={12} /></button>
          <div className="flex-1" />
          {/* Search */}
          <div className="flex items-center gap-1">
            <input
              className="win95-window shadow-inner bg-white px-1 h-5 w-24 text-xs outline-none"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="win95-button p-1" onClick={handleSearch}><Search size={12} /></button>
          </div>
        </div>

        {/* Address Bar */}
        <div className="bg-[#c0c0c0] p-1 flex items-center gap-2 border-b border-gray-400">
          <span className="ml-1 text-[10px]">Address</span>
          <div className="flex-1 bg-white border border-gray-400 px-2 py-0.5 shadow-inner flex items-center gap-2 font-mono text-[10px]">
            <HardDrive size={10} /> {showRecycleBin ? 'Recycle Bin' : currentPath}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Folder Tree */}
          {showTree && !showRecycleBin && (
            <div className="w-40 bg-white border-r border-gray-400 overflow-auto p-1 text-[10px]">
              <div className="font-bold mb-1">Folders</div>
              {tree.map((node, i) => (
                <button
                  key={`${node.path}-${i}`}
                  className={`flex items-center gap-1 w-full text-left px-1 py-0.5 hover:bg-blue-100 ${currentPath === node.path ? 'bg-blue-200 font-bold' : ''}`}
                  onClick={() => navigateTo(node.path)}
                  style={{ paddingLeft: `${Math.max(4, (node.path.split('\\').length - 1) * 12)}px` }}
                >
                  {node.hasChildren ? <ChevronDown size={8} /> : <ChevronRight size={8} />}
                  <Folder size={10} className="text-yellow-500" />
                  <span className="truncate">{node.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Files */}
          {showRecycleBin ? (
            <div className="flex-1 p-2 overflow-auto bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{recycleBin.length} item(s) in Recycle Bin</span>
                <button className="win95-button px-2 py-0.5 text-[10px]" onClick={emptyRecycleBin}>Empty Recycle Bin</button>
              </div>
              {recycleBin.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">Recycle Bin is empty</div>
              ) : (
                <div className="flex flex-col gap-1">
                  {recycleBin.map(item => (
                    <div key={item.file.id} className="flex items-center gap-2 p-1 hover:bg-blue-50 border border-transparent hover:border-blue-300">
                      {getIcon(item.file.type, 16)}
                      <span className="flex-1">{item.file.name}</span>
                      <span className="text-gray-500">{item.originalPath}</span>
                      <span className="text-gray-400">{item.deletedAt}</span>
                      <button className="win95-button px-1 py-0.5 text-[9px]" onClick={() => restoreFromBin(item.file.id)}>
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="flex-1 p-3 overflow-auto bg-white border-2 border-retro-border-dark shadow-inner flex flex-wrap content-start gap-4"
              onClick={() => setSelectedFiles(new Set())}
            >
              {visibleFiles.map((file) => (
                <div 
                  key={file.id}
                  className={`flex flex-col items-center gap-1 w-20 p-1 cursor-pointer group relative border ${
                    selectedFiles.has(file.id) ? 'bg-blue-200 border-blue-500' : 'border-transparent hover:bg-blue-50 hover:border-blue-200'
                  } ${file.hidden ? 'opacity-50' : ''} ${file.permissions === 'locked' ? 'ring-1 ring-red-300' : ''}`}
                  onClick={(e) => { e.stopPropagation(); toggleSelect(file.id, e.ctrlKey || e.shiftKey); }}
                  onDoubleClick={() => openFile(file)}
                  onContextMenu={(e) => { e.preventDefault(); setShowProperties(file); }}
                >
                  <div className="flex items-center justify-center h-10 relative">
                    {getIcon(file.type)}
                    {file.permissions === 'locked' && <Lock size={8} className="absolute -top-1 -right-1 text-red-500" />}
                    {file.hidden && <EyeOff size={8} className="absolute -bottom-1 -right-1 text-gray-500" />}
                  </div>
                  {renamingId === file.id ? (
                    <input
                      ref={renameRef}
                      className="text-center text-[10px] w-full outline-none border border-blue-500 px-1"
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onBlur={finishRename}
                      onKeyDown={e => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') setRenamingId(null); }}
                    />
                  ) : (
                    <span className="text-center break-all select-none text-[10px]">{file.name}</span>
                  )}
                  
                  {/* Context buttons */}
                  <div className="absolute -top-1 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100">
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }} className="bg-red-100 p-0.5 border border-red-400 rounded-sm hover:bg-red-500 hover:text-white" title="Delete">
                      <Trash2 size={8} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); startRename(file); }} className="bg-blue-100 p-0.5 border border-blue-400 rounded-sm hover:bg-blue-500 hover:text-white" title="Rename">
                      <Edit3 size={8} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setShowProperties(file); }} className="bg-gray-100 p-0.5 border border-gray-400 rounded-sm hover:bg-gray-500 hover:text-white" title="Properties">
                      <Info size={8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List view */
            <div className="flex-1 overflow-auto bg-white border-2 border-retro-border-dark shadow-inner">
              <table className="w-full text-[10px]">
                <thead className="bg-[#c0c0c0] sticky top-0">
                  <tr>
                    <th className="text-left p-1 border-r border-gray-400">Name</th>
                    <th className="text-left p-1 border-r border-gray-400 w-16">Type</th>
                    <th className="text-right p-1 border-r border-gray-400 w-16">Size</th>
                    <th className="text-left p-1 border-r border-gray-400 w-28">Modified</th>
                    <th className="text-left p-1 w-12">Perm</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFiles.map(file => (
                    <tr
                      key={file.id}
                      className={`cursor-pointer ${selectedFiles.has(file.id) ? 'bg-blue-200' : 'hover:bg-blue-50'} ${file.hidden ? 'opacity-50' : ''}`}
                      onClick={(e) => toggleSelect(file.id, e.ctrlKey || e.shiftKey)}
                      onDoubleClick={() => openFile(file)}
                    >
                      <td className="p-1 flex items-center gap-1">
                        {getIcon(file.type, 14)}
                        {renamingId === file.id ? (
                          <input
                            ref={renameRef}
                            className="outline-none border border-blue-500 px-1 flex-1"
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onBlur={finishRename}
                            onKeyDown={e => { if (e.key === 'Enter') finishRename(); if (e.key === 'Escape') setRenamingId(null); }}
                          />
                        ) : (
                          <span>{file.name}</span>
                        )}
                        {file.permissions === 'locked' && <Lock size={8} className="text-red-500" />}
                      </td>
                      <td className="p-1 uppercase">{file.type}</td>
                      <td className="p-1 text-right">{file.type === 'folder' ? '' : formatSize(file.size)}</td>
                      <td className="p-1">{file.modifiedAt || file.createdAt}</td>
                      <td className="p-1">{file.permissions || 'rw'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Status Bar */}
        <div className="bg-[#c0c0c0] border-t border-gray-400 px-2 py-0.5 flex justify-between text-[10px]">
          <span>{visibleFiles.length} object(s) {selectedFiles.size > 0 ? `(${selectedFiles.size} selected)` : ''}</span>
          {clipboard && <span>📋 {clipboard.action}: {clipboard.file.name}</span>}
          <span className="border-l border-gray-400 pl-2">My Computer</span>
        </div>

        {/* Properties Dialog */}
        {showProperties && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100]" onClick={() => setShowProperties(null)}>
            <div className="win95-window w-72" onClick={e => e.stopPropagation()}>
              <div className="win95-titlebar h-6 flex items-center justify-between px-2">
                <span className="text-[10px]">{showProperties.name} Properties</span>
                <button onClick={() => setShowProperties(null)} className="window-control window-control-close win95-button w-4 h-4 flex items-center justify-center">
                  <span className="text-[8px]">X</span>
                </button>
              </div>
              <div className="p-3 bg-[#c0c0c0] text-[10px] font-sans flex flex-col gap-2">
                <div className="flex items-center gap-3 border-b border-gray-400 pb-2">
                  {getIcon(showProperties.type, 32)}
                  <div>
                    <div className="font-bold text-sm">{showProperties.name}</div>
                    <div className="text-gray-500">Type: {showProperties.type.toUpperCase()} File</div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-1">
                  <span className="font-bold">Location:</span><span>{showProperties.path}</span>
                  <span className="font-bold">Size:</span><span>{formatSize(showProperties.size || 0)}</span>
                  <span className="font-bold">Created:</span><span>{showProperties.createdAt}</span>
                  <span className="font-bold">Modified:</span><span>{showProperties.modifiedAt || 'N/A'}</span>
                  <span className="font-bold">Permissions:</span><span>{showProperties.permissions || 'readwrite'}</span>
                  <span className="font-bold">Hidden:</span><span>{showProperties.hidden ? 'Yes' : 'No'}</span>
                  <span className="font-bold">System:</span><span>{showProperties.isSystem ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-end gap-1 mt-2">
                  <button className="win95-button px-3 py-0.5" onClick={() => setShowProperties(null)}>OK</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
};

export default FileExplorer;
