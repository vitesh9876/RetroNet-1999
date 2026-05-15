import React, { useState } from 'react';
import Window from './Window';
import { RotateCw, Save, Trash2 } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useSystem } from '../contexts/SystemContext';

const SystemRestore: React.FC<CommonWindowProps> = (props) => {
  const { snapshots, saveSnapshot, restoreSnapshot, deleteSnapshot } = useSystem();
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    if (!newName.trim()) return;
    saveSnapshot(newName.trim());
    setNewName('');
  };

  return (
    <Window title="System Restore" icon={<RotateCw size={14} />} width={450} height={380} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs p-3 gap-3">
        <div className="flex items-center gap-2 border-b border-gray-400 pb-2">
          <RotateCw size={24} className="text-blue-600" />
          <div>
            <div className="font-bold text-sm">System Restore</div>
            <div className="text-gray-600">Save and restore system states</div>
          </div>
        </div>

        {/* Create snapshot */}
        <div className="flex gap-2 items-center">
          <span className="font-bold">New Checkpoint:</span>
          <input className="win95-window shadow-inner bg-white px-1 h-5 flex-1 outline-none" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Enter description..." onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <button className="win95-button px-3 py-0.5 flex items-center gap-1" onClick={handleSave}><Save size={10} /> Save</button>
        </div>

        {/* Snapshots list */}
        <div className="flex-1 win95-window shadow-inner bg-white overflow-auto">
          {snapshots.length === 0 ? (
            <div className="p-4 text-center text-gray-500 italic">No restore points saved yet.</div>
          ) : (
            <table className="w-full text-[10px]">
              <thead className="bg-[#c0c0c0] sticky top-0">
                <tr><th className="p-1 text-left">Name</th><th className="p-1 text-left w-32">Date</th><th className="p-1 w-24">Actions</th></tr>
              </thead>
              <tbody>
                {snapshots.slice().reverse().map(snap => (
                  <tr key={snap.id} className="hover:bg-blue-50 border-b border-gray-100">
                    <td className="p-1 font-bold">{snap.name}</td>
                    <td className="p-1 text-gray-600">{snap.date}</td>
                    <td className="p-1 flex gap-1 justify-center">
                      <button className="win95-button px-1 py-0.5 text-[9px]" onClick={() => { if (confirm(`Restore to "${snap.name}"? Current state will be replaced.`)) restoreSnapshot(snap.id); }}>Restore</button>
                      <button className="win95-button px-1 py-0.5 text-[9px] hover:text-red-600" onClick={() => deleteSnapshot(snap.id)}><Trash2 size={8} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="text-[10px] text-gray-500">
          💡 Restore points save your files and settings. Restoring will reload the page.
        </div>
      </div>
    </Window>
  );
};

export default SystemRestore;
