import React, { useState } from 'react';
import { TerminalBar }    from './components/TerminalBar';
import { CRTOverlay }     from './components/CRTOverlay';
import { IsometricCity }  from './components/IsometricCity';
import { BuildingPanel }  from './components/BuildingPanel';
import { GameModal }      from './components/GameModal';
import { GameplayScreen } from './components/GameplayScreen';

type Screen = 'map' | 'gameplay';

// Buildings that launch mini-games when clicked
const GAME_BUILDINGS = new Set(['UPLINK', 'BLOCKCHAIN', 'JAMMER']);

export default function App() {
  const [screen, setScreen]                     = useState<Screen>('map');
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [hoveredBuilding, setHoveredBuilding]   = useState<string | null>(null);
  const [activeGame, setActiveGame]             = useState<string | null>(null);
  const [health, setHealth]                     = useState(5);
  const [dogsActive, setDogsActive]             = useState(false);

  function handleBuildingClick(id: string) {
    // STACK NODE → mailto link
    if (id === 'STACK_NODE') {
      window.open('mailto:marversaldcl.eth@gmail.com');
      return;
    }
    // Game buildings → launch embedded game
    if (GAME_BUILDINGS.has(id)) {
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

  function handlePlay() {
    setSelectedBuilding(null);
    setScreen('gameplay');
  }

  function handleHealthChange(h: number) {
    setHealth(h);
  }

  function handleDogsActivated() {
    setDogsActive(true);
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#000900',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: '"VT323", monospace',
        color: '#39FF14',
      }}
    >
      {/* Top terminal bar — always visible */}
      <TerminalBar dogsActive={dogsActive} health={health} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {screen === 'map' && (
          <>
            {/* Left info panel — only for non-game buildings */}
            <BuildingPanel
              buildingId={selectedBuilding}
              onClose={() => setSelectedBuilding(null)}
            />

            {/* Isometric city map */}
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

      {/* Mini-game modal (UPLINK / BLOCKCHAIN / JAMMER) */}
      {activeGame && (
        <GameModal
          gameId={activeGame}
          onClose={() => setActiveGame(null)}
        />
      )}

      {/* CRT overlay — always on top */}
      <CRTOverlay />
    </div>
  );
}
