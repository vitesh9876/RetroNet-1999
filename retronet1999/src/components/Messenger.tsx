import React, { useState, useEffect, useRef } from 'react';
import Window from './Window';
import { Mail, Send, Smile, Info, Settings, MoreHorizontal } from 'lucide-react';
import { CommonWindowProps } from '../types';
import { useSystem } from '../contexts/SystemContext';

interface Message {
  user: string;
  text: string;
  time: string;
  isBot?: boolean;
}

const BOT_MESSAGES = [
  "hey did you see the new matrix trailer?",
  "i finally got 56k! so fast!!",
  "wanna play starcraft later?",
  "asl?",
  "check out my new geocities page!",
  "i think i have a virus... my computer keeps saying hello",
  "do you have any extra AOL minutes?",
  "brb mom needs the phone line",
  "gtg dinner is ready",
];

const Messenger: React.FC<CommonWindowProps> = (props) => {
  const { addNotification } = useSystem();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('retronet1999:messages') || '[]');
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState('');
  const [activeBuddy, setActiveBuddy] = useState('CoolHacker99');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('retronet1999:messages', JSON.stringify(messages));
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // Bot simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const botMsg = {
          user: activeBuddy,
          text: BOT_MESSAGES[Math.floor(Math.random() * BOT_MESSAGES.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true
        };
        setMessages(prev => [...prev, botMsg]);
        addNotification({ title: `IM from ${activeBuddy}`, message: botMsg.text, type: 'info' });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [activeBuddy, addNotification]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newMsg = { 
      user: 'retro_user_99', 
      text: inputValue, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
  };

  return (
    <Window title="Retro Messenger" icon={<Mail size={14} />} width={500} height={450} {...props}>
      <div className="flex h-full font-sans text-xs bg-[#c0c0c0]">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-400 flex flex-col">
          <div className="bg-[#000080] text-white p-1 font-bold flex items-center justify-between">
            <span>Buddy List</span>
            <MoreHorizontal size={10} />
          </div>
          <div className="p-2 flex flex-col gap-3 overflow-auto bg-white flex-1">
            <div className="flex flex-col gap-1">
              <div className="font-bold text-[10px] text-gray-500 border-b border-gray-100">Buddies (1/3)</div>
              <button 
                className={`flex items-center gap-2 p-1 text-left ${activeBuddy === 'CoolHacker99' ? 'bg-blue-100' : 'hover:bg-gray-50'}`}
                onClick={() => setActiveBuddy('CoolHacker99')}
              >
                <div className="w-4 h-4 bg-yellow-400 rounded-sm flex items-center justify-center text-[10px] font-bold">CH</div>
                <div className="flex-1 truncate">
                  <div className="font-bold">CoolHacker99</div>
                  <div className="text-[8px] text-green-600">Online</div>
                </div>
              </button>
              <div className="flex items-center gap-2 p-1 opacity-50">
                <div className="w-4 h-4 bg-gray-300 rounded-sm" />
                <div className="flex-1 truncate">
                  <div className="font-bold">AnimeFan2000</div>
                  <div className="text-[8px]">Away</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-1 opacity-30">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <div className="flex-1 truncate">
                  <div className="font-bold">X_Matrix_X</div>
                  <div className="text-[8px]">Offline</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="font-bold text-[10px] text-gray-500 border-b border-gray-100">Family (0/1)</div>
              <div className="flex items-center gap-2 p-1 opacity-30">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
                <div className="flex-1 truncate">
                  <div className="font-bold">Mom</div>
                  <div className="text-[8px]">Offline</div>
                </div>
              </div>
            </div>
          </div>
          <div className="p-1 bg-[#c0c0c0] border-t border-gray-400 flex gap-1">
            <button className="win95-button flex-1 text-[9px] py-0.5">Chat</button>
            <button className="win95-button flex-1 text-[9px] py-0.5">Info</button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#000080] text-white p-1 font-bold text-[10px] flex items-center justify-between">
            <span>{activeBuddy} - Instant Message</span>
            <div className="flex gap-2">
              <Settings size={10} />
              <Info size={10} />
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 bg-white m-2 win95-window shadow-inner p-3 overflow-auto flex flex-col gap-2">
            {messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">No messages yet. Say hi to {activeBuddy}!</div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="flex flex-col">
                  <span className={`font-bold ${msg.user === 'retro_user_99' ? 'text-blue-800' : 'text-red-800'}`}>
                    {msg.user}: <span className="font-normal text-black">{msg.text}</span>
                  </span>
                  <span className="text-[8px] text-gray-400">{msg.time}</span>
                </div>
              ))
            )}
          </div>

          <div className="px-2 pb-2 flex flex-col gap-1">
            <div className="flex gap-1 items-center bg-[#c0c0c0] p-0.5 border border-gray-400">
              <button className="win95-button p-0.5"><Smile size={14} /></button>
              <div className="border-r border-gray-400 h-4 mx-1" />
              <button className="hover:bg-blue-100 px-1 font-bold">A</button>
              <button className="hover:bg-blue-100 px-1 italic">I</button>
              <button className="hover:bg-blue-100 px-1 underline">U</button>
              <div className="flex-1" />
              <button className="win95-button px-2 py-0.5 text-[9px]">Warn</button>
              <button className="win95-button px-2 py-0.5 text-[9px]">Block</button>
            </div>
            <div className="flex gap-1">
              <textarea 
                className="flex-1 win95-window shadow-inner p-2 h-16 outline-none bg-white resize-none text-xs"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button 
                className="win95-button px-4 flex flex-col items-center justify-center gap-1 font-bold"
                onClick={handleSend}
              >
                <Send size={18} />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Messenger;
