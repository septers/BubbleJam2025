import React, { forwardRef } from 'react';
import * as THREE from 'three';

const Aquarium = forwardRef((props, ref) => {
  return (
    <group ref={ref}>
      {/* Bottom Plane */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial color="navajowhite" />
      </mesh>

      {/* Top Plane */}
      <mesh position={[0, 8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 40]} />
        <meshStandardMaterial
          color={new THREE.Color(0x0077be)}
          transparent={true}
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Front Plane */}
      <mesh position={[0, 3, -20]} rotation={[0, 0, 0]}>
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

      {/* Back Plane */}
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

      {/* Left Plane */}
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

      {/* Right Plane */}
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
    </group>
  );
});

export default Aquarium;
