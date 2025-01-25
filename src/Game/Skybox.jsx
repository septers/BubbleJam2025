import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Skybox() {
  const { scene } = useThree();

  useEffect(() => {
    // Create a new CubeTextureLoader
    const loader = new THREE.CubeTextureLoader();

    // Load the skybox textures
    const texture = loader.load(
      [
        '/skybox/posx.jpg', // Right
        '/skybox/negx.jpg', // Left
        '/skybox/posy.jpg', // Top
        '/skybox/negy.jpg', // Bottom
        '/skybox/posz.jpg', // Back
        '/skybox/negz.jpg', // Front
      ],
      () => {
        console.log('Skybox textures loaded successfully!');
      },
      (progress) => {
        console.log('Loading progress:', progress);
      },
      (error) => {
        console.error('Error loading skybox textures:', error);
      }
    );

    // Set the scene background to the loaded texture
    scene.background = texture;

    // Cleanup on unmount (optional)
    return () => {
      scene.background = null;
    };
  }, [scene]);

  return null;
}

export default Skybox;