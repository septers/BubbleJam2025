import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../Hooks/KeyboardControls';

export function Player() {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  const moveSpeed = 0.1; // Movement speed
  const lookSpeed = 0.002; // Mouse look sensitivity
  const isLocked = useRef(false); // Track pointer lock state

  // Track the camera's pitch and yaw
  const pitch = useRef(0); // Up/down rotation
  const yaw = useRef(0); // Left/right rotation

  // Initialize camera position
  useEffect(() => {
    camera.position.set(0, 0, 0); // Start position
  }, [camera]);

  // Handle pointer lock change
  useEffect(() => {
    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === document.body;
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  // Request pointer lock on click
  useEffect(() => {
    const handleClick = () => {
      if (!isLocked.current) {
        document.body.requestPointerLock();
      }
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);

  // Handle mouse movement for camera rotation
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isLocked.current) {
        const { movementX, movementY } = e;

        // Adjust yaw (left/right)
        yaw.current -= movementX * lookSpeed;

        // Adjust pitch (up/down)
        pitch.current -= movementY * lookSpeed;

        // Clamp pitch to prevent flipping
        pitch.current = Math.max(
          -Math.PI / 2, // Limit looking up
          Math.min(Math.PI / 2, pitch.current) // Limit looking down
        );

        // Update camera rotation
        camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ');
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, lookSpeed]);

  // Update camera position based on keyboard input
  useFrame(() => {
    const direction = new THREE.Vector3();

    // Get the forward and right vectors based on the camera's yaw (left/right rotation)
    const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);
    const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw.current);

    if (keys.current['KeyW']) direction.add(forward); // Move forward
    if (keys.current['KeyS']) direction.sub(forward); // Move backward
    if (keys.current['KeyA']) direction.sub(right); // Move left
    if (keys.current['KeyD']) direction.add(right); // Move right

    direction.normalize().multiplyScalar(moveSpeed);
    camera.position.add(direction);
  });

  return null;
}