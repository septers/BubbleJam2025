import React, { useEffect } from 'react';
import * as THREE from 'three';

const BubbleSpawner = ({ onBubbleSpawn, position = [0, 0, 0], spawnRate = 3000 }) => {
  useEffect(() => {
    // Spawn bubbles unique to this spawner
    const interval = setInterval(() => {
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 2, // Random offset for x
        (Math.random() - 0.5) * 2, // Random offset for y
        (Math.random() - 0.5) * 2  // Random offset for z
      );
      const spawnPosition = new THREE.Vector3(...position).add(randomOffset);

      onBubbleSpawn(spawnPosition); // Call the unique spawn handler
    }, spawnRate);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [onBubbleSpawn, position, spawnRate]);

  return (
    <mesh position={new THREE.Vector3(...position)}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default BubbleSpawner;
