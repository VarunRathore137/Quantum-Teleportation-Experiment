import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTeleportationStore } from '@/state/teleportationStore';

interface Qubit3DProps {
   type: 'alice' | 'bob' | 'message';
   position: [number, number, number];
   showSuperposition?: boolean;
   isEntangled?: boolean;
   isMeasuring?: boolean;
   onClick?: () => void;
}

export const Qubit3D = ({
   type,
   position,
   showSuperposition = false,
   isEntangled = false,
   isMeasuring = false,
   onClick,
}: Qubit3DProps) => {
   const meshRef = useRef<THREE.Mesh>(null);
   const glowRef = useRef<THREE.Mesh>(null);
   const auraRef = useRef<THREE.Points>(null);
   const [hovered, setHovered] = useState(false);

   const qubits = useTeleportationStore((state) => state.qubits);
   const qubitData = qubits[type];

   const colors = {
      alice: '#dc2626',     // Warm red hsl(0, 85%, 55%) -> #dc2626
      bob: '#00e5ff',       // Quantum cyan
      message: '#22c55e',   // Green
   };

   const color = colors[type];

   // Handle click - check if Hadamard gate is selected
   const handleClick = () => {
      if (onClick) {
         onClick();
      }
      // Check if Hadamard gate is selected and this is Alice
      if (type === 'alice' && typeof window !== 'undefined') {
         const applyFn = (window as any).__hadamardApply;
         if (applyFn) {
            applyFn();
         }
      }
   };

   // Idle floating animation
   useFrame((state) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + position[0]) * 0.1;
      meshRef.current.rotation.y = time * 0.3;

      // Glow pulse
      if (glowRef.current) {
         const scale = 1.2 + Math.sin(time * 2) * 0.1;
         glowRef.current.scale.setScalar(scale);
      }

      // Superposition aura animation
      if (auraRef.current && showSuperposition) {
         auraRef.current.rotation.y = time * 2;
         auraRef.current.rotation.x = time * 0.5;
      }
   });

   // Generate aura particles for superposition effect
   const auraParticles = useRef<Float32Array>();
   if (!auraParticles.current) {
      const count = 200;
      auraParticles.current = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
         const theta = Math.random() * Math.PI * 2;
         const phi = Math.random() * Math.PI;
         const radius = 0.5 + Math.random() * 0.3;
         auraParticles.current[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
         auraParticles.current[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
         auraParticles.current[i * 3 + 2] = radius * Math.cos(phi);
      }
   }

   if (!qubitData.visible && type === 'message') {
      return null;
   }

   return (
      <group position={position}>
         {/* Main qubit sphere */}
         <mesh
            ref={meshRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onClick={handleClick}
         >
            <icosahedronGeometry args={[0.35, 2]} />
            <meshStandardMaterial
               color={color}
               emissive={color}
               emissiveIntensity={hovered ? 0.8 : 0.4}
               metalness={0.3}
               roughness={0.4}
            />
         </mesh>

         {/* Outer glow */}
         <mesh ref={glowRef}>
            <sphereGeometry args={[0.45, 32, 32]} />
            <meshBasicMaterial
               color={color}
               transparent
               opacity={0.15}
               side={THREE.BackSide}
            />
         </mesh>

         {/* Superposition aura (fire-like effect) */}
         {showSuperposition && (
            <points ref={auraRef}>
               <bufferGeometry>
                  <bufferAttribute
                     attach="attributes-position"
                     count={200}
                     array={auraParticles.current!}
                     itemSize={3}
                  />
               </bufferGeometry>
               <pointsMaterial
                  size={0.05}
                  color="#ffd700"
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
               />
            </points>
         )}

         {/* Entanglement indicator ring */}
         {isEntangled && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
               <torusGeometry args={[0.55, 0.02, 8, 32]} />
               <meshBasicMaterial color="#a855f7" transparent opacity={0.8} />
            </mesh>
         )}

         {/* Measurement spotlight cone */}
         {isMeasuring && (
            <mesh position={[0, 1.5, 0]} rotation={[Math.PI, 0, 0]}>
               <coneGeometry args={[0.8, 2, 32, 1, true]} />
               <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0.2}
                  side={THREE.DoubleSide}
               />
            </mesh>
         )}

         {/* Label */}
         <Html
            position={[0, -0.7, 0]}
            center
            style={{
               pointerEvents: 'none',
               userSelect: 'none',
            }}
         >
            <div className="text-center font-quantum text-xs whitespace-nowrap">
               <div className="text-white font-semibold">{qubitData.label}</div>
               <div className="text-white/70 text-[10px]">{qubitData.state}</div>
            </div>
         </Html>
      </group>
   );
};
