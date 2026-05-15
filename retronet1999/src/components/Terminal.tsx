import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';
import { Terminal as TerminalIcon } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

interface TerminalProps extends CommonWindowProps {
  onTriggerVirus?: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onTriggerVirus, ...props }) => {
  const [history, setHistory] = useState<string[]>(['RetroNet OS [Version 4.10.1999]', '(C) Copyright Retro Corp 1985-1999.', '', 'Type HELP for available commands.', '']);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentPath, setCurrentPath, getFilesAtPath, readTextFile, saveTextFile, makeFolder, deleteFile, files, renameFile, moveFile, copyFile } = useFileSystem();
  const { completeMission, triggerBSOD, setAdminMode, isAdminMode, discoverEasterEgg, virusActive, setVirusActive, setTheme, missions } = useSystem();

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const addLines = (...lines: string[]) => setHistory(prev => [...prev, ...lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    setCmdHistory(prev => [...prev, raw]);
    setCmdIndex(-1);

    const out: string[] = [`${currentPath}> ${raw}`];

    if (cmd === 'help') {
      out.push('Commands: HELP, DIR, CD, TYPE, ECHO, DEL, MKDIR, COPY, MOVE, RENAME,');
      out.push('  OPEN, CLS, VER, WHOAMI, PING, TREE, TASKLIST, DATE, TIME,');
      out.push('  CHKDSK, FORMAT, SCAN, ADMIN, MISSION, EASTER, BSOD, SHUTDOWN');
    } else if (cmd === 'dir') {
      out.push(' Volume in drive C has no label.', ' Volume Serial Number is 1999-0513', '');
      const items = getFilesAtPath(currentPath);
      items.forEach(f => {
        const marker = f.type === 'folder' ? '<DIR>' : `${(f.size || f.content?.length || 0).toString().padStart(8)}`;
        out.push(` ${(f.modifiedAt || f.createdAt).padEnd(22)} ${marker.padEnd(12)} ${f.name}${f.hidden ? ' [H]' : ''}${f.permissions === 'locked' ? ' [L]' : ''}`);
      });
      out.push('', `  ${items.length} file(s)`);
    } else if (cmd.startsWith('cd ')) {
      const target = raw.slice(3).trim();
      if (target === '..' || target === '\\') { setCurrentPath('C:\\Documents'); out.push(''); }
      else if (target === '\\' || target === 'c:\\') { setCurrentPath('C:\\'); out.push(''); }
      else {
        const folder = getFilesAtPath(currentPath).find(f => f.type === 'folder' && f.name.toLowerCase() === target.toLowerCase());
        if (folder) { setCurrentPath(`${folder.path}\\${folder.name}`); out.push(''); }
        else out.push('The system cannot find the path specified.');
      }
    } else if (cmd.startsWith('type ')) {
      const content = readTextFile(raw.slice(5).trim(), currentPath);
      out.push(content ?? 'The system cannot find the file specified.');
    } else if (cmd.startsWith('echo ') && cmd.includes('>')) {
      const [text, fileName] = raw.slice(5).split('>').map(s => s.trim());
      saveTextFile(fileName || 'echo.txt', text, currentPath);
      out.push(`Wrote to file.`);
    } else if (cmd.startsWith('mkdir ')) {
      makeFolder(raw.slice(6).trim(), currentPath);
      out.push(`Created folder.`);
    } else if (cmd.startsWith('del ')) {
      const name = raw.slice(4).trim();
      const target = files.find(f => f.path === currentPath && f.name.toLowerCase() === name.toLowerCase());
      if (target) { deleteFile(target.id); out.push(`Deleted ${target.name}`); }
      else out.push('Could Not Find ' + name);
    } else if (cmd.startsWith('copy ')) {
      const parts = raw.slice(5).trim().split(/\s+/);
      if (parts.length >= 2) {
        const src = files.find(f => f.path === currentPath && f.name.toLowerCase() === parts[0].toLowerCase());
        if (src) { copyFile(src.id, parts[1]); out.push(`1 file(s) copied.`); }
        else out.push('File not found: ' + parts[0]);
      } else out.push('Usage: COPY <source> <dest_path>');
    } else if (cmd.startsWith('move ')) {
      const parts = raw.slice(5).trim().split(/\s+/);
      if (parts.length >= 2) {
        const src = files.find(f => f.path === currentPath && f.name.toLowerCase() === parts[0].toLowerCase());
        if (src) { moveFile(src.id, parts[1]); out.push(`1 file(s) moved.`); }
        else out.push('File not found: ' + parts[0]);
      } else out.push('Usage: MOVE <source> <dest_path>');
    } else if (cmd.startsWith('rename ') || cmd.startsWith('ren ')) {
      const parts = raw.slice(cmd.startsWith('rename') ? 7 : 4).trim().split(/\s+/);
      if (parts.length >= 2) {
        const src = files.find(f => f.path === currentPath && f.name.toLowerCase() === parts[0].toLowerCase());
        if (src) { renameFile(src.id, parts.slice(1).join(' ')); out.push(`Renamed successfully.`); }
        else out.push('File not found.');
      } else out.push('Usage: RENAME <old_name> <new_name>');
    } else if (cmd.startsWith('open ')) {
      const name = raw.slice(5).trim();
      const target = files.find(f => f.path === currentPath && f.name.toLowerCase() === name.toLowerCase());
      if (target?.type === 'exe') { onTriggerVirus?.(); out.push('Executing... WARNING: Suspicious activity detected!'); }
      else out.push(target ? `Opened ${target.name}` : 'File not found.');
    } else if (cmd.startsWith('ping ')) {
      const host = raw.slice(5).trim() || 'retronet.local';
      out.push(`Pinging ${host} with 32 bytes of data:`);
      for (let i = 0; i < 4; i++) out.push(`Reply from 10.0.0.99: bytes=32 time=${180 + Math.floor(Math.random() * 40)}ms TTL=42`);
      out.push('', `Ping statistics for ${host}:`, '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)');
    } else if (cmd === 'tree') {
      out.push('Folder PATH listing');
      const buildTree = (path: string, prefix: string) => {
        const folders = files.filter(f => f.path === path && f.type === 'folder');
        folders.forEach((f, i) => {
          const isLast = i === folders.length - 1;
          out.push(`${prefix}${isLast ? '└──' : '├──'} ${f.name}`);
          buildTree(`${path}\\${f.name}`, `${prefix}${isLast ? '    ' : '│   '}`);
        });
      };
      out.push('C:\\');
      buildTree('C:\\', '');
    } else if (cmd === 'tasklist') {
      out.push('Image Name                     PID Session Name     Mem Usage');
      out.push('========================= ======== ================ =========');
      const tasks = [
        ['System Idle Process', '0', 'Console', '16 K'], ['System', '4', 'Console', '236 K'],
        ['retroshell.exe', '420', 'Console', '4,096 K'], ['explorer.exe', '1337', 'Console', '12,288 K'],
        ['dialup.exe', '666', 'Console', '2,048 K'], ['winamp.exe', '1999', 'Console', '8,192 K'],
        ['iexplore.exe', '2600', 'Console', '16,384 K'], ['virus_scan.exe', '31337', 'Console', '1,024 K'],
      ];
      tasks.forEach(t => out.push(`${t[0].padEnd(26)} ${t[1].padStart(8)} ${t[2].padEnd(17)} ${t[3].padStart(9)}`));
    } else if (cmd === 'cls') { setHistory([]); setInput(''); return; }
    else if (cmd === 'whoami') out.push(isAdminMode ? 'RETRONET\\Administrator' : 'RETRONET\\retro_user_99');
    else if (cmd === 'ver') out.push('RetroNet OS [Version 4.10.1999]');
    else if (cmd === 'date') out.push(`The current date is: ${new Date().toLocaleDateString()}`);
    else if (cmd === 'time') out.push(`The current time is: ${new Date().toLocaleTimeString()}`);
    else if (cmd === 'chkdsk') {
      out.push('Checking drive C:...', 'CHKDSK is verifying files...', '  42069 files processed.', '', 'Windows found problems with the filesystem.', 'Run CHKDSK /F to fix errors.', '');
      if (cmd.includes('/f')) { out.push('Fixing errors...', 'All errors fixed.'); completeMission('repairModem'); }
    } else if (cmd === 'scan' || cmd === 'antivirus') {
      out.push('RetroNet AntiVirus Scanner v1.0', 'Scanning...', '  C:\\Documents... OK', '  C:\\System... OK', '  C:\\Program Files... OK');
      if (virusActive) { out.push('', '⚠ THREAT DETECTED: LOVE-LETTER.VBS', 'Quarantining...', 'Threat removed successfully!'); setVirusActive(false); completeMission('defeatVirus'); }
      else out.push('', 'No threats found. System clean.');
    } else if (cmd.startsWith('admin ')) {
      const pass = raw.slice(6).trim();
      if (pass === 'RETROKING99') { setAdminMode(true); completeMission('findAdminPassword'); out.push('*** ADMIN MODE ACTIVATED ***', 'You now have full system access.'); }
      else out.push('Access denied. Invalid admin password.');
    } else if (cmd === 'mission' || cmd === 'missions') {
      out.push('=== MISSION STATUS ===');
      const labels: Record<string, string> = { findAdminPassword: 'Find Admin Password', repairModem: 'Repair Modem', recoverEmail: 'Recover Email', installSoftware: 'Install Software', defeatVirus: 'Defeat Virus' };
      Object.entries(labels).forEach(([k, v]) => out.push(`  [${(missions as any)?.[k] ? 'X' : ' '}] ${v}`));
      out.push('', 'Hint: Read README.txt for mission briefing.');
    } else if (cmd === 'format c:') {
      out.push('WARNING: ALL DATA ON DRIVE C: WILL BE LOST!', 'Just kidding. This is a simulation. 😄');
      discoverEasterEgg('format_c');
    } else if (cmd === 'bsod') {
      triggerBSOD();
      return;
    } else if (cmd === 'shutdown') {
      out.push('Initiating shutdown sequence...');
      setTimeout(() => window.location.reload(), 2000);
    } else if (cmd === 'color matrix' || cmd === 'matrix') {
      setTheme('matrix');
      discoverEasterEgg('matrix_terminal');
      out.push('> Follow the white rabbit...');
    } else if (cmd === 'hello' || cmd === 'hi') {
      out.push('Hello, user! Welcome to RetroNet OS.');
      discoverEasterEgg('friendly_terminal');
    } else if (cmd === 'exit') {
      props.onClose?.();
      return;
    } else {
      out.push(`'${cmd}' is not recognized as an internal or external command,`, 'operable program or batch file.');
    }

    out.push('');
    addLines(...out);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = cmdIndex < cmdHistory.length - 1 ? cmdIndex + 1 : cmdIndex;
      setCmdIndex(newIdx);
      setInput(cmdHistory[cmdHistory.length - 1 - newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = cmdIndex > 0 ? cmdIndex - 1 : -1;
      setCmdIndex(newIdx);
      setInput(newIdx >= 0 ? cmdHistory[cmdHistory.length - 1 - newIdx] : '');
    }
  };

  return (
    <Window title="MS-DOS Prompt" icon={<TerminalIcon size={14} />} width={600} height={380} {...props}>
      <div ref={scrollRef} className="bg-black text-lime-400 font-mono text-xs p-2 h-full overflow-auto flex flex-col" onClick={() => document.getElementById('term-input')?.focus()}>
        {history.map((line, i) => (<div key={i} className="min-h-[1.2em] whitespace-pre-wrap">{line}</div>))}
        <form onSubmit={handleCommand} className="flex">
          <span className="shrink-0">{currentPath}&gt;&nbsp;</span>
          <input id="term-input" autoFocus className="bg-transparent border-none outline-none flex-1 text-lime-400 font-mono" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} autoComplete="off" spellCheck={false} />
        </form>
      </div>
    </Window>
  );
};

export default Terminal;
