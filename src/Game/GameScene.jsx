import React, { useState, useRef, useEffect } from 'react';
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
  const bubblesRef = useRef([]); // Store references to bubble objects

  // Function to handle spawning bubbles
  const handleSpawn = (position) => {
    const id = Date.now(); // Unique ID for each bubble
    const bubble = {
      id,
      position,
      ref: null, // Will store the reference to the Bubble object
    };
    setBubbles((prevBubbles) => [...prevBubbles, bubble]);
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

  // Update the bubblesRef whenever the bubbles state changes
  useEffect(() => {
    bubblesRef.current = bubbles.map((bubble) => bubble.ref).filter((ref) => ref !== null);
  }, [bubbles]);

  return (
    <>
      {/* 3D Game Scene */}
      <Canvas>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <Skybox />
        <Aquarium />
        <Player bubbles={bubblesRef.current} bubbleClick={handleBubbleClick}/> {/* Pass the bubbles to Player */}

        {/* Spawner */}
        <Spawner onSpawn={handleSpawn} />

        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            position={[bubble.position.x, bubble.position.y, bubble.position.z]}
            onClick={() => handleBubbleClick(bubble.id)} // Pass the bubble's ID to the click handler
            onRemove={() => handleBubbleRemove(bubble.id)} // Pass the bubble's ID to the remove handler
            ref={(ref) => {
              // Store the reference to the Bubble object
              if (ref) {
                bubble.ref = ref;
              }
            }}
          />
        ))}
      </Canvas>

      <div className="game-ui">
        <p className="CurrencyHolder">Bubbles: {money}</p>
        <button onClick={onBackToMenu} className="BackButton">Back to Menu</button>
      </div>
    </>
  );
}

export default GameScene;