import React, { useRef, useEffect, useState } from 'react';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

interface StackNodeHUDProps {
  show: boolean;
  onPlay: () => void;
}

export function StackNodeHUD({ show, onPlay }: StackNodeHUDProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState('');

  // Dynamically load the video so missing file won't crash the app
  useEffect(() => {
    // @ts-ignore
    import('../../imports/BOXBOT_splash.mp4')
      .then((m: any) => setVideoSrc(m.default))
      .catch(() => {}); // file not uploaded yet — video area stays blank
  }, []);

  useEffect(() => {
    if (show && videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {});
    }
  }, [show, videoSrc]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'all',
      }}
    >
      <div
        style={{
          background: '#000900',
          border: `2px solid ${NEON}`,
          boxShadow: `0 0 30px ${NEON}55, 0 0 60px ${NEON}22`,
          width: 420,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: FONT,
          color: NEON,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          borderBottom: `1px solid ${NEON}44`,
          padding: '8px 14px',
          fontSize: 15,
          letterSpacing: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ color: '#ff3300', fontSize: 10 }}>●</span>
          <span>STACK NODE // MISSION BRIEF</span>
        </div>

        {/* Video area */}
        <div style={{ position: 'relative', background: '#000', aspectRatio: '16 / 9' }}>
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              playsInline
              loop
              style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
            />
          ) : (
            // Placeholder when video not yet uploaded
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 8,
            }}>
              <div style={{ fontSize: 28, letterSpacing: 4, opacity: 0.6 }}>BOXBOT</div>
              <div style={{ fontSize: 14, opacity: 0.35, letterSpacing: 2 }}>[ LOADING MISSION BRIEF ]</div>
              <div style={{
                width: 40, height: 3, background: NEON, opacity: 0.4,
                animation: 'termBlink 1s step-end infinite',
              }} />
            </div>
          )}
          {/* Scanline overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
          }} />
        </div>

        {/* Play button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '14px 16px 16px',
          borderTop: `1px solid ${NEON}33`,
        }}>
          <button
            onClick={onPlay}
            style={{
              fontFamily: FONT,
              fontSize: 24,
              letterSpacing: 6,
              color: '#000900',
              background: NEON,
              border: 'none',
              padding: '6px 48px 4px',
              cursor: 'pointer',
              boxShadow: `0 0 16px ${NEON}, 0 0 32px ${NEON}66`,
              transition: 'box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 0 28px ${NEON}, 0 0 56px ${NEON}88`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 0 16px ${NEON}, 0 0 32px ${NEON}66`;
            }}
          >
            PLAY
          </button>
        </div>
      </div>
    </div>
  );
}
