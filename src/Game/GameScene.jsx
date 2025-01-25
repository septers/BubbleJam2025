import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import Bubble from './Bubble';
import Spawner from './Spawner';
import { Player } from './Player'; // Import the Player component
import Aquarium from './Aquarium';
import Skybox from './Skybox';

function GameScene({ onBackToMenu }) {
  const [money, setMoney] = useState(0);
  const [bubbles, setBubbles] = useState([]);

  // Function to handle spawning bubbles
  const handleSpawn = (position) => {
    const id = Date.now(); // Unique ID for each bubble
    setBubbles((prevBubbles) => [...prevBubbles, { id, position }]);
  };

  // Function to handle clicking on a bubble
  const handleBubbleClick = (id) => {
    setMoney((prevMoney) => prevMoney + 1); // Increase money
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id)); // Remove the clicked bubble
  };

  // Function to handle removing a bubble when it goes off-screen
  const handleBubbleRemove = (id) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  return (
    <>
      {/* 3D Game Scene */}
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />


        <Skybox />

        <Aquarium />

        <Player />



        {/* Spawner */}
        <Spawner onSpawn={handleSpawn} />

        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            position={[bubble.position.x, bubble.position.y, bubble.position.z]}
            onClick={() => handleBubbleClick(bubble.id)} // Pass the bubble's ID to the click handler
            onRemove={() => handleBubbleRemove(bubble.id)} // Pass the bubble's ID to the remove handler
          />
        ))}
      </Canvas>

      <div className="game-ui">
        <p className="CurrencyHolder">Bubbles: {money}</p>
        <button onClick={onBackToMenu}>Back to Menu</button>
      </div>
    </>
  );
}

export default GameScene;