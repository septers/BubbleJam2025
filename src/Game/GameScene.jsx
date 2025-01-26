import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Bubble from './Bubble';
import Spawner from './Spawner';
import { Player } from './Player';
import Aquarium from './Aquarium';
import Skybox from './Skybox';

function GameScene({ onBackToMenu }) {
  const [money, setMoney] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [intersectPoint, setIntersectPoint] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSpherePurchased, setIsSpherePurchased] = useState(false);
  const cameraRef = useRef();
  const aquariumPlanesRef = useRef([]);
  const canvasRef = useRef();
  const menuRef = useRef(); // Reference to the whole menu (including shop sidebar)
  const gameUIRef = useRef(); // Reference to the UI elements (currency and back button)

  const handleSpawn = (position) => {
    const id = Date.now();
    setBubbles((prevBubbles) => [
      ...prevBubbles,
      { id, position, ref: null },
    ]);
  };

  const handleBubbleClick = (id) => {
    setMoney((prevMoney) => prevMoney + 1);
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  const handleBubbleRemove = (id) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  // Handle pointer lock change events
  const handlePointerLockChange = () => {
    setIsPointerLocked(!!document.pointerLockElement);
  };

  useEffect(() => {
    // Listen for pointer lock events
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('mozpointerlockchange', handlePointerLockChange);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('mozpointerlockchange', handlePointerLockChange);
    };
  }, []);

  const handlePointerLock = () => {
    if (!isPointerLocked && !isShopOpen) {
      canvasRef.current.requestPointerLock();
    }
  };

  const handleEscape = () => {
    if (isPointerLocked) {
      document.exitPointerLock();
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      // Prevent pointer lock when clicking inside the shop menu or UI
      if (menuRef.current && menuRef.current.contains(e.target)) {
        return; // Skip pointer lock if click is inside the shop menu
      }

      if (gameUIRef.current && gameUIRef.current.contains(e.target)) {
        return; // Skip pointer lock if click is inside the game UI (currency or back button)
      }

      if (!cameraRef.current) return;

      const raycaster = new THREE.Raycaster();
      const center = new THREE.Vector2(0, 0);
      raycaster.setFromCamera(center, cameraRef.current);

      const intersectObjects = bubbles
        .map((bubble) => bubble.ref)
        .filter((ref) => ref !== null);

      const allObjects = [
        ...intersectObjects,
        ...aquariumPlanesRef.current,
      ];

      const intersects = raycaster.intersectObjects(allObjects, true);
      if (intersects.length > 0) {
        const firstIntersect = intersects[0];
        setIntersectPoint(firstIntersect.point);

        // If the sphere is purchased, create a sphere at the intersection point
        if (isSpherePurchased) {
          const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
          const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(firstIntersect.point.x, firstIntersect.point.y, firstIntersect.point.z);
          scene.add(sphere); // Assuming `scene` is available, this may need adjustment depending on your setup.
          setIsSpherePurchased(false); // Reset after placing
        }

        // Handle bubble click
        if (bubbles.some((bubble) => bubble.ref === firstIntersect.object)) {
          const clickedBubble = bubbles.find((bubble) => bubble.ref === firstIntersect.object);
          handleBubbleClick(clickedBubble.id);
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [bubbles, isSpherePurchased]);

  const toggleShop = () => {
    setIsShopOpen((prev) => {
      if (!prev) {
        document.exitPointerLock(); // Exit pointer lock when opening the shop
      }
      return !prev;
    });
  };

  // Handle the purchase of the sphere for 10 bubbles
  const purchaseSphere = () => {
    console.log("buy")
    if (money >= 10) {
      setMoney((prevMoney) => prevMoney - 10);
      setIsSpherePurchased(true);
    }
  };

  return (
    <>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 10], fov: 75 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera;
        }}
        onClick={handlePointerLock} // Allow pointer lock on canvas click
        style={{
          transition: 'width 0.5s ease',
          width: isShopOpen ? 'calc(100% - 300px)' : '100%',
          pointerEvents: isShopOpen ? 'none' : 'auto', // Disable canvas pointer events when shop is open
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <Skybox />
        <Aquarium
          ref={(ref) => {
            if (ref && ref.children) {
              aquariumPlanesRef.current = ref.children;
            }
          }}
        />
        <Player />
        <Spawner onSpawn={handleSpawn} />

        {/* Render bubbles */}
        {bubbles.map((bubble) => (
          <Bubble
            key={bubble.id}
            position={[bubble.position.x, bubble.position.y, bubble.position.z]}
            onClick={() => handleBubbleClick(bubble.id)}
            onRemove={() => handleBubbleRemove(bubble.id)}
            ref={(ref) => {
              if (ref) {
                bubble.ref = ref;
              }
            }}
          />
        ))}

        {/* Render a box at the intersection point */}
        {intersectPoint && !isSpherePurchased && (
          <mesh position={[intersectPoint.x, intersectPoint.y, intersectPoint.z]}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color="red" />
          </mesh>
        )}
      </Canvas>

      {/* Crosshair dot at the center of the screen */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: isShopOpen ? 'calc(50% - 150px)' : '50%', // Offset left when shop is open
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />


      {/* Pointer lock instructions */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          left: isShopOpen ? 'calc(50% - 300px)' : 'calc(50% - 100px)',
          fontSize: '18px',
          color: 'white',
          pointerEvents: 'none',
        }}
      >
        {!isPointerLocked ? (
          <p>Click to enter submarine</p>
        ) : (
          <p>Hit ESC to exit submarine</p>
        )}
      </div>

      {/* Shop button */}
      <div
        onClick={toggleShop}
        style={{
          position: 'absolute',
          top: '50%',
          right: '0',
          transform: 'translateY(-50%)',
          backgroundColor: 'green',
          color: 'white',
          padding: '10px',
          cursor: 'pointer',
          zIndex: 100,
          borderRadius: '5px 0 0 5px',
        }}
      >
        {isShopOpen ? 'Close Shop' : 'Open Shop'}
      </div>

      {/* Shop Sidebar */}
      <div
        ref={menuRef}
        style={{
          position: 'absolute',
          top: '0',
          right: '0',
          height: '100%',
          width: isShopOpen ? '600px' : '0',
          backgroundColor: '#222',
          color: 'white',
          transition: 'width 0.5s ease',
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {isShopOpen && (
          <div style={{ padding: '20px' }}>
            <h2>Shop</h2>
            <p>Money: {money}</p>
            <button onClick={purchaseSphere}>Buy Sphere (10)</button>
          </div>
        )}
      </div>

      {/* Game UI */}
      <div
        ref={gameUIRef}
        style={{
          position: 'fixed',
          top: '0px',
          left: '20px',
          color: 'white',
          fontSize: '18px',
          zIndex: 200,
        }}
      >
        <p>Bubbles: {money}</p>
      </div>
    </>
  );
}

export default GameScene;
