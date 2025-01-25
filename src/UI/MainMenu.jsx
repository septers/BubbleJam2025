import React from 'react';

function MainMenu({ onStartGame, onOpenSettings }) {
  return (
    <div className="main-menu">
      <h1>Bubble Clicker</h1>
      <button onClick={onStartGame}>Start</button>
      <button onClick={onOpenSettings}>Settings</button>
    </div>
  );
}

export default MainMenu;