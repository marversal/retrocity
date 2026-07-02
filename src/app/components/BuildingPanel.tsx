import React from 'react';
import { BUILDING_DATA } from './IsometricCity';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

interface BuildingPanelProps {
  buildingId: string | null;
  onClose: () => void;
}

export function BuildingPanel({ buildingId, onClose }: BuildingPanelProps) {
  const data = buildingId ? BUILDING_DATA[buildingId] : null;
  const show = !!buildingId && !!data;

  return (
    <div
      style={{
        width: show ? 260 : 0,
        minWidth: show ? 260 : 0,
        height: '100%',
        overflow: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {show && data && (
        <div
          style={{
            width: 260,
            height: '100%',
            background: '#000900',
            border: `1px solid ${NEON}`,
            borderLeft: 'none',
            boxShadow: `4px 0 24px ${NEON}22`,
            fontFamily: FONT,
            color: NEON,
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            overflow: 'hidden',
          }}
        >
          {/* Panel header */}
          <div style={{
            borderBottom: `1px solid ${NEON}44`,
            padding: '10px 14px 8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 15, letterSpacing: 2 }}>[ NODE INFO ]</span>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: `1px solid ${NEON}66`,
                color: NEON,
                fontFamily: FONT,
                fontSize: 14,
                cursor: 'pointer',
                padding: '1px 8px',
              }}
            >
              ✕ CLOSE
            </button>
          </div>

          {/* Title */}
          <div style={{ padding: '14px 14px 6px', borderBottom: `1px solid ${NEON}22` }}>
            <div style={{
              fontSize: 28,
              letterSpacing: 3,
              textShadow: `0 0 10px ${NEON}`,
              lineHeight: 1,
            }}>
              {data.title}
            </div>
            <div style={{
              fontSize: 13,
              marginTop: 4,
              opacity: 0.65,
              letterSpacing: 1,
            }}>
              {data.type}
            </div>
          </div>

          {/* Status */}
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${NEON}22` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8,
                borderRadius: '50%',
                background: NEON,
                boxShadow: `0 0 6px ${NEON}`,
                animation: 'termBlink 2s step-end infinite',
              }} />
              <span style={{ fontSize: 16, letterSpacing: 2 }}>STATUS: {data.status}</span>
            </div>
          </div>

          {/* Data rows */}
          <div style={{ flex: 1, padding: '10px 14px', overflow: 'auto' }}>
            {[
              ['IP ADDR', data.ip],
              ['SECTOR', data.region],
              ['LOAD', data.load],
              ['CONNECTIONS', data.connections],
              ['UPTIME', data.uptime],
            ].map(([label, value]) => (
              <DataRow key={label} label={label} value={value} />
            ))}

            {/* Fake bar chart */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 6, letterSpacing: 1 }}>TRAFFIC LOAD</div>
              <MiniChart buildingId={buildingId!} />
            </div>

            {/* Log entries */}
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 4, letterSpacing: 1 }}>SYS LOG</div>
              {getLogEntries(buildingId!).map((line, i) => (
                <div key={i} style={{ fontSize: 11, opacity: 0.5, lineHeight: 1.6 }}>
                  &gt; {line}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{
            borderTop: `1px solid ${NEON}33`,
            padding: '8px 14px',
            fontSize: 11,
            opacity: 0.35,
            letterSpacing: 1,
          }}>
            ACCESS LEVEL: CLASSIFIED // BOXBOT GRID
          </div>
        </div>
      )}
    </div>
  );
}

function DataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '5px 0',
      borderBottom: `1px solid ${NEON}11`,
      fontSize: 14,
    }}>
      <span style={{ opacity: 0.55, letterSpacing: 1 }}>{label}</span>
      <span style={{ letterSpacing: 1 }}>{value}</span>
    </div>
  );
}

function MiniChart({ buildingId }: { buildingId: string }) {
  const seed = buildingId.charCodeAt(0);
  const bars = Array.from({ length: 8 }, (_, i) => {
    const h = 10 + Math.floor(seededR(seed + i) * 35);
    return h;
  });
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: h, background: NEON,
          opacity: 0.4 + (h / 45) * 0.5,
          boxShadow: `0 0 3px ${NEON}`,
        }} />
      ))}
    </div>
  );
}

function seededR(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function getLogEntries(id: string): string[] {
  const logs: Record<string, string[]> = {
    DATA_HUB:   ['SYNC OK 192.168.7.42', 'PKT LOSS 0.01%', 'RELAY ACTIVE'],
    BLOCKCHAIN: ['BLOCK #88421 VALID', 'CHAIN SYNC 100%', 'CONSENSUS OK'],
    UPLINK:     ['UPLINK STABLE', 'SIGNAL STR 97%', 'HANDSHAKE OK'],
    JAMMER:     ['JAM FREQ 2.4GHz', 'RADIUS 400m', 'SWEEP ACTIVE'],
    STACK_NODE: ['CUBE QUEUE: 512', 'DRONE LINK OK', 'BOT ACTIVE'],
  };
  return logs[id] ?? ['NODE ACTIVE', 'ALL SYSTEMS OK'];
}
