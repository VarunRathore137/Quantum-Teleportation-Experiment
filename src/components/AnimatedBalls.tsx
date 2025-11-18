'use client';
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Individual animated ball component
function AnimatedBall({ 
  position, 
  color, 
  speed = 1,
  distortion = 0.3 
}: { 
  position: [number, number, number];
  color: string;
  speed?: number;
  distortion?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const baseYRef = useRef(position[1]);

  // Update base Y when position changes
  useEffect(() => {
    baseYRef.current = position[1];
  }, [position[1]]);

  // Animation loop
  useFrame((state) => {
    if (meshRef.current) {
      // Rotate the ball
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      
      // Update X and Z positions from props
      meshRef.current.position.x = position[0];
      meshRef.current.position.z = position[2];
      
      // Floating animation (up and down) - use baseYRef which updates when position changes
      meshRef.current.position.y = baseYRef.current + Math.sin(state.clock.elapsedTime * speed) * 0.5;
      
      // Gentle rotation around its own axis
      meshRef.current.rotation.z += 0.005 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={distortion}
        speed={2}
        roughness={0.1}
        metalness={0.8}
      />
    </Sphere>
  );
}

// Function to move balls (can be called externally)
export interface BallControls {
  moveBall1: (x: number, y: number, z: number) => void;
  moveBall2: (x: number, y: number, z: number) => void;
  resetPositions: () => void;
}

// Main component
export function AnimatedBalls({ 
  onControlsReady 
}: { 
  onControlsReady?: (controls: BallControls) => void;
}) {
  // Use state instead of refs for positions so React re-renders when they change
  const [ball1Position, setBall1Position] = useState<[number, number, number]>([-3, 0, 0]);
  const [ball2Position, setBall2Position] = useState<[number, number, number]>([3, 0, 0]);

  // Expose control functions in useEffect to avoid calling during render
  useEffect(() => {
    if (onControlsReady) {
      onControlsReady({
        moveBall1: (x: number, y: number, z: number) => {
          setBall1Position([x, y, z]);
        },
        moveBall2: (x: number, y: number, z: number) => {
          setBall2Position([x, y, z]);
        },
        resetPositions: () => {
          setBall1Position([-3, 0, 0]);
          setBall2Position([3, 0, 0]);
        }
      });
    }
  }, [onControlsReady]);

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} />

      {/* Ball 1 - Cyan/Blue */}
      <AnimatedBall
        position={ball1Position}
        color="#00d9ff"
        speed={1.2}
        distortion={0.4}
      />

      {/* Ball 2 - Magenta/Pink */}
      <AnimatedBall
        position={ball2Position}
        color="#ff00d9"
        speed={0.8}
        distortion={0.3}
      />

      {/* Camera controls (optional - allows user to rotate view) */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        autoRotate={false}
      />
    </Canvas>
  );
}

// Alternative simpler version without controls
export function SimpleAnimatedBalls() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <AnimatedBall position={[-3, 0, 0]} color="#00d9ff" speed={1.2} />
      <AnimatedBall position={[3, 0, 0]} color="#ff00d9" speed={0.8} />

      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  );
}