import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../Hooks/KeyboardControls';

export function Player() {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const moveSpeed = 0.05; // Movement speed
  const lookSpeed = 0.002; // Mouse look sensitivity

  const pitch = useRef(0); // Up/down rotation
  const yaw = useRef(0); // Left/right rotation

  const aquariumBounds = {
    minX: -9,
    maxX: 9,
    minY: -1,
    maxY: 7,
    minZ: -19,
    maxZ: 19,
  };

  useEffect(() => {
    camera.position.set(0, 0, 0); // Start position
  }, [camera]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const isLocked = document.pointerLockElement;
      if (isLocked) {
        // Update camera rotation based on mouse movement
        const { movementX, movementY } = e;

        yaw.current -= movementX * lookSpeed;
        pitch.current -= movementY * lookSpeed;

        pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current));
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, lookSpeed]);

  useFrame(() => {
    const direction = new THREE.Vector3();
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    // Horizontal movement
    if (keys.current['KeyW']) direction.add(forward);
    if (keys.current['KeyS']) direction.sub(forward);
    if (keys.current['KeyA']) direction.sub(right);
    if (keys.current['KeyD']) direction.add(right);

    // Vertical movement
    if (keys.current['KeyE']) direction.y += moveSpeed; // Rise
    if (keys.current['KeyQ']) direction.y -= moveSpeed; // Lower

    direction.normalize().multiplyScalar(moveSpeed);
    camera.position.add(direction);

    // Clamp camera position within aquarium bounds
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, aquariumBounds.minX, aquariumBounds.maxX);
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, aquariumBounds.minY, aquariumBounds.maxY);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, aquariumBounds.minZ, aquariumBounds.maxZ);
  });

  return null; // No need to render anything here
}
