import React, { useState } from 'react';
import MainMenu from './UI/MainMenu';
import GameScene from './Game/GameScene';
import SettingsMenu from './UI/SettingsMenu';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('mainMenu'); // 'mainMenu', 'game', 'settings'

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleOpenSettings = () => {
    setGameState('settings');
  };

  const handleBackToMenu = () => {
    setGameState('mainMenu');
  };

  return (
    <div className="App">
      {gameState === 'mainMenu' && (
        <MainMenu onStartGame={handleStartGame} onOpenSettings={handleOpenSettings} />
      )}

      {gameState === 'game' && <GameScene onBackToMenu={handleBackToMenu} />}

      {gameState === 'settings' && <SettingsMenu onBackToMenu={handleBackToMenu} />}
    </div>
  );
}

export default App;