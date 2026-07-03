import React from 'react';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

interface TerminalBarProps {
  dogsActive: boolean;
  health: number;
  playerCount: number;
}

export function TerminalBar({ dogsActive, health, playerCount }: TerminalBarProps) {
  const countStr = playerCount.toString().padStart(4, '0');

  return (
    <div
      style={{
        height: 48,
        background: '#000900',
        borderBottom: `1px solid ${NEON}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontFamily: FONT,
        color: NEON,
        fontSize: 18,
        boxShadow: `0 0 12px ${NEON}33`,
        flexShrink: 0,
        zIndex: 50,
        position: 'relative',
      }}
    >
      <span style={{ opacity: 0.5 }}>{'[ '}</span>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        flex: 1, paddingLeft: 4, justifyContent: 'center',
      }}>
        <span style={{ textShadow: `0 0 8px ${NEON}` }}>VIBE STACKED</span>
        <Sep />
        <span>RETRO DATA</span>
        <Sep />
        <span>OG ACTIVE</span>
        <Sep />
        <span>
          ACTIVE PLAYERS:{' '}
          <span style={{ textShadow: `0 0 10px ${NEON}`, letterSpacing: 2 }}>
            {countStr}
          </span>
        </span>
        <BlinkCursor />
      </div>

      {dogsActive && <HealthMeter health={health} />}

      <span style={{ opacity: 0.5 }}>{'  ]'}</span>
    </div>
  );
}

function Sep() {
  return <span style={{ opacity: 0.4 }}>{' // '}</span>;
}

function BlinkCursor() {
  return (
    <span style={{
      display: 'inline-block', width: 10, height: 18,
      background: NEON, marginLeft: 4,
      animation: 'termBlink 1s step-end infinite',
      verticalAlign: 'middle',
    }} />
  );
}

function HealthMeter({ health }: { health: number }) {
  const MAX = 5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginRight: 12 }}>
      <span style={{ fontSize: 14, opacity: 0.7 }}>HP:</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: MAX }).map((_, i) => (
          <div key={i} style={{
            width: 14, height: 20,
            background: i < health ? NEON : 'transparent',
            border: `1px solid ${NEON}`,
            boxShadow: i < health ? `0 0 4px ${NEON}` : 'none',
          }} />
        ))}
      </div>
    </div>
  );
}
