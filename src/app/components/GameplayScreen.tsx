import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import armSprite from '../../imports/arm-512.png';
// @ts-ignore
import botSprite from '../../imports/BOT-512..png';
import conveyorSprite from '../../imports/conveyor-512.png';
import dogSprite from '../../imports/dog-512.png';
import droneSprite from '../../imports/drone-512.png';
import printerSprite from '../../imports/printer-512.png';

const NEON = '#39FF14';
const FONT = '"VT323", monospace';

// Gameplay layout positions (% of workspace area)
const ROBOT_POS   = { x: 48, y: 36 };  // center
const PRINTER_POS = { x: 68, y: 55 };  // lower right
const CONVEYOR_POS = { x: 10, y: 58 }; // lower left
const ARM_POS     = { x: 6,  y: 30 };  // left side
const CONVEYOR_DROP_X = 38; // % — where robot drops cube on conveyor

type RobotPhase = 'idle' | 'to-printer' | 'at-printer' | 'to-conveyor' | 'at-conveyor' | 'returning';

interface Cube { id: number; xPct: number; onConveyor: boolean; }
interface Dog  { id: number; side: 'left' | 'right'; xPct: number; }

interface GameplayScreenProps {
  onHealthChange: (h: number) => void;
  onDogsActivated: () => void;
}

export function GameplayScreen({ onHealthChange, onDogsActivated }: GameplayScreenProps) {
  const [phase, setPhase]           = useState<RobotPhase>('idle');
  const [holdingCube, setHoldingCube] = useState(false);
  const [robotPos, setRobotPos]     = useState({ x: ROBOT_POS.x, y: ROBOT_POS.y });
  const [cubes, setCubes]           = useState<Cube[]>([]);
  const [cubeCounter, setCubeCounter] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [droneActive, setDroneActive] = useState(false);
  const [droneMsg, setDroneMsg]     = useState(false);
  const [dogs, setDogs]             = useState<Dog[]>([]);
  const [health, setHealth]         = useState(5);
  const [dogsLive, setDogsLive]     = useState(false);
  const [robotFlash, setRobotFlash] = useState(false);
  const [cubesMade, setCubesMade]   = useState(0);

  const cubeIdRef      = useRef(0);
  const thirdCubeTimeRef = useRef<number | null>(null);
  const droneTriggered = useRef(false);
  const healthRef      = useRef(5);
  const dogsRef        = useRef(false);

  // ── Timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // ── Robot state machine ────────────────────────────────────────────
  const advancePhase = useCallback((cur: RobotPhase) => {
    const delays: Record<RobotPhase, number> = {
      idle: 600,
      'to-printer': 1400,
      'at-printer': 500,
      'to-conveyor': 1800,
      'at-conveyor': 500,
      returning: 1200,
    };
    const nextPhase: Record<RobotPhase, RobotPhase> = {
      idle: 'to-printer',
      'to-printer': 'at-printer',
      'at-printer': 'to-conveyor',
      'to-conveyor': 'at-conveyor',
      'at-conveyor': 'returning',
      returning: 'idle',
    };
    setTimeout(() => {
      const next = nextPhase[cur];
      setPhase(next);

      if (next === 'to-printer') {
        setRobotPos({ x: PRINTER_POS.x - 4, y: PRINTER_POS.y - 10 });
      } else if (next === 'at-printer') {
        setHoldingCube(true);
      } else if (next === 'to-conveyor') {
        setRobotPos({ x: CONVEYOR_DROP_X, y: CONVEYOR_POS.y - 12 });
      } else if (next === 'at-conveyor') {
        setHoldingCube(false);
        // Place cube on conveyor
        const newId = ++cubeIdRef.current;
        setCubes((prev) => [...prev, { id: newId, xPct: CONVEYOR_DROP_X - 2, onConveyor: true }]);
        setCubesMade((c) => {
          const next = c + 1;
          if (next === 3 && thirdCubeTimeRef.current === null) {
            thirdCubeTimeRef.current = Date.now();
          }
          return next;
        });
      } else if (next === 'returning') {
        setRobotPos({ x: ROBOT_POS.x, y: ROBOT_POS.y });
      }

      advancePhase(next);
    }, delays[cur]);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => advancePhase('idle'), 800);
    return () => clearTimeout(t);
  }, []);

  // ── Conveyor — scroll cubes left ───────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setCubes((prev) =>
        prev
          .map((c) => ({ ...c, xPct: c.xPct - 0.3 }))
          .filter((c) => c.xPct > -5)
      );
    }, 100);
    return () => clearInterval(iv);
  }, []);

  // ── Drone event check ──────────────────────────────────────────────
  useEffect(() => {
    if (droneTriggered.current) return;
    if (thirdCubeTimeRef.current !== null) {
      const waited = Date.now() - thirdCubeTimeRef.current;
      if (waited > 12000) { // 12s "too long"
        droneTriggered.current = true;
        setDroneActive(true);
        setTimeout(() => setDroneMsg(true), 4000);
        setTimeout(() => {
          setDroneActive(false);
          setDroneMsg(false);
          // Spawn 2 dogs
          setDogs([
            { id: 1, side: 'left',  xPct: -10 },
            { id: 2, side: 'right', xPct: 110  },
          ]);
          setDogsLive(true);
          dogsRef.current = true;
          onDogsActivated();
        }, 7500);
      }
    }
  });

  // ── Dog movement ───────────────────────────────────────────────────
  useEffect(() => {
    if (!dogsLive) return;
    const iv = setInterval(() => {
      setDogs((prev) =>
        prev.map((d) => ({
          ...d,
          xPct: d.side === 'left'
            ? Math.min(d.xPct + 0.4, ROBOT_POS.x - 8)
            : Math.max(d.xPct - 0.4, ROBOT_POS.x + 8),
        }))
      );
    }, 80);
    return () => clearInterval(iv);
  }, [dogsLive]);

  // ── Dog collision ──────────────────────────────────────────────────
  useEffect(() => {
    if (!dogsLive) return;
    const iv = setInterval(() => {
      const hit = dogs.some((d) => Math.abs(d.xPct - ROBOT_POS.x) < 12);
      if (hit) {
        if (healthRef.current > 0) {
          healthRef.current -= 1;
          setHealth(healthRef.current);
          onHealthChange(healthRef.current);
          setRobotFlash(true);
          setTimeout(() => setRobotFlash(false), 500);
        }
      }
    }, 1200);
    return () => clearInterval(iv);
  }, [dogsLive, dogs, onHealthChange]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000900',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: FONT,
    }}>
      {/* ── Grid floor ── */}
      <GridFloor />

      {/* ── Arm (left side) ── */}
      <div style={{
        position: 'absolute',
        left: `${ARM_POS.x}%`,
        top: `${ARM_POS.y}%`,
        width: 120, height: 120,
        animation: 'armMalfunction 1.6s ease-in-out infinite',
        transformOrigin: 'bottom center',
      }}>
        <ImageWithFallback src={armSprite} alt="Robotic arm" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* ── Printer (lower right) ── */}
      <div style={{
        position: 'absolute',
        left: `${PRINTER_POS.x}%`,
        top: `${PRINTER_POS.y}%`,
        width: 130, height: 130,
        animation: 'printerPulse 2s ease-in-out infinite',
      }}>
        <ImageWithFallback src={printerSprite} alt="Printer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {/* Cube being printed */}
        <div style={{
          position: 'absolute',
          top: -16, left: '50%', transform: 'translateX(-50%)',
          width: 14, height: 14,
          background: '#FFFFFF',
          boxShadow: '0 0 8px #FFFFFF, 0 0 20px #FFFFFF88',
          animation: 'cubeAppear 0.5s ease-out',
        }} />
      </div>

      {/* ── Conveyor (lower left) ── */}
      <div style={{
        position: 'absolute',
        left: `${CONVEYOR_POS.x}%`,
        top: `${CONVEYOR_POS.y}%`,
        width: 260, height: 100,
      }}>
        <ImageWithFallback src={conveyorSprite} alt="Conveyor belt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>

      {/* ── Cubes on conveyor — in workspace coordinates ── */}
      {cubes.map((c) => (
        <div key={c.id} style={{
          position: 'absolute',
          left: `${c.xPct}%`,
          top: `${CONVEYOR_POS.y - 2}%`,
          width: 13, height: 13,
          background: '#FFFFFF',
          boxShadow: '0 0 6px #FFFFFF, 0 0 18px #FFFFFF66',
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.1s linear',
          zIndex: 8,
        }} />
      ))}

      {/* ── Robot (center) ── */}
      <div style={{
        position: 'absolute',
        left: `${robotPos.x}%`,
        top: `${robotPos.y}%`,
        width: 110, height: 130,
        transform: 'translate(-50%, -50%)',
        transition: 'left 1.5s ease-in-out, top 1.5s ease-in-out',
        animation: robotFlash ? 'robotFlash 0.5s ease-in-out' : undefined,
      }}>
        <ImageWithFallback src={botSprite} alt="Robot BOT-512" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        {/* Carried cube */}
        {holdingCube && (
          <div style={{
            position: 'absolute',
            top: 10, right: -10,
            width: 16, height: 16,
            background: '#FFFFFF',
            boxShadow: '0 0 10px #FFFFFF, 0 0 24px #FFFFFF88',
          }} />
        )}
      </div>

      {/* ── Drone event ── */}
      {droneActive && (
        <div style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          marginLeft: -50,
          marginTop: -50,
          width: 100, height: 100,
          animation: 'dronefly 7.5s ease-in-out forwards',
          zIndex: 20,
        }}>
          <ImageWithFallback src={droneSprite} alt="Drone" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          {droneMsg && (
            <div style={{
              position: 'absolute',
              top: -70, left: '50%', transform: 'translateX(-50%)',
              background: '#000900',
              border: `1px solid ${NEON}`,
              padding: '6px 12px',
              whiteSpace: 'nowrap',
              fontFamily: FONT,
              color: NEON,
              fontSize: 14,
              letterSpacing: 1,
              boxShadow: `0 0 12px ${NEON}55`,
              lineHeight: 1.4,
            }}>
              REPORT:<br />SEND OUT 2 DOGS
            </div>
          )}
        </div>
      )}

      {/* ── Dogs ── */}
      {dogs.map((dog) => (
        <div key={dog.id} style={{
          position: 'absolute',
          left: `${dog.xPct}%`,
          top: '62%',
          width: 80, height: 80,
          transform: dog.side === 'right' ? 'scaleX(-1)' : 'none',
          transition: 'left 0.08s linear',
          animation: 'dogChase 0.5s ease-out',
          zIndex: 15,
        }}>
          <ImageWithFallback src={dogSprite} alt="Enemy dog" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
      ))}

      {/* ── HUD overlays ── */}
      {/* Timer */}
      <div style={{
        position: 'absolute',
        top: 12, left: 16,
        fontFamily: FONT,
        color: NEON,
        fontSize: 24,
        letterSpacing: 3,
        textShadow: `0 0 8px ${NEON}`,
        border: `1px solid ${NEON}44`,
        padding: '4px 14px 2px',
        background: '#000900ee',
      }}>
        TIMER: {fmtTime(elapsedSec)}
      </div>

      {/* Cube count */}
      <div style={{
        position: 'absolute',
        top: 12, right: 16,
        fontFamily: FONT,
        color: NEON,
        fontSize: 18,
        letterSpacing: 2,
        border: `1px solid ${NEON}44`,
        padding: '4px 14px 2px',
        background: '#000900ee',
      }}>
        CUBES: {cubesMade.toString().padStart(3, '0')}
      </div>

      {/* Phase indicator */}
      <div style={{
        position: 'absolute',
        bottom: 14, left: 16,
        fontFamily: FONT,
        color: NEON,
        fontSize: 13,
        opacity: 0.45,
        letterSpacing: 2,
      }}>
        BOT STATUS: {phase.toUpperCase().replace('-', ' ')}
      </div>

      {/* Corner decorations */}
      <CornerDeco pos="top-left" />
      <CornerDeco pos="top-right" />
      <CornerDeco pos="bottom-left" />
      <CornerDeco pos="bottom-right" />
    </div>
  );
}

// ── Grid floor SVG ──────────────────────────────────────────────────
function GridFloor() {
  const lines: React.ReactElement[] = [];
  // Horizontal grid lines (perspective: converge toward top)
  const rows = 14;
  for (let r = 0; r < rows; r++) {
    const y = 40 + (r / rows) * 95; // 40% to 95% down the screen
    const vanishX = 50; // vanishing point x %
    const spread  = 5 + (r / rows) * 110; // spread at this row
    lines.push(
      <line key={`h${r}`}
        x1={`${vanishX - spread / 2}%`} y1={`${y}%`}
        x2={`${vanishX + spread / 2}%`} y2={`${y}%`}
        stroke={NEON} strokeWidth={0.5} opacity={0.08 + (r / rows) * 0.12}
      />
    );
  }
  // Vertical perspective lines
  const cols = 16;
  for (let c = 0; c <= cols; c++) {
    const xTop = 50 - 5 + (c / cols) * 10; // near vanishing at top
    const xBot = c * (100 / cols);
    lines.push(
      <line key={`v${c}`}
        x1={`${xTop}%`} y1="40%"
        x2={`${xBot}%`} y2="95%"
        stroke={NEON} strokeWidth={0.5} opacity={0.1}
      />
    );
  }
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {lines}
    </svg>
  );
}

function CornerDeco({ pos }: { pos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const size = 18;
  const isTop    = pos.includes('top');
  const isLeft   = pos.includes('left');
  const style: React.CSSProperties = {
    position: 'absolute',
    top:    isTop    ? 8 : undefined,
    bottom: !isTop   ? 8 : undefined,
    left:   isLeft   ? 8 : undefined,
    right:  !isLeft  ? 8 : undefined,
    width: size, height: size,
    borderTop:    isTop    ? `2px solid ${NEON}` : undefined,
    borderBottom: !isTop   ? `2px solid ${NEON}` : undefined,
    borderLeft:   isLeft   ? `2px solid ${NEON}` : undefined,
    borderRight:  !isLeft  ? `2px solid ${NEON}` : undefined,
    opacity: 0.35,
  };
  return <div style={style} />;
}
