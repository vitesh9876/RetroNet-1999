# RetroNet 1999

A fully immersive 1999 Internet simulator with retro browsers, fake old websites, CRT effects, dial-up sounds, retro chat systems, and a mock virtual machine environment.

## Key Features
- **CRT Visual Engine:** Real-time scanlines, flicker, and static effects.
- **Native Window Manager:** Drag, Minimize, Maximize, and Focus windows like a real OS.
- **Classic Start Menu & Taskbar:** Functional "Start" experience with app switching and a system tray.
- **Dial-up Simulation:** Authentic modem sounds and connection gatekeeping.
- **Retro Browser:** Browse a mock 1999 web including a Google 1998 beta page.
- **Persistent Messenger:** Save your chats to a local SQLite database (powered by Rust).
- **MS-DOS Terminal:** Mock command prompt with directory browsing and system info.
- **Media Player:** Functional visualizer and audio playback.
- **Virus Simulator:** Experience the chaos of 1999 "popup storms."

## Tech Stack
- **Frontend:** React, TypeScript, Tailwind CSS v4, Framer Motion.
- **Backend:** Tauri V2 (Rust).
- **Database:** SQLite (Rusqlite).

## Getting Started
1. Install Rust and Node.js.
2. Clone the repository.
3. Run `npm install`.
4. Run `npm run tauri dev` to launch the simulator.
