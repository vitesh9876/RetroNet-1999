export interface RetroSite {
  id: string;
  url: string;
  title: string;
  content: React.ReactNode;
}

export const FAKE_SITES: Record<string, { title: string; bg: string; content: string }> = {
  geocities_ufo: {
    title: "THE TRUTH IS HERE - AREA 51 WATCH",
    bg: "#000022",
    content: `<div style="color: #00ff00; font-family: 'Comic Sans MS', sans-serif; text-align: center; padding: 20px;">
      <h1 style="font-size: 32px; text-shadow: 2px 2px #ff00ff;">🛸 WELCOME TO THE VAULT 🛸</h1>
      <p>They don't want you to know about the 1997 Phoenix Lights incident...</p>
      <div style="border: 2px solid yellow; padding: 10px; background: rgba(0,0,0,0.5); margin: 10px 0;">
        <h3>LATEST SIGHTINGS:</h3>
        <ul style="text-align: left;"><li>Nevada Desert - May 10, 1999</li><li>London Tube - April 22, 1999</li><li>Tokyo Bay - March 3, 1999</li></ul>
      </div>
      <marquee>STAY VIGILANT --- THE TRUTH IS OUT THERE --- SIGN OUR GUESTBOOK</marquee>
      <hr style="border-color: #00ff00;">
      <div style="display: flex; gap: 10px; justify-content: center; margin: 10px 0; flex-wrap: wrap;">
        <a href="#" style="color: lime;">[ HOME ]</a>
        <a href="#" style="color: lime;">[ EVIDENCE ]</a>
        <a href="#" style="color: lime;">[ GUESTBOOK ]</a>
        <a href="#" style="color: lime;">[ WEBRING ]</a>
        <a href="#" style="color: lime;">[ EMAIL ME ]</a>
      </div>
      <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='31' fill='%2300ff00'><rect width='88' height='31' fill='%23003300' rx='2'/><text x='44' y='20' font-size='8' text-anchor='middle' fill='lime'>🛸 WEBRING 🛸</text></svg>" />
      <div style="margin-top: 20px; font-size: 10px; color: #666;">Visitor #00004521 | Best viewed in Netscape Navigator 4.0</div>
    </div>`
  },
  matrix_fan: {
    title: "NEO'S NEST - MATRIX FAN PAGE",
    bg: "#000",
    content: `<div style="color: #00ff41; font-family: monospace; padding: 20px;">
      <h1 style="border-bottom: 1px solid #00ff41;">> Wake up, Neo...</h1>
      <p>This page is dedicated to the best movie of 1999: THE MATRIX.</p>
      <div style="display: flex; gap: 20px; margin-top: 20px;">
        <div style="border: 1px solid #00ff41; padding: 10px; flex: 1;">
          <h4>BLUE PILL</h4><p>Go back to sleep.</p>
        </div>
        <div style="border: 1px solid #00ff41; padding: 10px; background: #003300; flex: 1;">
          <h4>RED PILL</h4><p>See how deep the rabbit hole goes.</p>
        </div>
      </div>
      <hr style="border-color: #003300; margin: 20px 0;">
      <div style="border: 1px dashed #00ff41; padding: 10px; margin: 10px 0;">
        <h3>📖 GUESTBOOK</h3>
        <div style="background: #001100; padding: 5px; margin: 5px 0;"><strong>xX_N3o_Xx:</strong> Whoa... I know kung fu</div>
        <div style="background: #001100; padding: 5px; margin: 5px 0;"><strong>TrinityFan99:</strong> There is no spoon 🥄</div>
        <div style="background: #001100; padding: 5px; margin: 5px 0;"><strong>AgentSmith:</strong> Mr. Anderson...</div>
      </div>
    </div>`
  },
  google: {
    title: 'Google!',
    bg: '#ffffff',
    content: `<div style="font-family: 'Times New Roman'; padding: 50px; text-align: center;">
      <h1 style="font-size: 60px;"><span style="color:blue">G</span><span style="color:red">o</span><span style="color:orange">o</span><span style="color:blue">g</span><span style="color:green">l</span><span style="color:red">e</span><span style="color:blue">!</span></h1>
      <p>Search the web using Google!</p>
      <div style="margin: 20px;"><input type="text" style="width: 300px; padding: 5px; border: 1px solid #ccc;"></div>
      <button style="padding: 5px 15px;">Google Search</button>
      <button style="padding: 5px 15px;">I'm Feeling Lucky</button>
      <p style="margin-top: 20px; font-size: 12px;">Copyright 1998 Google Inc.</p>
    </div>`
  },
  tucows: {
    title: 'TUCOWS Download Mirror',
    bg: '#e9f2ff',
    content: `<div style="font-family: Arial; padding: 24px;">
      <h1 style="color: #003366;">TUCOWS Shareware Mirror</h1>
      <p>Featured download: <strong>RetroZip 2.1</strong></p>
      <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; margin: 10px 0;">
        <tr style="background: #003366; color: white;"><th>Software</th><th>Rating</th><th>Size</th><th>Action</th></tr>
        <tr><td>RetroZip 2.1</td><td>🐄🐄🐄🐄🐄</td><td>1.2 MB</td><td><a href="#">Download</a></td></tr>
        <tr><td>WinAmp 2.0</td><td>🐄🐄🐄🐄</td><td>3.1 MB</td><td><a href="#">Download</a></td></tr>
        <tr><td>mIRC 5.71</td><td>🐄🐄🐄🐄🐄</td><td>890 KB</td><td><a href="#">Download</a></td></tr>
        <tr><td>ICQ 99b</td><td>🐄🐄🐄🐄</td><td>4.2 MB</td><td><a href="#">Download</a></td></tr>
      </table>
      <marquee>Fast 56k mirror online now!</marquee>
    </div>`
  },
  guestbook: {
    title: 'RetroNet Guestbook',
    bg: '#ffffcc',
    content: `<div style="font-family: 'Comic Sans MS', sans-serif; padding: 20px;">
      <h1 style="color: #cc0000; text-align: center;">📝 Sign My Guestbook! 📝</h1>
      <div style="border: 2px inset; padding: 10px; background: white; margin: 10px 0;">
        <div style="padding: 5px; border-bottom: 1px dashed #ccc;"><strong>CyberSurfer99:</strong> Cool page dude!!! 😎 - <em>May 1, 1999</em></div>
        <div style="padding: 5px; border-bottom: 1px dashed #ccc;"><strong>~*~AnGeL~*~:</strong> LoVe yOuR pAgE!!! viSiT mInE!! - <em>Apr 28, 1999</em></div>
        <div style="padding: 5px; border-bottom: 1px dashed #ccc;"><strong>WebMaster_J:</strong> Added you to my webring! - <em>Apr 15, 1999</em></div>
        <div style="padding: 5px; border-bottom: 1px dashed #ccc;"><strong>h4x0r_1337:</strong> First!!!1! - <em>Apr 10, 1999</em></div>
        <div style="padding: 5px;"><strong>Mom:</strong> How do I get back to Yahoo? Love, Mom - <em>Apr 1, 1999</em></div>
      </div>
      <div style="text-align: center; margin-top: 10px;">
        <input type="text" placeholder="Your name" style="padding: 4px; width: 150px;">
        <input type="text" placeholder="Your message" style="padding: 4px; width: 250px;">
        <button style="padding: 4px 12px;">Sign!</button>
      </div>
    </div>`
  },
  webring: {
    title: 'The Ultimate 90s WebRing',
    bg: '#000066',
    content: `<div style="color: white; font-family: 'Comic Sans MS'; padding: 20px; text-align: center;">
      <h1 style="color: #ffff00;">🌐 The Ultimate 90s WebRing 🌐</h1>
      <p>You are visiting site <strong>#42</strong> of <strong>1,337</strong> in this ring!</p>
      <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0;">
        <a href="#" style="color: cyan;">[ ← Previous ]</a>
        <a href="#" style="color: cyan;">[ Random ]</a>
        <a href="#" style="color: cyan;">[ Next → ]</a>
        <a href="#" style="color: cyan;">[ Join Ring ]</a>
      </div>
      <hr style="border-color: #333;">
      <h3 style="color: #ff6600;">Member Sites:</h3>
      <div style="text-align: left; max-width: 400px; margin: 0 auto;">
        <div style="padding: 4px;">🏠 Bob's Reptile Page</div>
        <div style="padding: 4px;">⭐ Jenny's Anime Shrine</div>
        <div style="padding: 4px;">🎮 DOOM Clan HQ</div>
        <div style="padding: 4px;">🛸 Area 51 Watch (you are here!)</div>
        <div style="padding: 4px;">💿 The MP3 Underground</div>
      </div>
      <div style="margin-top: 20px; font-size: 10px; color: #666;">Powered by WebRing.org | Est. 1997</div>
    </div>`
  },
  angelfire: {
    title: "~*~KaTiE's PaGe~*~",
    bg: '#ff99cc',
    content: `<div style="font-family: 'Comic Sans MS'; padding: 20px; text-align: center;">
      <h1 style="color: #cc00cc;">~*~WeLcOmE tO mY pAgE~*~</h1>
      <marquee style="color: red; font-weight: bold;">*** UNDER CONSTRUCTION ***</marquee>
      <p style="color: #660066;">Hi!! My name is Katie and I'm 14!! I like *NSYNC, TLC, and my cat Whiskers!!</p>
      <div style="border: 3px double #cc00cc; padding: 10px; margin: 10px 0;">
        <h3>My Links:</h3>
        <a href="#" style="color: #6600cc;">My LiveJournal</a> |
        <a href="#" style="color: #6600cc;">My AOL Profile</a> |
        <a href="#" style="color: #6600cc;">Email me!!</a>
      </div>
      <blink style="color: red;">DO NOT STEAL MY GRAPHICS!!</blink>
      <div style="margin-top: 20px;">
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='88' height='31'><rect width='88' height='31' fill='%23ff69b4' rx='2'/><text x='44' y='20' font-size='7' text-anchor='middle' fill='white'>AngelFire</text></svg>" />
      </div>
      <div style="font-size: 10px; color: #999; margin-top: 10px;">Made with Angelfire Free Homepage Builder</div>
    </div>`
  },
  yahoo: {
    title: 'Yahoo!',
    bg: '#ffffff',
    content: `<div style="font-family: Arial; padding: 20px;">
      <div style="text-align: center; border-bottom: 2px solid #7b0099; padding-bottom: 10px;">
        <h1 style="color: #7b0099; font-size: 48px; margin: 0;">Yahoo!</h1>
      </div>
      <div style="display: flex; gap: 20px; margin-top: 20px; font-size: 14px;">
        <div style="flex: 1;">
          <h3>Categories:</h3>
          <a href="#" style="color: blue;">Arts & Humanities</a><br>
          <a href="#" style="color: blue;">Business & Economy</a><br>
          <a href="#" style="color: blue;">Computers & Internet</a><br>
          <a href="#" style="color: blue;">Entertainment</a><br>
          <a href="#" style="color: blue;">Science</a>
        </div>
        <div style="flex: 1;">
          <h3>Yahoo! Services:</h3>
          <a href="#" style="color: blue;">Yahoo! Mail</a><br>
          <a href="#" style="color: blue;">Yahoo! Games</a><br>
          <a href="#" style="color: blue;">Yahoo! Chat</a><br>
          <a href="#" style="color: blue;">Yahoo! GeoCities</a>
        </div>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #666;">Copyright © 1999 Yahoo! Inc. All rights reserved.</div>
    </div>`
  },
  notFound: {
    title: '404 Not Found',
    bg: '#ffffff',
    content: '<div style="font-family: monospace; padding: 24px;"><h1>404 Not Found</h1><p>The requested fake host could not be found on RetroNet.</p><hr><p style="font-size: 12px; color: #666;">RetroNet/1.0 Server at retronet.local Port 80</p></div>'
  }
};
