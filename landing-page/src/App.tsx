import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Monitor, Zap, Shield, Globe, ArrowRight, Play, MessageSquare, Gamepad2, Layers, Music } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-colors group relative overflow-hidden"
    >
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-retro-cyan/5 rounded-full blur-2xl group-hover:bg-retro-cyan/10 transition-colors" />
      <div className="w-12 h-12 bg-retro-blue/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
        <Icon className="text-retro-cyan" size={24} />
      </div>
      <h3 className="text-xl font-bold mb-4 pixel-font text-white relative z-10">{title}</h3>
      <p className="text-gray-400 leading-relaxed relative z-10 text-sm">{description}</p>
    </motion.div>
  );
};

const SectionHeading = ({ children, subtitle, light = false, align = "center" }: { children: React.ReactNode, subtitle?: string, light?: boolean, align?: "center" | "left" }) => (
  <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
    {subtitle && <span className={`${light ? 'text-white/60' : 'text-retro-cyan'} text-xs font-bold uppercase tracking-[4px] mb-4 block`}>{subtitle}</span>}
    <h2 className={`text-4xl md:text-5xl font-extrabold text-white pixel-font tracking-tight`}>{children}</h2>
  </div>
);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  const heroScale = useTransform(smoothProgress, [0, 0.2], [1, 0.85]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const osPreviewScale = useTransform(smoothProgress, [0.05, 0.25], [0.9, 1]);
  const osPreviewOpacity = useTransform(smoothProgress, [0.05, 0.2], [0, 1]);

  return (
    <div ref={containerRef} className="relative bg-[#050505] text-white selection:bg-retro-cyan selection:text-black overflow-x-hidden">
      <div className="crt-overlay fixed inset-0 z-[1000] pointer-events-none opacity-10" />
      <div className="scanline z-[1001]" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 bg-retro-blue flex items-center justify-center rounded-lg font-bold pixel-font text-white shadow-[0_0_15px_rgba(0,0,128,0.5)] group-hover:scale-110 transition-transform">RN</div>
          <span className="font-bold tracking-tighter text-xl hidden sm:block">RetroNet <span className="text-retro-cyan">1999</span></span>
        </div>
        <div className="flex items-center gap-4 sm:gap-8">
          <a href="https://github.com/vitesh9876/RetroNet-1999" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
            <Globe size={18} /> <span className="hidden md:inline">Source Code</span>
          </a>
          <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold text-sm hover:bg-retro-cyan transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group">
            Enter OS <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-retro-cyan font-bold uppercase tracking-[8px] mb-6 block text-sm sm:text-base drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">Personal Workstation Simulator</span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black mb-8 pixel-font leading-[1.1] tracking-tighter">
              BEYOND THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-retro-cyan via-white to-retro-pink drop-shadow-sm">PIXELS</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-xl mb-12 leading-relaxed px-4">
              RetroNet 1999 is a pixel-perfect reconstruction of the golden era of computing. 
              Built with React & Framer Motion to deliver a high-fidelity immersive experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="w-full sm:w-auto bg-retro-blue text-white px-10 py-5 rounded-2xl font-bold pixel-font flex items-center justify-center gap-3 hover:bg-blue-700 hover:shadow-[0_0_30px_rgba(0,0,128,0.4)] transition-all transform hover:-translate-y-1">
                <Play size={20} fill="currentColor" /> Boot System
              </button>
              <button className="w-full sm:w-auto bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-sm">
                View Missions
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Dynamic Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-retro-blue/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-retro-pink/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      </section>

      {/* Real OS Preview Section */}
      <section className="relative py-32 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
        <motion.div 
          style={{ scale: osPreviewScale, opacity: osPreviewOpacity }}
          className="max-w-6xl mx-auto relative group"
        >
          <div className="absolute -inset-2 bg-gradient-to-r from-retro-cyan/20 to-retro-pink/20 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          <div className="relative bg-black rounded-[28px] overflow-hidden border border-white/15 shadow-2xl">
            <img 
              src="/assets/desktop.png" 
              alt="RetroNet 1999 Real Desktop" 
              className="w-full aspect-video object-cover"
            />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute -left-12 top-1/4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl hidden lg:block shadow-2xl"
          >
            <div className="text-retro-cyan font-bold pixel-font text-xs mb-1">REAL-TIME ENGINE</div>
            <div className="text-white text-[10px]">60FPS UI Transformations</div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="absolute -right-12 bottom-1/4 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-xl hidden lg:block shadow-2xl"
          >
            <div className="text-retro-pink font-bold pixel-font text-xs mb-1">ACTIVE DESKTOP</div>
            <div className="text-white text-[10px]">Fully Persistent User Files</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <SectionHeading subtitle="The Architecture">Immersive System Internals</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={Monitor}
            title="Interactive Desktop"
            description="A fully interactive workspace with draggable icons, window snapping, and context menus that feel like 1999."
            index={0}
          />
          <FeatureCard 
            icon={Layers}
            title="Window Management"
            description="Native multi-window environment with Z-index handling, minimizing, and real-time task switching via the taskbar."
            index={1}
          />
          <FeatureCard 
            icon={Zap}
            title="Authentic Audio"
            description="Every click, startup chime, and modem handshake is professionally sampled to recreate the sonic era."
            index={2}
          />
          <FeatureCard 
            icon={Globe}
            title="Retro Navigator"
            description="A dedicated browser component capable of rendering mock historical sites with era-appropriate delays."
            index={3}
          />
          <FeatureCard 
            icon={Shield}
            title="System Security"
            description="Experience a safe simulation of early internet threats, including pop-up storms and virus scanner repairs."
            index={4}
          />
          <FeatureCard 
            icon={MessageSquare}
            title="Retro Messenger"
            description="Chat with simulated users in a high-fidelity replica of 90s instant messaging software."
            index={5}
          />
        </div>
      </section>

      {/* Start Menu Feature */}
      <section className="py-40 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="The Navigation Hub" light>Start Menu Excellence</SectionHeading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative group lg:order-1 order-2"
            >
              <div className="absolute -inset-1 bg-retro-blue/30 rounded-2xl blur-lg group-hover:bg-retro-blue/50 transition duration-500"></div>
              <img 
                src="/assets/start_menu.png" 
                alt="RetroNet Start Menu" 
                className="relative rounded-xl border border-white/10 shadow-2xl w-full max-w-[420px] mx-auto"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left lg:order-2 order-1"
            >
              <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                Our Start Menu is more than a list—it's a tribute to classic design. 
                Featuring a custom vertical branding rail with developer attribution and 
                a categorized app system for easy navigation.
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Custom Brand Rail', detail: 'By Vitesh Pallapothu branding included' },
                  { label: 'Categorized Launcher', detail: 'Internet, Games, Programs, and System tools' },
                  { label: 'Real-time Notifications', detail: 'System tray updates and taskbar icons' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-retro-cyan group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
                    <div>
                      <h4 className="font-bold text-white text-base mb-1">{item.label}</h4>
                      <p className="text-gray-500 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Browser Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeading subtitle="Internet Simulator">The 1999 Web Experience</SectionHeading>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                Step into the "RetroNet Navigator" and visit sites that defined an era. 
                From the alien conspiracies of "The Vault" to the first iterations of search engines, 
                experience the web with the layout and soul of 1999.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Music className="text-retro-pink" size={20} />
                    <h4 className="font-bold text-sm">Multimedia Engine</h4>
                  </div>
                  <p className="text-gray-500 text-xs">Authentic audio playback with legacy codecs.</p>
                </div>
                <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="text-retro-cyan" size={20} />
                    <h4 className="font-bold text-sm">Legacy Protocols</h4>
                  </div>
                  <p className="text-gray-500 text-xs">Simulated HTTP/1.0 loading behaviors.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute -inset-6 bg-retro-cyan/10 blur-[120px] rounded-full" />
              <img 
                src="/assets/browser.png" 
                alt="Retro Browser" 
                className="relative rounded-2xl border border-white/15 shadow-2xl z-10 w-full"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Multimedia Full Width Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-white/5 rounded-[32px] border border-white/10 p-8 md:p-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-retro-pink/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-retro-pink/10 transition-colors" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-retro-pink/20 rounded-xl flex items-center justify-center">
                  <Music className="text-retro-pink" size={24} />
                </div>
                <h3 className="text-2xl font-bold pixel-font">WinRetro Media Player</h3>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Experience high-fidelity 90s audio with functional visualizers, 
                playlist management, and that classic metallic industrial interface.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-gray-500">MP3 SUPPORT</div>
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest text-gray-500">VISUALIZER</div>
              </div>
            </div>
            <div className="relative">
              <img src="/assets/media_player.png" alt="Media Player" className="rounded-xl shadow-2xl border border-white/15 hover:scale-105 transition-transform duration-500 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Chaos & Virus Simulation */}
      <section className="py-40 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <SectionHeading subtitle="Digital Chaos">The Virus Popup Storm</SectionHeading>
          <p className="text-gray-400 text-xl mb-16 max-w-2xl mx-auto">
            Experience the legendary "Popup Storms" of the late 90s. 
            Test your clicking speed as windows multiply and the system reacts to simulated threats.
          </p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative group max-w-5xl mx-auto"
          >
            <div className="absolute -inset-10 bg-retro-pink/15 blur-[120px] rounded-full group-hover:bg-retro-pink/25 transition-colors" />
            <img src="/assets/virus_popups.png" alt="Virus Popups" className="relative rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(255,0,255,0.15)] z-10 w-full" />
          </motion.div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="relative p-12 md:p-24 rounded-[48px] bg-gradient-to-br from-retro-blue/15 via-black to-retro-pink/15 border border-white/10 overflow-hidden text-center">
          <div className="flex justify-center mb-8">
            <span className="bg-retro-cyan/20 text-retro-cyan px-6 py-1.5 rounded-full text-[10px] font-bold tracking-[4px] uppercase border border-retro-cyan/30">Roadmap 2026</span>
          </div>
          
          <div className="relative z-10">
            <SectionHeading subtitle="The Digital Frontier" light>Features Coming Soon...</SectionHeading>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mt-20">
              {[
                { icon: MessageSquare, label: 'Multiplayer IRC', desc: 'Real-time global chat with other users' },
                { icon: Gamepad2, label: 'Retro Gaming', desc: 'Full Minesweeper & 3D Maze implementations' },
                { icon: Monitor, label: 'Custom Themes', desc: 'Upload wallpapers and tweak UI colors' },
                { icon: Shield, label: 'Registry Editor', desc: 'Deep-dive into system kernel settings' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-retro-cyan group-hover:text-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/10">
                    <item.icon size={32} />
                  </div>
                  <h4 className="font-bold mb-3 text-white text-lg">{item.label}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="py-32 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h2 className="text-5xl md:text-8xl font-black mb-12 pixel-font tracking-tighter">RETRO IS NOW.</h2>
          <button className="bg-retro-cyan text-black px-16 py-8 rounded-3xl font-black text-2xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(0,255,255,0.3)] hover:shadow-[0_0_70px_rgba(0,255,255,0.5)]">
            LAUNCH THE SYSTEM
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full pt-24 border-t border-white/5 items-center mt-20">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-gray-500 uppercase tracking-widest text-[10px] mb-4">Project Created By</span>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-retro-blue rounded-full flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">VP</div>
                <div className="text-left">
                  <div className="font-bold text-lg text-white">Vitesh Pallapothu</div>
                  <div className="text-xs text-gray-500">Developer & Systems Designer</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center gap-6">
              <a href="https://github.com/vitesh9876/RetroNet-1999" target="_blank" className="bg-white/5 px-6 py-3 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 font-medium">
                <Globe size={20} /> View on GitHub
              </a>
              <div className="text-[10px] text-gray-600 uppercase tracking-[4px]">Verified Secure Build v1.0.4</div>
            </div>

            <div className="text-center md:text-right">
              <div className="text-white font-bold pixel-font text-lg mb-2">RetroNet <span className="text-retro-cyan">1999</span></div>
              <div className="text-[10px] text-gray-600 uppercase tracking-[4px]">© 2026 Vitesh Pallapothu</div>
              <div className="text-[9px] text-gray-700 mt-2 italic">A tribute to the pioneers of the digital frontier.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
