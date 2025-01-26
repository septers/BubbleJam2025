import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// Define the base area size (you can modify these values based on your scene size)
const BASE_WIDTH = 18;  // Width of the base area (X-axis)
const BASE_HEIGHT = 10; // Height of the base area (Y-axis)
const BASE_DEPTH = 40;  // Depth of the base area (Z-axis)

function BaseSpawner({ onSpawn }) {
  const lastSpawnTimeRef = useRef(0); // Track the last spawn time for timing control
  const spawnRate = 100; // How often to spawn (in milliseconds)

  // Spawn the bubbles at random positions
  useFrame(() => {
    const currentTime = Date.now();
    
    // Only spawn if the required time has passed (based on spawn rate)
    if (currentTime - lastSpawnTimeRef.current >= spawnRate) {
      // Randomly position the bubble within the base's boundaries
      const x = (Math.random() - 0.5) * BASE_WIDTH;  // Random X within base width
      const y = (Math.random() - 0.5) * BASE_HEIGHT; // Random Y within base height
      const z = (Math.random() - 0.5) * BASE_DEPTH;  // Random Z within base depth

      onSpawn({ x, y, z }); // Call the onSpawn function with the new position
      
      lastSpawnTimeRef.current = currentTime; // Update the last spawn time
    }
  });

  return null; // Spawner doesn't render anything visually
}

export default BaseSpawner;
