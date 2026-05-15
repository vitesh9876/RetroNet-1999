import type React from 'react';
import { useSystem } from '../contexts/SystemContext';

const CRTFilter = () => {
  const { crt } = useSystem();

  if (!crt.enabled) return null;

  return (
    <div
      className="crt-stack"
      style={{
        '--crt-scanline-opacity': crt.scanlines ? crt.scanlineIntensity : 0,
        '--crt-flicker-opacity': crt.flicker ? crt.flickerIntensity : 0,
        '--crt-vhs-opacity': crt.vhs ? 0.16 : 0,
        '--crt-bloom-opacity': crt.bloom,
      } as React.CSSProperties}
    >
      {crt.scanlines && (
        <div className="crt-overlay" />
      )}
      {crt.flicker && (
        <div className="crt-flicker" />
      )}
      {crt.vhs && (
        <div className="crt-vhs" />
      )}
      <div className="crt-glass" />
    </div>
  );
};

export default CRTFilter;
