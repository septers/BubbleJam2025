import React from 'react';

function MainMenu({ onStartGame, onOpenSettings }) {
  return (
    <div className="main-menu">
      <h1>Aquarium Delerium</h1>
      
      {/* Add screenshot below the title */}
      <img 
        src="/Screenshot.png"
        alt="Game Screenshot" 
        className="game-screenshot" 
        style={{
          width: '100%',
          maxWidth: '600px',
          margin: '20px auto',
          display: 'block',
          borderRadius: '10px',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
        }}
      />
      
      <p>--- Gameplay ---</p>
      <p>
        Aquarium Delerium is an aquarium-based clicker/idle game where you must shoot bubbles to gain currency. <br />
        Use this currency at the shop to buy items to enhance your aquarium (located on the right).
      </p>
      <p>--- Controls ---</p>
      <p>Movement - WASD | Look - Mouse</p>
      <p>Down - Q | Up - E</p>
      <p>Middle Menu is Active Item</p>
      <p>Lower Menu is Inventory (Click to Use)</p>

      <button className="StartButton" onClick={onStartGame}>Start</button>
    </div>
  );
}

export default MainMenu;
