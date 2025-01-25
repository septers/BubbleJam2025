import React from 'react';

function SettingsMenu({ onBackToMenu }) {
  return (
    <div className="settings-menu">
      <h1>Settings</h1>
      <button onClick={onBackToMenu}>Back to Menu</button>
    </div>
  );
}

export default SettingsMenu;