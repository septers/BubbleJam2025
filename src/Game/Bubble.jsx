import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Bubble({ position, onClick, onRemove }) {
  const meshRef = useRef(); // Reference to the bubble's mesh

  // Create a custom material with two-tone colors and transparency
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x3bbfeb), // Light blue base color
    emissive: new THREE.Color(0x3bbfeb), // Slightly darker blue for emissive effect
    transparent: true, // Enable transparency
    opacity: 0.8, // Set opacity (0 = fully transparent, 1 = fully opaque)
    metalness: 0.1, // Slight metallic effect
    roughness: 0.5, // Slight roughness for a softer look
    clearcoat: 0.5, // Add a clear coat for a shiny effect
    clearcoatRoughness: 0.1, // Smooth out the clear coat
  });

  // Animate the bubble to float upward
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y += 0.01; // Move the bubble upward
      // Optional: Add a slight horizontal movement for a more natural effect
      meshRef.current.position.x += Math.sin(Date.now() * 0.001) * 0.005;

      // Remove the bubble if it goes off-screen and onRemove is provided
      if (meshRef.current.position.y > 10 && onRemove) {
        onRemove(); // Call the onRemove callback
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <sphereGeometry args={[0.2, 32, 32]} />
      <primitive object={material} attach="material" /> {/* Use the custom material */}
    </mesh>
  );
}

export default Bubble;