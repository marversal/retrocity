import React, { useState } from 'react';
import { TerminalBar }    from './components/TerminalBar';
import { CRTOverlay }     from './components/CRTOverlay';
import { IsometricCity }  from './components/IsometricCity';
import { BuildingPanel }  from './components/BuildingPanel';
import { GameModal }      from './components/GameModal';
import { GameplayScreen } from './components/GameplayScreen';

type Screen = 'map' | 'gameplay';

const GAME_BUILDINGS = new Set(['UPLINK', 'BLOCKCHAIN', 'JAMMER']);

function loadPlayerCount(): number {
  try { return parseInt(localStorage.getItem('boxbot_players') || '0', 10); }
  catch { return 0; }
}
function savePlayerCount(n: number) {
  try { localStorage.setItem('boxbot_players', n.toString()); }
  catch {}
}

export default function App() {
  const [screen, setScreen]                     = useState<Screen>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding]   = useState<string | null>(null);
  const [activeGame, setActiveGame]             = useState<string | null>(null);
  const [health, setHealth]                     = useState(5);
  const [dogsActive, setDogsActive]             = useState(false);
  const [playerCount, setPlayerCount]           = useState<number>(loadPlayerCount);

  function handleBuildingClick(id: string) {
    // BUILDER → open Marversal X profile
    if (id === 'STACK_NODE') {
      window.open('https://x.com/Marversal_eth', '_blank', 'noopener,noreferrer');
      return;
    }
    // Game buildings → launch modal + increment persistent player counter
    if (GAME_BUILDINGS.has(id)) {
      const next = playerCount + 1;
      setPlayerCount(next);
      savePlayerCount(next);
      setActiveGame(id);
      setSelectedBuilding(null);
      return;
    }
    // All other buildings → info panel toggle
    setSelectedBuilding((prev) => (prev === id ? null : id));
  }

  function handleBuildingHover(id: string | null) {
    setHoveredBuilding(id);
  }

  function handleHealthChange(h: number) { setHealth(h); }
  function handleDogsActivated() { setDogsActive(true); }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#000900',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: '"VT323", monospace',
      color: '#39FF14',
    }}>
      <TerminalBar
        dogsActive={dogsActive}
        health={health}
        playerCount={playerCount}
      />

      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {screen === 'map' && (
          <>
            <BuildingPanel
              buildingId={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
            />
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <IsometricCity
                selectedBuilding={selectedBuilding}
                hoveredBuilding={hoveredBuilding}
                onBuildingClick={handleBuildingClick}
                onBuildingHover={handleBuildingHover}
              />
            </div>
          </>
        )}

        {screen === 'gameplay' && (
          <GameplayScreen
            onHealthChange={handleHealthChange}
            onDogsActivated={handleDogsActivated}
          />
        )}
      </div>

      {activeGame && (
        <GameModal gameId={activeGame} onClose={() => setActiveGame(null)} />
      )}

      <CRTOverlay />
    </div>
  );
}
