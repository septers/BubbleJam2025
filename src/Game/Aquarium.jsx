import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Aquarium({ }) {

  return (

    <>
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[20, 40]} /> {/* Width and height of the plane */}
          <meshStandardMaterial color="navajowhite" /> {/* Color of the plane */}
      </mesh>

      <mesh position={[0, 8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 40]} /> {/* Adjust size to fit the tank */}
        <meshStandardMaterial
          color={new THREE.Color(0x0077be)} // Light blue color
          transparent={true}
          opacity={0.5} // Semi-transparent
          side={THREE.DoubleSide} // Render both sides
        />
      </mesh>

      <mesh position={[0, 3, -20]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshPhysicalMaterial
        color={new THREE.Color(0xadd8e6)} // Light blue tint
        transparent={true}
        opacity={0.8} // Slightly transparent
        metalness={0.1} // Slight metallic effect
        roughness={0.2} // Smooth surface
        clearcoat={0.5} // Clear coat for a shiny look
        clearcoatRoughness={0.1} // Smooth clear coat
        />
      </mesh>

        <mesh position={[0, 3, 20]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[20, 10]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0xadd8e6)}
            transparent={true}
            opacity={0.8}
            metalness={0.1}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>

        <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[40, 10]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0xadd8e6)}
            transparent={true}
            opacity={0.8}
            metalness={0.1}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>

        <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[40, 10]} />
          <meshPhysicalMaterial
            color={new THREE.Color(0xadd8e6)}
            transparent={true}
            opacity={0.8}
            metalness={0.1}
            roughness={0.2}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>
    </>

  );
}

export default Aquarium;