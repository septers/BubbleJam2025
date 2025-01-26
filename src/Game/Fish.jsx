import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const Fish = ({ position, bubbles, onBubblePopped, rarity = 1 }) => {
  const fishRef = useRef();
  const [texture, setTexture] = useState(null); // Store the loaded texture
  const [speedVariation, setSpeedVariation] = useState(1);

  // Determine the texture for the fish based on rarity
  const getTextureForRarity = (rarity) => {
    const randomNumber = Math.floor(Math.random() * 5) + 1; // Pick a random image between 1 and 5
    switch (rarity) {
      default:
        return `/Fish/SlowFish/Slow${randomNumber}.png`; // Texture for rarity 1
      case 2:
        return `/Fish/NormalFish/Normal${randomNumber}.png`; // Texture for rarity 2
      case 3:
        return `/Fish/FastFish/Fast${randomNumber}.png`; // Texture for rarity 3
    }
  };

  // Preload and set the texture only when rarity changes
  useEffect(() => {
    const texturePath = getTextureForRarity(rarity);
    const loader = new THREE.TextureLoader();
    const loadedTexture = loader.load(texturePath);
    setTexture(loadedTexture); // Set the loaded texture

    // Generate random speed variation factor between 0.8 and 1.2 (20% variation)
    setSpeedVariation(Math.random() * 0.6 + 0.4);
  }, [rarity]); // This effect will only run when rarity changes

  // Adjust size based on rarity
  const getSizeForRarity = (rarity) => {
    switch (rarity) {
      default:
        return 1; // Default size
      case 2:
        return 1.75; // Slightly larger
      case 3:
        return 2.5; // Much larger
    }
  };

  // Adjust speed based on rarity
  const getSpeedForRarity = (rarity) => {
    switch (rarity) {
      default:
        return 0.02; // Slower speed for rarity 1
      case 2:
        return 0.05; // Medium speed for rarity 2
      case 3:
        return 0.07; // Faster speed for rarity 3
    }
  };

  useFrame(() => {
    if (!fishRef.current || bubbles.length === 0) return;

    // Get fish's current position
    const fishPosition = new THREE.Vector3();
    fishRef.current.getWorldPosition(fishPosition);

    // Find the nearest bubble
    let nearestBubble = null;
    let shortestDistance = Infinity;

    bubbles.forEach((bubble) => {
      if (!bubble.ref) return;

      const bubblePosition = new THREE.Vector3();
      bubble.ref.getWorldPosition(bubblePosition);

      const distance = fishPosition.distanceTo(bubblePosition);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestBubble = bubble;
      }
    });

    // Move toward the nearest bubble
    if (nearestBubble) {
      const bubblePosition = new THREE.Vector3();
      nearestBubble.ref.getWorldPosition(bubblePosition);

      const direction = bubblePosition.sub(fishPosition).normalize();
      const baseSpeed = getSpeedForRarity(rarity); // Base speed based on rarity
      const adjustedSpeed = baseSpeed * speedVariation; // Apply random speed variation
      fishRef.current.position.add(direction.multiplyScalar(adjustedSpeed));

      // Rotate the fish to face the bubble
      fishRef.current.lookAt(bubblePosition);

      // Check if the fish is close enough to pop the bubble
      if (shortestDistance < 0.5) {
        onBubblePopped(nearestBubble.id);
      }
    }
  });

  return (
    <mesh
      ref={fishRef}
      position={position}
      scale={[getSizeForRarity(rarity), getSizeForRarity(rarity), getSizeForRarity(rarity)]} // Adjust scale based on rarity
    >
      <planeGeometry args={[1, 0.5]} /> {/* Adjust size to fit the fish image */}
      {/* Only render the material once the texture is loaded */}
      {texture && (
        <meshStandardMaterial
          map={texture} // Use the loaded texture directly
          side={THREE.DoubleSide} // Make the plane double-sided
          transparent={true} // Ensure the fish image has transparency
        />
      )}
    </mesh>
  );
};

export default Fish;
