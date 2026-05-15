import React, { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

const LoginScreen: React.FC = () => {
  const { users, login, loginAttempts, isLocked, phase, playSound } = useSystem();
  const [selectedUser, setSelectedUser] = useState(0);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setPassword('');
    setError('');
    setShowHint(false);
  }, [selectedUser]);

  if (phase !== 'login') return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users[selectedUser];
    if (isLocked) {
      setError('Account locked. Please wait 15 seconds...');
      return;
    }
    const success = login(user.username, password);
    if (!success) {
      setError('Invalid password. Please try again.');
      if (loginAttempts >= 2) {
        setError('Too many failed attempts. Account locked for 15 seconds.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60000] flex items-center justify-center overflow-auto py-10"
      style={{
        background: 'linear-gradient(135deg, #000080, #1084d0 40%, #000080)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/30" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30" />
      </div>

      <div className="w-[480px] max-w-[90vw] text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-4xl font-bold text-white tracking-[6px] drop-shadow-lg font-sans">
            RetroNet 1999
          </div>
          <div className="text-sm text-blue-200 mt-1">Personal Virtual Machine</div>
        </div>

        {/* Login box */}
        <div className="win95-window p-0 overflow-hidden" style={{ color: 'var(--color-retro-text)' }}>
          {/* Title bar */}
          <div className="win95-titlebar h-7 flex items-center px-2 gap-1">
            <Lock size={12} />
            <span>Log On to RetroNet</span>
          </div>

          <div className="p-4" style={{ background: 'var(--color-retro-panel)' }}>
            {/* User selection */}
            <div className="flex gap-3 justify-center mb-4">
              {users.map((user, i) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => { 
                    if (playSound) playSound('click'); 
                    setSelectedUser(i); 
                  }}
                  className={`flex flex-col items-center gap-1 p-2 border-2 rounded min-w-[80px] transition-all cursor-pointer ${
                    selectedUser === i
                      ? 'border-blue-600 shadow-inner'
                      : 'border-transparent hover:border-gray-400'
                  }`}
                  style={{ background: selectedUser === i ? 'rgba(0,0,80,0.1)' : 'var(--color-retro-input-bg)', color: 'var(--color-retro-input-text)' }}
                >
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="text-[10px] font-bold font-sans truncate w-full">{user.username}</div>
                  {user.isAdmin && <div className="text-[8px] text-red-600 font-bold">ADMIN</div>}
                </button>
              ))}
            </div>

            {/* Password field */}
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <User size={14} />
                <span className="text-xs font-sans font-bold">{users[selectedUser].username}</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-xs font-sans w-16">Password:</span>
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    className="win95-window shadow-inner w-full px-2 py-1 text-xs outline-none pr-6"
                    style={{ background: 'var(--color-retro-input-bg)', color: 'var(--color-retro-input-text)' }}
                    autoFocus
                    disabled={isLocked}
                    placeholder={users[selectedUser].password === '' ? '(no password)' : ''}
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-1 text-[10px] text-red-600 font-sans bg-red-50 border border-red-300 p-1 rounded">
                  <AlertTriangle size={12} />
                  {error}
                </div>
              )}

              {isLocked && (
                <div className="text-[10px] text-orange-600 font-sans animate-pulse">
                  🔒 Account temporarily locked...
                </div>
              )}

              <div className="flex gap-2 justify-between items-center mt-2">
                <button
                  type="button"
                  className="win95-button px-2 py-0.5 text-[10px] font-sans"
                  style={{ color: 'var(--color-retro-text)' }}
                  onClick={() => setShowHint(!showHint)}
                >
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </button>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="win95-button px-4 py-1 text-xs font-sans font-bold"
                    style={{ color: 'var(--color-retro-text)' }}
                    disabled={isLocked}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    className="win95-button px-4 py-1 text-xs font-sans"
                    style={{ color: 'var(--color-retro-text)' }}
                    onClick={() => window.location.reload()}
                  >
                    Shutdown
                  </button>
                </div>
              </div>

              {showHint && (
                <div className="text-[10px] font-sans bg-yellow-50 border border-yellow-300 p-2 rounded mt-1 text-black">
                  💡 <strong>Hint:</strong> {users[selectedUser].hint}
                </div>
              )}
            </form>

            {/* Login attempts */}
            {loginAttempts > 0 && !isLocked && (
              <div className="text-[10px] font-sans mt-2 text-center opacity-60">
                Failed attempts: {loginAttempts}/3
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-2">
          <div className="text-[10px] text-blue-200/60 font-sans">
            RetroNet OS v4.10.1999 • Build 2222 • © 1999 Retro Corp
          </div>
          <div className="text-[9px] text-white/40 font-sans tracking-[3px] uppercase">
            Created by Vitesh Pallapothu
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
