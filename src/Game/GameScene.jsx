import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Bubble from './Bubble';
import BaseSpawner from './BaseBubbleSpawner';
import BubbleSpawner from './PurchasedBubbleSpawner.jsx';
import {Player} from './Player';
import Fish from './Fish';
import Aquarium from './Aquarium';
import Skybox from './Skybox';
import { v4 as uuidv4 } from 'uuid';
import './Gamescene.css';

function GameScene({ onBackToMenu }) {
  const [money, setMoney] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [intersectPoint, setIntersectPoint] = useState(null);
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [placedSpheres, setPlacedSpheres] = useState([]);

  const [currentItem, setCurrentItem] = useState('box'); // Track the current item you're holding (default is 'box')
  const [inventory, setInventory] = useState([]); // Store inventory items

  const [fishes, setFishes] = useState([]);
  const [spawners, setSpawners] = useState([]);
  
  const cameraRef = useRef();
  const aquariumPlanesRef = useRef([]);
  const canvasRef = useRef();
  const menuRef = useRef(); // Reference to the whole menu (including shop sidebar)
  const gameUIRef = useRef(); // Reference to the UI elements (currency and back button)


  const handlePlaceFish = (position) => {
    const id = generateUniqueId();
    setFishes((prevFishes) => [
      ...prevFishes,
      { id, position, ref: null },
    ]);
  };
  
  const handleBubblePoppedByFish = (id) => {
    setMoney((prevMoney) => prevMoney + 1);
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  const handleSpawn = (position) => {
    const id = generateUniqueId();
    // Add a spawnerId to the bubble so we can track which spawner created it
    setBubbles((prevBubbles) => [
      ...prevBubbles,
      { id, position},
    ]);
  };
  
  const generateUniqueId = () => {
    return uuidv4();
  };

  const addSpawner = (position) => {
    const id = generateUniqueId();
    setSpawners((prevSpawners) => [...prevSpawners, { id, position }]);
  };

  const handleBubbleClick = (id) => {
    setMoney((prevMoney) => prevMoney + 1);
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  const handleBubbleRemove = (id) => {
    setBubbles((prevBubbles) => prevBubbles.filter((bubble) => bubble.id !== id));
  };

  const handlePointerLockRequest = () => {
    if (!isPointerLocked) {
      console.log("Requesting pointer lock...");
      canvasRef.current.requestPointerLock();
    }
  };

  useEffect(() => {
    const handleClick = (e) => {
      console.log("clicked");
      
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

          console.log("Holding",currentItem);
          // If the sphere is purchased, add a new sphere to the placedSpheres array
          if (currentItem == "Sphere") {
            setPlacedSpheres((prevSpheres) => [
              ...prevSpheres,
              firstIntersect.point,
            ]);
            useItem("Sphere",1);
          }

          if (currentItem == "Fish") {
            handlePlaceFish(firstIntersect.point);
            useItem("Fish",1);
          }

          if (currentItem == "Spawner") {
            addSpawner(firstIntersect.point);
            useItem("Spawner",1);
          }


          // Handle bubble click
          if (bubbles.some((bubble) => bubble.ref === firstIntersect.object)) {
            const clickedBubble = bubbles.find((bubble) => bubble.ref === firstIntersect.object);
            handleBubbleClick(clickedBubble.id);
          }
        };
      }

      var islocked = document.pointerLockElement;
      if(islocked){
        console.log("Locked and sending click")
        window.addEventListener('click', handleClick);
        return () => {
          window.removeEventListener('click', handleClick);
        }
    };
  }, [bubbles]);

  const toggleShop = () => {
    setIsShopOpen((prev) => {
      const newShopState = !prev;
      return newShopState;
    });
  };

  // Handle the purchase of the sphere for 1 bubble
  const purchaseItem = (itemName, itemPrice) => {
    // Check if we can buy the item
    if (money >= itemPrice) {
      // Remove the money to purchase the item
      setMoney((prevMoney) => prevMoney - itemPrice);
      // Check if the item is already owned (present in the inventory)
      const ownedItemIndex = inventory.findIndex((invItem) => invItem.name === itemName);
      if (ownedItemIndex !== -1) {
        // Item is already owned, increment the quantity
        const updatedInventory = [...inventory];
        updatedInventory[ownedItemIndex].quantity += 1; // Assuming the item has a 'quantity' field
        setInventory(updatedInventory);
      } else {
        // Item is not owned, add it to the inventory
        const newItem = {
          name: itemName,
          quantity: 1, // Add the item with quantity 1 when purchased
          image: 'path/to/item/image.png', // Set the image for the item (adjust as necessary)
        };
        setInventory((prevInventory) => [...prevInventory, newItem]);
      }
    } else {
      console.log("Not enough money to purchase item.");
    }
  };

  const useItem = (itemName, qtyUsed) => {
    const ownedItemIndex = inventory.findIndex((invItem) => invItem.name === itemName);
    const updatedInventory = [...inventory];
  
    if (ownedItemIndex !== -1 && qtyUsed <= updatedInventory[ownedItemIndex].quantity) {
      updatedInventory[ownedItemIndex].quantity -= qtyUsed;
  
      // Remove the item from the inventory if its quantity reaches 0
      if (updatedInventory[ownedItemIndex].quantity <= 0) {
        updatedInventory.splice(ownedItemIndex, 1); // Remove the item from the array
        setCurrentItem('box');
      }
  
      setInventory(updatedInventory); // Update the state with the modified inventory
      console.log(`Used ${qtyUsed} ${itemName}(s).`);
    } else {
      console.log(`Not enough ${itemName}(s) to use or item not found.`);
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
        onClick={handlePointerLockRequest} // Allow pointer lock on canvas click
        style={{
          transition: 'width 0.5s ease',
          width: isShopOpen ? 'calc(100% - 300px)' : '100%',
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
        <BaseSpawner onSpawn={handleSpawn} />

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

        {/* Render bubble Spawners */}
        {spawners.map((spawner) => (
          <BubbleSpawner
            key={spawner.id}
            spawnerId={spawner.id}  // Pass the spawnerId to the BubbleSpawner
            position={spawner.position}
            spawnRate={100} // Customize spawn rate here
            onBubbleSpawn={(bubblePosition) => handleSpawn(bubblePosition, spawner.id)} // Pass the spawnerId
          />
        ))}

        {/* Render all placed Fish */}
        {fishes.map((fish) => (
          <Fish
            key={fish.id}
            position={fish.position}
            bubbles={bubbles} // Pass bubbles to fish for targeting
            onBubblePopped={handleBubblePoppedByFish}
            ref={(ref) => {
              if (ref) {
                fish.ref = ref;
              }
            }}
          />
        ))}

        {/* Render all placed spheres */}
        {placedSpheres.map((position, index) => (
          <mesh key={index} position={position}>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        ))}

        {/* Render a box or sphere at the intersection point */}
        {intersectPoint && (
          <mesh position={[intersectPoint.x, intersectPoint.y, intersectPoint.z]}>
            {currentItem === 'box' ? (
              <>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="red" />
              </>
            ) : (
              <>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="blue" />
              </>
            )}
          </mesh>
        )}
      </Canvas>

      {/* Crosshair dot at the center of the screen */}
      <div className='Crosshair'
        style={{ left: isShopOpen ? 'calc(50% - 150px)' : '50%' }}
      />
      {/* Pointer lock instructions */}
      <div
        className='PlockInst'
        style={{ left: isShopOpen ? 'calc(50% - 150px)' : 'calc(50% - 100px)' }}
      >
        {!document.pointerLockElement ? (
          <p>Click to enter submarine</p>
        ) : (
          <p>Hit ESC to exit submarine</p>
        )}
      </div>

      {/*Inventory */}
      <div className='Inventory'>
        <div className='HeldItem'>{currentItem}</div>
        <div className='Backpack'>
          {inventory.map((InventoryItem) =>(
            <div onClick={()=>setCurrentItem(InventoryItem.name)}>
              {InventoryItem.name} x {InventoryItem.quantity}
            </div>
          ))}
        </div>
      </div>

      {/* Shop button */}
      <div className='ShopButton'
        onClick={toggleShop}
      >
        {isShopOpen ? 'Close Shop' : 'Open Shop'}
      </div>

      {/* Shop Sidebar */}
      <div className='ShopSidebar'
        ref={menuRef}
        style={{ width: isShopOpen ? '300px' : '0px' }}
      >
        {isShopOpen && (
          <div style={{ padding: '20px' }}>
            <h2>Shop</h2>
            <p>Bubbles: {money}</p>
            <button onClick={() => purchaseItem("Sphere", 1)}>Buy Sphere (1)</button>
            <button onClick={() => purchaseItem("Fish", 1)}>Buy Fish (1)</button>
            <button onClick={() => purchaseItem("Spawner", 1)}>Spawner (1)</button>
          </div>
        )}
      </div>

      {/* Game UI */}
      <div
        className='GameUI'
        ref={gameUIRef}
      >
        <p className='BubbleCount'>Bubbles: {money}</p>
      </div>
    </>
  );
}

export default GameScene;
