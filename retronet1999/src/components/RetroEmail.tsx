import { useEffect, useState } from 'react';
import Window from './Window';
import { Mail, Inbox, Send, Trash2, Edit3, User, Reply, Paperclip, Download, RefreshCcw } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useSystem } from '../contexts/SystemContext';

interface Email {
  id: number;
  from: string;
  to?: string;
  subject: string;
  date: string;
  body: string;
  read: boolean;
  folder: 'inbox' | 'sent' | 'deleted';
  hasAttachment?: boolean;
  attachmentName?: string;
}

const STORAGE_KEY = 'retronet1999:email';

const seedEmails: Email[] = [
  {
    id: 1,
    from: 'System Administrator',
    subject: 'Welcome to RetroNet!',
    date: '05/13/1999',
    body: 'Welcome to the future of communication. Your account is now active.\n\nYour temporary password for the admin terminal is "RETROKING99". Please change it immediately.\n\nEnjoy your stay!',
    read: true,
    folder: 'inbox',
  },
  {
    id: 2,
    from: 'CoolHacker99',
    subject: 'Check this out!',
    date: '05/14/1999',
    body: 'I found a way to bypass the CRT filter logic... meet me in the messenger later. - CH99\n\nAlso, I attached that background you wanted.',
    read: false,
    folder: 'inbox',
    hasAttachment: true,
    attachmentName: 'matrix_bg.jpg'
  },
  {
    id: 3,
    from: 'HotDeals@DiscountWeb.com',
    subject: '!!! WIN A FREE PC !!!',
    date: '05/14/1999',
    body: 'You have been selected as our 1,000,000th visitor! Click the link to claim your Pentium III processor!\n\nJust download the attached claim form and run it!',
    read: false,
    folder: 'inbox',
    hasAttachment: true,
    attachmentName: 'FREE_MONEY.exe'
  },
];

const RetroEmail: React.FC<CommonWindowProps> = (props) => {
  const { addNotification, completeMission } = useSystem();
  const [emails, setEmails] = useState<Email[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? seedEmails;
    } catch {
      return seedEmails;
    }
  });
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'deleted'>('inbox');
  const [isComposing, setIsComposing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [draft, setDraft] = useState({ to: 'friend@retronet.local', subject: '', body: '' });
  const selectedEmail = emails.find(e => e.id === selectedId);
  const visibleEmails = emails.filter(email => email.folder === folder);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
  }, [emails]);

  const markRead = (id: number) => {
    setEmails(prev => prev.map(email => email.id === id ? { ...email, read: true } : email));
    setSelectedId(id);
    setIsComposing(false);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setEmails(prev => prev.map(email => email.id === selectedId ? { ...email, folder: 'deleted' } : email));
    setSelectedId(null);
  };

  const sendDraft = () => {
    if (!draft.subject.trim() && !draft.body.trim()) return;
    const sent: Email = {
      id: Date.now(),
      from: 'retro_user_99@retronet.local',
      to: draft.to,
      subject: draft.subject || '(no subject)',
      date: new Date().toLocaleDateString(),
      body: draft.body,
      read: true,
      folder: 'sent',
    };
    setEmails(prev => [sent, ...prev]);
    setDraft({ to: 'friend@retronet.local', subject: '', body: '' });
    setFolder('sent');
    setSelectedId(sent.id);
    setIsComposing(false);
    addNotification({ title: 'Email Sent', message: `Message to ${sent.to} sent successfully.`, type: 'success' });
    completeMission('recoverEmail');
  };

  const checkMail = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const incoming: Email = {
        id: Date.now(),
        from: 'newsletter@retronet.local',
        subject: `Daily Digest - ${new Date().toLocaleDateString()}`,
        date: new Date().toLocaleDateString(),
        body: 'Today on RetroNet: new shareware mirrors, animated GIF awards, and a guide to safer downloads.\n\nKeep your AntiVirus updated! The LOVE-LETTER virus is real!',
        read: false,
        folder: 'inbox',
      };
      setEmails(prev => [incoming, ...prev]);
      addNotification({ title: 'New Mail', message: 'You have received 1 new message.', type: 'info' });
    }, 2000);
  };

  const reply = () => {
    if (!selectedEmail) return;
    setDraft({
      to: selectedEmail.from,
      subject: `RE: ${selectedEmail.subject}`,
      body: `\n\n---- Original Message ----\n${selectedEmail.body}`,
    });
    setIsComposing(true);
  };

  return (
    <Window title="Retro Outlook Express" icon={<Mail size={14} />} width={740} height={520} {...props}>
      <div className="flex flex-col h-full bg-[#c0c0c0] font-sans text-xs">
        {/* Toolbar */}
        <div className="flex gap-1 p-1 border-b border-gray-400 bg-[#c0c0c0]">
          <button className="win95-button flex flex-col items-center px-4 py-1 gap-1 min-w-[70px]" onClick={() => setIsComposing(true)}>
            <Edit3 size={18} /> <span>Compose</span>
          </button>
          <button className="win95-button flex flex-col items-center px-4 py-1 gap-1 min-w-[70px]" onClick={checkMail} disabled={isChecking}>
            <RefreshCcw size={18} className={isChecking ? 'animate-spin' : ''} /> <span>{isChecking ? 'Checking...' : 'Send/Recv'}</span>
          </button>
          <div className="border-r border-gray-400 h-10 mx-1" />
          <button className="win95-button flex flex-col items-center px-4 py-1 gap-1 min-w-[70px]" onClick={reply} disabled={!selectedEmail}>
            <Reply size={18} /> <span>Reply</span>
          </button>
          <button className="win95-button flex flex-col items-center px-4 py-1 gap-1 min-w-[70px]" onClick={deleteSelected} disabled={!selectedId}>
            <Trash2 size={18} /> <span>Delete</span>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Folders */}
          <div className="w-44 border-r border-gray-400 bg-white p-1">
            <div className="font-bold p-1 bg-[#000080] text-white flex items-center gap-2 mb-1">
              <Mail size={12} /> Folders
            </div>
            {(['inbox', 'sent', 'deleted'] as const).map((item) => (
              <button
                key={item}
                className={`flex items-center gap-2 p-1 w-full text-left capitalize ${folder === item ? 'bg-[#000080] text-white' : 'hover:bg-blue-100'}`}
                onClick={() => {
                  setFolder(item);
                  setSelectedId(null);
                  setIsComposing(false);
                }}
              >
                {item === 'inbox' ? <Inbox size={14} /> : item === 'sent' ? <Send size={14} /> : <Trash2 size={14} />}
                <span className="flex-1">{item}</span>
                <span className="text-[10px] opacity-60">{emails.filter(e => e.folder === item && !e.read).length || ''}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mail List */}
            <div className="h-1/3 border-b border-gray-400 overflow-auto bg-white">
              <table className="w-full border-collapse text-[11px]">
                <thead className="bg-[#c0c0c0] sticky top-0 z-10">
                  <tr className="text-left">
                    <th className="border-r border-gray-100 px-1 font-normal w-6">!</th>
                    <th className="border-r border-gray-100 px-1 font-normal w-6"><Paperclip size={10} /></th>
                    <th className="border-r border-gray-100 px-2 font-normal w-40">From</th>
                    <th className="border-r border-gray-100 px-2 font-normal">Subject</th>
                    <th className="px-2 font-normal w-24">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleEmails.map(email => (
                    <tr
                      key={email.id}
                      onClick={() => markRead(email.id)}
                      className={`cursor-default border-b border-gray-50 h-6 ${selectedId === email.id ? 'bg-[#000080] text-white' : 'hover:bg-blue-100'} ${!email.read ? 'font-bold' : ''}`}
                    >
                      <td className="px-1 text-center">{!email.read ? '●' : ''}</td>
                      <td className="px-1 text-center">{email.hasAttachment ? <Paperclip size={10} /> : ''}</td>
                      <td className="px-2 truncate">{email.from}</td>
                      <td className="px-2 truncate">{email.subject}</td>
                      <td className="px-2">{email.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-0 bg-white flex flex-col overflow-hidden relative">
              {isComposing ? (
                <div className="flex flex-col gap-1 p-4 h-full bg-[#c0c0c0]">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-gray-600">To:</span>
                    <input className="win95-window shadow-inner bg-white h-5 px-1 flex-1 outline-none" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-gray-600">Subject:</span>
                    <input className="win95-window shadow-inner bg-white h-5 px-1 flex-1 outline-none" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />
                  </div>
                  <div className="border-b border-gray-400 my-1" />
                  <textarea className="win95-window shadow-inner bg-white p-2 flex-1 resize-none outline-none font-mono text-xs" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} autoFocus />
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="win95-button px-6 py-1 font-bold" onClick={sendDraft}>Send</button>
                    <button className="win95-button px-6 py-1" onClick={() => setIsComposing(false)}>Cancel</button>
                  </div>
                </div>
              ) : selectedEmail ? (
                <div className="flex flex-col h-full overflow-auto">
                  <div className="bg-[#e0e0e0] p-3 flex flex-col gap-1 border-b border-gray-300">
                    <div className="flex gap-2 text-sm font-bold">{selectedEmail.subject}</div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 w-12">From:</span>
                      <span className="flex items-center gap-1"><User size={12} /> {selectedEmail.from}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600 w-12">Date:</span>
                      <span>{selectedEmail.date}</span>
                    </div>
                    {selectedEmail.hasAttachment && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Paperclip size={14} className="text-blue-600" />
                          <span>Attachment: <strong>{selectedEmail.attachmentName}</strong></span>
                        </div>
                        <button className="win95-button px-3 py-0.5 flex items-center gap-1 text-[10px]" onClick={() => addNotification({ title: 'Download', message: `Saved ${selectedEmail.attachmentName} to Downloads`, type: 'success' })}>
                          <Download size={10} /> Save
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-6 font-mono whitespace-pre-wrap leading-relaxed text-sm selection:bg-[#000080] selection:text-white">
                    {selectedEmail.body}
                    <div className="mt-10 pt-4 border-t border-gray-200 text-gray-400 text-[10px]">
                      -- <br />
                      RetroNet 1999 Mail System <br />
                      Sent from my Pentium III PC
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 italic flex-col gap-2">
                  <Mail size={48} className="opacity-20" />
                  Select a message to view its content
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Status Bar */}
        <div className="bg-[#c0c0c0] border-t border-gray-400 px-2 py-0.5 flex justify-between text-[10px]">
          <span>{visibleEmails.length} Message(s)</span>
          <span>Last checked: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </Window>
  );
};

export default RetroEmail;
