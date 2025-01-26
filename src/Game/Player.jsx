import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useKeyboardControls } from '../Hooks/KeyboardControls';
import { Line } from '@react-three/drei'; // Import Line for visualization

export function Player({ bubbles, bubbleClick }) {
  const { camera, scene } = useThree();
  const keys = useKeyboardControls();
  const moveSpeed = 0.25; // Movement speed
  const lookSpeed = 0.002; // Mouse look sensitivity
  const isLocked = useRef(false); // Track pointer lock state

  // Track the camera's pitch and yaw
  const pitch = useRef(0); // Up/down rotation
  const yaw = useRef(0); // Left/right rotation

  // Define the aquarium boundaries
  const aquariumBounds = {
    minX: -9, // Left wall
    maxX: 9,  // Right wall
    minY: -2, // Floor
    maxY: 8,  // Water surface (top of the tank)
    minZ: -19, // Back wall
    maxZ: 19,  // Front wall
  };

  // Raycaster for detecting bubbles
  const raycaster = useRef(new THREE.Raycaster());
  const raycastDistance = 40; // Increased raycast distance

  // Reference for the raycast line visualization
  const raycastLineRef = useRef();

  // Reference for the box at the raycast endpoint
  const boxRef = useRef();

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
      } else {
        // Perform raycasting only when in pointer lock mode and the user clicks
        performRaycasting();
      }
    };

    document.body.addEventListener('click', handleClick);

    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [bubbles]); // Add bubbles as a dependency to ensure the latest state is used

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

  // Function to perform raycasting
  const performRaycasting = () => {
    if (bubbles && bubbles.length > 0) {
      // Set the raycaster's origin and direction
      raycaster.current.setFromCamera(new THREE.Vector2(0, 0), camera);

      // Perform raycasting
      const intersects = raycaster.current.intersectObjects(bubbles, true);

      // Handle intersections
      if (intersects.length > 0) {
        const closestIntersection = intersects[0];
        bubbleClick(closestIntersection.object.id); // Call the bubbleClick callback
        scene.remove(closestIntersection.object); // Remove the bubble from the scene
      }

      // Visualize the raycast line
      const rayOrigin = camera.position.clone();
      const rayDirection = raycaster.current.ray.direction.clone();
      const rayEnd = new THREE.Vector3().addVectors(
        rayOrigin,
        rayDirection.multiplyScalar(raycastDistance)
      );

      // Update the box position at the raycast endpoint
      if (boxRef.current) {
        boxRef.current.position.copy(rayEnd);
      }
    }
  };

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

    // Clamp camera position within aquarium boundaries
    camera.position.x = THREE.MathUtils.clamp(
      camera.position.x,
      aquariumBounds.minX,
      aquariumBounds.maxX
    );
    camera.position.y = THREE.MathUtils.clamp(
      camera.position.y,
      aquariumBounds.minY,
      aquariumBounds.maxY
    );
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      aquariumBounds.minZ,
      aquariumBounds.maxZ
    );
  });

  return (
    <>
      {/* Box at the raycast endpoint */}
      <mesh ref={boxRef}>
        <boxGeometry args={[1, 1, 1]} /> {/* Small box */}
        <meshStandardMaterial color="yellow" /> {/* Yellow color for visibility */}
      </mesh>
    </>
  );
}