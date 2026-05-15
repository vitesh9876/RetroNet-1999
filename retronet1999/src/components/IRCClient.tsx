import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';
import { MessageSquare, Users } from 'lucide-react';
import { CommonWindowProps } from '../types';

interface Message {
  user: string;
  text: string;
  time: string;
  type?: 'system' | 'msg' | 'join';
}

const IRCClient: React.FC<CommonWindowProps> = (props) => {
  const [messages, setMessages] = useState<Message[]>([
    { user: 'System', text: '*** Connecting to Undernet Server...', time: '18:50', type: 'system' },
    { user: 'System', text: '*** Connected! Welcome to #retrochat', time: '18:51', type: 'join' },
    { user: 'RetroKing99', text: 'Anybody want to trade some Winamp skins?', time: '18:52', type: 'msg' },
    { user: 'NapsterLover', text: 'I just downloaded the new Metallica song!', time: '18:53', type: 'msg' },
  ]);
  const [input, setInput] = useState('');
  const [channel, _setChannel] = useState('#retrochat');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Bot simulation
  useEffect(() => {
    const bots = ['CyberPunk', 'MatrixFan', 'NetWizard'];
    const botMessages = [
      "Check out this site: http://www.geocities.com/area51/nebula",
      "Does anyone have the key for Office 97?",
      "I love my new 56k modem, it's so fast!",
      "LOL!",
      "brb, mom needs the phone line",
    ];

    const timer = setInterval(() => {
      if (Math.random() > 0.8) {
        const bot = bots[Math.floor(Math.random() * bots.length)];
        const text = botMessages[Math.floor(Math.random() * botMessages.length)];
        setMessages(prev => [...prev, { user: bot, text, time: new Date().toLocaleTimeString().slice(0,5), type: 'msg' }]);
      }
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { user: 'You', text: input, time: new Date().toLocaleTimeString().slice(0,5), type: 'msg' }]);
    setInput('');
  };

  return (
    <Window title={`mIRC - [${channel}]`} icon={<MessageSquare size={14} />} width={500} height={350} {...props}>
      <div className="flex h-full bg-[#c0c0c0] font-sans overflow-hidden">
        {/* Main Chat */}
        <div className="flex-1 flex flex-col p-1 gap-1">
          <div ref={scrollRef} className="flex-1 win95-window bg-white shadow-inner p-2 overflow-auto text-[11px] font-mono leading-tight">
            {messages.map((m, i) => (
              <div key={i} className="mb-0.5">
                {m.type === 'system' ? (
                  <span className="text-blue-800 italic">{m.text}</span>
                ) : m.type === 'join' ? (
                  <span className="text-green-700 font-bold">{m.text}</span>
                ) : (
                  <>
                    <span className="text-gray-500">[{m.time}]</span>{' '}
                    <span className="font-bold text-red-800">&lt;{m.user}&gt;</span>{' '}
                    <span className="text-black">{m.text}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSend} className="flex gap-1">
            <div className="win95-window bg-white px-2 py-1 text-[11px] font-bold text-blue-900">{channel}</div>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 win95-window shadow-inner px-2 py-1 text-[11px] outline-none"
              placeholder="Type message here..."
            />
          </form>
        </div>

        {/* Sidebar */}
        <div className="w-24 win95-window m-1 bg-white flex flex-col overflow-auto text-[10px]">
          <div className="bg-blue-800 text-white px-2 py-0.5 flex items-center gap-1">
            <Users size={10} /> Users
          </div>
          <div className="p-1 flex flex-col gap-0.5">
            <div className="flex items-center gap-1 font-bold">@Operator</div>
            <div className="flex items-center gap-1">RetroKing99</div>
            <div className="flex items-center gap-1">NapsterLover</div>
            <div className="flex items-center gap-1">CyberPunk</div>
            <div className="flex items-center gap-1">MatrixFan</div>
            <div className="flex items-center gap-1">NetWizard</div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default IRCClient;
