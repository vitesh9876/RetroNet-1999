import React, { useState } from 'react';
import Window from './Window';
import { Database, Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { CommonWindowProps } from '../types';

const Regedit: React.FC<CommonWindowProps> = (props) => {
  const [selectedPath, _setSelectedPath] = useState('HKEY_LOCAL_MACHINE\\SOFTWARE\\RetroNet');
  
  const regData = [
    { name: '(Default)', type: 'REG_SZ', value: '(value not set)' },
    { name: 'SystemVersion', type: 'REG_SZ', value: '4.10.1999' },
    { name: 'RegisteredOwner', type: 'REG_SZ', value: 'Retro Enthusiast' },
    { name: 'AdminPassword', type: 'REG_SZ', value: 'RETROKING99' },
    { name: 'MinesweeperCheats', type: 'REG_DWORD', value: '0x00000001 (1)' },
    { name: 'TurboMode', type: 'REG_DWORD', value: '0x00000000 (0)' },
    { name: 'ThemeOverride', type: 'REG_SZ', value: 'classic' },
  ];

  return (
    <Window title="Registry Editor" icon={<Database size={14} />} width={550} height={400} {...props}>
      <div className="flex h-full bg-white font-sans overflow-hidden">
        {/* Tree View */}
        <div className="w-48 border-r border-gray-300 overflow-auto p-2 text-xs flex flex-col gap-1">
          <div className="flex items-center gap-1"><Database size={12} className="text-red-800" /> My Computer</div>
          <div className="ml-3 flex items-center gap-1"><ChevronDown size={12} /> <Folder size={12} className="text-yellow-600" /> HKEY_CLASSES_ROOT</div>
          <div className="ml-3 flex items-center gap-1"><ChevronDown size={12} /> <Folder size={12} className="text-yellow-600" /> HKEY_CURRENT_USER</div>
          <div className="ml-3 flex items-center gap-1"><ChevronDown size={12} /> <Folder size={12} className="text-yellow-600" /> HKEY_LOCAL_MACHINE</div>
          <div className="ml-6 flex items-center gap-1"><ChevronDown size={12} /> <Folder size={12} className="text-yellow-600" /> SOFTWARE</div>
          <div className="ml-9 flex items-center gap-1 bg-blue-800 text-white px-1"><Folder size={12} /> RetroNet</div>
          <div className="ml-3 flex items-center gap-1"><ChevronRight size={12} /> <Folder size={12} className="text-yellow-600" /> HKEY_USERS</div>
        </div>

        {/* Values View */}
        <div className="flex-1 flex flex-col">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-[#f0f0f0] border-b border-gray-300">
                <th className="text-left px-2 py-1 border-r border-gray-300 font-normal">Name</th>
                <th className="text-left px-2 py-1 border-r border-gray-300 font-normal">Type</th>
                <th className="text-left px-2 py-1 font-normal">Data</th>
              </tr>
            </thead>
            <tbody>
              {regData.map((row, i) => (
                <tr key={i} className="hover:bg-blue-100 cursor-default">
                  <td className="px-2 py-0.5 border-r border-gray-200 flex items-center gap-1"><FileText size={10} className="text-red-700" /> {row.name}</td>
                  <td className="px-2 py-0.5 border-r border-gray-200">{row.type}</td>
                  <td className="px-2 py-0.5 truncate max-w-[200px]">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex-1 bg-white" />
        </div>
      </div>
      <div className="win95-window h-5 px-2 text-[10px] flex items-center border-t border-gray-400">
        My Computer\{selectedPath}
      </div>
    </Window>
  );
};

export default Regedit;
