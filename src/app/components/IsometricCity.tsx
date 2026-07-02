import React, { useMemo } from 'react';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

// ── Isometric projection constants ──────────────────────────────────
const OX = 450; // scene origin x
const OY = 450; // scene origin y (ground level)
const HW = 32;  // half-tile width per iso unit
const HH = 16;  // half-tile height per iso unit (HW/2)
const FH = 38;  // screen pixels per floor

function iso(ix: number, iy: number, iz: number = 0) {
  return { x: OX + (ix - iy) * HW, y: OY + (ix + iy) * HH - iz * FH };
}

function pts(points: { x: number; y: number }[]) {
  return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}

// ── Seeded random (deterministic, no render-time changes) ────────────
function seededRand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

// ── Building definitions (sorted back-to-front for painter's algo) ───
interface BuildingDef {
  id: string;
  labels: string[];
  ax: number; ay: number;
  w: number; d: number;
  floors: number;
  pulseDelay: number;
}

const BUILDINGS: BuildingDef[] = [
  { id: 'DATA_HUB',   labels: ['DATA HUB'],           ax: 0, ay: 0, w: 2, d: 2, floors: 3, pulseDelay: 0.9 },
  { id: 'BLOCKCHAIN', labels: ['BLOCKCHAIN'],           ax: 2, ay: 0, w: 2, d: 2, floors: 7, pulseDelay: 0   },
  { id: 'UPLINK',     labels: ['UPLINK'],               ax: 0, ay: 2, w: 2, d: 2, floors: 5, pulseDelay: 1.35 },
  { id: 'JAMMER',     labels: ['JAMMER'],               ax: 4, ay: 0, w: 2, d: 2, floors: 4, pulseDelay: 0.45 },
  { id: 'STACK_NODE', labels: ['STACK NODE', 'ACTIVE'], ax: 4, ay: 2, w: 1, d: 1, floors: 2, pulseDelay: 1.8 },
];

// ── Building info panel data ─────────────────────────────────────────
export const BUILDING_DATA: Record<string, {
  title: string; status: string; type: string;
  ip: string; load: string; connections: string; uptime: string; region: string;
}> = {
  DATA_HUB:   { title: 'DATA HUB',   status: 'ONLINE', type: 'RELAY NODE',    ip: '192.168.7.42',  load: '78%',  connections: '2,341', uptime: '99.91%', region: 'SECTOR-04' },
  BLOCKCHAIN: { title: 'BLOCKCHAIN', status: 'ACTIVE', type: 'LEDGER NODE',   ip: '10.0.48.1',     load: '91%',  connections: '8,842', uptime: '100%',   region: 'CORE-01'   },
  UPLINK:     { title: 'UPLINK',     status: 'ONLINE', type: 'UPLINK HUB',    ip: '172.16.33.9',   load: '55%',  connections: '4,120', uptime: '99.87%', region: 'SECTOR-07' },
  JAMMER:     { title: 'JAMMER',     status: 'ONLINE', type: 'SIGNAL JAMMER', ip: '192.168.8.200', load: '62%',  connections: '1,083', uptime: '99.44%', region: 'SECTOR-11' },
  STACK_NODE: { title: 'STACK NODE', status: 'ACTIVE', type: 'STACK NODE',    ip: '10.0.0.255',    load: '100%', connections: '512',   uptime: '99.98%', region: 'CORE-00'   },
};

// ── Window generation (fully deterministic) ──────────────────────────
interface WinDot { x: number; y: number; lit: boolean; opacity: number; }

function bilinear(
  p00: { x: number; y: number }, p10: { x: number; y: number },
  p11: { x: number; y: number }, p01: { x: number; y: number },
  t: number, s: number
) {
  return {
    x: (1-t)*(1-s)*p00.x + t*(1-s)*p10.x + t*s*p11.x + (1-t)*s*p01.x,
    y: (1-t)*(1-s)*p00.y + t*(1-s)*p10.y + t*s*p11.y + (1-t)*s*p01.y,
  };
}

function generateWindows(
  p00: {x:number;y:number}, p10: {x:number;y:number},
  p11: {x:number;y:number}, p01: {x:number;y:number},
  nCols: number, nRows: number,
  seedBase: number
): WinDot[] {
  const result: WinDot[] = [];
  for (let r = 0; r < nRows; r++) {
    for (let c = 0; c < nCols; c++) {
      const t = (c + 0.5) / nCols;
      const s = (r + 0.5) / nRows;
      const pos = bilinear(p00, p10, p11, p01, t, s);
      const seed = seedBase + r * 31 + c * 7;
      const rand = seededRand(seed);
      const lit = rand > 0.32;
      const opacity = lit ? 0.5 + seededRand(seed + 1000) * 0.45 : 0;
      result.push({ x: pos.x, y: pos.y, lit, opacity });
    }
  }
  return result;
}

// ── Grid floor ───────────────────────────────────────────────────────
function GridFloor() {
  const lines: React.ReactElement[] = [];
  // iso-x lines (varying iy, fixed ix)
  for (let ix = -1; ix <= 7; ix++) {
    const a = iso(ix, -1); const b = iso(ix, 5);
    lines.push(
      <line key={`x${ix}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={NEON} strokeWidth={0.4} opacity={0.18} />
    );
  }
  // iso-y lines (varying ix, fixed iy)
  for (let iy = -1; iy <= 5; iy++) {
    const a = iso(-1, iy); const b = iso(7, iy);
    lines.push(
      <line key={`y${iy}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={NEON} strokeWidth={0.4} opacity={0.18} />
    );
  }
  return <g>{lines}</g>;
}

// ── Single building component ─────────────────────────────────────────
interface BuildingProps {
  b: BuildingDef;
  selected: boolean;
  hovered: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function Building({ b, selected, hovered, onClick, onMouseEnter, onMouseLeave }: BuildingProps) {
  const { ax, ay, w, d, floors } = b;

  // 8 corners of the building box
  const BL_b = iso(ax, ay);
  const BR_b = iso(ax + w, ay);
  const FL_b = iso(ax, ay + d);
  const FR_b = iso(ax + w, ay + d);
  const BL_t = iso(ax, ay, floors);
  const BR_t = iso(ax + w, ay, floors);
  const FL_t = iso(ax, ay + d, floors);
  const FR_t = iso(ax + w, ay + d, floors);

  // Face colors — darker = shadowed, lighter = lit
  const highlight = selected ? '#2a5000' : hovered ? '#1a3500' : '#0d1e00';
  const topColor   = selected ? '#1e4200' : hovered ? '#122e00' : '#0c1c00';
  const leftColor  = selected ? '#162e00' : hovered ? '#0e2200' : '#081300';
  const rightColor = selected ? '#0d1e00' : '#060e00';
  const stroke     = selected ? '#FFFFFF' : hovered ? '#7fff60' : NEON;
  const strokeW    = selected ? 1.2 : 0.7;
  const opacity    = 0.75 + (ax + ay) * 0.02; // subtle depth

  // TOP face: BL_t → BR_t → FR_t → FL_t
  const topPts = pts([BL_t, BR_t, FR_t, FL_t]);
  // LEFT (near) face: FL_b → FR_b → FR_t → FL_t
  const leftPts = pts([FL_b, FR_b, FR_t, FL_t]);
  // RIGHT face: FR_b → BR_b → BR_t → FR_t
  const rightPts = pts([FR_b, BR_b, BR_t, FR_t]);

  // Windows — deterministic using building id hash as seed
  const seedBase = b.id.split('').reduce((s, c) => s * 31 + c.charCodeAt(0), 0);
  const leftWins = useMemo(() => generateWindows(
    FL_b, FR_b, FR_t, FL_t,
    Math.max(2, w * 3), Math.max(2, floors * 2), seedBase
  ), []);
  const rightWins = useMemo(() => generateWindows(
    FR_b, BR_b, BR_t, FR_t,
    Math.max(2, d * 3), Math.max(2, floors * 2), seedBase + 500
  ), []);

  // Beacon at rooftop center
  const beaconPos = iso(ax + w / 2, ay + d / 2, floors);
  // Antenna top
  const antennaBase = iso(ax + w / 2, ay + d / 2, floors);
  const antennaTop  = iso(ax + w / 2, ay + d / 2, floors + 0.8);

  // Label position (below front-top face)
  const labelPos = iso(ax + w / 2, ay + d + 0.1, 0);

  // Pulse strip for left face
  const leftFaceMinX = Math.min(FL_b.x, FR_b.x, FL_t.x, FR_t.x);
  const leftFaceMaxX = Math.max(FL_b.x, FR_b.x, FL_t.x, FR_t.x);
  const leftFaceBottomY = Math.max(FL_b.y, FR_b.y);
  const leftFaceTopY    = Math.min(FL_t.y, FR_t.y);
  const clipId = `clip-${b.id}`;
  const hasPulse = ['BLOCKCHAIN', 'UPLINK', 'JAMMER', 'DATA_HUB', 'STACK_NODE'].includes(b.id);

  return (
    <g style={{ cursor: 'pointer' }} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {/* Clip path for pulse animation */}
      {hasPulse && (
        <defs>
          <clipPath id={clipId}>
            <polygon points={leftPts} />
          </clipPath>
        </defs>
      )}

      {/* TOP face */}
      <polygon points={topPts} fill={topColor} stroke={stroke} strokeWidth={strokeW}
        style={{ filter: selected ? `drop-shadow(0 0 4px ${NEON})` : undefined }} />

      {/* LEFT (near) face */}
      <polygon points={leftPts} fill={leftColor} stroke={stroke} strokeWidth={strokeW} />

      {/* RIGHT face */}
      <polygon points={rightPts} fill={rightColor} stroke={stroke} strokeWidth={strokeW} />

      {/* Windows on left face */}
      {leftWins.map((w, i) => w.lit && (
        <rect key={`lw${i}`} x={w.x - 1.5} y={w.y - 2.5} width={3} height={4}
          fill={NEON} opacity={w.opacity}
          style={{ filter: `drop-shadow(0 0 2px ${NEON})` }} />
      ))}

      {/* Windows on right face */}
      {rightWins.map((w, i) => w.lit && (
        <rect key={`rw${i}`} x={w.x - 1.5} y={w.y - 2.5} width={3} height={4}
          fill={NEON} opacity={w.opacity * 0.65} />
      ))}

      {/* Rooftop antenna */}
      <line x1={antennaBase.x} y1={antennaBase.y} x2={antennaTop.x} y2={antennaTop.y}
        stroke={NEON} strokeWidth={0.8} opacity={0.6} />

      {/* Beacon light (animated via SVG animate) */}
      <circle cx={beaconPos.x} cy={beaconPos.y} r={2.5} fill="#ff3300" opacity={0.9}
        style={{ filter: 'drop-shadow(0 0 3px #ff6600)' }}>
        <animate attributeName="opacity" values="0.9;0.1;0.9" dur="2s"
          begin={`${b.pulseDelay}s`} repeatCount="indefinite" />
        <animate attributeName="r" values="2.5;1.5;2.5" dur="2s"
          begin={`${b.pulseDelay}s`} repeatCount="indefinite" />
      </circle>

      {/* Data pulse strip */}
      {hasPulse && (
        <rect
          clipPath={`url(#${clipId})`}
          x={leftFaceMinX - 5}
          width={leftFaceMaxX - leftFaceMinX + 10}
          height={10}
          fill={NEON}
          opacity={0.3}
        >
          <animate attributeName="y"
            from={leftFaceBottomY + 10} to={leftFaceTopY - 10}
            dur="1.8s" begin={`${b.pulseDelay}s`} repeatCount="indefinite" />
        </rect>
      )}

      {/* Selected highlight glow */}
      {selected && (
        <polygon points={leftPts} fill="none" stroke="#FFFFFF" strokeWidth={1.5}
          opacity={0.5} style={{ filter: 'drop-shadow(0 0 6px #FFFFFF)' }} />
      )}
      {hovered && b.id !== 'STACK_NODE' && (
        <polygon points={leftPts} fill="none" stroke={NEON} strokeWidth={1}
          opacity={0.4} style={{ filter: `drop-shadow(0 0 4px ${NEON})` }} />
      )}
      {hovered && b.id === 'STACK_NODE' && (
        <>
          <polygon points={leftPts} fill={`${NEON}15`} stroke={NEON} strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 8px ${NEON})` }} />
          <polygon points={rightPts} fill={`${NEON}10`} stroke={NEON} strokeWidth={1.5}
            style={{ filter: `drop-shadow(0 0 8px ${NEON})` }} />
        </>
      )}

      {/* Building labels */}
      {b.labels.map((lbl, i) => (
        <text key={lbl} x={labelPos.x} y={labelPos.y + 14 + i * 14}
          textAnchor="middle" fontFamily={FONT}
          fontSize={i === 0 ? 14 : 11}
          fill={NEON} opacity={i === 0 ? 0.95 : 0.6}
          style={{ textShadow: `0 0 6px ${NEON}`, pointerEvents: 'none' }}>
          {lbl}
        </text>
      ))}
    </g>
  );
}

// ── Main IsometricCity component ─────────────────────────────────────
interface IsometricCityProps {
  selectedBuilding: string | null;
  hoveredBuilding: string | null;
  onBuildingClick: (id: string) => void;
  onBuildingHover: (id: string | null) => void;
}

export function IsometricCity({
  selectedBuilding, hoveredBuilding, onBuildingClick, onBuildingHover,
}: IsometricCityProps) {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <svg
        viewBox="0 0 900 680"
        style={{ width: '100%', height: '100%', maxHeight: '100%' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="strong-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Ground grid */}
        <GridFloor />

        {/* Buildings — painter's order: back to front */}
        {BUILDINGS.map((b) => (
          <Building
            key={b.id}
            b={b}
            selected={selectedBuilding === b.id}
            hovered={hoveredBuilding === b.id}
            onClick={() => onBuildingClick(b.id)}
            onMouseEnter={() => onBuildingHover(b.id)}
            onMouseLeave={() => onBuildingHover(null)}
          />
        ))}

        {/* Scene title / HUD text */}
        <text x={450} y={50} textAnchor="middle" fontFamily={FONT} fontSize={13}
          fill={NEON} opacity={0.45}>
          {'[ SECTOR MAP : DOWNTOWN GRID ]'}
        </text>
        <text x={450} y={65} textAnchor="middle" fontFamily={FONT} fontSize={11}
          fill={NEON} opacity={0.3}>
          {'HOVER STACK NODE TO LAUNCH // CLICK ANY BUILDING FOR DATA'}
        </text>

        {/* Coordinate readout bottom */}
        <text x={20} y={660} fontFamily={FONT} fontSize={11} fill={NEON} opacity={0.3}>
          {`SYS:GRID // NODES:5 // STATUS:ONLINE`}
        </text>
        <text x={880} y={660} textAnchor="end" fontFamily={FONT} fontSize={11} fill={NEON} opacity={0.3}>
          {`LAT:40.7128 // LON:-74.0060`}
        </text>
      </svg>
    </div>
  );
}
