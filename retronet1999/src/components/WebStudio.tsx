import React, { useState } from 'react';
import Window from './Window';
import { Code, Layout, Palette, Save, Globe, Image as ImageIcon, Type } from 'lucide-react';
import { useFileSystem } from '../contexts/FileSystemContext';
import { useSystem } from '../contexts/SystemContext';

const WebStudio: React.FC<any> = (props) => {
  const { saveFile } = useFileSystem();
  const { addNotification, completeMission } = useSystem();
  
  const [siteTitle, setSiteTitle] = useState("My Awesome Page");
  const [bgColor, setBgColor] = useState("#008080");
  const [textColor, setTextColor] = useState("#ffffff");
  const [content, setContent] = useState("Welcome to my corner of the web! Created with RetroNet Web Studio.");
  const [hasHitCounter, setHasHitCounter] = useState(true);
  const [hasUnderConstruction, setHasUnderConstruction] = useState(true);
  const [font, setFont] = useState("Times New Roman");

  const generateHTML = () => {
    return `
      <html>
        <head>
          <title>${siteTitle}</title>
          <style>
            body { 
              background-color: ${bgColor}; 
              color: ${textColor}; 
              font-family: "${font}", serif; 
              padding: 20px; 
              text-align: center;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              border: 4px double ${textColor};
              padding: 20px;
              background: rgba(0,0,0,0.2);
            }
            h1 { text-decoration: underline; }
            .counter { font-family: "Courier New", monospace; background: #000; color: #0f0; padding: 2px 5px; }
            marquee { font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>${siteTitle}</h1>
            ${hasUnderConstruction ? '<p><img src="https://web.archive.org/web/20091023133333im_/http://geocities.com/Heartland/6959/undercon.gif" alt="Under Construction"></p>' : ''}
            <p>${content}</p>
            <hr>
            ${hasHitCounter ? `<p>You are visitor number: <span class="counter">000427</span></p>` : ''}
            <p><a href="mailto:vitesh@retronet.com" style="color: ${textColor}">Contact Me</a></p>
            <marquee>Created by Vitesh Pallapothu using RetroNet Web Studio v1.0</marquee>
          </div>
        </body>
      </html>
    `;
  };

  const handleSave = () => {
    const html = generateHTML();
    saveFile('index.html', html, 'html', 'C:\\Documents\\Websites');
    addNotification({ title: 'Web Studio', message: 'Site saved to C:\\Documents\\Websites\\index.html', type: 'success' });
    completeMission('createWebsite');
  };

  return (
    <Window title="RetroNet Web Studio" icon={<Code size={14} />} {...props} width={600} height={450}>
      <div className="flex h-full bg-[#c0c0c0] font-sans overflow-hidden">
        {/* Toolbox */}
        <div className="w-48 border-r-2 border-gray-400 p-3 flex flex-col gap-4 overflow-auto">
          <div className="win95-window p-2 bg-gray-100 flex flex-col gap-2">
            <div className="font-bold text-[10px] flex items-center gap-1"><Type size={12} /> Page Info</div>
            <input 
              type="text" 
              className="win95-window shadow-inner p-1 text-[10px] w-full" 
              placeholder="Title" 
              value={siteTitle} 
              onChange={e => setSiteTitle(e.target.value)}
            />
          </div>

          <div className="win95-window p-2 bg-gray-100 flex flex-col gap-2">
            <div className="font-bold text-[10px] flex items-center gap-1"><Palette size={12} /> Appearance</div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px]">BG:</span>
              <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-5" />
            </div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px]">Text:</span>
              <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-5" />
            </div>
            <select className="win95-window p-1 text-[9px]" value={font} onChange={e => setFont(e.target.value)}>
              <option>Times New Roman</option>
              <option>Arial</option>
              <option>Courier New</option>
              <option>Comic Sans MS</option>
            </select>
          </div>

          <div className="win95-window p-2 bg-gray-100 flex flex-col gap-2">
            <div className="font-bold text-[10px] flex items-center gap-1"><Layout size={12} /> Widgets</div>
            <label className="flex items-center gap-2 text-[9px]">
              <input type="checkbox" checked={hasHitCounter} onChange={e => setHasHitCounter(e.target.checked)} /> Hit Counter
            </label>
            <label className="flex items-center gap-2 text-[9px]">
              <input type="checkbox" checked={hasUnderConstruction} onChange={e => setHasUnderConstruction(e.target.checked)} /> Construction GIF
            </label>
          </div>

          <button 
            className="win95-button flex items-center justify-center gap-2 py-2 mt-auto font-bold"
            onClick={handleSave}
          >
            <Save size={14} /> Publish
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex bg-[#d4d4d4] border-b border-gray-400 p-1 gap-2">
            <button className="win95-button px-3 py-0.5 text-[10px] bg-white">Editor</button>
            <button className="win95-button px-3 py-0.5 text-[10px] opacity-50">Preview</button>
          </div>
          
          <div className="flex-1 p-4 bg-white overflow-auto">
            <textarea 
              className="w-full h-full p-4 font-mono text-xs border-0 outline-none resize-none"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Start typing your HTML content here..."
            />
          </div>

          {/* Quick Preview at bottom */}
          <div className="h-24 border-t-2 border-gray-400 p-2 overflow-auto" style={{ backgroundColor: bgColor, color: textColor, fontFamily: font }}>
            <h1 className="text-sm font-bold underline mb-1">{siteTitle}</h1>
            <p className="text-[10px]">{content.substring(0, 100)}...</p>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default WebStudio;
