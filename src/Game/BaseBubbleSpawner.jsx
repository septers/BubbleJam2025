import React, { useEffect } from 'react';

// Define the base area size (you can modify these values based on your scene size)
const BASE_WIDTH = 18;  // Width of the base area (X-axis)
const BASE_HEIGHT = 10; // Height of the base area (Y-axis)
const BASE_DEPTH = 40;  // Depth of the base area (Z-axis)

function BaseSpawner({ onSpawn }) {
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly position the bubble within the base's boundaries
      const x = (Math.random() - 0.5) * BASE_WIDTH;  // Random X within base width
      const y = (Math.random() - 0.5) * BASE_HEIGHT; // Random Y within base height
      const z = (Math.random() - 0.5) * BASE_DEPTH;  // Random Z within base depth
      
      onSpawn({ x, y, z }); // Call the onSpawn function with the new position
    }, 100); // Spawn a bubble every 100ms (adjust spawn rate as needed)

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [onSpawn]);

  return null; // Spawner doesn't render anything visually
}

export default BaseSpawner;
