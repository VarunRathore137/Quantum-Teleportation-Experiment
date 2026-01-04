import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTeleportationStore } from '@/state/teleportationStore';

interface HadamardGateProps {
   initialPosition: [number, number, number];
   targetPosition: [number, number, number];
   onApplied: () => void;
   isActive: boolean;
}

export const HadamardGate = ({
   initialPosition,
   targetPosition,
   onApplied,
   isActive,
}: HadamardGateProps) => {
   const meshRef = useRef<THREE.Group>(null);
   const [isSelected, setIsSelected] = useState(false);
   const [isApplied, setIsApplied] = useState(false);
   const [isAnimating, setIsAnimating] = useState(false);
   const animationProgress = useRef(0);

   const triggerWrongStepShake = useTeleportationStore((state) => state.triggerWrongStepShake);
   const isTourMode = useTeleportationStore((state) => state.isTourMode);

   // Floating and animation
   useFrame((state, delta) => {
      if (!meshRef.current) return;

      const time = state.clock.elapsedTime;

      if (isAnimating) {
         // Animate towards Alice qubit
         animationProgress.current = Math.min(1, animationProgress.current + delta * 3);
         const t = animationProgress.current;
         const easeT = t * t * (3 - 2 * t); // Smooth step

         meshRef.current.position.x = initialPosition[0] + (targetPosition[0] - initialPosition[0]) * easeT;
         meshRef.current.position.y = initialPosition[1] + (targetPosition[1] - initialPosition[1]) * easeT;
         meshRef.current.position.z = initialPosition[2] + (targetPosition[2] - initialPosition[2]) * easeT;

         // Scale down as it approaches
         const scale = 1 - easeT * 0.5;
         meshRef.current.scale.setScalar(scale);

         if (animationProgress.current >= 1) {
            setIsApplied(true);
            onApplied();
         }
      } else if (!isApplied) {
         // Floating animation
         meshRef.current.position.y = initialPosition[1] + Math.sin(time * 2) * 0.08;
         meshRef.current.rotation.y = time * 0.5;

         // Extra glow effect when selected
         if (isSelected) {
            meshRef.current.scale.setScalar(1 + Math.sin(time * 4) * 0.05);
         } else {
            meshRef.current.scale.setScalar(1);
         }
      }
   });

   const handleClick = () => {
      if (!isActive && isTourMode) {
         triggerWrongStepShake();
         return;
      }
      if (!isActive || isApplied || isAnimating) return;

      setIsSelected(true);
   };

   // Export method for Qubit to call when Alice is clicked
   const applyToQubit = () => {
      if (isSelected && !isApplied && !isAnimating) {
         setIsAnimating(true);
      }
   };

   // Store the apply function in a global ref so Qubit can access it
   if (typeof window !== 'undefined') {
      (window as any).__hadamardApply = isSelected ? applyToQubit : null;
      (window as any).__hadamardSelected = isSelected;
   }

   if (isApplied) return null;

   return (
      <group
         ref={meshRef}
         position={initialPosition}
         onClick={handleClick}
      >
         {/* Gate box */}
         <mesh castShadow>
            <boxGeometry args={[0.4, 0.4, 0.1]} />
            <meshStandardMaterial
               color="#a855f7"
               emissive="#a855f7"
               emissiveIntensity={isSelected ? 1 : 0.4}
               metalness={0.5}
               roughness={0.3}
            />
         </mesh>

         {/* H text */}
         <Html
            center
            position={[0, 0, 0.06]}
            style={{ pointerEvents: 'none' }}
         >
            <div
               className="font-quantum text-white font-bold text-lg select-none"
               style={{ textShadow: '0 0 10px #a855f7' }}
            >
               H
            </div>
         </Html>

         {/* Glow effect */}
         <mesh>
            <boxGeometry args={[0.5, 0.5, 0.15]} />
            <meshBasicMaterial
               color="#a855f7"
               transparent
               opacity={isSelected ? 0.5 : 0.2}
               side={THREE.BackSide}
            />
         </mesh>

         {/* Selection ring when selected */}
         {isSelected && (
            <mesh rotation={[Math.PI / 2, 0, 0]}>
               <torusGeometry args={[0.4, 0.03, 8, 32]} />
               <meshBasicMaterial color="#ffd700" />
            </mesh>
         )}

         {/* Instruction hint */}
         {isActive && !isAnimating && (
            <group position={[0, 0.6, 0]}>
               <Html
                  center
                  style={{ pointerEvents: 'none' }}
               >
                  <div className="text-white/90 text-xs font-quantum whitespace-nowrap animate-pulse px-2 py-1 bg-black/50 rounded">
                     {isSelected ? '👆 Now click on Alice (red qubit)' : '👆 Click to select'}
                  </div>
               </Html>
            </group>
         )}
      </group>
   );
};
