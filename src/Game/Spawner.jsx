import React, { useEffect } from 'react';

function Spawner({ onSpawn }) {
  useEffect(() => {
    const interval = setInterval(() => {
      const x = (Math.random() - 0.5) * 18; // Random X position
      const y = (Math.random() - 0.5) * 10; // Random Y position
      const z = (Math.random() - 0.5) * 40; // Random Z position
      onSpawn({ x, y, z }); // Call the onSpawn function with the new position
    }, 100); // Spawn a bubble every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [onSpawn]);

  return null; // Spawner doesn't render anything
}

export default Spawner;