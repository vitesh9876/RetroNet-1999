import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type FileItemType = 'folder' | 'txt' | 'exe' | 'mp3' | 'zip' | 'bmp' | 'html' | 'bat' | 'sys' | 'dll' | 'ini' | 'log';

export interface FileItem {
  id: string;
  name: string;
  type: FileItemType;
  content?: string;
  path: string;
  createdAt: string;
  modifiedAt?: string;
  size?: number;
  permissions?: 'read' | 'readwrite' | 'locked';
  hidden?: boolean;
  isSystem?: boolean;
}

export interface RecycleBinItem {
  file: FileItem;
  deletedAt: string;
  originalPath: string;
}

export interface ClipboardItem {
  file: FileItem;
  action: 'copy' | 'cut';
}

interface FileSystemState {
  files: FileItem[];
  recycleBin: RecycleBinItem[];
  clipboard: ClipboardItem | null;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  getFilesAtPath: (path: string) => FileItem[];
  saveTextFile: (name: string, content: string, path?: string) => FileItem;
  saveFile: (name: string, content: string, type: FileItemType, path?: string) => FileItem;
  deleteFile: (id: string) => void;
  permanentDelete: (id: string) => void;
  renameFile: (id: string, name: string) => void;
  makeFolder: (name: string, path?: string) => FileItem;
  readTextFile: (name: string, path?: string) => string | null;
  getFileById: (id: string) => FileItem | undefined;
  moveFile: (id: string, newPath: string) => void;
  copyFile: (id: string, newPath: string) => FileItem;
  setClipboard: (item: ClipboardItem | null) => void;
  pasteClipboard: (targetPath: string) => void;
  restoreFromBin: (id: string) => void;
  emptyRecycleBin: () => void;
  setFilePermission: (id: string, perm: FileItem['permissions']) => void;
  toggleHidden: (id: string) => void;
  getAllPaths: () => string[];
  findFiles: (query: string) => FileItem[];
  getFileTree: (rootPath?: string) => { path: string; name: string; hasChildren: boolean }[];
}

const STORAGE_KEY = 'retronet1999:file-system';
const BIN_KEY = 'retronet1999:recycle-bin';
const ROOT_PATH = 'C:\\Documents';

const defaultFiles: FileItem[] = [
  { id: 'folder-pictures', name: 'My Pictures', type: 'folder', path: ROOT_PATH, createdAt: '1999-05-13 22:00', permissions: 'readwrite' },
  { id: 'folder-games', name: 'Games', type: 'folder', path: ROOT_PATH, createdAt: '1999-04-01 10:00', permissions: 'readwrite' },
  { id: 'folder-system', name: 'System', type: 'folder', path: 'C:\\', createdAt: '1999-01-01 00:00', permissions: 'locked', isSystem: true },
  { id: 'folder-programs', name: 'Program Files', type: 'folder', path: 'C:\\', createdAt: '1999-01-01 00:00', permissions: 'readwrite' },
  { id: 'folder-downloads', name: 'Downloads', type: 'folder', path: ROOT_PATH, createdAt: '1999-05-13 22:00', permissions: 'readwrite' },
  { id: 'folder-secret', name: '.secret', type: 'folder', path: ROOT_PATH, createdAt: '1999-03-15 03:00', permissions: 'locked', hidden: true },
  { id: 'txt-passwords', name: 'Passwords.txt', type: 'txt', path: ROOT_PATH, content: 'Bank: 1234\nEmail: retro_user_99\n\n--- ADMIN ACCESS ---\nThe admin password is: RETROKING99\nDo NOT share this with anyone!', createdAt: '1999-05-13 22:02', size: 128, permissions: 'readwrite' },
  { id: 'txt-readme', name: 'README.txt', type: 'txt', path: ROOT_PATH, content: 'Welcome to RetroNet OS.\nTry DIR, TYPE README.txt, MKDIR GAMES, ECHO hello > note.txt, and OPEN FREE_MONEY.exe.\n\n=== MISSION BRIEFING ===\nAgent, your objectives:\n1. Find the admin password hidden in a text file\n2. Repair the modem connection (check System folder)\n3. Recover the lost email backup\n4. Install the secret software from the CD-ROM\n5. Defeat the LOVE-LETTER virus\n\nGood luck, Agent.', createdAt: '1999-05-13 22:03', size: 312, permissions: 'readwrite' },
  { id: 'exe-free-money', name: 'FREE_MONEY.exe', type: 'exe', path: ROOT_PATH, createdAt: '1999-05-13 22:04', size: 42069, permissions: 'readwrite' },
  { id: 'mp3-dialup', name: 'DialUp_Sound.mp3', type: 'mp3', path: ROOT_PATH, createdAt: '1999-05-13 22:05', size: 1024000, permissions: 'readwrite' },
  { id: 'txt-todo', name: 'TODO.txt', type: 'txt', path: ROOT_PATH, content: '- Fix the modem\n- Check email\n- Install WinZip\n- Defragment hard drive\n- Update virus definitions', createdAt: '1999-06-01 14:30', size: 96, permissions: 'readwrite' },
  { id: 'bat-autoexec', name: 'AUTOEXEC.BAT', type: 'bat', path: 'C:\\', content: '@ECHO OFF\nPATH C:\\DOS;C:\\WINDOWS\nSET BLASTER=A220 I5 D1\nLH C:\\MOUSE\\MOUSE.COM\nSET RETRONET=ACTIVE', createdAt: '1999-01-01 00:00', size: 128, permissions: 'read', isSystem: true },
  { id: 'ini-config', name: 'CONFIG.SYS', type: 'ini', path: 'C:\\', content: 'DEVICE=C:\\DOS\\HIMEM.SYS\nDEVICE=C:\\DOS\\EMM386.EXE NOEMS\nDOS=HIGH,UMB\nFILES=40\nBUFFERS=20', createdAt: '1999-01-01 00:00', size: 96, permissions: 'read', isSystem: true },
  { id: 'sys-modem', name: 'MODEM.SYS', type: 'sys', path: 'C:\\System', content: 'STATUS=DISCONNECTED\nBAUD=56000\nCOM_PORT=COM2\nINIT_STRING=ATZ\nERROR=DRIVER_CORRUPTED\n\n;; To repair: change ERROR to NONE', createdAt: '1999-01-01 00:00', size: 256, permissions: 'readwrite', isSystem: true },
  { id: 'log-system', name: 'SYSTEM.LOG', type: 'log', path: 'C:\\System', content: '[1999-01-01] System initialized\n[1999-03-15] Warning: Disk space low\n[1999-04-22] Modem driver corrupted\n[1999-05-01] Virus signature database outdated\n[1999-05-13] User profile created: retro_user_99', createdAt: '1999-05-13 22:00', size: 512, permissions: 'read', isSystem: true },
  { id: 'txt-secret-key', name: 'access_codes.txt', type: 'txt', path: 'C:\\Documents\\.secret', content: 'LEVEL 1: OPEN_SESAME\nLEVEL 2: BACK_DOOR\nLEVEL 3: ROOT_ACCESS\n\nMaster Key: RETROKING99', createdAt: '1999-03-15 03:00', size: 64, permissions: 'locked', hidden: true },
  { id: 'txt-email-backup', name: 'email_backup.txt', type: 'txt', path: 'C:\\Documents\\Downloads', content: 'From: boss@retronet.com\nTo: retro_user_99@retronet.com\nSubject: URGENT - Server Credentials\n\nThe server credentials are:\nUsername: admin\nPassword: RETROKING99\n\nDo not lose this email!', createdAt: '1999-04-10 09:00', size: 256, permissions: 'readwrite' },
  { id: 'html-homepage', name: 'my_homepage.html', type: 'html', path: ROOT_PATH, content: '<html><body bgcolor="#000080"><font color="lime"><h1>My Cool Homepage</h1><marquee>Under Construction!</marquee></font></body></html>', createdAt: '1999-06-15 20:00', size: 512, permissions: 'readwrite' },
];

const FileSystemContext = createContext<FileSystemState | undefined>(undefined);

const normalizeFileName = (name: string, fallback = 'Untitled.txt') => {
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  return trimmed.includes('.') ? trimmed : `${trimmed}.txt`;
};

const computeSize = (content?: string) => content ? new Blob([content]).size : 0;

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(ROOT_PATH);
  const [files, setFiles] = useState<FileItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as FileItem[] : defaultFiles;
    } catch {
      return defaultFiles;
    }
  });
  const [recycleBin, setRecycleBin] = useState<RecycleBinItem[]>(() => {
    try {
      const saved = localStorage.getItem(BIN_KEY);
      return saved ? JSON.parse(saved) as RecycleBinItem[] : [];
    } catch {
      return [];
    }
  });
  const [clipboard, setClipboard] = useState<ClipboardItem | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(BIN_KEY, JSON.stringify(recycleBin));
  }, [recycleBin]);

  const api = useMemo<FileSystemState>(() => {
    const getFilesAtPath = (path: string) => files.filter(file => file.path === path);

    const getFileById = (id: string) => files.find(f => f.id === id);

    const saveFile = (name: string, content: string, type: FileItemType, path = ROOT_PATH) => {
      const fileName = type === 'txt' ? normalizeFileName(name) : (name.trim() || `Untitled.${type}`);
      const now = new Date().toLocaleString();
      const existing = files.find(file => file.path === path && file.name.toLowerCase() === fileName.toLowerCase());
      const savedFile: FileItem = {
        id: existing?.id ?? `file-${Date.now()}`,
        name: fileName,
        type,
        content,
        path,
        createdAt: existing?.createdAt ?? now,
        modifiedAt: now,
        size: computeSize(content),
        permissions: existing?.permissions ?? 'readwrite',
      };

      setFiles(prev => existing
        ? prev.map(file => file.id === existing.id ? savedFile : file)
        : [...prev, savedFile]
      );
      return savedFile;
    };

    const saveTextFile = (name: string, content: string, path = ROOT_PATH) => saveFile(name, content, 'txt', path);

    const deleteFile = (id: string) => {
      const file = files.find(f => f.id === id);
      if (!file) return;
      setRecycleBin(prev => [...prev, {
        file,
        deletedAt: new Date().toLocaleString(),
        originalPath: file.path,
      }]);
      setFiles(prev => prev.filter(f => f.id !== id));
    };

    const permanentDelete = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
    };

    const renameFile = (id: string, name: string) => {
      setFiles(prev => prev.map(file => file.id === id ? { ...file, name: name.trim() || file.name, modifiedAt: new Date().toLocaleString() } : file));
    };

    const makeFolder = (name: string, path = ROOT_PATH) => {
      const folderName = name.trim() || 'New Folder';
      const folder: FileItem = {
        id: `folder-${Date.now()}`,
        name: folderName,
        type: 'folder',
        path,
        createdAt: new Date().toLocaleString(),
        permissions: 'readwrite',
      };
      setFiles(prev => [...prev, folder]);
      return folder;
    };

    const readTextFile = (name: string, path = ROOT_PATH) => {
      const target = files.find(file => file.path === path && file.name.toLowerCase() === name.toLowerCase() && (file.type === 'txt' || file.type === 'bat' || file.type === 'ini' || file.type === 'log' || file.type === 'html' || file.type === 'sys'));
      return target?.content ?? null;
    };

    const moveFile = (id: string, newPath: string) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, path: newPath, modifiedAt: new Date().toLocaleString() } : f));
    };

    const copyFile = (id: string, newPath: string) => {
      const original = files.find(f => f.id === id);
      if (!original) return original as any;
      const newFile: FileItem = {
        ...original,
        id: `file-${Date.now()}`,
        path: newPath,
        name: original.name,
        createdAt: new Date().toLocaleString(),
      };
      setFiles(prev => [...prev, newFile]);
      return newFile;
    };

    const pasteClipboard = (targetPath: string) => {
      if (!clipboard) return;
      if (clipboard.action === 'copy') {
        copyFile(clipboard.file.id, targetPath);
      } else {
        moveFile(clipboard.file.id, targetPath);
        setClipboard(null);
      }
    };

    const restoreFromBin = (id: string) => {
      const item = recycleBin.find(r => r.file.id === id);
      if (!item) return;
      setFiles(prev => [...prev, { ...item.file, path: item.originalPath }]);
      setRecycleBin(prev => prev.filter(r => r.file.id !== id));
    };

    const emptyRecycleBin = () => {
      setRecycleBin([]);
    };

    const setFilePermission = (id: string, perm: FileItem['permissions']) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, permissions: perm } : f));
    };

    const toggleHidden = (id: string) => {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, hidden: !f.hidden } : f));
    };

    const getAllPaths = () => {
      const paths = new Set<string>();
      paths.add('C:\\');
      paths.add(ROOT_PATH);
      files.forEach(f => {
        paths.add(f.path);
        if (f.type === 'folder') {
          paths.add(`${f.path}\\${f.name}`);
        }
      });
      return Array.from(paths).sort();
    };

    const findFiles = (query: string) => {
      const q = query.toLowerCase();
      return files.filter(f => f.name.toLowerCase().includes(q) || f.content?.toLowerCase().includes(q));
    };

    const getFileTree = () => {
      const folders = files.filter(f => f.type === 'folder');
      const tree: { path: string; name: string; hasChildren: boolean }[] = [];
      
      const addLevel = (parentPath: string) => {
        const children = folders.filter(f => f.path === parentPath);
        children.forEach(f => {
          const fullPath = `${parentPath}\\${f.name}`;
          const hasKids = folders.some(c => c.path === fullPath);
          tree.push({ path: fullPath, name: f.name, hasChildren: hasKids });
        });
      };

      tree.push({ path: 'C:\\', name: 'C:', hasChildren: true });
      tree.push({ path: ROOT_PATH, name: 'Documents', hasChildren: true });
      addLevel('C:\\');
      addLevel(ROOT_PATH);
      
      // Go one more level deep
      folders.forEach(f => {
        const fullPath = `${f.path}\\${f.name}`;
        addLevel(fullPath);
      });

      return tree;
    };

    return {
      files,
      recycleBin,
      clipboard,
      currentPath,
      setCurrentPath,
      getFilesAtPath,
      saveTextFile,
      saveFile,
      deleteFile,
      permanentDelete,
      renameFile,
      makeFolder,
      readTextFile,
      getFileById,
      moveFile,
      copyFile,
      setClipboard,
      pasteClipboard,
      restoreFromBin,
      emptyRecycleBin,
      setFilePermission,
      toggleHidden,
      getAllPaths,
      findFiles,
      getFileTree,
    };
  }, [currentPath, files, recycleBin, clipboard]);

  return (
    <FileSystemContext.Provider value={api}>
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used within FileSystemProvider');
  return context;
};
