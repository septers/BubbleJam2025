import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const BubbleSpawner = ({ onBubbleSpawn, position = [0, 0, 0], spawnRate = 3000, rarity = 1 }) => {
  const meshRef = useRef();
  const lastSpawnTimeRef = useRef(0); // Store the last spawn time for timing control
  const [texture, setTexture] = useState(null); // Store the loaded texture
  const [size, setSize] = useState([1, 1]);

  // Preload and cache the texture based on rarity
  const getTextureForRarity = (rarity) => {
    const randomNumber = Math.floor(Math.random() * 5) + 1;
    switch (rarity) {
      default:
        return `/Spawners/Coral/Coral${randomNumber}.png`; // Texture for rarity 1
      case 2:
        return `/Spawners/Plant/Plant${randomNumber}.png`; // Texture for rarity 2
      case 3:
        return `/Spawners/Tank/Tank${randomNumber}.png`; // Texture for rarity 3
    }
  };

  // Load texture only once when rarity changes
  useEffect(() => {
    const texturePath = getTextureForRarity(rarity);
    const loader = new THREE.TextureLoader();
    const loadedTexture = loader.load(texturePath);
    setTexture(loadedTexture);

    // Adjust size based on rarity with subtle random variation
    const baseSize = 0.5 + rarity * 1; // Increase size based on rarity
    const randomFactor = Math.random() * 0.2 + 0.9; // Random factor for subtle size variation
    const newSize = baseSize * randomFactor;

    setSize([newSize, newSize]); // Set the size of the plane
  }, [rarity]); // Trigger only when rarity changes

  // Calculate the offset to raise the plane based on its size
  const getOffset = (size) => {
    return size[1] / 2; // Raise the plane by half of its height/width to avoid sinking into the floor
  };

  // Adjust the spawn rate based on rarity (1 - 1000ms, 2 - 500ms, 3 - 250ms)
  const spawnRates = {
    1: 2000,  // Rarity 1: 1000ms
    2: 1000,   // Rarity 2: 500ms
    3: 500    // Rarity 3: 250ms
  };
  const adjustedSpawnRate = spawnRates[rarity] || 1000; // Default to 1000ms if rarity is undefined

  // Make the BubbleSpawner always face the camera
  useFrame(({ camera }) => {
    if (meshRef.current) {
      meshRef.current.lookAt(camera.position); // Make the spawner face the camera
    }

    // Get the current time
    const currentTime = Date.now();

    // If enough time has passed, spawn a bubble
    if (currentTime - lastSpawnTimeRef.current >= adjustedSpawnRate) {
      const randomOffset = new THREE.Vector3(
        (Math.random() - 0.5) * 2, // Random offset for x
        (Math.random() - 0.5) * 2, // Random offset for y
        (Math.random() - 0.5) * 2  // Random offset for z
      );
      const spawnPosition = new THREE.Vector3(...position).add(randomOffset);

      onBubbleSpawn(spawnPosition); // Call the unique spawn handler

      // Update the last spawn time
      lastSpawnTimeRef.current = currentTime;
    }
  });

  return (
    <mesh ref={meshRef} position={new THREE.Vector3(...position).add(new THREE.Vector3(0, getOffset(size), 0))}>
      <planeGeometry args={size} /> {/* Adjust size dynamically */}
      {/* Only render the material once the texture is loaded */}
      {texture && (
        <meshStandardMaterial
          map={texture} // Use the loaded texture directly
          side={THREE.DoubleSide} // Make the plane double-sided
          transparent={true} // Enable transparency
          opacity={1} // Full opacity (adjust as needed)
        />
      )}
    </mesh>
  );
};

export default BubbleSpawner;
