import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const Fish = ({ position, bubbles, onBubblePopped }) => {
  const fishRef = useRef();

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
      const step = 0.05; // Speed of the fish
      fishRef.current.position.add(direction.multiplyScalar(step));

      // Check if the fish is close enough to pop the bubble
      if (shortestDistance < 0.5) {
        onBubblePopped(nearestBubble.id);
      }
    }
  });

  return (
    <mesh ref={fishRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

export default Fish;
